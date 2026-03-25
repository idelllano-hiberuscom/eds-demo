/*
import { patternDecorate } from '../../scripts/blockTemplate.js';

export default async function decorate(block) {
  patternDecorate(block);
}
*/

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Lazy-load video modal if this is a video-card variant
  const isVideoCard = block.classList.contains('video-card');
  let openVideoModal;
  if (isVideoCard) {
    const mod = await import('../../scripts/video-modal.js');
    openVideoModal = mod.openVideoModal;
  }

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Read card style from the third div (index 2)
    const styleDiv = row.children[2];
    const styleParagraph = styleDiv?.querySelector('p');
    const cardStyle = styleParagraph?.textContent?.trim() || 'default';
    if (cardStyle && cardStyle !== 'default') {
      li.className = cardStyle;
    }

    // Read CTA style from the fourth div (index 3)
    const ctaDiv = row.children[3];
    const ctaParagraph = ctaDiv?.querySelector('p');
    const ctaStyle = ctaParagraph?.textContent?.trim() || 'default';

    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Process the li children to identify and style them correctly
    [...li.children].forEach((div, index) => {
      // First div (index 0) - Image
      if (index === 0) {
        div.className = 'cards-card-image';
      } else if (index === 1) {
      // Second div (index 1) - Content with button
        div.className = 'cards-card-body';
      } else if (index === 2) {
      // Third div (index 2) - Card style configuration
        div.className = 'cards-config';
        const p = div.querySelector('p');
        if (p) {
          p.style.display = 'none'; // Hide the configuration text
        }
      } else if (index === 3) {
      // Fourth div (index 3) - CTA style configuration
        div.className = 'cards-config';
        const p = div.querySelector('p');
        if (p) {
          p.style.display = 'none'; // Hide the configuration text
        }
      } else {
      // Any other divs
        div.className = 'cards-card-body';
      }
    });

    // Apply CTA styles to button containers
    const buttonContainers = li.querySelectorAll('p.button-container');
    buttonContainers.forEach((buttonContainer) => {
      // Remove any existing CTA classes
      buttonContainer.classList.remove('default', 'cta-button', 'cta-button-secondary', 'cta-button-dark', 'cta-default');
      // Add the correct CTA class
      buttonContainer.classList.add(ctaStyle);
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);

  // Video-card variant: add play button overlay on cards with a video URL
  if (isVideoCard && openVideoModal) {
    ul.querySelectorAll('li').forEach((card) => {
      // Find a video URL in any text node or link href within hidden config divs
      let videoUrl = '';
      card.querySelectorAll('.cards-config, [style*="display: none"]').forEach((cfg) => {
        const text = cfg.textContent.trim();
        if (!videoUrl && (text.includes('http') && (text.includes('youtu') || text.includes('.mp4')))) {
          videoUrl = text;
        }
      });
      // Also check any anchor href that looks like a video
      if (!videoUrl) {
        card.querySelectorAll('a').forEach((a) => {
          if (!videoUrl && (a.href.includes('youtu') || a.href.includes('.mp4'))) {
            videoUrl = a.href;
            a.remove(); // remove link, play button handles it
          }
        });
      }

      if (videoUrl) {
        const imgWrapper = card.querySelector('.cards-card-image');
        if (imgWrapper) {
          const playBtn = document.createElement('button');
          playBtn.type = 'button';
          playBtn.className = 'play-btn-overlay';
          playBtn.setAttribute('aria-label', 'Play video');
          playBtn.addEventListener('click', () => openVideoModal(videoUrl, playBtn));
          imgWrapper.appendChild(playBtn);
        }
      }
    });
  }

  // Make entire card clickeable (UX improvement)
  ul.querySelectorAll('li').forEach((card) => {
    const link = card.querySelector('a');
    if (link) {
      // Add cursor pointer to card
      card.style.cursor = 'pointer';

      // Make entire card clickeable
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking directly on the link (prevent double trigger)
        if (e.target !== link && !link.contains(e.target)) {
          link.click();
        }
      });

      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}
