import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Default navigation menu structure (same as cecabank.es)
const DEFAULT_NAV_MENU = [
  {
    title: 'Podemos ayudarte',
    subtitle: 'Nuestros servicios',
    link: '/servicios',
    items: [
      { title: 'Securities Services', link: '/servicios/securities-services' },
      { title: 'Tesorería', link: '/servicios/tesoreria' },
      { title: 'Pagos', link: '/servicios/pagos' },
      { title: 'Plataformas Tecnológicas', link: '/servicios/plataformas-tecnologicas' },
    ],
  },
  {
    title: '¿Por qué Cecabank?',
    subtitle: 'Conócenos',
    link: '/por-que-cecabank',
    items: [
      { title: 'Especialización y Solvencia', link: '/por-que-cecabank/especializacion-solvencia' },
      { title: 'Sostenibilidad', link: '/por-que-cecabank/sostenibilidad' },
      { title: 'Negocio internacional', link: '/por-que-cecabank/negocio-internacional' },
    ],
  },
  {
    title: 'Cecabank al día',
    subtitle: 'Actualidad',
    link: '/noticias',
    items: [
      { title: 'Notas de prensa', link: '/noticias/notas-prensa' },
      { title: 'Cecabank en los medios', link: '/noticias/en-medios' },
      { title: 'Brand Center', link: '/noticias/brand-center' },
    ],
  },
  {
    title: '¿Hablamos?',
    subtitle: 'Contacta con nosotros',
    link: '/contacto',
    items: [],
  },
];

// Secondary links for the header (bottom)
const SECONDARY_LINKS = [
  { title: 'Información corporativa', link: '/informacion-corporativa' },
  { title: 'Informe de mercados', link: '/informe-mercados' },
  { title: 'Oficina de cambio de divisas', link: '/oficina-cambio' },
  { title: 'Banca electrónica', link: '/banca-electronica' },
  { title: 'Portal de proveedores', link: '/portal-proveedores' },
];

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

function createNavMenu(menuData) {
  const nav = document.createElement('nav');
  nav.className = 'drawer-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  const ul = document.createElement('ul');
  ul.className = 'drawer-menu';

  menuData.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'drawer-menu-item';

    // Main item wrapper
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'menu-item-wrapper';

    // Main link with title and subtitle
    const mainLink = document.createElement('a');
    mainLink.href = item.link;
    mainLink.className = 'menu-item-link';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'menu-item-title';
    titleSpan.textContent = item.title;

    // Add chevron inline with title if has subitems
    if (item.items && item.items.length > 0) {
      const chevron = document.createElement('span');
      chevron.className = 'menu-item-chevron';
      chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
      titleSpan.appendChild(chevron);
    }

    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'menu-item-subtitle';
    subtitleSpan.textContent = item.subtitle || '';

    mainLink.appendChild(titleSpan);
    mainLink.appendChild(subtitleSpan);
    itemWrapper.appendChild(mainLink);

    li.appendChild(itemWrapper);

    // Submenu if has subitems
    if (item.items && item.items.length > 0) {
      const subMenu = document.createElement('div');
      subMenu.className = 'submenu';

      const subUl = document.createElement('ul');
      item.items.forEach((subItem) => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = subItem.link;
        subA.textContent = subItem.title;
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });
      subMenu.appendChild(subUl);
      li.appendChild(subMenu);

      // Toggle submenu on hover/click
      li.addEventListener('mouseenter', () => li.classList.add('expanded'));
      li.addEventListener('mouseleave', () => li.classList.remove('expanded'));
      itemWrapper.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          li.classList.toggle('expanded');
        }
      });
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

function createSecondaryLinks(links) {
  const div = document.createElement('div');
  div.className = 'drawer-secondary-links';

  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.link;
    a.textContent = link.title;
    div.appendChild(a);
  });

  return div;
}

/**
 * Decorates the header with Cecabank drawer navigation
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Prevent double-decoration
  if (block.dataset.initialized) return;
  block.dataset.initialized = 'true';

  // Default logo path
  const defaultLogoPath = `${window.hlx.codeBasePath}/icons/logo-cecabank.svg`;

  // Extract configuration
  const headerConfig = {
    logo: null,
    logoLink: '/',
    languages: 'ES,EN,PT',
  };

  const cells = Array.from(block.querySelectorAll(':scope > div'));

  const getFieldValue = (cell, fieldType = 'text') => {
    if (!cell) return '';
    if (fieldType === 'image') {
      const img = cell.querySelector('img') || cell.querySelector('picture img');
      if (img) return img.src;
    }
    return cell.textContent?.trim() || '';
  };

  if (cells[0]) headerConfig.logo = getFieldValue(cells[0], 'image') || getFieldValue(cells[0]);
  if (cells[1]) headerConfig.logoLink = getFieldValue(cells[1]) || '/';
  if (cells[5]) headerConfig.languages = getFieldValue(cells[5]) || 'ES,EN,PT';

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

  const logoImg = document.createElement('img');
  if (headerConfig.logo && headerConfig.logo.startsWith('http')) {
    logoImg.src = headerConfig.logo;
  } else {
    logoImg.src = defaultLogoPath;
  }
  logoImg.alt = 'Cecabank';
  logoImg.className = 'nav-logo';
  logoLink.appendChild(logoImg);
  navBrand.appendChild(logoLink);

  // Hamburger
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

  // Drawer top row: Languages + Close
  const drawerTop = document.createElement('div');
  drawerTop.className = 'drawer-top';

  // Languages
  const langDiv = document.createElement('div');
  langDiv.className = 'drawer-languages';
  const langs = headerConfig.languages.split(',').map((l) => l.trim());
  langs.forEach((lang, idx) => {
    if (idx > 0) {
      const separator = document.createElement('span');
      separator.className = 'lang-separator';
      separator.textContent = '|';
      langDiv.appendChild(separator);
    }
    const langLink = document.createElement('a');
    langLink.href = `/${lang.toLowerCase()}`;
    langLink.textContent = lang;
    langLink.className = 'nav-language';
    if (idx === 0) langLink.classList.add('active');
    langDiv.appendChild(langLink);
  });

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'drawer-close';
  closeBtn.setAttribute('aria-label', 'Close navigation');
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  drawerTop.appendChild(langDiv);
  drawerTop.appendChild(closeBtn);
  drawer.appendChild(drawerTop);

  // Search input
  const searchWrap = document.createElement('div');
  searchWrap.className = 'drawer-search';
  const searchIcon = document.createElement('span');
  searchIcon.className = 'search-icon';
  searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = '¿Qué estás buscando?';
  searchInput.setAttribute('aria-label', 'Buscar');
  searchWrap.appendChild(searchIcon);
  searchWrap.appendChild(searchInput);
  drawer.appendChild(searchWrap);

  // Nav menu
  const navMeta = getMetadata('nav');
  let hasFragmentNav = false;

  if (navMeta) {
    try {
      const navPath = new URL(navMeta, window.location).pathname;
      const fragment = await loadFragment(navPath);
      if (fragment && fragment.querySelector('a')) {
        hasFragmentNav = true;
        // TODO: Convert fragment to menu format if needed
      }
    } catch (_) {
      // use default menu
    }
  }

  if (!hasFragmentNav) {
    const defaultNav = createNavMenu(DEFAULT_NAV_MENU);
    drawer.appendChild(defaultNav);
  }

  // Secondary links at bottom
  const secondaryLinks = createSecondaryLinks(SECONDARY_LINKS);
  drawer.appendChild(secondaryLinks);

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
