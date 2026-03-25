// Hardcoded footer data matching cecabank.es
const FOOTER_DATA = {
  utilityLinks: [
    { title: 'Oficina de cambio de divisas', href: '/oficina-de-cambio-de-divisas/' },
    { title: 'Banca electrónica', href: 'https://be.ceca.es/BEWeb/2000/2000/inicia_identificacion.action' },
    { title: 'Portal de proveedores', href: 'https://centraldecompras.cecabank.es/web/index.html' },
    { title: 'Tablón de anuncios', href: '/informacion-corporativa/informacion-para-clientes/#tablon-de-anuncios' },
    { title: 'Información corporativa', href: '/informacion-corporativa/' },
    { title: 'Gobierno corporativo y política de remuneraciones', href: '/informacion-corporativa/gobierno-corporativo-y-politica-de-remuneraciones/' },
    { title: 'Canal de conducta corporativa', href: '/informacion-corporativa/gobierno-corporativo-y-politica-de-remuneraciones/#canal-conducta' },
  ],
  ctaLinks: [
    { title: '¿Hablamos?', href: '/contacto' },
    { title: 'Banca electrónica', href: 'https://be.ceca.es/' },
  ],
  socialLinks: [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/Cecabank/', icon: 'linkedin' },
    { title: 'X', href: 'https://twitter.com/Cecabank_es', icon: 'twitter' },
    { title: 'YouTube', href: 'https://www.youtube.com/channel/UCWmbZjMOVvAmhdYZvBXCPwA', icon: 'youtube' },
  ],
  legalLinks: [
    { title: 'Aviso legal', href: '/aviso-legal/' },
    { title: 'Derechos de privacidad', href: '/derechos-de-privacidad/' },
    { title: 'Política de cookies', href: '/politica-de-cookies/' },
  ],
};

function createIcon(name, size = 20) {
  const iconPath = `${window.hlx.codeBasePath}/icons/${name}.svg`;
  const iconImg = document.createElement('img');
  iconImg.src = iconPath;
  iconImg.alt = name;
  iconImg.width = size;
  iconImg.height = size;
  iconImg.setAttribute('loading', 'lazy');
  return iconImg;
}

/**
 * loads and decorates the footer with Cecabank style
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer';

  // Zone 1: Utility links (top row)
  const utilityZone = document.createElement('div');
  utilityZone.className = 'footer-utility';
  FOOTER_DATA.utilityLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    utilityZone.appendChild(a);
  });
  footer.appendChild(utilityZone);

  // Main content area
  const mainContent = document.createElement('div');
  mainContent.className = 'footer-main';

  // Zone 2: Logo
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

  // Zone 3: CTA links + social icons
  const ctaZone = document.createElement('div');
  ctaZone.className = 'footer-cta';

  const ctaLinks = document.createElement('div');
  ctaLinks.className = 'footer-cta-links';
  FOOTER_DATA.ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    ctaLinks.appendChild(a);
  });
  ctaZone.appendChild(ctaLinks);

  const socialZone = document.createElement('div');
  socialZone.className = 'footer-social';
  FOOTER_DATA.socialLinks.forEach((link) => {
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

  // Zone 4: Sitemap
  const sitemapZone = document.createElement('div');
  sitemapZone.className = 'footer-sitemap';
  const sitemapLink = document.createElement('a');
  sitemapLink.href = '/mapa-web';
  sitemapLink.textContent = 'Mapa web';
  sitemapZone.appendChild(sitemapLink);
  footer.appendChild(sitemapZone);

  // Zone 5: Legal links
  const legalZone = document.createElement('div');
  legalZone.className = 'footer-legal';
  FOOTER_DATA.legalLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.title;
    legalZone.appendChild(a);
  });
  footer.appendChild(legalZone);

  block.append(footer);
}
