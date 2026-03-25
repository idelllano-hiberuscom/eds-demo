import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Values block — full-viewport stacked panels
 *
 * Authored table structure:
 * | values             |             |               |          |
 * | background-image   | title       | description   | CTA link |
 * | background-image   | title       | description   | CTA link |
 */
export default function decorate(block) {
  const rows = Array.from(block.children);

  const panels = rows.map((row) => {
    const cells = Array.from(row.children);
    const imgCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const ctaCell = cells[3];

    const section = document.createElement('section');
    section.className = 'values-panel';

    // Background image
    const img = imgCell ? imgCell.querySelector('img') : null;
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt || '', true, [{ width: '1200' }]);
      pic.className = 'values-bg';
      section.appendChild(pic);
    }

    // Dark overlay
    const overlay = document.createElement('div');
    overlay.className = 'values-overlay';
    section.appendChild(overlay);

    // Content
    const content = document.createElement('div');
    content.className = 'values-content';

    const titleText = titleCell ? titleCell.textContent.trim() : '';
    if (titleText) {
      const h2 = document.createElement('h2');
      h2.className = 'values-title';
      h2.textContent = titleText;
      content.appendChild(h2);
    }

    const descText = descCell ? descCell.textContent.trim() : '';
    if (descText) {
      const p = document.createElement('p');
      p.className = 'values-description';
      p.textContent = descText;
      content.appendChild(p);
    }

    const ctaLink = ctaCell ? ctaCell.querySelector('a') : null;
    if (ctaLink) {
      const cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.className = 'values-cta';
      cta.textContent = ctaLink.textContent || 'SABER MÁS →';
      content.appendChild(cta);
    }

    section.appendChild(content);
    return section;
  });

  block.textContent = '';
  panels.forEach((panel) => block.appendChild(panel));

  // IntersectionObserver for fade-in animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  block.querySelectorAll('.values-panel').forEach((panel) => observer.observe(panel));
}
