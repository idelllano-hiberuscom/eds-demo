import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * CTA Banner block — stats strip + full-bleed CTA panel
 *
 * Authored table structure:
 * | cta-banner         |                      |               |                     |
 * | stat-number-1      | stat-description-1   | stat-number-2 | stat-description-2  |
 * | background-image   | title                | CTA link      |                     |
 */
export default function decorate(block) {
  const rows = Array.from(block.children);
  block.textContent = '';

  // Row 0: Stats strip
  if (rows[0]) {
    const cells = Array.from(rows[0].children);
    const statsStrip = document.createElement('div');
    statsStrip.className = 'cta-banner-stats';

    // Pair up: number + description
    for (let i = 0; i < cells.length; i += 2) {
      const numCell = cells[i];
      const descCell = cells[i + 1];
      if (!numCell) break;

      const statItem = document.createElement('div');
      statItem.className = 'cta-banner-stat';

      const numEl = document.createElement('span');
      numEl.className = 'stat-number';
      numEl.textContent = numCell.textContent.trim();
      statItem.appendChild(numEl);

      if (descCell) {
        const descEl = document.createElement('span');
        descEl.className = 'stat-desc';
        descEl.textContent = descCell.textContent.trim();
        statItem.appendChild(descEl);
      }

      statsStrip.appendChild(statItem);
    }

    block.appendChild(statsStrip);
  }

  // Row 1: CTA panel
  if (rows[1]) {
    const cells = Array.from(rows[1].children);
    const imgCell = cells[0];
    const titleCell = cells[1];
    const ctaCell = cells[2];

    const ctaPanel = document.createElement('div');
    ctaPanel.className = 'cta-banner-panel';

    // Background image
    const img = imgCell ? imgCell.querySelector('img') : null;
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt || '', true, [{ width: '1200' }]);
      pic.className = 'cta-banner-bg';
      ctaPanel.appendChild(pic);
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'cta-banner-overlay';
    ctaPanel.appendChild(overlay);

    // Content
    const content = document.createElement('div');
    content.className = 'cta-banner-content';

    const titleText = titleCell ? titleCell.textContent.trim() : '';
    if (titleText) {
      const h2 = document.createElement('h2');
      h2.className = 'cta-banner-title';
      h2.textContent = titleText;
      content.appendChild(h2);
    }

    const ctaLink = ctaCell ? ctaCell.querySelector('a') : null;
    if (ctaLink) {
      const cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.className = 'cta-banner-link';
      cta.textContent = ctaLink.textContent || 'SABER MÁS →';
      content.appendChild(cta);
    }

    ctaPanel.appendChild(content);
    block.appendChild(ctaPanel);
  }
}
