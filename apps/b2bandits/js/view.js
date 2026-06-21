/* =====================================================================
   VIEW  (table + metric callout rendering — reads state, touches DOM only)
   ===================================================================== */

import { estimate, estNet, trueNet, computeRegret, computeProfitRegret, bankroll } from './simulation.js';
import { PALETTE } from './theme.js';

// "$1,234" / "-$1,234"
function money(v) {
  const r = Math.round(v);
  return (r < 0 ? '-$' : '$') + Math.abs(r).toLocaleString();
}
// signed dollars for per-lead economics, e.g. "+$19" / "-$46"
function signedMoney(v) {
  const r = Math.round(v);
  return (r < 0 ? '-$' : '+$') + Math.abs(r).toLocaleString();
}

export function renderTable(state) {
  // leader = arm the bandit currently favors, i.e. highest estimated profit/lead
  let leader = -1, leaderNet = -Infinity;
  state.banditArms.forEach((arm, i) => {
    if (arm.shown > 0 && estNet(arm) > leaderNet) { leaderNet = estNet(arm); leader = i; }
  });
  const rows = state.banditArms.map((arm, i) => {
    const est = arm.shown > 0 ? (100 * estimate(arm)).toFixed(1) + '%' : '—';
    const net = arm.shown > 0 ? signedMoney(estNet(arm)) : '—';
    const netCls = arm.shown > 0 && estNet(arm) < 0 ? 'num neg' : 'num';
    const trueNetCls = trueNet(arm) < 0 ? 'num neg true-col' : 'num true-col';
    return `<tr class="${i === leader && arm.shown > 0 ? 'leader' : ''}">
      <td class="campaign"><span class="swatch" style="background:${PALETTE.arms[i]}"></span>${arm.name}</td>
      <td class="num">${money(arm.costPerLead)}</td>
      <td class="num">${arm.shown.toLocaleString()}</td>
      <td class="num">${arm.conversions.toLocaleString()}</td>
      <td class="num">${est}</td>
      <td class="${netCls}">${net}</td>
      <td class="num true-col">${(100 * arm.trueRate).toFixed(0)}%</td>
      <td class="${trueNetCls}">${signedMoney(trueNet(arm))}</td>
    </tr>`;
  }).join('');
  document.getElementById('tableBody').innerHTML = rows;
}

export function renderRegret(state) {
  // --- regret view ---
  document.getElementById('regretValue').textContent = Math.round(computeRegret(state)).toLocaleString();
  document.getElementById('profitRegretValue').textContent = money(computeProfitRegret(state));

  // --- budget view ---
  const bBank = bankroll(state, 'bandit');
  const aBank = bankroll(state, 'ab');
  const bProfit = state.banditRevenue - state.banditSpend;
  const roi = state.banditSpend > 0 ? (100 * bProfit / state.banditSpend) : 0;
  document.getElementById('budgetValue').textContent = money(bBank);
  document.getElementById('budgetValue').classList.toggle('neg', bBank <= 0);
  document.getElementById('abBudgetValue').textContent =
    state.abBankrupt ? 'BUST' : money(aBank);
  document.getElementById('netProfitValue').textContent = signedMoney(bProfit);
  document.getElementById('roiValue').textContent =
    state.banditSpend > 0 ? (roi >= 0 ? '+' : '') + roi.toFixed(0) + '%' : '—';

  // --- shared stats ---
  document.getElementById('statDay').textContent = state.day.toLocaleString();
  document.getElementById('statBanditConv').textContent = state.banditConv.toLocaleString();
  document.getElementById('statAbConv').textContent = state.abConv.toLocaleString();
  document.getElementById('statLeads').textContent = state.banditLeads.toLocaleString();
}
