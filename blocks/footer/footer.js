import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer with Cecabank 5-zone teal layout
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  const fragment = await loadFragment(footerPath);
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer';

  if (!fragment) {
    footer.innerHTML = '<p>Footer content not available</p>';
    block.append(footer);
    return;
  }

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
      // plain text fallback
      utilityZone.appendChild(sections[0].cloneNode(true));
    }
  }
  footer.appendChild(utilityZone);

  // Zone 2: Logo (section 1)
  const logoZone = document.createElement('div');
  logoZone.className = 'footer-logo';
  if (sections[1]) {
    logoZone.appendChild(sections[1].cloneNode(true));
  }
  footer.appendChild(logoZone);

  // Zone 3: CTA links + social icons (section 2)
  const ctaZone = document.createElement('div');
  ctaZone.className = 'footer-cta';
  if (sections[2]) {
    const clone = sections[2].cloneNode(true);
    // Social icons: look for a list with only icon-like items
    const lists = clone.querySelectorAll('ul');
    lists.forEach((list) => {
      const isIconList = Array.from(list.querySelectorAll('li')).every(
        (li) => li.querySelector('img, svg, .icon') || li.textContent.trim().length <= 3,
      );
      if (isIconList) {
        list.classList.add('footer-social');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';
      }
    });
    while (clone.firstElementChild) ctaZone.appendChild(clone.firstElementChild);
  }
  footer.appendChild(ctaZone);

  // Zone 4: Sitemap link (section 3)
  const sitemapZone = document.createElement('div');
  sitemapZone.className = 'footer-sitemap';
  if (sections[3]) {
    sitemapZone.appendChild(sections[3].cloneNode(true));
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
