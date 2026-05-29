/**
 * Solution Cards Grid Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Included
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila 0 — OPCIONAL header: col 0 = <h2>Título sección</h2>)
 *     └── div (fila N — item)
 *           ├── div (col 0) → <picture><img ...></picture>
 *           └── div (col 1) → <h2>Título</h2><p>Descripción</p><p><a href="...">CTA</a></p>
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // UE: block-level attributes
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'solution-cards';
  block.dataset.aueLabel = 'Solution Cards Grid';

  // Detect modifier
  if (block.classList.contains('no-alternate')) {
    block.classList.add('solution-cards--no-alternate');
  }

  // Separate header row from item rows
  let headerRow = null;
  const itemRows = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const hasPicture = row.querySelector('picture');
    const hasHeading = row.querySelector('h1,h2,h3,h4,h5,h6');

    if (!headerRow && cols.length === 1 && hasHeading && !hasPicture) {
      headerRow = row;
    } else {
      itemRows.push(row);
    }
  });

  // Build header
  if (headerRow) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('solution-cards__header');
    const heading = headerRow.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      heading.classList.add('solution-cards__section-title');
      heading.dataset.aueType = 'text';
      heading.dataset.aueProp = 'sectionTitle';
      heading.dataset.aueLabel = 'Título de sección';
    }
    moveInstrumentation(headerRow, headerDiv);
    headerDiv.append(...headerRow.children);
    headerRow.replaceWith(headerDiv);
  }

  // Build list
  const ul = document.createElement('ul');
  ul.classList.add('solution-cards__list');
  ul.dataset.aueType = 'container';
  ul.dataset.aueFilter = 'solution-cards-filter';
  if (block.dataset.aueResource) {
    ul.dataset.aueResource = block.dataset.aueResource;
  }

  itemRows.forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    li.classList.add('solution-cards__item');
    li.dataset.aueType = 'component';
    li.dataset.aueModel = 'solution-cards-item';
    li.dataset.aueLabel = 'Solution Card';

    // Detect per-item image position classes
    if (row.classList.contains('image-right')) {
      li.classList.add('solution-cards__item--image-right');
    }
    if (row.classList.contains('image-left')) {
      li.classList.add('solution-cards__item--image-left');
    }

    moveInstrumentation(row, li);

    const article = document.createElement('article');
    article.classList.add('solution-cards__card');

    // Col 0 — image
    const imageCol = cols[0];
    if (imageCol) {
      imageCol.classList.add('solution-cards__image');
      imageCol.querySelectorAll('picture img').forEach((img) => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      });
      article.append(imageCol);
    }

    // Col 1 — content
    const contentCol = cols[1];
    if (contentCol) {
      contentCol.classList.add('solution-cards__content');

      // Classify heading
      const heading = contentCol.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        heading.classList.add('solution-cards__title');
      }

      // Find CTA paragraph: last <p> whose only child is an <a>
      const paragraphs = [...contentCol.querySelectorAll('p')];
      let ctaParagraph = null;
      for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
        const p = paragraphs[i];
        const links = p.querySelectorAll('a');
        const textContent = p.textContent.trim();
        if (links.length === 1 && links[0].textContent.trim() === textContent) {
          ctaParagraph = p;
          break;
        }
      }

      // Wrap description paragraphs
      const descParagraphs = paragraphs.filter((p) => p !== ctaParagraph);
      if (descParagraphs.length > 0) {
        const descDiv = document.createElement('div');
        descDiv.classList.add('solution-cards__description');
        descParagraphs.forEach((p) => descDiv.append(p));
        if (heading) {
          heading.after(descDiv);
        } else {
          contentCol.prepend(descDiv);
        }
      }

      // Extract CTA link
      if (ctaParagraph) {
        const ctaLink = ctaParagraph.querySelector('a');
        if (ctaLink) {
          ctaLink.classList.add('button', 'solution-cards__cta');
          ctaParagraph.replaceWith(ctaLink);
        }
      }

      article.append(contentCol);
    }

    li.append(article);
    ul.append(li);
    row.remove();
  });

  block.append(ul);
}
