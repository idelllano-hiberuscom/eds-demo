/**
 * CTA Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Pendiente (Fase 3 - UE & QA Specialist)
 *
 * DOM de entrada (matriz EDS):
 *   block (.cta .image-right | .image-left | .compact)
 *     └── div (fila 0 — ÚNICA fila)
 *           ├── div (col 0) → picture (normal) | content (compact)
 *           └── div (col 1) → content (normal only)
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a content column: title, description wrapper, CTA link
 * @param {Element} col - The column element containing text content
 */
function decorateContentCol(col) {
  col.classList.add('cta__content');

  // Title: first heading
  const title = col.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) {
    title.classList.add('cta__title');
  }

  // CTA: last <p> that contains only an <a> child
  const paragraphs = [...col.querySelectorAll(':scope > p')];
  let ctaParagraph = null;

  for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
    const p = paragraphs[i];
    const links = p.querySelectorAll('a');
    const textContent = p.textContent.trim();
    // Check if paragraph has only a single link and nothing else meaningful
    if (links.length === 1 && textContent === links[0].textContent.trim()) {
      ctaParagraph = p;
      break;
    }
  }

  if (ctaParagraph) {
    const ctaLink = ctaParagraph.querySelector('a');
    ctaLink.classList.add('button', 'cta__cta');
    // Replace the paragraph with just the link
    ctaParagraph.replaceWith(ctaLink);
  }

  // Description: wrap remaining content between title and CTA in a div
  const descriptionWrapper = document.createElement('div');
  descriptionWrapper.classList.add('cta__description');

  // Collect nodes between title and CTA link
  const children = [...col.children];
  let collecting = false;

  children.forEach((child) => {
    if (child === title) {
      collecting = true;
      return;
    }
    if (child.classList.contains('cta__cta')) {
      collecting = false;
      return;
    }
    if (collecting) {
      descriptionWrapper.appendChild(child);
    }
  });

  // Insert description wrapper after title, before CTA
  if (descriptionWrapper.children.length > 0) {
    const ctaEl = col.querySelector('.cta__cta');
    if (ctaEl) {
      col.insertBefore(descriptionWrapper, ctaEl);
    } else {
      col.appendChild(descriptionWrapper);
    }
  }
}

export default function decorate(block) {
  const isCompact = block.classList.contains('compact');
  const isImageLeft = block.classList.contains('image-left');
  const isImageRight = block.classList.contains('image-right');

  // Determine variant
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  const hasPicture = cols.some((col) => col.querySelector('picture'));

  // Apply BEM modifier
  if (isCompact || (!hasPicture && !isImageLeft && !isImageRight)) {
    block.classList.add('cta--compact');
  } else if (isImageLeft) {
    block.classList.add('cta--image-left');
  } else {
    block.classList.add('cta--image-right');
  }

  // Convert row to cta__inner
  row.classList.add('cta__inner');
  moveInstrumentation(row, row);

  if (!isCompact && hasPicture) {
    // Normal variant: identify media and content columns
    cols.forEach((col) => {
      if (col.querySelector('picture')) {
        col.classList.add('cta__media');
        // Set lazy loading on all images
        col.querySelectorAll('picture img').forEach((image) => {
          image.setAttribute('loading', 'lazy');
          image.setAttribute('decoding', 'async');
        });
      } else {
        decorateContentCol(col);
      }
    });
  } else {
    // Compact variant (or graceful degradation)
    const contentCol = cols[0];
    if (contentCol) {
      decorateContentCol(contentCol);
    }
  }
}
