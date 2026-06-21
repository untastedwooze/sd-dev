/* =====================================================================
   CHARTS  (Chart.js setup + chart rendering — reads state, never mutates)

   Relies on the global `Chart` provided by the CDN <script> in index.html,
   which (as a classic script) is evaluated before this module runs.
   ===================================================================== */

import { ARMS } from './simulation.js';
import { PALETTE, getCSS, hexA } from './theme.js';

Chart.defaults.color = getCSS('--color-text');
Chart.defaults.font.family = "'Oswald', sans-serif";
Chart.defaults.font.size = 13;
const GRID = 'rgba(255,243,209,0.12)';

let convChart, armChart;

export function initCharts() {
  const convCtx = document.getElementById('convChart').getContext('2d');
  convChart = new Chart(convCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Bandit (selected)', data: [], borderColor: PALETTE.bandit, backgroundColor: PALETTE.bandit, borderWidth: 3, pointRadius: 0, tension: 0.15 },
        { label: 'Static A/B test',   data: [], borderColor: PALETTE.ab, backgroundColor: PALETTE.ab, borderWidth: 3, borderDash: [7, 5], pointRadius: 0, tension: 0.15 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { title: { display: true, text: 'Day' }, grid: { color: GRID }, ticks: { maxTicksLimit: 10 } },
        y: { title: { display: true, text: 'Cumulative conversions' }, grid: { color: GRID }, beginAtZero: true }
      },
      plugins: { legend: { labels: { boxWidth: 18, font: { size: 13 } } } }
    }
  });

  const armCtx = document.getElementById('armChart').getContext('2d');
  armChart = new Chart(armCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: ARMS.map((a, i) => ({
        label: a.name, data: [],
        borderColor: PALETTE.arms[i],
        backgroundColor: hexA(PALETTE.arms[i], 0.55),
        borderWidth: 1.5, pointRadius: 0, fill: true, tension: 0.2,
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { title: { display: true, text: 'Day' }, grid: { color: GRID }, ticks: { maxTicksLimit: 10 } },
        y: { stacked: true, min: 0, max: 100, title: { display: true, text: '% of daily leads' }, grid: { color: GRID }, ticks: { callback: v => v + '%' } }
      },
      plugins: { legend: { labels: { boxWidth: 18, font: { size: 12 } } } }
    }
  });
}

export function renderCharts(state) {
  const labels = state.history.map(h => h.day);
  convChart.data.labels = labels;
  convChart.data.datasets[0].data = state.history.map(h => h.banditCumConv);
  convChart.data.datasets[1].data = state.history.map(h => h.abCumConv);
  convChart.update('none');

  armChart.data.labels = labels;
  for (let i = 0; i < ARMS.length; i++) {
    armChart.data.datasets[i].data = state.history.map(h => h.armPct[i]);
  }
  armChart.update('none');
}
