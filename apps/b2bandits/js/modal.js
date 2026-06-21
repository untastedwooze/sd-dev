/* =====================================================================
   WELCOME MODAL
   ===================================================================== */

export function initModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  function dismiss() { backdrop.classList.add('hidden'); }

  closeBtn.addEventListener('click', dismiss);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) dismiss(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') dismiss(); });
}
