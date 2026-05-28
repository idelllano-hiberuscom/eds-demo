/**
 * Logo Carousel Block — AEM Edge Delivery Services
 *
 * Figma reference: 06 — Logo Carousel
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: ✅ Completado (Fase 3)
 * QA audit: ✅ Validado
 *
 * QA Changes:
 * - Removed will-change on :hover/:focus-visible (no transform animation)
 * - Added UE xwalk instrumentation (container, items, inline title)
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

const AUTOPLAY_INTERVAL = 5000;
const TRACK_ID_PREFIX = 'logo-carousel-track-';
let instanceCounter = 0;

/**
 * SVG arrow icon (chevron left). Flip via CSS transform for next.
 * @returns {string}
 */
function arrowSVG() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
}

/**
 * Build the carousel DOM structure synchronously from the EDS matrix.
 * @param {Element} block
 */
function buildStructure(block) {
  const rows = [...block.children];
  const [headerRow, ...itemRows] = rows;

  // Generate unique track ID
  instanceCounter += 1;
  const trackId = `${TRACK_ID_PREFIX}${instanceCounter}`;

  // --- Header ---
  const header = document.createElement('div');
  header.className = 'logo-carousel__header';
  moveInstrumentation(headerRow, header);

  const titleEl = headerRow.querySelector('h1,h2,h3,h4,h5,h6');
  const titleText = titleEl ? titleEl.textContent.trim() : '';

  if (titleEl) {
    titleEl.classList.add('logo-carousel__title');
    header.appendChild(titleEl);
  }
  // Remove original header row from block
  headerRow.remove();

  // --- Viewport ---
  const viewport = document.createElement('div');
  viewport.className = 'logo-carousel__viewport';

  // --- Track (ul) ---
  const track = document.createElement('ul');
  track.className = 'logo-carousel__track';
  track.id = trackId;
  track.setAttribute('aria-live', 'off');

  // --- Slides ---
  itemRows.forEach((row) => {
    const slide = document.createElement('li');
    slide.className = 'logo-carousel__slide';
    moveInstrumentation(row, slide);

    const col = row.children[0];
    if (!col) {
      row.remove();
      return;
    }

    // Find anchor or picture
    const anchor = col.querySelector('a');
    const picture = col.querySelector('picture');

    if (anchor && picture) {
      anchor.classList.add('logo-carousel__link');
      // Ensure picture is inside the anchor
      if (!anchor.contains(picture)) {
        anchor.appendChild(picture);
      }
      picture.classList.add('logo-carousel__media');
      slide.appendChild(anchor);
    } else if (picture) {
      picture.classList.add('logo-carousel__media');
      slide.appendChild(picture);
    }

    // Set lazy loading on all images (below-the-fold)
    slide.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });

    track.appendChild(slide);
    row.remove();
  });

  // --- Nav buttons ---
  const prevBtn = document.createElement('button');
  prevBtn.className = 'logo-carousel__nav logo-carousel__nav--prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('data-action', 'prev');
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.setAttribute('aria-controls', trackId);
  prevBtn.innerHTML = `${arrowSVG()}<span class="sr-only">Anterior</span>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'logo-carousel__nav logo-carousel__nav--next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('data-action', 'next');
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.setAttribute('aria-controls', trackId);
  nextBtn.innerHTML = `${arrowSVG()}<span class="sr-only">Siguiente</span>`;

  // --- Status (sr-only, aria-live polite) ---
  const status = document.createElement('p');
  status.className = 'logo-carousel__status sr-only';
  status.setAttribute('aria-live', 'polite');

  // --- Assemble ---
  viewport.appendChild(prevBtn);
  viewport.appendChild(track);
  viewport.appendChild(nextBtn);

  block.appendChild(header);
  block.appendChild(viewport);
  block.appendChild(status);

  // --- ARIA on block root ---
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', titleText || 'Logo carousel');

  // Mark ready
  block.classList.add('logo-carousel--ready');

  // --- UE Instrumentation (xwalk) ---
  // Block root: component type (AEM injects data-aue-resource automatically)
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'logo-carousel';
  block.dataset.aueLabel = 'Logo Carousel';

  // Track: container of items — copy resource from block, set filter for add-item button
  if (block.dataset.aueResource) {
    track.dataset.aueResource = block.dataset.aueResource;
  }
  track.dataset.aueType = 'container';
  track.dataset.aueFilter = 'logo-carousel-filter';

  // Title: inline text editing
  const titleInstrument = block.querySelector('.logo-carousel__title');
  if (titleInstrument) {
    titleInstrument.dataset.aueProp = 'sectionTitle';
    titleInstrument.dataset.aueType = 'text';
    titleInstrument.dataset.aueLabel = 'Título de sección';
  }

  // Slides: each item is a component (resource already via moveInstrumentation)
  track.querySelectorAll('.logo-carousel__slide').forEach((slide) => {
    slide.dataset.aueType = 'component';
    slide.dataset.aueModel = 'logo-carousel-item';
    slide.dataset.aueLabel = 'Logo';
  });
}

/**
 * Determine how many slides are currently visible based on CSS variable.
 * @param {Element} block
 * @returns {number}
 */
function getVisibleCount(block) {
  const val = getComputedStyle(block).getPropertyValue('--logo-carousel-visible-slides');
  return parseInt(val, 10) || 1;
}

/**
 * Initialize carousel behaviour (scroll, nav, autoplay).
 * Called via queueMicrotask so layout is ready.
 * @param {Element} block
 */
function initCarousel(block) {
  const track = block.querySelector('.logo-carousel__track');
  const prevBtn = block.querySelector('.logo-carousel__nav--prev');
  const nextBtn = block.querySelector('.logo-carousel__nav--next');
  const statusEl = block.querySelector('.logo-carousel__status');

  if (!track) return;

  const slides = [...track.children];
  const totalSlides = slides.length;

  // --- Hide controls if not needed ---
  function updateControls() {
    const visible = getVisibleCount(block);
    const shouldHide = totalSlides <= visible;

    prevBtn.hidden = shouldHide;
    nextBtn.hidden = shouldHide;

    if (shouldHide) {
      block.classList.add('logo-carousel--static');
    } else {
      block.classList.remove('logo-carousel--static');
    }
  }

  updateControls();

  // --- Scroll navigation ---
  function getScrollAmount() {
    if (!slides.length) return 0;
    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slideWidth + gap;
  }

  function goPrev() {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  }

  function goNext() {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  }

  // --- Delegated click handler ---
  block.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const { action } = actionEl.dataset;
    if (action === 'prev') goPrev();
    if (action === 'next') goNext();
  });

  // --- Keyboard nav on track ---
  block.addEventListener('keydown', (e) => {
    if (e.target.closest('.logo-carousel__nav')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  });

  // --- Update aria status on scroll (throttled) ---
  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      if (!statusEl) return;
      const { scrollLeft } = track;
      const scrollAmount = getScrollAmount();
      const currentIndex = scrollAmount ? Math.round(scrollLeft / scrollAmount) + 1 : 1;
      const visible = getVisibleCount(block);
      statusEl.textContent = `Mostrando ${currentIndex} a ${Math.min(currentIndex + visible - 1, totalSlides)} de ${totalSlides}`;
    }, 150);
  }, { passive: true });

  // --- Autoplay ---
  const isAutoplay = block.classList.contains('autoplay');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isAutoplay && !prefersReducedMotion && totalSlides > getVisibleCount(block)) {
    block.classList.add('logo-carousel--autoplay');
    let autoplayTimer = null;

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 2) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          goNext();
        }
      }, AUTOPLAY_INTERVAL);
    };

    // Pause on hover, focus, pointer
    block.addEventListener('pointerenter', stopAutoplay);
    block.addEventListener('pointerleave', startAutoplay);
    block.addEventListener('focusin', stopAutoplay);
    block.addEventListener('focusout', startAutoplay);

    // Pause on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Start
    startAutoplay();
  }

  // --- Resize: re-check controls ---
  const resizeObserver = new ResizeObserver(() => {
    updateControls();
  });
  resizeObserver.observe(block);
}

export default function decorate(block) {
  buildStructure(block);
  queueMicrotask(() => initCarousel(block));
}
