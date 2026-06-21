/* =====================================================================
   RENDER  (composes the chart + view renderers into one pass)
   ===================================================================== */

import { renderCharts } from './charts.js';
import { renderTable, renderRegret } from './view.js';

export function renderAll(state) {
  renderCharts(state);
  renderTable(state);
  renderRegret(state);
}
