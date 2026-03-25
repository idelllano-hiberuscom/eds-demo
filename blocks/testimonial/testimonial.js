import { createOptimizedPicture } from '../../scripts/aem.js';
import { openVideoModal } from '../../scripts/video-modal.js';

/**
 * Testimonial block — 2-col layout with thumbnail + video play + quote
 *
 * Authored table structure:
 * | testimonial         |            |          |             |              |
 * | thumbnail-image     | video-url  | quote    | author-name | author-role  |
 */
export default function decorate(block) {
  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const imgCell = cells[0];
    const videoCell = cells[1];
    const quoteCell = cells[2];
    const nameCell = cells[3];
    const roleCell = cells[4];

    const card = document.createElement('div');
    card.className = 'testimonial-card';

    // === Left: Thumbnail + Play ===
    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'testimonial-thumb';

    const img = imgCell ? imgCell.querySelector('img') : null;
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt || '', true, [{ width: '600' }]);
      thumbWrap.appendChild(pic);
    }

    const videoUrl = videoCell ? videoCell.textContent.trim() : '';

    if (videoUrl) {
      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'testimonial-play';
      playBtn.setAttribute('aria-label', 'Play testimonial video');
      playBtn.addEventListener('click', () => openVideoModal(videoUrl, playBtn));
      thumbWrap.appendChild(playBtn);
    }

    // Author overlay at bottom of thumbnail
    const authorName = nameCell ? nameCell.textContent.trim() : '';
    const authorRole = roleCell ? roleCell.textContent.trim() : '';
    if (authorName || authorRole) {
      const authorOverlay = document.createElement('div');
      authorOverlay.className = 'testimonial-author-overlay';
      if (authorName) {
        const nameEl = document.createElement('span');
        nameEl.className = 'testimonial-author-name';
        nameEl.textContent = authorName;
        authorOverlay.appendChild(nameEl);
      }
      if (authorRole) {
        const roleEl = document.createElement('span');
        roleEl.className = 'testimonial-author-role';
        roleEl.textContent = authorRole;
        authorOverlay.appendChild(roleEl);
      }
      thumbWrap.appendChild(authorOverlay);
    }

    card.appendChild(thumbWrap);

    // === Right: Quote ===
    const quoteWrap = document.createElement('div');
    quoteWrap.className = 'testimonial-quote-wrap';

    const quoteText = quoteCell ? quoteCell.textContent.trim() : '';
    if (quoteText) {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'testimonial-quote';
      blockquote.textContent = quoteText;
      quoteWrap.appendChild(blockquote);
    }

    card.appendChild(quoteWrap);

    row.replaceWith(card);
  });
}
