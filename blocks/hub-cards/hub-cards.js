/**
 * Hub Cards Block â€” AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Included (Fase 3 ready)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     â””â”€â”€ div (fila 0 â€” OPCIONAL header)
 *           â””â”€â”€ div (col 0) â†’ <h2>Cecabank al dÃ­a</h2>
 *     â””â”€â”€ div (fila N â€” item, 4 cols)
 *           â”œâ”€â”€ div (col 0) â†’ <picture> icono
 *           â”œâ”€â”€ div (col 1) â†’ <h3> tÃ­tulo
 *           â”œâ”€â”€ div (col 2) â†’ <picture> imagen principal
 *           â””â”€â”€ div (col 3) â†’ <p><a> enlace
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.classList.add('hub-cards__grid');

  // UE: grid container instrumentation
  grid.dataset.aueType = 'container';
  grid.dataset.aueFilter = 'hub-cards-filter';
  if (block.dataset.aueResource) {
    grid.dataset.aueResource = block.dataset.aueResource;
  }

  rows.forEach((row) => {
    const cols = [...row.children];

    // Detect header row: single col with heading and no picture
    if (cols.length === 1 && cols[0].querySelector('h1,h2,h3,h4,h5,h6') && !cols[0].querySelector('picture')) {
      row.classList.add('hub-cards__header');
      const heading = cols[0].querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        heading.classList.add('hub-cards__title');
        // UE instrumentation for title
        heading.dataset.aueType = 'text';
        heading.dataset.aueProp = 'sectionTitle';
        heading.dataset.aueLabel = 'TÃ­tulo de secciÃ³n';
      }
      return;
    }

    // Item row: exactly 4 cols (icon, title, image, link)
    if (cols.length >= 4) {
      const article = document.createElement('article');
      article.classList.add('hub-cards__item');
      moveInstrumentation(row, article);

      // UE instrumentation for item
      article.dataset.aueType = 'component';
      article.dataset.aueModel = 'hub-cards-item';
      article.dataset.aueLabel = 'Hub Card';

      // Col 0: icon
      const iconCol = cols[0];
      iconCol.classList.add('hub-cards__icon');
      iconCol.setAttribute('aria-hidden', 'true');
      const iconImg = iconCol.querySelector('img');
      if (iconImg) {
        iconImg.setAttribute('alt', '');
        iconImg.setAttribute('width', '40');
        iconImg.setAttribute('height', '40');
        iconImg.setAttribute('loading', 'lazy');
        iconImg.setAttribute('decoding', 'async');
      }
      article.append(iconCol);

      // Col 1: title (h3)
      const titleCol = cols[1];
      titleCol.classList.add('hub-cards__content');
      const h3 = titleCol.querySelector('h3');
      if (h3) {
        h3.classList.add('hub-cards__card-title');
      }
      article.append(titleCol);

      // Col 2: main image
      const imageCol = cols[2];
      imageCol.classList.add('hub-cards__image');
      const mainImg = imageCol.querySelector('img');
      if (mainImg) {
        mainImg.setAttribute('loading', 'lazy');
        mainImg.setAttribute('decoding', 'async');
      }
      article.append(imageCol);

      // Col 3: link â€” extract <a>, add stretched link class
      const linkCol = cols[3];
      const anchor = linkCol.querySelector('a');
      if (anchor) {
        anchor.classList.add('hub-cards__link');
        const cardTitle = h3 ? h3.textContent.trim() : '';
        anchor.setAttribute('aria-label', `Ir a ${cardTitle}`);
        article.append(anchor);
      }

      grid.append(article);
      // Remove original row from block (it's now empty or has leftover col 3 wrapper)
      row.remove();
    }
  });

  // UE instrumentation on block root
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'hub-cards';
  block.dataset.aueLabel = 'Hub Cards';

  block.append(grid);
}
