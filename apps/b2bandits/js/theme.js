/* =====================================================================
   THEME  (palette + color helpers — shared by the render modules)
   ===================================================================== */

export function getCSS(v) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

export function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export const PALETTE = {
  bandit: getCSS('--chart-gold'),
  ab:     getCSS('--chart-rust'),
  arms: [ getCSS('--chart-cream'), getCSS('--chart-gold'), getCSS('--chart-sage'), getCSS('--chart-rust') ],
};
