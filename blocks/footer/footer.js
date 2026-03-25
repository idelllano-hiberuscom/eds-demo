import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Default footer data matching cecabank.es structure
const DEFAULT_FOOTER = {
  utilityLinks: [
    { title: 'Información corporativa', href: '/informacion-corporativa' },
    { title: 'Informe de mercados', href: '/informe-mercados' },
    { title: 'Oficina de cambio', href: '/oficina-cambio' },
    { title: 'Banca electrónica', href: '/banca-electronica' },
    { title: 'Portal de proveedores', href: '/portal-proveedores' },
  ],
  ctaLinks: [
    { title: '¿Hablamos?', href: '/contacto' },
    { title: 'Banca electrónica', href: '/banca-electronica' },
  ],
  socialLinks: [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/cecabank', icon: 'linkedin' },
    { title: 'X', href: 'https://twitter.com/cecabank', icon: 'twitter' },
    { title: 'YouTube', href: 'https://www.youtube.com/cecabank', icon: 'youtube' },
  ],
  legalLinks: [
    { title: 'Aviso legal', href: '/aviso-legal' },
    { title: 'Derechos de privacidad', href: '/privacidad' },
    { title: 'Política de cookies', href: '/cookies' },
  ],
  address: 'Calle Alcalá 27, 28014 Madrid',
  phone: '91 596 50 00',
};

function createIcon(name, size = 20) {
  const iconPath = `${window.hlx.codeBasePath}/icons/${name}.svg`;
  const img = document.createElement('img');
  img.src = iconPath;
  img.alt = name;
  img.width = size;
  img.height = size;
  img.setAttribute('loading', 'lazy');
  return img;
}

function createDefaultFooter() {
  const footer = document.createElement('div');
  footer.className = 'footer';

  // Top row with utility links
  const utilityZone = document.createElement('div');
  utilityZone.className = 'footer-utility';
  DEFAULT_FOOTER.utilityLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    utilityZone.appendChild(a);
  });
  footer.appendChild(utilityZone);

  // Main content area
  const mainContent = document.createElement('div');
  mainContent.className = 'footer-main';

  // Logo
  const logoZone = document.createElement('div');
  logoZone.className = 'footer-logo';
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Cecabank Home');
  const logoImg = document.createElement('img');
  logoImg.src = `${window.hlx.codeBasePath}/icons/logo-cecabank.svg`;
  logoImg.alt = 'Cecabank';
  logoImg.className = 'footer-logo-img';
  logoLink.appendChild(logoImg);
  logoZone.appendChild(logoLink);
  mainContent.appendChild(logoZone);

  // CTA and social
  const ctaZone = document.createElement('div');
  ctaZone.className = 'footer-cta';

  // CTA links
  const ctaLinks = document.createElement('div');
  ctaLinks.className = 'footer-cta-links';
  DEFAULT_FOOTER.ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    ctaLinks.appendChild(a);
  });
  ctaZone.appendChild(ctaLinks);

  // Social icons
  const socialZone = document.createElement('div');
  socialZone.className = 'footer-social';
  DEFAULT_FOOTER.socialLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.setAttribute('aria-label', link.title);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.appendChild(createIcon(link.icon, 18));
    socialZone.appendChild(a);
  });
  ctaZone.appendChild(socialZone);

  mainContent.appendChild(ctaZone);
  footer.appendChild(mainContent);

  // Sitemap link
  const sitemapZone = document.createElement('div');
  sitemapZone.className = 'footer-sitemap';
  const sitemapLink = document.createElement('a');
  sitemapLink.href = '/mapa-web';
  sitemapLink.textContent = 'Mapa web';
  sitemapZone.appendChild(sitemapLink);
  footer.appendChild(sitemapZone);

  // Legal links
  const legalZone = document.createElement('div');
  legalZone.className = 'footer-legal';
  DEFAULT_FOOTER.legalLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    legalZone.appendChild(a);
  });
  footer.appendChild(legalZone);

  return footer;
}

/**
 * loads and decorates the footer with Cecabank style
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  const fragment = await loadFragment(footerPath);
  block.textContent = '';

  // If no fragment content, use default footer
  if (!fragment || !fragment.querySelector('a')) {
    block.append(createDefaultFooter());
    return;
  }

  const footer = document.createElement('div');
  footer.className = 'footer';

  // Collect top-level sections from fragment
  const sections = Array.from(fragment.children);

  // Zone 1: Utility links (section 0)
  const utilityZone = document.createElement('div');
  utilityZone.className = 'footer-utility';
  if (sections[0]) {
    const links = sections[0].querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      utilityZone.appendChild(a);
    });
    if (!links.length) {
      utilityZone.appendChild(sections[0].cloneNode(true));
    }
  }
  footer.appendChild(utilityZone);

  // Main content wrapper
  const mainContent = document.createElement('div');
  mainContent.className = 'footer-main';

  // Zone 2: Logo (section 1)
  const logoZone = document.createElement('div');
  logoZone.className = 'footer-logo';
  if (sections[1]) {
    const img = sections[1].querySelector('img');
    if (img) {
      const logoLink = document.createElement('a');
      logoLink.href = '/';
      logoLink.setAttribute('aria-label', 'Cecabank Home');
      const logoImg = document.createElement('img');
      logoImg.src = img.src;
      logoImg.alt = img.alt || 'Cecabank';
      logoImg.className = 'footer-logo-img';
      logoLink.appendChild(logoImg);
      logoZone.appendChild(logoLink);
    } else {
      logoZone.appendChild(sections[1].cloneNode(true));
    }
  } else {
    // Default logo
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    const logoImg = document.createElement('img');
    logoImg.src = `${window.hlx.codeBasePath}/icons/logo-cecabank.svg`;
    logoImg.alt = 'Cecabank';
    logoImg.className = 'footer-logo-img';
    logoLink.appendChild(logoImg);
    logoZone.appendChild(logoLink);
  }
  mainContent.appendChild(logoZone);

  // Zone 3: CTA links + social icons (section 2)
  const ctaZone = document.createElement('div');
  ctaZone.className = 'footer-cta';
  if (sections[2]) {
    const clone = sections[2].cloneNode(true);

    // Find links and social icons
    const links = clone.querySelectorAll('a');
    const ctaLinksDiv = document.createElement('div');
    ctaLinksDiv.className = 'footer-cta-links';

    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social';

    links.forEach((linkEl) => {
      const a = document.createElement('a');
      a.href = linkEl.href;

      // Check if it's a social link
      const isSocial = linkEl.href.includes('linkedin')
        || linkEl.href.includes('twitter')
        || linkEl.href.includes('youtube')
        || linkEl.href.includes('facebook');

      if (isSocial) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        // Try to determine which social network
        let iconName = 'linkedin';
        if (linkEl.href.includes('twitter') || linkEl.href.includes('x.com')) iconName = 'twitter';
        if (linkEl.href.includes('youtube')) iconName = 'youtube';
        a.setAttribute('aria-label', iconName);
        a.appendChild(createIcon(iconName, 18));
        socialDiv.appendChild(a);
      } else {
        a.textContent = linkEl.textContent;
        ctaLinksDiv.appendChild(a);
      }
    });

    if (ctaLinksDiv.children.length) ctaZone.appendChild(ctaLinksDiv);
    if (socialDiv.children.length) ctaZone.appendChild(socialDiv);
  }
  mainContent.appendChild(ctaZone);
  footer.appendChild(mainContent);

  // Zone 4: Sitemap link (section 3)
  const sitemapZone = document.createElement('div');
  sitemapZone.className = 'footer-sitemap';
  if (sections[3]) {
    const links = sections[3].querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      sitemapZone.appendChild(a);
    });
  }
  footer.appendChild(sitemapZone);

  // Zone 5: Legal links (section 4)
  const legalZone = document.createElement('div');
  legalZone.className = 'footer-legal';
  if (sections[4]) {
    const links = sections[4].querySelectorAll('a');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      legalZone.appendChild(a);
    });
    if (!links.length) {
      legalZone.appendChild(sections[4].cloneNode(true));
    }
  }
  footer.appendChild(legalZone);

  block.append(footer);
}
