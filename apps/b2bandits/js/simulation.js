/* =====================================================================
   SIMULATION CORE  (pure functions — no DOM access)
   ===================================================================== */

// Constant gross profit booked per conversion (a closed demo). Known to the
// marketer — only the conversion rate is hidden from the algorithm.
export const PROFIT_PER_CONVERSION = 300;

// Each campaign also has a known cost to contact one lead. Costs are tuned so
// the best-converting arm is NOT the most profitable: Trade Show converts best
// (0.18) but is so expensive it loses money, while cheap Cold Email wins on
// profit-per-lead. The bandit has to balance conversion rate against cost.
//   exp. profit/lead = trueRate * PROFIT_PER_CONVERSION - costPerLead
//   LinkedIn   0.12*300 - 40  = -$4    (slightly unprofitable)
//   Cold Email 0.08*300 -  5  = +$19   (the true winner)
//   Trade Show 0.18*300 - 100 = -$46   (best rate, biggest loser)
//   Newsletter 0.05*300 - 10  = +$5
// A static even split blends to -$6.5/lead — it slowly goes broke.
export const ARMS = [
  { name: "LinkedIn Ad",          pitch: "Cut operational costs by 30%",   trueRate: 0.12, costPerLead: 40  },
  { name: "Cold Email",           pitch: "Try it free for 30 days",       trueRate: 0.08, costPerLead: 5   },
  { name: "Trade Show Follow-up", pitch: "Bulk discount for fleet orders",trueRate: 0.18, costPerLead: 100 },
  { name: "Newsletter Ad",        pitch: "See your ROI in 6 months",      trueRate: 0.05, costPerLead: 10  },
];
const BEST_TRUE_RATE = Math.max(...ARMS.map(a => a.trueRate));
// Best achievable expected profit per lead — the benchmark for profit regret.
const BEST_EV = Math.max(...ARMS.map(a => a.trueRate * PROFIT_PER_CONVERSION - a.costPerLead));
const HISTORY_CAP = 200;

function createArm(def) {
  return { name: def.name, trueRate: def.trueRate, costPerLead: def.costPerLead, shown: 0, conversions: 0, alpha: 1, beta: 1 };
}
export function createArmSet() { return ARMS.map(createArm); }

function bernoulliSample(trueRate, u) {
  // u is a shared uniform draw (common random numbers for a fair bandit-vs-AB comparison)
  return (u < trueRate) ? 1 : 0;
}

// argmax with random tie-breaking (avoids a fixed bias toward arm 0)
function argmaxRandomTie(values) {
  let best = -Infinity, idxs = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i] > best) { best = values[i]; idxs = [i]; }
    else if (values[i] === best) { idxs.push(i); }
  }
  return idxs[Math.floor(Math.random() * idxs.length)];
}

export function estimate(arm) { return arm.shown > 0 ? arm.conversions / arm.shown : 0; }

// Expected profit per lead for a given (possibly estimated or sampled) rate.
// Cost is a known constant, so the bandit reasons in dollars: it maximizes
// rate*profit - cost, not rate alone. Used for both selection and the table.
function netPerLead(rate, arm) { return rate * PROFIT_PER_CONVERSION - arm.costPerLead; }
export function estNet(arm)  { return netPerLead(estimate(arm), arm); }
export function trueNet(arm) { return netPerLead(arm.trueRate, arm); }

function epsilonGreedySelect(arms, epsilon) {
  if (Math.random() < epsilon) return Math.floor(Math.random() * arms.length);   // explore
  return argmaxRandomTie(arms.map(a => netPerLead(estimate(a), a)));              // exploit by profit
}

// --- Beta sampling for Thompson, via Gamma (Marsaglia–Tsang) ---
function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function gammaSample(k) {
  if (k < 1) return gammaSample(1 + k) * Math.pow(Math.random(), 1 / k);
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x, v;
    do { x = gaussian(); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
function betaSample(a, b) {
  const x = gammaSample(a), y = gammaSample(b);
  return x / (x + y);
}
function thompsonSelect(arms) {
  // Sample the (unknown) rate from each arm's Beta posterior, then rank by the
  // known economic transform. The uncertainty lives only in the rate.
  return argmaxRandomTie(arms.map(a => netPerLead(betaSample(a.alpha, a.beta), a)));
}

function abSelect(counter, n) { return counter % n; } // round-robin even split

// --- reward application (shared by the immediate and delayed paths) ---
// alpha/beta are always updated; Thompson uses them, epsilon-greedy / A-B ignore them (harmless).
// Cost is charged at contact time (in the lead loop); revenue is booked here,
// when the conversion is observed — which may be the same tick or, under a
// conversion delay, a later one.
function applyBandit(state, i, shown, conv) {
  if (!shown) return;
  const arm = state.banditArms[i];
  arm.shown += shown; arm.conversions += conv;
  arm.alpha += conv;  arm.beta += (shown - conv);
  state.banditConv += conv; state.banditLeads += shown;
  state.banditRevenue += conv * PROFIT_PER_CONVERSION;
}
function applyAb(state, i, shown, conv) {
  if (!shown) return;
  const arm = state.abArms[i];
  arm.shown += shown; arm.conversions += conv;
  state.abConv += conv;
  state.abRevenue += conv * PROFIT_PER_CONVERSION;
}

// --- pending feedback buckets for the delayed-conversion model ---
// Each bucket aggregates, per arm, the leads contacted that resolve on a given day.
function emptyBucket() {
  return { bShown: [0,0,0,0], bConv: [0,0,0,0], aShown: [0,0,0,0], aConv: [0,0,0,0] };
}
function getBucket(state, day) {
  let bk = state.pending.get(day);
  if (!bk) { bk = emptyBucket(); state.pending.set(day, bk); }
  return bk;
}
function resolvePending(state, day) {
  const bk = state.pending.get(day);
  if (!bk) return;
  for (let i = 0; i < ARMS.length; i++) {
    applyBandit(state, i, bk.bShown[i], bk.bConv[i]);
    applyAb(state, i, bk.aShown[i], bk.aConv[i]);
  }
  state.pending.delete(day);
}

// Run one simulated day. Mutates banditArms/abArms via state; returns the per-day record.
export function runOneDay(state) {
  const n = state.leadsPerDay;
  state.day++;
  const today = state.day;

  // feedback that matures today lands first, so today's choices benefit from it
  resolvePending(state, today);

  const counts = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    const u = Math.random(); // shared draw → common random numbers

    // --- selected bandit (a bankrupt strategy can't fund any more leads) ---
    if (!state.banditBankrupt) {
      let bIdx;
      if (state.banditAlgo === "epsilon")      bIdx = epsilonGreedySelect(state.banditArms, state.epsilon);
      else if (state.banditAlgo === "thompson")bIdx = thompsonSelect(state.banditArms);
      else                                     bIdx = abSelect(state.banditCounter++, state.banditArms.length);
      state.banditSpend += state.banditArms[bIdx].costPerLead; // cost charged at contact
      const bReward = bernoulliSample(state.banditArms[bIdx].trueRate, u);
      counts[bIdx]++;
      if (state.convDelay === 0) {
        applyBandit(state, bIdx, 1, bReward); // immediate feedback
      } else {
        const bk = getBucket(state, today + state.convDelay); // delayed feedback
        bk.bShown[bIdx]++; bk.bConv[bIdx] += bReward;
      }
    }

    // --- static A/B baseline (runs alongside until it too runs out of money) ---
    if (!state.abBankrupt) {
      const aIdx = abSelect(state.abCounter++, state.abArms.length);
      state.abSpend += state.abArms[aIdx].costPerLead;
      const aReward = bernoulliSample(state.abArms[aIdx].trueRate, u);
      if (state.convDelay === 0) {
        applyAb(state, aIdx, 1, aReward);
      } else {
        const bk = getBucket(state, today + state.convDelay);
        bk.aShown[aIdx]++; bk.aConv[aIdx] += aReward;
      }
    }
  }

  // Bankroll = starting budget + booked revenue − spend. Once it hits zero a
  // strategy is out of the game (it stops contacting leads on the next tick).
  const banditBankroll = state.initialBudget + state.banditRevenue - state.banditSpend;
  const abBankroll     = state.initialBudget + state.abRevenue     - state.abSpend;
  if (!state.banditBankrupt && banditBankroll <= 0) state.banditBankrupt = true;
  if (!state.abBankrupt     && abBankroll     <= 0) state.abBankrupt     = true;

  const rec = {
    day: today,
    banditCumConv: state.banditConv,
    abCumConv: state.abConv,
    armPct: counts.map(c => (n > 0 ? (100 * c / n) : 0)),
    banditBankroll,
    abBankroll,
  };
  state.history.push(rec);
  if (state.history.length > HISTORY_CAP) state.history.shift();
  return rec;
}

// Conversion regret: leads lost by not always picking the highest-rate arm.
export function computeRegret(state) {
  return BEST_TRUE_RATE * state.banditLeads - state.banditConv;
}

// Profit regret: dollars lost by not always picking the most profitable arm.
export function computeProfitRegret(state) {
  return BEST_EV * state.banditLeads - (state.banditRevenue - state.banditSpend);
}

// Current bankroll for either strategy (starting budget + profit so far).
export function bankroll(state, which) {
  return which === 'ab'
    ? state.initialBudget + state.abRevenue     - state.abSpend
    : state.initialBudget + state.banditRevenue - state.banditSpend;
}
