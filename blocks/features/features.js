/**
 * Features Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Pendiente (Fase 3 - UE & QA Specialist)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila 0 — OPCIONAL header)
 *           └── div (col 0) → <h2>Título de sección</h2>
 *     └── div (fila N — item)
 *           ├── div (col 0) → <picture><img ...></picture>
 *           └── div (col 1) → <h3>Título</h3><p>Descripción</p>
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let headerRow = null;
  let itemRows = rows;

  // Detect header row: single col child containing a heading but no picture
  const firstRow = rows[0];
  const firstRowCols = [...firstRow.children];
  if (
    firstRowCols.length === 1
    && firstRowCols[0].querySelector('h1,h2,h3,h4,h5,h6')
    && !firstRowCols[0].querySelector('picture')
  ) {
    headerRow = firstRow;
    itemRows = rows.slice(1);
  }

  // Build header
  if (headerRow) {
    headerRow.classList.add('features__header');
    moveInstrumentation(headerRow, headerRow);
    const heading = headerRow.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) heading.classList.add('features__title');
  }

  // Build grid
  const ul = document.createElement('ul');
  ul.classList.add('features__grid');

  itemRows.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('features__element');
    moveInstrumentation(row, li);

    const cols = [...row.children];

    // Col 0 — media (picture/icon)
    if (cols[0]) {
      const figure = document.createElement('figure');
      figure.classList.add('features__media');
      while (cols[0].firstChild) {
        figure.appendChild(cols[0].firstChild);
      }
      li.appendChild(figure);
    }

    // Col 1 — content (title + description)
    if (cols[1]) {
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('features__content');

      const h3 = cols[1].querySelector('h3');
      if (h3) {
        h3.classList.add('features__item-title');
        contentDiv.appendChild(h3);
      }

      // Wrap remaining nodes in description div
      const descDiv = document.createElement('div');
      descDiv.classList.add('features__description');
      while (cols[1].firstChild) {
        descDiv.appendChild(cols[1].firstChild);
      }
      if (descDiv.childNodes.length) {
        contentDiv.appendChild(descDiv);
      }

      li.appendChild(contentDiv);
    }

    ul.appendChild(li);
  });

  // Remove original item rows (header stays in place)
  itemRows.forEach((row) => row.remove());

  // Add count modifier
  block.classList.add(`features--count-${itemRows.length}`);

  // Append grid
  block.appendChild(ul);

  // Images: all lazy (not LCP block)
  block.querySelectorAll('picture img').forEach((img) => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });

  // --- UE Instrumentation (xwalk) ---
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'features';
  block.dataset.aueLabel = 'Features';

  // Grid: container for items
  if (block.dataset.aueResource) {
    ul.dataset.aueResource = block.dataset.aueResource;
  }
  ul.dataset.aueType = 'container';
  ul.dataset.aueFilter = 'features-filter';

  // Title: inline text editing
  const titleInstrument = block.querySelector('.features__title');
  if (titleInstrument) {
    titleInstrument.dataset.aueProp = 'sectionTitle';
    titleInstrument.dataset.aueType = 'text';
    titleInstrument.dataset.aueLabel = 'Título de sección';
  }

  // Items: each is a component
  ul.querySelectorAll('.features__element').forEach((el) => {
    el.dataset.aueType = 'component';
    el.dataset.aueModel = 'features-item';
    el.dataset.aueLabel = 'Feature Node';
  });
}
