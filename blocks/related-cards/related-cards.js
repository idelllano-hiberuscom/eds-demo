/**
 * Related Cards Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Included
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila 0) → header: col 0 = <h2>
 *     └── div (fila 1+) → card item: col 0 = <picture> (optional), col 1 = <h3> + <a>
 *         OR single col: col 0 = <h3> + <a> (text-only card)
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // --- Header row (first row) ---
  const headerRow = rows[0];
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('related-cards__header');

  const h2 = headerRow.querySelector('h2');
  if (h2) {
    h2.classList.add('related-cards__title');
    h2.dataset.aueProp = 'sectionTitle';
    h2.dataset.aueType = 'text';
    h2.dataset.aueLabel = 'Título de sección';
    headerDiv.append(h2);
  }
  moveInstrumentation(headerRow, headerDiv);

  // --- Card items ---
  const ul = document.createElement('ul');
  ul.classList.add('related-cards__list');
  ul.dataset.aueType = 'container';
  ul.dataset.aueFilter = 'related-cards-filter';
  if (block.dataset.aueResource) {
    ul.dataset.aueResource = block.dataset.aueResource;
  }

  rows.slice(1).forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    li.classList.add('related-cards__element');
    li.dataset.aueType = 'component';
    li.dataset.aueModel = 'related-cards-item';
    li.dataset.aueLabel = 'Related Card';
    moveInstrumentation(row, li);

    const hasPicture = row.querySelector('picture') !== null;
    const contentCol = hasPicture && cols.length > 1 ? cols[1] : cols[0];

    // Extract link info
    let href = '#';
    let ctaText = 'Saber más';
    const link = contentCol.querySelector('a');
    if (link) {
      href = link.getAttribute('href') || '#';
      ctaText = link.textContent.trim() || 'Saber más';
    }

    // Build card anchor
    const cardLink = document.createElement('a');
    cardLink.classList.add('related-cards__card');
    cardLink.setAttribute('href', href);
    if (!hasPicture) {
      cardLink.classList.add('related-cards__card--text-only');
    }

    // Media
    if (hasPicture) {
      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('related-cards__media');
      const picture = row.querySelector('picture');
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }
      mediaDiv.append(picture);
      cardLink.append(mediaDiv);
    }

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('related-cards__content');

    const h3 = contentCol.querySelector('h3');
    if (h3) {
      h3.classList.add('related-cards__card-title');
      contentDiv.append(h3);
    }

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('related-cards__cta');
    ctaSpan.textContent = ctaText;
    contentDiv.append(ctaSpan);

    cardLink.append(contentDiv);
    li.append(cardLink);
    ul.append(li);
  });

  // Remove original rows and append new structure
  rows.forEach((row) => row.remove());
  block.append(headerDiv, ul);

  // UE instrumentation on block root
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'related-cards';
  block.dataset.aueLabel = 'Related Cards';
}
