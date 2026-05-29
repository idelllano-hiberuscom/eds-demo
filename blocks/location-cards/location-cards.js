/**
 * Location Cards Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila 0 — header, 2 cols)
 *           ├── div col 0 → <h2>Oficinas y sucursal</h2>
 *           └── div col 1 → <p>Sede</p>
 *     └── div (fila N — item, 4 cols)
 *           ├── div col 0 → <picture>…</picture>
 *           ├── div col 1 → <h3>Ciudad</h3>
 *           ├── div col 2 → <p>dirección línea 1</p><p>línea 2</p>
 *           └── div col 3 → <p>teléfono</p><p><a href="…">Ver mapa</a></p>
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Normalize a phone string to a tel: URI value.
 * Strips spaces, parentheses, dashes.
 * @param {string} raw - visible phone text
 * @returns {string} normalized for tel: href
 */
function normalizePhone(raw) {
  return raw.replace(/[\s()\-–]/g, '');
}

export default function decorate(block) {
  // Modifier class
  if (block.classList.contains('headquarters')) {
    block.classList.add('location-cards--headquarters');
  }

  const rows = [...block.children];
  const headerRow = rows[0];
  const itemRows = rows.slice(1);

  // --- HEADER ---
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('location-cards__header');
  moveInstrumentation(headerRow, headerDiv);

  const headerCols = [...headerRow.children];
  const titleEl = headerCols[0]?.querySelector('h2');
  if (titleEl) {
    titleEl.classList.add('location-cards__title');
    titleEl.setAttribute('data-aue-prop', 'sectionTitle');
    titleEl.setAttribute('data-aue-type', 'text');
    titleEl.setAttribute('data-aue-label', 'Título de sección');
    headerDiv.append(titleEl);
  }
  const subtypeEl = headerCols[1]?.querySelector('p');
  if (subtypeEl) {
    subtypeEl.classList.add('location-cards__subtype');
    headerDiv.append(subtypeEl);
  }

  // --- GRID ---
  const grid = document.createElement('div');
  grid.classList.add('location-cards__grid');
  grid.setAttribute('data-aue-type', 'container');
  grid.setAttribute('data-aue-filter', 'location-cards-filter');
  if (block.dataset.aueResource) {
    grid.dataset.aueResource = block.dataset.aueResource;
  }

  itemRows.forEach((row) => {
    const article = document.createElement('article');
    article.classList.add('location-cards__item');
    article.setAttribute('data-aue-type', 'component');
    article.setAttribute('data-aue-model', 'location-cards-item');
    article.setAttribute('data-aue-label', 'Location Card');
    moveInstrumentation(row, article);

    const cols = [...row.children];

    // Col 0 — Image
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('location-cards__image');
    const picture = cols[0]?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }
      imageWrapper.append(picture);
    }
    article.append(imageWrapper);

    // Content wrapper
    const content = document.createElement('div');
    content.classList.add('location-cards__content');

    // Col 1 — City name
    const cityEl = cols[1]?.querySelector('h3');
    if (cityEl) {
      cityEl.classList.add('location-cards__city');
      content.append(cityEl);
    }

    // Col 2 — Address
    const addressEl = document.createElement('address');
    addressEl.classList.add('location-cards__address');
    if (cols[2]) {
      [...cols[2].querySelectorAll('p')].forEach((p) => addressEl.append(p));
    }
    content.append(addressEl);

    // Col 3 — Contact (phone + map link)
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('location-cards__contact');

    if (cols[3]) {
      const paragraphs = [...cols[3].querySelectorAll('p')];
      paragraphs.forEach((p) => {
        const anchor = p.querySelector('a');
        if (anchor) {
          // Map link
          anchor.classList.add('location-cards__map-link');
          contactDiv.append(anchor);
        } else {
          // Phone text — convert to tel: link
          const phoneText = p.textContent.trim();
          if (phoneText) {
            const phoneLink = document.createElement('a');
            phoneLink.classList.add('location-cards__phone');
            phoneLink.href = `tel:${normalizePhone(phoneText)}`;
            phoneLink.textContent = phoneText;
            contactDiv.append(phoneLink);
          }
        }
      });
    }
    content.append(contactDiv);
    article.append(content);
    grid.append(article);
  });

  // --- UE instrumentation on block root ---
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-model', 'location-cards');
  block.setAttribute('data-aue-label', 'Location Cards');

  // Replace original rows with new structure
  // Remove original rows (already moved content out of them)
  rows.forEach((row) => row.remove());
  block.append(headerDiv, grid);
}
