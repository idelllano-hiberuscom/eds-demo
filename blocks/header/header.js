import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function closeDrawer(drawer) {
  drawer.classList.remove('open');
  document.body.style.overflowY = '';
  const trigger = document.querySelector('.nav-hamburger button');
  if (trigger) trigger.setAttribute('aria-label', 'Open navigation');
  window.removeEventListener('keydown', closeOnEscape); // eslint-disable-line no-use-before-define
  if (trigger) trigger.focus();
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const drawer = document.querySelector('.header-drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer(drawer);
    }
  }
}

function openDrawer(drawer) {
  drawer.classList.add('open');
  document.body.style.overflowY = 'hidden';
  const trigger = document.querySelector('.nav-hamburger button');
  if (trigger) trigger.setAttribute('aria-label', 'Close navigation');
  window.addEventListener('keydown', closeOnEscape);
  const firstFocusable = drawer.querySelector('button, a, input');
  if (firstFocusable) firstFocusable.focus();
}

/**
 * Decorates the header with Cecabank drawer navigation
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Prevent double-decoration (can happen in Universal Editor or with loadHeader race)
  if (block.dataset.initialized) return;
  block.dataset.initialized = 'true';

  // Extract configuration
  const headerConfig = {
    logo: null,
    logoLink: '/',
    ctaText: null,
    ctaLink: '#',
    languages: null,
  };

  const cells = Array.from(block.querySelectorAll(':scope > div'));

  const getFieldValue = (cell, fieldType = 'text') => {
    if (!cell) return '';
    if (fieldType === 'image') {
      const img = cell.querySelector('img') || cell.querySelector('picture img');
      if (img) return img.src;
    }
    const input = cell.querySelector('input[type="text"]');
    if (input && input.value) return input.value.trim();
    const select = cell.querySelector('select');
    if (select && select.value) return select.value.trim();
    return cell.textContent?.trim() || '';
  };

  if (cells[0]) headerConfig.logo = getFieldValue(cells[0], 'image') || getFieldValue(cells[0]);
  if (cells[1]) headerConfig.logoLink = getFieldValue(cells[1]) || '/';
  if (cells[2]) headerConfig.ctaText = getFieldValue(cells[2]);
  if (cells[3]) headerConfig.ctaLink = getFieldValue(cells[3]) || '#';
  if (cells[5]) headerConfig.languages = getFieldValue(cells[5]);

  // Clear block and build new header
  block.textContent = '';

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // === TOP BAR ===
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Logo
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  const logoLink = document.createElement('a');
  logoLink.href = headerConfig.logoLink || '/';
  logoLink.setAttribute('aria-label', 'Cecabank Home');

  if (headerConfig.logo && headerConfig.logo.startsWith('http')) {
    const logoImg = document.createElement('img');
    logoImg.src = headerConfig.logo;
    logoImg.alt = 'Cecabank';
    logoImg.className = 'nav-logo';
    logoLink.appendChild(logoImg);
  } else {
    logoLink.textContent = headerConfig.logo || 'CECABANK';
  }
  navBrand.appendChild(logoLink);

  // Hamburger (always visible)
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-label="Open navigation" aria-controls="header-drawer" aria-expanded="false">
    <span class="nav-hamburger-label">MENÚ</span>
    <span class="nav-hamburger-icon"></span>
  </button>`;

  nav.appendChild(navBrand);
  nav.appendChild(hamburger);
  navWrapper.appendChild(nav);

  // === DRAWER ===
  const drawer = document.createElement('div');
  drawer.id = 'header-drawer';
  drawer.className = 'header-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Navigation menu');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'drawer-close';
  closeBtn.setAttribute('aria-label', 'Close navigation');
  closeBtn.innerHTML = '&times;';
  drawer.appendChild(closeBtn);

  // Search input
  const searchWrap = document.createElement('div');
  searchWrap.className = 'drawer-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Buscar...';
  searchInput.setAttribute('aria-label', 'Buscar');
  searchWrap.appendChild(searchInput);
  drawer.appendChild(searchWrap);

  // Nav links from fragment
  const navMeta = getMetadata('nav');
  if (navMeta) {
    try {
      const navPath = new URL(navMeta, window.location).pathname;
      const fragment = await loadFragment(navPath);
      if (fragment) {
        const drawerNav = document.createElement('nav');
        drawerNav.className = 'drawer-nav';
        drawerNav.setAttribute('aria-label', 'Site navigation');

        // Convert any list items to accordion details/summary
        const lists = fragment.querySelectorAll('ul');
        lists.forEach((listEl) => {
          const items = listEl.querySelectorAll(':scope > li');
          items.forEach((item) => {
            const subList = item.querySelector('ul');
            if (subList) {
              // Has children → accordion
              const details = document.createElement('details');
              const summary = document.createElement('summary');
              const topLink = item.querySelector(':scope > a');
              summary.textContent = topLink ? topLink.textContent : item.firstChild?.textContent || '';
              details.appendChild(summary);
              details.appendChild(subList.cloneNode(true));
              item.replaceWith(details);
            }
          });
        });

        while (fragment.firstElementChild) {
          drawerNav.appendChild(fragment.firstElementChild);
        }

        // Mark current page
        drawerNav.querySelectorAll('a').forEach((link) => {
          try {
            if (window.location.pathname === new URL(link.href).pathname) {
              link.setAttribute('aria-current', 'page');
            }
          } catch (_) { /* ignore invalid URLs */ }
        });
        drawer.appendChild(drawerNav);
      }
    } catch (_) {
      // no nav fragment – drawer still works without nav links
    }
  }

  // Language switcher
  if (headerConfig.languages) {
    const langDiv = document.createElement('div');
    langDiv.className = 'drawer-languages';
    const langs = headerConfig.languages.split(',').map((l) => l.trim());
    langs.forEach((lang, idx) => {
      if (idx > 0) langDiv.appendChild(document.createTextNode(' | '));
      const langLink = document.createElement('a');
      langLink.href = `#${lang.toLowerCase()}`;
      langLink.textContent = lang;
      langLink.className = 'nav-language';
      if (idx === 0) langLink.classList.add('active');
      langDiv.appendChild(langLink);
    });
    drawer.appendChild(langDiv);
  }

  // CTA button at bottom of drawer
  if (headerConfig.ctaText) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'drawer-cta';
    const ctaA = document.createElement('a');
    ctaA.href = headerConfig.ctaLink || '#';
    ctaA.className = 'button primary';
    ctaA.textContent = headerConfig.ctaText;
    ctaWrap.appendChild(ctaA);
    drawer.appendChild(ctaWrap);
  }

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'header-backdrop';

  // Wire up events
  hamburger.querySelector('button').addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer(drawer);
      hamburger.querySelector('button').setAttribute('aria-expanded', 'false');
    } else {
      openDrawer(drawer);
      hamburger.querySelector('button').setAttribute('aria-expanded', 'true');
    }
  });

  closeBtn.addEventListener('click', () => {
    closeDrawer(drawer);
    hamburger.querySelector('button').setAttribute('aria-expanded', 'false');
  });

  backdrop.addEventListener('click', () => {
    closeDrawer(drawer);
    hamburger.querySelector('button').setAttribute('aria-expanded', 'false');
  });

  navWrapper.appendChild(drawer);
  navWrapper.appendChild(backdrop);
  block.append(navWrapper);
}
