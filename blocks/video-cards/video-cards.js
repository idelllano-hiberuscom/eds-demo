import { createOptimizedPicture } from '../../scripts/aem.js';
import { openVideoModal } from '../../scripts/video-modal.js';

/**
 * Video Cards block
 *
 * Standard variant:
 * | video-cards        |           |           |
 * | thumbnail-image    | title     | video-url |
 * | Section CTA link   |           |           |
 *
 * Axes variant (video-cards axes):
 * | video-cards (axes) |           |           |          |
 * | thumbnail-image    | title     | video-url | CTA link |
 */
export default function decorate(block) {
  const isAxes = block.classList.contains('axes');
  const rows = Array.from(block.children);

  // Detect section CTA: last row with a single link and no image
  let sectionCta = null;
  const lastRow = rows[rows.length - 1];
  if (lastRow) {
    const cells = Array.from(lastRow.children);
    const hasImage = lastRow.querySelector('img, picture');
    const link = lastRow.querySelector('a');
    if (!hasImage && link && cells.filter((c) => c.textContent.trim()).length <= 2) {
      sectionCta = link.cloneNode(true);
      rows.pop(); // remove from iteration
    }
  }

  const ul = document.createElement('ul');
  ul.className = 'video-cards-list';

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const imgCell = cells[0];
    const titleCell = cells[1];
    const videoCell = cells[2];
    const ctaCell = cells[3]; // axes variant only

    const li = document.createElement('li');
    li.className = 'video-card-item';

    // Thumbnail with play button
    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'video-card-thumb';

    const img = imgCell ? imgCell.querySelector('img') : null;
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt || '', true, [{ width: '480' }]);
      thumbWrap.appendChild(pic);
    }

    // Video URL
    const videoUrl = videoCell ? videoCell.textContent.trim() : '';

    // Play button overlay
    if (videoUrl) {
      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'video-card-play';
      playBtn.setAttribute('aria-label', 'Play video');
      playBtn.addEventListener('click', () => openVideoModal(videoUrl, playBtn));
      thumbWrap.appendChild(playBtn);

      // Also clicking thumbnail triggers modal
      thumbWrap.style.cursor = 'pointer';
      thumbWrap.addEventListener('click', (e) => {
        if (!playBtn.contains(e.target)) openVideoModal(videoUrl, thumbWrap);
      });
    }

    li.appendChild(thumbWrap);

    // Title
    const titleText = titleCell ? titleCell.textContent.trim() : '';
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.className = 'video-card-title';
      h3.textContent = titleText;
      li.appendChild(h3);
    }

    // Per-card CTA (axes variant)
    if (isAxes && ctaCell) {
      const ctaLink = ctaCell.querySelector('a');
      if (ctaLink) {
        const ctaEl = document.createElement('a');
        ctaEl.href = ctaLink.href;
        ctaEl.className = 'video-card-cta';
        ctaEl.textContent = ctaLink.textContent || 'SABER MÁS →';
        li.appendChild(ctaEl);
      }
    }

    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);

  // Section CTA
  if (sectionCta) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'video-cards-section-cta';
    sectionCta.className = 'button primary';
    ctaWrap.appendChild(sectionCta);
    block.appendChild(ctaWrap);
  }
}
