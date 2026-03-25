# Plan: Cecabank Homepage Components for Edge Delivery Services

## TL;DR
Implement 10 Cecabank homepage components adapting AEM-traditional functionals (`/cecabank_functionals`) to EDS blocks. **Existing blocks audited**: header, footer, hero, teaser, carousel, cards, action-button, separator already exist and will be **modified/adjusted**. Three new blocks needed (values, video-cards, cta-banner). Cookie banner added via delayed.js. Global color palette swapped: CaixaBank blue (#0073C8) -> Cecabank teal (#00A8B5) throughout.

---

## Existing Blocks Inventory & What Changes

| Block | Exists? | Action | Reason |
|---|---|---|---|
| `hero` | YES (carousel) | Modify JS+CSS significantly | Replace carousel with canvas constellation |
| `header` | YES (3-col desktop nav) | Modify JS+CSS significantly | Hamburger all breakpoints + right drawer |
| `footer` | YES (light grid) | Modify JS+CSS significantly | Teal bg, 5-zone Cecabank layout |
| `teaser` | YES (video + swoosh) | Adapt CSS, minor JS | Reuse video logic for testimonial section |
| `carousel` | YES (cards slider) | Adapt for logo carousel | Add logo variant, adjust grid |
| `cards` | YES (full grid) | Adapt for video-cards pattern | Add play button overlay, video modal |
| `action-button` | YES (3 variants) | Adjust colors only | Colors auto-updated via CSS tokens |
| `separator` | YES | Adjust colors only | Colors auto-updated via CSS tokens |
| `video-cards` | NO | Create new | New block distinct from cards |
| `values` | NO | Create new | Full-viewport panels pattern |
| `cta-banner` | NO | Create new | Stats strip + CTA panel |
| `logo-carousel` | NO | Create new (adapting carousel) | Specific logo grid behavior |
| `testimonial` | NO | Create new (adapting teaser) | 2-col testimonial layout |

---

## Phase 1: Foundation — Global Color Palette

### Step 1.1: Replace Color Palette in Global Styles
- **File**: `styles/styles.css`
- **What**: Replace CaixaBank blue-orange tokens with Cecabank teal palette IN-PLACE in `:root`:
  - `--primary-color: #0073C8` -> `#00A8B5` (Cecabank teal — all links, accents, buttons)
  - `--primary-dark: #005A9C` -> `#007D87` (darker teal, hover states)
  - `--secondary-color: #FF6200` -> `#7AB800` (green accent, stats/highlights)
  - `--accent-color: #00A3E0` -> `#004851` (dark teal, footer bg, dark sections)
  - `--button-primary-bg` / `--button-primary-hover`: update to teal values
  - Keep `--text-color`, `--background-color`, `--border-color` unchanged
- **Add new tokens** (after existing `:root` block):
  - `--color-light-blue-bg: #F0F8FA` (transformation axes section bg)
  - `--color-footer-bg: #004851` (dark teal footer)
  - `--cecabank-header-height: 60px`
- **Impact**: This single step cascades teal color to action-button, separator, and nav links automatically — no further changes needed for those two blocks

### Step 1.2: Adjust Action-Button Block Colors
- **File**: `blocks/action-button/action-button.css`
- **What**: Confirm existing button variants resolve via `--primary-color`. If any hex values are hardcoded (not using tokens), replace with token references. The 3 variants (default, secondary, dark) should already pick up the new teal via CSS cascade.

---

## Phase 2: Modify Existing Navigation Blocks

### Step 2.1: Header Block — Modify for Cecabank Navigation
- **Files**: `blocks/header/header.js`, `blocks/header/header.css`
- **Functional**: `cecabank_functionals/cmp-header.md`
- **Current state**: CSS Grid `brand | sections | tools`, hamburger hidden on desktop (900px)
- **What to change JS**:
  - Remove desktop nav sections display; hamburger always visible on all breakpoints
  - Add drawer panel creation: right-to-left slide-in `<nav>` overlay
  - Language switcher extracted from existing `languages` config field (already parsed as comma-separated) — reuse `computeLocalizedUrl()` from `scripts/utils.js`
  - Search input added to drawer (currently stock price is shown — replace)
  - Accordion nav items: existing nav links grouped with `<details>/<summary>` (pattern already in `blocks/accordion/accordion.js`)
  - Close drawer on Escape and on X button click (already handles Escape for hamburger)
- **What to change CSS**:
  - Remove 3-column grid `[brand] [sections] [tools]`; use simple flexbox row (logo left, hamburger right)
  - Add `.header-drawer` styles: `position: fixed; right: 0; top: 0; height: 100vh; width: min(360px, 90vw); background: white; transform: translateX(100%); transition: transform 0.3s ease`
  - Drawer open state: `transform: translateX(0)`
  - Language switcher: teal text, pipe separators, active language bold
  - Search input: full-width with search icon, teal focus ring
  - Nav items (drawer accordion): large teal links, `details/summary` expand arrows

### Step 2.2: Footer Block — Modify for Cecabank 5-Zone Layout
- **Files**: `blocks/footer/footer.js`, `blocks/footer/footer.css`
- **Functional**: `cecabank_functionals/cmp-footer.md`
- **Current state**: Light background, 4-col responsive grid
- **What to change JS**: The existing fragment loading logic stays unchanged. Update DOM construction inside `decorate()` to expect 5 sections in the fragment:
  1. Utility links row
  2. Logo
  3. CTA links + social icons
  4. Mapa web link (simple anchor for now — overlay deferred)
  5. Legal links
- **What to change CSS**:
  - Background: `var(--color-footer-bg)` (#004851 dark teal)
  - Text: white; links: teal (`var(--primary-color)`)
  - Layout: 5 stacked zones (not grid), centered content
  - Utility links: flex row wrapping, pipe-separated look
  - Social icons: inline SVG or Font Awesome X/LinkedIn/YouTube icons
  - Legal links: smaller font, bottom bar

---

## Phase 3: Modify Existing Visual Blocks

### Step 3.1: Hero Block — Replace Carousel with Canvas Constellation
- **Files**: `blocks/hero/hero.js`, `blocks/hero/hero.css`
- **Functional**: `cecabank_functionals/cmp-hero.md`
- **Current state**: Multi-slide carousel with dots, auto-play, keyboard nav
- **What to change JS** (large rework of logic, keep file):
  - Remove all carousel/slide logic, dot navigation, auto-play, keyboard slide handlers
  - `decorate(block)`: extract first row content as `<h1>` title
  - Create `<canvas aria-hidden="true">`, append behind title
  - Canvas engine (self-contained in hero.js):
    - Spawn ~80 nodes with random positions + velocity vectors
    - `requestAnimationFrame` loop: move nodes, draw teal lines between nodes within proximity radius
    - Desktop: `mousemove` on hero → attract nodes within `attractionRadius` (120px) to cursor; `mouseleave` → reset
    - Mobile: idle animation only (no touch attraction, check via `matchMedia('(hover: none)')`)
    - `prefers-reduced-motion: reduce`: cancel animation loop, freeze canvas
    - `window.resize` handler: resize canvas to match hero dimensions
  - Guard: `data-initialized` attribute to prevent double-init
- **What to change CSS**:
  - Hero background: `#FFFFFF` (white) — remove dark overlay / gradient
  - Height: `500px` fixed (both mobile + desktop)
  - Canvas: `position: absolute; inset: 0; z-index: 0`
  - Title: `position: relative; z-index: 1; color: var(--primary-color)` (teal)
  - Font sizes: desktop 52-64px / mobile 28-36px, weight 400
  - Desktop alignment: left; mobile alignment: center (via media query)
  - Remove dot navigation, carousel slide styles, dark overlay styles

### Step 3.2: Cards Block — Extend with Video Play Overlay
- **Files**: `blocks/cards/cards.js`, `blocks/cards/cards.css`
- **Current state**: Full-featured grid with multiple variants (image-top, image-bottom, teaser-overlay, etc.)
- **What to add** (additive, not breaking):
  - New variant class: `video-card` — detects when a row contains a video URL
  - JS: if card contains a video URL (3rd column), add circular play button overlay on top of the picture
  - Play click: open shared video modal (from `scripts/video-modal.js`)
  - CSS: `.cards.video-card` — play button circle overlay (teal border, white play triangle, hover scale effect)
  - Does NOT break existing card variants — only activates when `video-card` class present on block

---

## Phase 4: New Blocks (no existing equivalent)

### Step 4.1: Video Cards Block — NEW
- **Files**: NEW `blocks/video-cards/video-cards.js`, `blocks/video-cards/video-cards.css`
- **Functionals**: `cmp-services-cards.md` ("Podemos ayudarte") + `cmp-transformation-axes.md`
- **Why new and not reusing cards**: Video cards are semantically different (video-first, no card body text), justify their own block for maintainability
- **EDS authored table structure**:
  ```
  | video-cards        |                   |           |          |
  | thumbnail-image    | title             | video-url |          |
  | thumbnail-image    | title             | video-url |          |
  | thumbnail-image    | title             | video-url |          |
  | Section CTA link   |                   |           |          |
  ```
  Axes variant (with per-card CTA):
  ```
  | video-cards (axes) |                   |           |          |
  | thumbnail-image    | title             | video-url | CTA link |
  ```
- **Key implementation**:
  - Build `<ul>` with `<li>` cards: picture wrapper + circular play button + `<h3>` title + optional per-card CTA
  - Detect last row as section CTA if it contains only a link
  - Play click → `openVideoModal(videoUrl)` from shared `scripts/video-modal.js`
  - Grid: 3 cols desktop (min-width: 900px), 1 col mobile
  - `axes` variant: per-card "SABER MÁS →" link, `--color-light-blue-bg` section background
- **Reference patterns**: `blocks/cards/cards.js` for list/grid structure, `scripts/slider.js` for any overflow handling

### Step 4.2: Values Block — NEW
- **Files**: NEW `blocks/values/values.js`, `blocks/values/values.css`
- **Functional**: `cecabank_functionals/cmp-values.md`
- **From images (desktop_2, desktop_3, mobile_6)**: 4 stacked full-viewport panels
- **EDS authored table structure**:
  ```
  | values             |             |               |          |
  | background-image   | title       | description   | CTA link |
  | background-image   | title       | description   | CTA link |
  ```
- **Key implementation**:
  - For each row: create `<section>` panel (100vh height), background image via `createOptimizedPicture()` with CSS `object-fit: cover`
  - Dark overlay `::before` pseudo-element: `rgba(0,0,0,0.5)`
  - Content `<div>` with `position: relative; z-index: 1`: white title, white description, teal CTA "SABER MÁS →"
  - Alternating alignment via `:nth-child(even)` → text right; odd → text left (desktop). Mobile: always centered
  - IntersectionObserver: add `.visible` class on enter viewport → triggers `fadeInUp` animation (already defined in `styles.css`)
  - Images lazy-loaded (below-fold)

### Step 4.3: Testimonial Block — NEW (adapting teaser pattern)
- **Files**: NEW `blocks/testimonial/testimonial.js`, `blocks/testimonial/testimonial.css`
- **Functional**: `cecabank_functionals/cmp-testimonials.md`
- **From images (desktop_4, mobile_7)**
- **EDS authored table structure**:
  ```
  | testimonial         |            |          |             |              |
  | thumbnail-image     | video-url  | quote    | author-name | author-role  |
  ```
- **Adapts from teaser.js**: The existing teaser handles video + play button + intersection observer — reuse that pattern
- **Key implementation**:
  - Thumbnail left (60%), quote text right (40%) — CSS flexbox; stacked on mobile
  - Author name + role overlay at bottom of thumbnail (absolute positioning)
  - Play button circle (same style as video-cards for consistency)
  - Play click → `openVideoModal(videoUrl)` from shared `scripts/video-modal.js`
  - Quote: italic text; author name: bold teal; role: small gray

### Step 4.4: Logo Carousel Block — NEW (adapting carousel)
- **Files**: NEW `blocks/logo-carousel/logo-carousel.js`, `blocks/logo-carousel/logo-carousel.css`
- **Functional**: `cecabank_functionals/cmp-clients-logos.md`
- **EDS authored table structure**:
  ```
  | logo-carousel       |
  | logo-image-1        |
  | logo-image-2        |
  | logo-image-3        |
  ```
- **Adapts from carousel.js**: Reuse `createSlider()` from `scripts/slider.js` (already handles arrows, scroll, RTL)
- **Key implementation**:
  - Extract all images from rows, build flat `<ul><li><img>` list
  - Call `createSlider()` with the list — inherits arrow navigation and scroll behavior
  - CSS: 4 items visible desktop (25% width each), 1 item mobile (100%)
  - Full-color logos (no filter/grayscale)
  - Arrows hidden via CSS when all logos ≤ visible count (check total items in JS)

### Step 4.5: CTA Banner Block — NEW
- **Files**: NEW `blocks/cta-banner/cta-banner.js`, `blocks/cta-banner/cta-banner.css`
- **Functional**: `cecabank_functionals/cmp-cta-banner.md`
- **From images (desktop_4)**: Stats strip (numbers 9, 8.7) + full-bleed image CTA
- **EDS authored table structure**:
  ```
  | cta-banner         |                      |             |                     |
  | stat-number-1      | stat-description-1   | stat-number-2 | stat-description-2 |
  | background-image   | title                | CTA link      |                    |
  ```
- **Key implementation**:
  - Row 1 → stats strip: flexbox row centered, large green numbers (`var(--secondary-color)`), description text
  - Row 2 → CTA panel: full-width background image, dark overlay, left-aligned white title + teal CTA link
  - Stats responsive: row on desktop (side-by-side), column on mobile (stacked)
  - CTA panel: `min-height: 300px`, image `object-fit: cover`

---

## Phase 5: Utilities

### Step 5.1: Shared Video Modal Utility
- **File**: NEW `scripts/video-modal.js`
- **Used by**: video-cards (step 4.1), testimonial (step 4.3), and cards video variant (step 3.2)
- **Exports**: `openVideoModal(videoUrl)`, `closeVideoModal()`
- **Implementation**:
  - Detect URL type: YouTube (`youtu.be`/`youtube.com`) → create `<iframe>` with `?autoplay=1`; otherwise → create `<video controls autoplay>`
  - Create modal DOM: `<div role="dialog" aria-modal="true">` with backdrop + centered container + close button
  - Append to `document.body`; trap focus inside modal (Tab/Shift+Tab cycle, Escape to close)
  - On close: remove modal from DOM, return focus to trigger element
  - Guard: prevent multiple modals open simultaneously

### Step 5.2: Cookie Banner via delayed.js
- **File**: `scripts/delayed.js`
- **Functional**: `cecabank_functionals/cmp-cookie-banner.md`
- **What to add** at the end of delayed.js (after existing martech):
  - Check `localStorage.getItem('cecabank-cookie-consent')` → if set, skip banner
  - Otherwise, create banner DOM and append to `document.body`
  - Desktop: `position: fixed; bottom: 1.5rem; left: 1.5rem; max-width: 380px; border-radius: 8px`
  - Mobile: `position: fixed; bottom: 0; left: 0; right: 0; border-radius: 0`
  - 3 buttons: "Aceptar" (stores `accepted`), "Rechazar" (stores `rejected`), "Configuración" (links to privacy page)
  - Dismiss animation: `transform: translateY(20px); opacity: 0` on close
- **CSS**: Add in `styles/lazy-styles.css` (currently empty — use for cookie banner styles)

---

## Phase 6: Integration & Test Content

### Step 6.1: Create Test HTML Page
- **File**: NEW `drafts/index.html` (EDS `plain.html` markup structure)
- Section order: Hero → Services Cards → Transformation Axes → Values → Testimonial → Logo Carousel → CTA Banner
- Use `aem up --html-folder drafts` to serve
- Also create `drafts/nav.plain.html` (header navigation fragment) + `drafts/footer.plain.html` (footer fragment)

### Step 6.2: Lint & Validation
- `npm run lint` — zero errors on all new/modified files
- Fix any Airbnb ESLint / Stylelint violations before committing

---

## Relevant Files

### To Modify
- `styles/styles.css` — Replace color tokens in `:root` (step 1.1)
- `styles/lazy-styles.css` — Add cookie banner styles (step 5.2)
- `blocks/header/header.js` + `header.css` — Drawer navigation (step 2.1)
- `blocks/footer/footer.js` + `footer.css` — Teal 5-zone footer (step 2.2)
- `blocks/hero/hero.js` + `hero.css` — Canvas constellation (step 3.1)
- `blocks/action-button/action-button.css` — Confirm token usage (step 1.2)
- `blocks/cards/cards.js` + `cards.css` — Add video-card variant (step 3.2)
- `scripts/delayed.js` — Cookie banner initialization (step 5.2)

### To Create (New)
- `scripts/video-modal.js` — Shared modal utility (step 5.1)
- `blocks/video-cards/video-cards.js` + `video-cards.css` (step 4.1)
- `blocks/values/values.js` + `values.css` (step 4.2)
- `blocks/testimonial/testimonial.js` + `testimonial.css` (step 4.3)
- `blocks/logo-carousel/logo-carousel.js` + `logo-carousel.css` (step 4.4)
- `blocks/cta-banner/cta-banner.js` + `cta-banner.css` (step 4.5)
- `drafts/index.html`, `drafts/nav.plain.html`, `drafts/footer.plain.html` (step 6.1)

### Reference (read-only patterns)
- `scripts/aem.js` — NEVER modify; `decorateBlock()`, `loadBlock()` patterns
- `scripts/scripts.js` — `decorateMain()`, `loadEager/Lazy/Delayed()` phases
- `scripts/dom-helpers.js` — `domEl()`, `div()`, `a()` for DOM construction
- `scripts/slider.js` — `createSlider()` for logo-carousel
- `scripts/utils.js` — `computeLocalizedUrl()` for language switcher
- `blocks/accordion/accordion.js` — `<details>/<summary>` pattern for header drawer nav
- `blocks/teaser/teaser.js` — Video + IntersectionObserver pattern for testimonial

---

## Verification

1. `npm run lint` — zero errors on all new/modified files
2. `aem up --html-folder drafts` serves `localhost:3000` correctly
3. Compare each section visually against `/resources/` screenshots (desktop_1–4, mobile_1–8)
4. Test at 375px, 900px, 1440px widths
5. Accessibility: ARIA, keyboard nav, heading hierarchy; canvas `aria-hidden="true"`; video modal focus trap
6. Performance: no external libs; `requestAnimationFrame` for canvas; images lazy-loaded; cookie banner in delayed phase
7. `prefers-reduced-motion` freezes hero canvas
8. Video modals: open on play press, close on Escape, focus returns to trigger

---

## Decisions

- **Existing blocks modified, not rebuilt**: All 8 existing blocks are adjusted. No file is deleted or renamed (except hero carousel logic which is replaced inside the same file).
- **Color token swap**: Replacing `--primary-color` in `:root` propagates teal to action-button, separator, header nav, buttons automatically via CSS cascade.
- **Video Cards is a new block**: Even though `cards` exists, the video-first semantic + play-button + modal behavior justifies a dedicated block. `cards` gets an additive `video-card` variant for simpler use cases.
- **No Swiper.js**: Use existing `scripts/slider.js` for logo carousel — no external dependencies.
- **Cookie banner in delayed.js**: Not a block — loaded in phase 3 for performance (same pattern as martech).
- **Breakpoints**: 600px/900px/1200px per AGENTS.md (not 768px from AEM functionals).
- **Footer sitemap overlay**: Deferred — implement as simple anchor link in v1.
