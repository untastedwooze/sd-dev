/* =====================================================================
   TOOLTIP  (hover/focus bubbles for `[data-tip]` info icons)

   The subtext that used to sit under each control now lives in a
   tooltip. We position a single fixed-position bubble next to the
   hovered icon so it never gets clipped by the sidebar's scroll area.
   ===================================================================== */

let bubble = null;

function ensureBubble() {
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'tooltip-pop';
    bubble.setAttribute('role', 'tooltip');
    document.body.appendChild(bubble);
  }
  return bubble;
}

function show(target) {
  const tip = target.getAttribute('data-tip');
  if (!tip) return;
  const el = ensureBubble();
  el.textContent = tip;
  // Make it measurable before positioning.
  el.style.left = '0px';
  el.style.top = '0px';
  el.classList.add('is-visible');

  const icon = target.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  const gap = 8;
  const margin = 8;

  // Prefer above the icon; flip below if there isn't room.
  let top = icon.top - box.height - gap;
  if (top < margin) top = icon.bottom + gap;

  // Center horizontally on the icon, clamped to the viewport.
  let left = icon.left + icon.width / 2 - box.width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - box.width - margin));

  el.style.left = `${Math.round(left)}px`;
  el.style.top = `${Math.round(top)}px`;
}

function hide() {
  if (bubble) bubble.classList.remove('is-visible');
}

export function initTooltips() {
  const icons = document.querySelectorAll('[data-tip]');
  icons.forEach((icon) => {
    icon.addEventListener('mouseenter', () => show(icon));
    icon.addEventListener('mouseleave', hide);
    icon.addEventListener('focus', () => show(icon));
    icon.addEventListener('blur', hide);
  });
  // Hide on scroll so the bubble doesn't drift away from its icon.
  window.addEventListener('scroll', hide, true);
}
