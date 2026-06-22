// =====================================================================
// SHARED SITE HEADER — single source of truth for the top navigation.
//
// Each app imports `mountHeader` and calls it once on load. The markup
// (and the list of apps) lives here so every page stays in sync; styling
// lives in shared/header.css.
//
// Usage (from any app under apps/<name>/):
//   import { mountHeader } from '../../shared/header.js';
//   mountHeader({ active: 'b2bandits' });
//
// Apps are siblings under apps/, so the default basePath of '../' links
// correctly between them from any app page.
// =====================================================================

// Order here is the order shown in the nav.
const APPS = [
  { id: 'cv',        label: 'CV',   href: 'cv/' },
  { id: 'b2bandits', label: 'B2B',  href: 'b2bandits/' },
  { id: 'talk',      label: 'Talk', href: 'talk.html' },
];

/**
 * Render the shared header and insert it as the first element in <body>.
 *
 * @param {Object}   [options]
 * @param {string}   [options.active='']    id of the current app (gets is-active)
 * @param {string}   [options.basePath='../'] path prefix to reach sibling apps
 * @param {Array<{label: string, onClick: (e: Event) => void}>} [options.buttons]
 *        page-specific buttons (e.g. Print), shown before the app links
 * @returns {HTMLElement} the mounted <header> element
 */
export function mountHeader({ active = '', basePath = '../', buttons = [] } = {}) {
  const header = document.createElement('header');
  header.className = 'topbar';

  const right = document.createElement('div');
  right.className = 'topbar-right';

  for (const btn of buttons) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'about-btn';
    el.textContent = btn.label;
    el.addEventListener('click', btn.onClick);
    right.appendChild(el);
  }

  for (const app of APPS) {
    const a = document.createElement('a');
    a.className = 'about-btn' + (app.id === active ? ' is-active' : '');
    a.href = basePath + app.href;
    a.textContent = app.label;
    right.appendChild(a);
  }

  // Contact link — opens the visitor's email client to message Sam.
  const contact = document.createElement('a');
  contact.className = 'about-btn';
  contact.href = 'mailto:samuel.duffy.work@gmail.com?subject=Hello%20Sam';
  contact.textContent = 'Contact';
  right.appendChild(contact);

  header.appendChild(right);
  document.body.insertBefore(header, document.body.firstChild);
  return header;
}
