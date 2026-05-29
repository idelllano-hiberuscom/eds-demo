/**
 * Search Results Block - AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Pendiente (Fase 3 - UE & QA Specialist)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     div (fila 0 - config)
 *       div (col 0) - searchPlaceholder text
 *       div (col 1) - resultsPerPage number
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

let indexCache;
const blockState = new WeakMap();

function getState(block) {
  if (!blockState.has(block)) blockState.set(block, {});
  return blockState.get(block);
}

async function getIndex() {
  if (!indexCache) {
    const resp = await fetch('/query-index.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    indexCache = json.data;
  }
  return indexCache;
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function renderResults(block, results, page) {
  const state = getState(block);
  const perPage = state.perPage || 10;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const slice = results.slice(start, start + perPage);

  const list = block.querySelector('.search-results__list');
  while (list.firstChild) list.removeChild(list.firstChild);

  slice.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('search-results__item');

    const article = document.createElement('article');
    article.classList.add('search-results__article');

    const h2 = document.createElement('h2');
    h2.classList.add('search-results__title');
    const a = document.createElement('a');
    a.href = item.path;
    a.textContent = item.title || item.path;
    h2.appendChild(a);
    article.appendChild(h2);

    if (item.date) {
      const dateP = document.createElement('p');
      dateP.classList.add('search-results__date');
      dateP.textContent = formatDate(item.date);
      article.appendChild(dateP);
    }

    if (item.description) {
      const excerpt = document.createElement('p');
      excerpt.classList.add('search-results__excerpt');
      excerpt.textContent = item.description;
      article.appendChild(excerpt);
    }

    li.appendChild(article);
    list.appendChild(li);
  });

  // Pagination
  const nav = block.querySelector('.search-results__pagination');
  while (nav.firstChild) nav.removeChild(nav.firstChild);

  if (totalPages <= 1) {
    nav.hidden = true;
    return;
  }

  nav.hidden = false;

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('search-results__page', 'search-results__page--prev');
  prevBtn.type = 'button';
  prevBtn.setAttribute('data-page', String(currentPage - 1));
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.textContent = '\u2190';
  if (currentPage <= 1) {
    prevBtn.disabled = true;
    prevBtn.classList.add('search-results__page--disabled');
  }
  nav.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i += 1) {
    const btn = document.createElement('button');
    btn.classList.add('search-results__page');
    btn.type = 'button';
    btn.setAttribute('data-page', String(i));
    btn.textContent = String(i);
    if (i === currentPage) {
      btn.classList.add('search-results__page--current');
      btn.setAttribute('aria-current', 'page');
    }
    nav.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('search-results__page', 'search-results__page--next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('data-page', String(currentPage + 1));
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.textContent = '\u2192';
  if (currentPage >= totalPages) {
    nextBtn.disabled = true;
    nextBtn.classList.add('search-results__page--disabled');
  }
  nav.appendChild(nextBtn);
}

async function runSearch(block, term, page = 1) {
  const status = block.querySelector('.search-results__status');
  block.classList.add('search-results--loading');
  block.classList.remove('search-results--error', 'search-results--empty');

  try {
    const index = await getIndex();
    const normalized = term.trim().toLowerCase();

    const filtered = index.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      const path = (item.path || '').toLowerCase();
      return title.includes(normalized)
        || description.includes(normalized)
        || path.includes(normalized);
    });

    filtered.sort((a, b) => (Number(b.date) || 0) - (Number(a.date) || 0));
    getState(block).results = filtered;

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('s', term);
    window.history.replaceState(null, '', url.toString());

    renderResults(block, filtered, page);

    if (filtered.length === 0) {
      status.textContent = 'No se han encontrado resultados';
      block.classList.add('search-results--empty');
    } else {
      status.textContent = `${filtered.length} resultados para \u201C${term}\u201D`;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[search-results] runSearch failed:', err);
    const statusEl = block.querySelector('.search-results__status');
    statusEl.textContent = 'Error al realizar la búsqueda. Inténtalo de nuevo.';
    block.classList.add('search-results--error');
  } finally {
    block.classList.remove('search-results--loading');
    block.classList.add('search-results--ready');
  }
}

function hydrateFromURL(block) {
  const params = new URLSearchParams(window.location.search);
  const term = params.get('s');
  if (term) {
    runSearch(block, term, 1);
  }
}

export default function decorate(block) {
  // 1. Read config from first row
  const configRow = block.children[0];
  const cols = [...configRow.children];
  const searchPlaceholder = (cols[0] && cols[0].textContent.trim()) || '¿Qué estás buscando?';
  const resultsPerPage = parseInt(cols[1] && cols[1].textContent.trim(), 10) || 10;
  getState(block).perPage = resultsPerPage;

  // 2. Move UE instrumentation from config row to block
  moveInstrumentation(configRow, block);

  // 3. Remove original children
  while (block.firstChild) block.removeChild(block.firstChild);

  // 4. Build search shell
  const searchSection = document.createElement('div');
  searchSection.classList.add('search-results__search');
  searchSection.setAttribute('role', 'search');
  searchSection.setAttribute('aria-label', 'Buscador interno');

  const form = document.createElement('form');
  form.classList.add('search-results__form');

  const label = document.createElement('label');
  label.classList.add('visually-hidden');
  label.setAttribute('for', 'search-results-input');
  label.textContent = 'Buscar';

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('search-results__field');

  const input = document.createElement('input');
  input.id = 'search-results-input';
  input.classList.add('search-results__input');
  input.type = 'search';
  input.name = 's';
  input.placeholder = searchPlaceholder;
  input.autocomplete = 'off';

  const submitBtn = document.createElement('button');
  submitBtn.classList.add('search-results__submit');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Buscar';

  fieldDiv.appendChild(input);
  fieldDiv.appendChild(submitBtn);
  form.appendChild(label);
  form.appendChild(fieldDiv);
  searchSection.appendChild(form);

  // 5. Status
  const status = document.createElement('div');
  status.classList.add('search-results__status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('role', 'status');

  // 6. Results list
  const list = document.createElement('ol');
  list.classList.add('search-results__list');

  // 7. Pagination
  const pagination = document.createElement('nav');
  pagination.classList.add('search-results__pagination');
  pagination.setAttribute('aria-label', 'Paginación de resultados');

  // 8. Append all to block
  block.appendChild(searchSection);
  block.appendChild(status);
  block.appendChild(list);
  block.appendChild(pagination);

  // 9. Set input from URL
  const params = new URLSearchParams(window.location.search);
  const urlTerm = params.get('s');
  if (urlTerm) {
    input.value = urlTerm;
    hydrateFromURL(block);
  }

  // 10. Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = input.value.trim();
    if (term) runSearch(block, term, 1);
  });

  pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn || btn.disabled) return;
    const page = parseInt(btn.getAttribute('data-page'), 10);
    const { results } = getState(block);
    if (results) {
      renderResults(block, results, page);
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(window.location.search);
    const term = p.get('s');
    if (term) {
      input.value = term;
      runSearch(block, term, 1);
    }
  });
}
