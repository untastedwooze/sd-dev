/* =====================================================================
   SIMULATION CORE  (pure functions — no DOM access)
   ===================================================================== */

export const ARMS = [
  { name: "LinkedIn Ad",          pitch: "Cut operational costs by 30%",   trueRate: 0.12 },
  { name: "Cold Email",           pitch: "Try it free for 30 days",       trueRate: 0.08 },
  { name: "Trade Show Follow-up", pitch: "Bulk discount for fleet orders",trueRate: 0.18 },
  { name: "Newsletter Ad",        pitch: "See your ROI in 6 months",      trueRate: 0.05 },
];
const BEST_TRUE_RATE = Math.max(...ARMS.map(a => a.trueRate));
const HISTORY_CAP = 200;

function createArm(def) {
  return { name: def.name, trueRate: def.trueRate, shown: 0, conversions: 0, alpha: 1, beta: 1 };
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

function epsilonGreedySelect(arms, epsilon) {
  if (Math.random() < epsilon) return Math.floor(Math.random() * arms.length); // explore
  return argmaxRandomTie(arms.map(estimate));                                   // exploit
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
  return argmaxRandomTie(arms.map(a => betaSample(a.alpha, a.beta)));
}

function abSelect(counter, n) { return counter % n; } // round-robin even split

// --- reward application (shared by the immediate and delayed paths) ---
// alpha/beta are always updated; Thompson uses them, epsilon-greedy / A-B ignore them (harmless).
function applyBandit(state, i, shown, conv) {
  if (!shown) return;
  const arm = state.banditArms[i];
  arm.shown += shown; arm.conversions += conv;
  arm.alpha += conv;  arm.beta += (shown - conv);
  state.banditConv += conv; state.banditLeads += shown;
}
function applyAb(state, i, shown, conv) {
  if (!shown) return;
  const arm = state.abArms[i];
  arm.shown += shown; arm.conversions += conv;
  state.abConv += conv;
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

    // --- selected bandit (decision made on whatever feedback has arrived) ---
    let bIdx;
    if (state.banditAlgo === "epsilon")      bIdx = epsilonGreedySelect(state.banditArms, state.epsilon);
    else if (state.banditAlgo === "thompson")bIdx = thompsonSelect(state.banditArms);
    else                                     bIdx = abSelect(state.banditCounter++, state.banditArms.length);
    const bReward = bernoulliSample(state.banditArms[bIdx].trueRate, u);
    counts[bIdx]++;

    // --- static A/B baseline (always running) ---
    const aIdx = abSelect(state.abCounter++, state.abArms.length);
    const aReward = bernoulliSample(state.abArms[aIdx].trueRate, u);

    if (state.convDelay === 0) {
      // immediate feedback: the day's later leads learn from its earlier ones
      applyBandit(state, bIdx, 1, bReward);
      applyAb(state, aIdx, 1, aReward);
    } else {
      // delayed feedback: outcome + learning land convDelay days from now
      const bk = getBucket(state, today + state.convDelay);
      bk.bShown[bIdx]++; bk.bConv[bIdx] += bReward;
      bk.aShown[aIdx]++; bk.aConv[aIdx] += aReward;
    }
  }

  const rec = {
    day: today,
    banditCumConv: state.banditConv,
    abCumConv: state.abConv,
    armPct: counts.map(c => (n > 0 ? (100 * c / n) : 0)),
  };
  state.history.push(rec);
  if (state.history.length > HISTORY_CAP) state.history.shift();
  return rec;
}

export function computeRegret(state) {
  return BEST_TRUE_RATE * state.banditLeads - state.banditConv;
}
