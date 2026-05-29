/**
 * Navigation Popup Block — AEM Edge Delivery Services
 *
 * Full-screen overlay navigation triggered from header.
 * Model: xwalk (EDS + Universal Editor)
 *
 * DOM de entrada (matriz EDS):
 *   block (hidden, aria-hidden="true")
 *     └── div (fila 0, config) — data-aue-model="nav-popup"
 *           ├── div col 0 — <p>dialogLabel</p>
 *           ├── div col 1 — <p><a href="...">searchResultsPath</a></p>
 *           └── div col 2 — <p>searchQueryParam</p>
 *     └── div (language rows) — data-aue-model="nav-popup-language-item"
 *           ├── div col 0 — <p>ES</p>
 *           └── div col 1 — <p><a href="/es/">ES</a></p>
 *     └── div (primary rows) — data-aue-model="nav-popup-primary-item"
 *           ├── div col 0 — <picture>...</picture>
 *           ├── div col 1 — <h3>Title</h3>
 *           ├── div col 2 — <p>description</p>
 *           └── div col 3 — <p><a href="...">link</a></p>
 *     └── div (secondary rows) — data-aue-model="nav-popup-link-item" data-nav-group="secondary"
 *           └── div col 0 — <p><a href="...">text</a></p>
 *     └── div (utility rows) — data-aue-model="nav-popup-link-item" data-nav-group="utility"
 *           └── div col 0 — <p><a href="...">text</a></p>
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getTrigger(event) {
  return (event && event.detail && event.detail.trigger) || document.activeElement;
}

function lockScroll() {
  document.documentElement.classList.add('scroll-locked');
}

function unlockScroll() {
  document.documentElement.classList.remove('scroll-locked');
}

function setInert(block, value) {
  const parent = block.closest('body') || document.body;
  [...parent.children].forEach((sibling) => {
    if (sibling !== block && sibling !== block.parentElement && !sibling.contains(block)) {
      if (value) sibling.setAttribute('inert', '');
      else sibling.removeAttribute('inert');
    }
  });
}

function trapFocus(panel, e) {
  const focusables = [...panel.querySelectorAll(FOCUSABLE_SELECTOR)];
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function detectCurrentLanguage(links) {
  const { pathname } = window.location;
  links.forEach((a) => {
    const href = a.getAttribute('href');
    if (href && pathname.startsWith(href)) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // --- Parse rows by model ---
  let configRow = null;
  const languageRows = [];
  const primaryRows = [];
  const secondaryRows = [];
  const utilityRows = [];

  rows.forEach((row) => {
    const model = row.dataset.aueModel || '';
    const group = row.dataset.navGroup || '';
    if (model === 'nav-popup' && !configRow) {
      configRow = row;
    } else if (model === 'nav-popup-language-item') {
      languageRows.push(row);
    } else if (model === 'nav-popup-primary-item') {
      primaryRows.push(row);
    } else if (model === 'nav-popup-link-item' && group === 'secondary') {
      secondaryRows.push(row);
    } else if (model === 'nav-popup-link-item' && group === 'utility') {
      utilityRows.push(row);
    }
  });

  // --- Extract config ---
  const configCols = configRow ? [...configRow.children] : [];
  const dialogLabel = configCols[0]?.textContent?.trim() || 'Menú de navegación';
  const searchLink = configCols[1]?.querySelector('a');
  const searchResultsPath = searchLink ? searchLink.getAttribute('href') : '/buscar';
  const searchQueryParam = configCols[2]?.textContent?.trim() || 'q';

  // Hide config row visually
  if (configRow) configRow.hidden = true;

  // --- Build backdrop (new element) ---
  const backdrop = document.createElement('div');
  backdrop.classList.add('nav-popup__backdrop');
  backdrop.dataset.action = 'backdrop';

  // --- Build panel ---
  const panel = document.createElement('div');
  panel.classList.add('nav-popup__panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', dialogLabel);
  panel.setAttribute('tabindex', '-1');

  // Copy UE resource from block to panel
  if (block.dataset.aueResource) {
    panel.dataset.aueResource = block.dataset.aueResource;
  }

  // --- Header section ---
  const header = document.createElement('div');
  header.classList.add('nav-popup__header');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('nav-popup__close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Cerrar menú');
  closeBtn.dataset.action = 'close';
  closeBtn.innerHTML = '<span class="icon icon-close"></span>';
  header.append(closeBtn);

  // Language nav
  if (languageRows.length) {
    const langNav = document.createElement('nav');
    langNav.classList.add('nav-popup__languages');
    langNav.setAttribute('aria-label', 'Selector de idioma');
    const ul = document.createElement('ul');
    languageRows.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const linkEl = row.querySelector('a');
      if (linkEl) {
        linkEl.classList.add('nav-popup__language-link');
        li.append(linkEl);
      } else {
        const label = row.children[0]?.textContent?.trim() || '';
        li.textContent = label;
      }
      ul.append(li);
      row.hidden = true;
    });
    langNav.append(ul);
    header.append(langNav);
    detectCurrentLanguage(langNav.querySelectorAll('a'));
  }

  // Search form
  const form = document.createElement('form');
  form.classList.add('nav-popup__search');
  form.setAttribute('role', 'search');
  form.setAttribute('action', searchResultsPath);
  form.setAttribute('method', 'get');

  const searchLabel = document.createElement('label');
  searchLabel.classList.add('visually-hidden');
  searchLabel.setAttribute('for', 'nav-popup-search');
  searchLabel.textContent = 'Buscar';

  const searchIcon = document.createElement('span');
  searchIcon.classList.add('nav-popup__search-icon', 'icon', 'icon-search');
  searchIcon.setAttribute('aria-hidden', 'true');

  const searchInput = document.createElement('input');
  searchInput.id = 'nav-popup-search';
  searchInput.name = searchQueryParam;
  searchInput.type = 'search';
  searchInput.placeholder = 'Buscar...';

  form.append(searchLabel, searchIcon, searchInput);
  header.append(form);
  panel.append(header);

  // --- Primary cards nav ---
  if (primaryRows.length) {
    const primaryNav = document.createElement('nav');
    primaryNav.classList.add('nav-popup__primary');
    primaryNav.setAttribute('aria-label', 'Navegación principal');
    const navItems = document.createElement('div');
    navItems.classList.add('nav-popup__nav-items');

    primaryRows.forEach((row) => {
      const cols = [...row.children];
      const iconCol = cols[0];
      const titleCol = cols[1];
      const descCol = cols[2];
      const linkCol = cols[3];
      const href = linkCol?.querySelector('a')?.getAttribute('href') || '#';

      const card = document.createElement('a');
      card.classList.add('nav-popup__card');
      card.href = href;
      moveInstrumentation(row, card);

      // Icon
      const cardIcon = document.createElement('div');
      cardIcon.classList.add('nav-popup__card-icon');
      const picture = iconCol?.querySelector('picture');
      if (picture) cardIcon.append(picture);
      card.append(cardIcon);

      // Content
      const cardContent = document.createElement('div');
      cardContent.classList.add('nav-popup__card-content');

      const h3 = titleCol?.querySelector('h3, h2, h4');
      if (h3) {
        h3.classList.add('nav-popup__card-title');
        cardContent.append(h3);
      }

      const desc = descCol?.querySelector('p');
      if (desc) {
        desc.classList.add('nav-popup__card-description');
        cardContent.append(desc);
      }

      card.append(cardContent);
      navItems.append(card);
      row.hidden = true;
    });

    primaryNav.append(navItems);
    panel.append(primaryNav);
  }

  // --- Secondary links ---
  if (secondaryRows.length) {
    const secondaryNav = document.createElement('nav');
    secondaryNav.classList.add('nav-popup__secondary-nav');
    secondaryNav.setAttribute('aria-label', 'Navegación secundaria');
    const ul = document.createElement('ul');
    ul.classList.add('nav-popup__secondary');

    secondaryRows.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const a = row.querySelector('a');
      if (a) li.append(a);
      ul.append(li);
      row.hidden = true;
    });

    secondaryNav.append(ul);
    panel.append(secondaryNav);
  }

  // --- Utility links ---
  if (utilityRows.length) {
    const utilityDiv = document.createElement('div');
    utilityDiv.classList.add('nav-popup__utility');
    utilityDiv.setAttribute('aria-label', 'Accesos utilitarios');

    utilityRows.forEach((row) => {
      const a = row.querySelector('a');
      if (a) {
        a.classList.add('nav-popup__utility-link');
        moveInstrumentation(row, a);
        utilityDiv.append(a);
      }
      row.hidden = true;
    });

    panel.append(utilityDiv);
  }

  // --- Append constructed elements to block ---
  block.append(backdrop, panel);

  // --- UE attributes on block root ---
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'nav-popup';
  block.dataset.aueLabel = 'Navigation Popup';

  // === BEHAVIOR ===
  let triggerElement = null;

  function open(event) {
    triggerElement = getTrigger(event);
    block.removeAttribute('hidden');
    block.setAttribute('aria-hidden', 'false');
    block.classList.add('nav-popup--open');
    lockScroll();
    setInert(block, true);
    closeBtn.focus();
    document.dispatchEvent(new CustomEvent('nav-popup:opened'));
  }

  function close() {
    block.classList.remove('nav-popup--open');
    block.classList.add('nav-popup--closing');

    const onTransitionEnd = () => {
      panel.removeEventListener('transitionend', onTransitionEnd);
      block.classList.remove('nav-popup--closing');
      block.setAttribute('hidden', '');
      block.setAttribute('aria-hidden', 'true');
      unlockScroll();
      setInert(block, false);
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      }
      document.dispatchEvent(new CustomEvent('nav-popup:closed'));
    };

    panel.addEventListener('transitionend', onTransitionEnd, { once: true });

    // Fallback timeout in case transitionend doesn't fire
    setTimeout(() => {
      if (block.classList.contains('nav-popup--closing')) {
        onTransitionEnd();
      }
    }, 350);
  }

  // Event: open
  document.addEventListener('nav-popup:open', (e) => open(e));
  document.addEventListener('nav-popup:toggle', (e) => {
    if (block.hasAttribute('hidden')) open(e);
    else close();
  });
  document.addEventListener('nav-popup:close', () => {
    if (!block.hasAttribute('hidden')) close();
  });

  // Click delegation
  block.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action) return;
    const actionName = action.dataset.action;
    if (actionName === 'close' || actionName === 'backdrop') {
      e.preventDefault();
      close();
    }
  });

  // Keyboard: Escape + focus trap
  block.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
    if (e.key === 'Tab') {
      trapFocus(panel, e);
    }
  });
}
