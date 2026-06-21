/* =====================================================================
   MAIN  (entry point — boot)
   ===================================================================== */

import { freshState, setState, getState } from './state.js';
import { initCharts } from './charts.js';
import { bindControls, syncEpsilonEnabled } from './controller.js';
import { renderAll } from './render.js';
import { initModal } from './modal.js';

function init() {
  setState(freshState(null));
  initCharts();
  bindControls();
  syncEpsilonEnabled();
  renderAll(getState());
  initModal();
}
init();
