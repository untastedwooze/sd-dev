/* =====================================================================
   CONTROLLER  (event listeners + tick loop)
   ===================================================================== */

import { getState, setState, freshState } from './state.js';
import { runOneDay } from './simulation.js';
import { renderAll } from './render.js';

let tickTimer = null;

// One tick: advance a day, repaint, then stop the run if the bandit went broke.
function tick() {
  runOneDay(getState());
  renderAll(getState());
  if (getState().banditBankrupt) {
    document.body.classList.add('bankrupt');
    if (getState().isPlaying) setPlaying(false); // game over — auto-pause
  }
}

function startLoop() {
  stopLoop();
  tickTimer = setInterval(tick, 1000 / getState().speed);
}
function stopLoop() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }

function setPlaying(playing) {
  getState().isPlaying = playing;
  document.getElementById('playBtn').innerHTML = playing ? '⏸ Pause' : '▶ Play';
  if (playing) startLoop(); else stopLoop();
}

function restartSimulation(keepPlaying) {
  const wasPlaying = keepPlaying && getState().isPlaying;
  stopLoop();
  setState(freshState(getState()));
  document.body.classList.remove('bankrupt'); // fresh budget, back in the game
  renderAll(getState());
  setPlaying(wasPlaying);
}

export function syncEpsilonEnabled() {
  const block = document.getElementById('epsilonBlock');
  const slider = document.getElementById('epsilonSlider');
  const active = getState().banditAlgo === 'epsilon';
  block.classList.toggle('disabled', !active);
  slider.disabled = !active;
}

export function bindControls() {
  // algorithm selector
  document.getElementById('algoToggle').addEventListener('change', e => {
    if (e.target.name !== 'algo') return;
    getState().banditAlgo = e.target.value;
    syncEpsilonEnabled();
    restartSimulation(true); // changing algorithm restarts the bandit's learning
  });

  // epsilon — live label on input, restart on release
  const epsSlider = document.getElementById('epsilonSlider');
  epsSlider.addEventListener('input', () => {
    document.getElementById('epsilonVal').textContent = parseFloat(epsSlider.value).toFixed(2);
  });
  epsSlider.addEventListener('change', () => {
    getState().epsilon = parseFloat(epsSlider.value);
    restartSimulation(true); // changing epsilon restarts the bandit's learning
  });

  // leads per day — live, no restart needed (just changes volume going forward)
  const leadsSlider = document.getElementById('leadsSlider');
  leadsSlider.addEventListener('input', () => {
    getState().leadsPerDay = parseInt(leadsSlider.value, 10);
    document.getElementById('leadsVal').textContent = getState().leadsPerDay;
  });

  // conversion delay — live; new leads use the new delay, already-pending ones resolve as scheduled
  const delaySlider = document.getElementById('delaySlider');
  delaySlider.addEventListener('input', () => {
    getState().convDelay = parseInt(delaySlider.value, 10);
    document.getElementById('delayVal').textContent = getState().convDelay;
  });

  // initial budget — live label, restart on release (it's a starting condition)
  const budgetSlider = document.getElementById('budgetSlider');
  budgetSlider.addEventListener('input', () => {
    document.getElementById('budgetVal').textContent =
      '$' + parseInt(budgetSlider.value, 10).toLocaleString();
  });
  budgetSlider.addEventListener('change', () => {
    getState().initialBudget = parseInt(budgetSlider.value, 10);
    restartSimulation(true);
  });

  // speed
  const speedSlider = document.getElementById('speedSlider');
  speedSlider.addEventListener('input', () => {
    getState().speed = parseInt(speedSlider.value, 10);
    document.getElementById('speedVal').textContent = getState().speed;
    if (getState().isPlaying) startLoop(); // re-arm at new rate
  });

  // play / pause
  document.getElementById('playBtn').addEventListener('click', () => setPlaying(!getState().isPlaying));

  // step one day
  document.getElementById('stepBtn').addEventListener('click', () => {
    setPlaying(false);
    tick();
  });

  // reset
  document.getElementById('resetBtn').addEventListener('click', () => restartSimulation(false));

  // reveal true rates
  document.getElementById('revealToggle').addEventListener('change', e => {
    document.body.classList.toggle('reveal', e.target.checked);
  });

  // headline callout: switch between conversion-regret, profit-regret, budget
  document.getElementById('metricToggle').addEventListener('change', e => {
    if (e.target.name !== 'metric') return;
    document.body.classList.toggle('show-profit', e.target.value === 'profit');
    document.body.classList.toggle('show-budget', e.target.value === 'budget');
  });
}
