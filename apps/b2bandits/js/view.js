/* =====================================================================
   VIEW  (table + regret rendering — reads state, touches DOM only)
   ===================================================================== */

import { estimate, computeRegret } from './simulation.js';
import { PALETTE } from './theme.js';

export function renderTable(state) {
  // deterministic leader (first max among arms with data) — avoids star flicker on ties
  let leader = -1, leaderEst = -1;
  state.banditArms.forEach((arm, i) => {
    if (arm.shown > 0 && estimate(arm) > leaderEst) { leaderEst = estimate(arm); leader = i; }
  });
  const rows = state.banditArms.map((arm, i) => {
    const est = arm.shown > 0 ? (100 * estimate(arm)).toFixed(1) + '%' : '—';
    return `<tr class="${i === leader && arm.shown > 0 ? 'leader' : ''}">
      <td class="campaign"><span class="swatch" style="background:${PALETTE.arms[i]}"></span>${arm.name}</td>
      <td class="num">${arm.shown.toLocaleString()}</td>
      <td class="num">${arm.conversions.toLocaleString()}</td>
      <td class="num">${est}</td>
      <td class="num true-col">${(100 * arm.trueRate).toFixed(0)}%</td>
    </tr>`;
  }).join('');
  document.getElementById('tableBody').innerHTML = rows;
}

export function renderRegret(state) {
  const regret = computeRegret(state);
  document.getElementById('regretValue').textContent = Math.round(regret).toLocaleString();
  document.getElementById('statDay').textContent = state.day.toLocaleString();
  document.getElementById('statBanditConv').textContent = state.banditConv.toLocaleString();
  document.getElementById('statAbConv').textContent = state.abConv.toLocaleString();
  document.getElementById('statLeads').textContent = state.banditLeads.toLocaleString();
}
