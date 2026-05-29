/**
 * Post List Block — AEM Edge Delivery Services
 *
 * Dynamic news/post listing that fetches from /query-index.json,
 * filters by category, orders by date descending, and paginates in client.
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Included (Fase 3)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila 0 - header)
 *           └── div (col 0) — <h2>Notas de prensa</h2>
 *     └── div (fila 1 - config)
 *           ├── div (col 0) — <p>notas-de-prensa</p> (category)
 *           └── div (col 1) — <p>4</p> (postsPerPage)
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Format a Unix timestamp (seconds) to YYYY-MM-DD
 * @param {number} timestamp
 * @returns {string}
 */
function toISODate(timestamp) {
  const d = new Date(timestamp * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Render a single page of posts into the block
 * @param {Element} block
 * @param {number} page - 1-based page number
 */
function renderPage(block, page) {
  const posts = block.postListData || [];
  const pageSize = parseInt(block.dataset.pageSize, 10) || 4;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const start = (currentPage - 1) * pageSize;
  const slice = posts.slice(start, start + pageSize);

  const ul = block.querySelector('.post-list__items');
  const nav = block.querySelector('.post-list__pagination');

  // Clear previous items
  while (ul.firstChild) ul.removeChild(ul.firstChild);
  while (nav.firstChild) nav.removeChild(nav.firstChild);

  if (posts.length === 0) {
    const empty = document.createElement('li');
    empty.classList.add('post-list__empty');
    empty.textContent = 'No se encontraron publicaciones.';
    ul.appendChild(empty);
    return;
  }

  // Render items
  slice.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('post-list__item');

    const time = document.createElement('time');
    time.classList.add('post-list__date');
    const ts = Number(post.date) || 0;
    time.setAttribute('datetime', toISODate(ts));
    time.textContent = DATE_FORMATTER.format(new Date(ts * 1000));

    const content = document.createElement('div');
    content.classList.add('post-list__content');

    const link = document.createElement('a');
    link.classList.add('post-list__link');
    link.href = post.path || '#';
    link.textContent = post.title || '';

    content.appendChild(link);

    if (post.description) {
      const excerpt = document.createElement('p');
      excerpt.classList.add('post-list__excerpt');
      excerpt.textContent = post.description;
      content.appendChild(excerpt);
    }

    li.appendChild(time);
    li.appendChild(content);
    ul.appendChild(li);
  });

  // Pagination — hide if single page
  if (totalPages <= 1) {
    nav.hidden = true;
    return;
  }
  nav.hidden = false;

  // Prev button
  const prev = document.createElement('a');
  prev.classList.add('post-list__page', 'post-list__page--prev');
  prev.href = '#';
  prev.dataset.page = String(Math.max(1, currentPage - 1));
  prev.setAttribute('aria-label', 'Página anterior');
  prev.textContent = '←';
  if (currentPage === 1) {
    prev.classList.add('post-list__page--disabled');
    prev.setAttribute('aria-disabled', 'true');
  }
  nav.appendChild(prev);

  // Page numbers
  for (let i = 1; i <= totalPages; i += 1) {
    const pageLink = document.createElement('a');
    pageLink.classList.add('post-list__page');
    pageLink.href = '#';
    pageLink.dataset.page = String(i);
    pageLink.textContent = String(i);
    if (i === currentPage) {
      pageLink.classList.add('post-list__page--current');
      pageLink.setAttribute('aria-current', 'page');
    }
    nav.appendChild(pageLink);
  }

  // Next button
  const next = document.createElement('a');
  next.classList.add('post-list__page', 'post-list__page--next');
  next.href = '#';
  next.dataset.page = String(Math.min(totalPages, currentPage + 1));
  next.setAttribute('aria-label', 'Página siguiente');
  next.textContent = '→';
  if (currentPage === totalPages) {
    next.classList.add('post-list__page--disabled');
    next.setAttribute('aria-disabled', 'true');
  }
  nav.appendChild(next);

  block.postListCurrentPage = currentPage;
}

/**
 * Fetch posts from query-index.json and render first page
 * @param {Element} block
 */
async function loadPosts(block) {
  const body = block.querySelector('.post-list__body');
  const category = (block.dataset.category || '').toLowerCase().trim();

  try {
    const resp = await fetch('/query-index.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const data = json.data || [];

    // Filter by category
    const filtered = category
      ? data.filter((item) => {
        const itemCat = (item.category || '').toLowerCase();
        const itemPath = (item.path || '').toLowerCase();
        return itemCat.includes(category) || itemPath.includes(category);
      })
      : data;

    // Sort by date descending
    filtered.sort((a, b) => (Number(b.date) || 0) - (Number(a.date) || 0));

    block.postListData = filtered;

    // Determine initial page from URL
    const params = new URLSearchParams(window.location.search);
    const initialPage = parseInt(params.get('page'), 10) || 1;

    renderPage(block, initialPage);
    body.setAttribute('aria-busy', 'false');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[post-list] loadPosts failed:', err);
    body.setAttribute('aria-busy', 'false');
    body.classList.add('post-list__body--error');

    const ul = block.querySelector('.post-list__items');
    while (ul.firstChild) ul.removeChild(ul.firstChild);
    const errorLi = document.createElement('li');
    errorLi.classList.add('post-list__empty', 'post-list__empty--error');
    errorLi.textContent = 'Error al cargar las publicaciones.';
    ul.appendChild(errorLi);
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  const headerRow = rows[0];
  const configRow = rows[1];

  // Extract config
  const h2 = headerRow.querySelector('h2');
  const configCols = configRow ? [...configRow.children] : [];
  const categoryText = configCols[0]?.textContent?.trim().toLowerCase() || '';
  const pageSize = parseInt(configCols[1]?.textContent?.trim(), 10) || 4;

  // Build header wrapper
  const header = document.createElement('div');
  header.classList.add('post-list__header');
  moveInstrumentation(headerRow, header);
  if (h2) {
    h2.classList.add('post-list__title');
    h2.setAttribute('data-aue-prop', 'sectionTitle');
    h2.setAttribute('data-aue-type', 'text');
    h2.setAttribute('data-aue-label', 'Título');
    header.appendChild(h2);
  }

  // Build body wrapper
  const body = document.createElement('div');
  body.classList.add('post-list__body');
  body.setAttribute('aria-busy', 'true');

  const ul = document.createElement('ul');
  ul.classList.add('post-list__items');
  ul.setAttribute('aria-live', 'polite');

  const nav = document.createElement('nav');
  nav.classList.add('post-list__pagination');
  nav.setAttribute('aria-label', 'Paginación de noticias');

  body.appendChild(ul);
  body.appendChild(nav);

  // Remove authored rows and append new structure
  while (block.firstChild) block.removeChild(block.firstChild);
  block.appendChild(header);
  block.appendChild(body);

  // Store config in dataset
  block.dataset.category = categoryText;
  block.dataset.pageSize = String(pageSize);

  // UE instrumentation on block root
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-model', 'post-list');
  block.setAttribute('data-aue-label', 'Post List');

  // IntersectionObserver for lazy fetch
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadPosts(block);
        observer.disconnect();
      }
    });
  }, { rootMargin: '200px' });
  observer.observe(block);

  // Event delegation for pagination
  block.addEventListener('click', (e) => {
    const ctrl = e.target.closest('[data-page]');
    if (!ctrl) return;
    e.preventDefault();
    if (ctrl.getAttribute('aria-disabled') === 'true') return;

    const newPage = parseInt(ctrl.dataset.page, 10);
    if (Number.isNaN(newPage)) return;

    renderPage(block, newPage);

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('page', String(newPage));
    window.history.replaceState({}, '', url);

    // Scroll block into view for UX
    block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
