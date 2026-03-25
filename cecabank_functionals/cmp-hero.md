# cmp-hero - Functional Documentation

> Functional specification for the `cmp-hero` component — Cecabank homepage

---

## Table of Contents

- [cmp-hero - Functional Documentation](#cmp-hero---functional-documentation)
    - [Table of Contents](#table-of-contents)
    - [1. Description](#1-description)
    - [2. Component Structure](#2-component-structure)
    - [3. Flows and Behavior](#3-flows-and-behavior)
    - [4. AEM Configuration (Dialog)](#4-aem-configuration-dialog)
    - [5. Accessibility (WCAG 2.1 AA)](#5-accessibility-wcag-21-aa)
        - [ARIA Roles \& Labels](#aria-roles--labels)
        - [Keyboard Navigation](#keyboard-navigation)
        - [Color Contrast](#color-contrast)
        - [Screen Reader](#screen-reader)
        - [Motion \& Reduced Motion](#motion--reduced-motion)
    - [6. Responsive Design](#6-responsive-design)
    - [7. Style Requirements](#7-style-requirements)
    - [8. Integration \& Technical Stack](#8-integration--technical-stack)
        - [8.1 Frontend Stack](#81-frontend-stack)
        - [8.2 Backend Stack](#82-backend-stack)
        - [8.3 Authorization \& Security](#83-authorization--security)
        - [8.4 Clientlib Integration](#84-clientlib-integration)
    - [9. Testing](#9-testing)
    - [10. Visual Assets \& Screenshots](#10-visual-assets--screenshots)

---

## 1. Description

The `cmp-hero` is the full-viewport introductory section that sits directly behind the site header (the header overlays the hero with a transparent or white background). It displays a single large headline in corporate teal on a **white background**. The defining visual feature is an HTML5 `<canvas>` animation rendering an interactive constellation network of interconnected nodes and lines in teal and subtle green tones. The lines animate continuously and **react to the user's mouse cursor** — nearby lines are attracted to the pointer and follow it. There is no background image, no overlay, no subtitle, and no CTA.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-hero/
├── cmp-hero.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-hero/
├── cmp-hero.scss
└── cmp-hero.js
```

---

## 3. Flows and Behavior

- **Initial render:** Hero occupies full viewport width at a fixed height of **500px** on both desktop and mobile. White background. The `<canvas>` element fills the entire hero area behind the title text and begins animating immediately on page load.
- **Canvas animation — idle state:** Nodes (small dots) and connecting lines animate continuously in slow organic motion across the canvas. Lines are rendered in teal and subtle green tones.
- **Canvas animation — mouse interaction (desktop only):** When the user moves the mouse over the hero area, nodes and line endpoints within a configurable radius are attracted to the cursor and follow its movement. The attraction effect is smooth and physics-based. On `mouseleave`, nodes gradually return to their natural paths.
- **Canvas animation — mobile:** No mouse interaction. The animation runs in idle mode only (continuous movement, no touch attraction).
- **Title:** Single `<h1>` headline rendered in corporate teal, left-aligned on desktop, centred on mobile. No subtitle, no CTA.
- **Header position:** The site header (cmp-header) is a separate component rendered in normal document flow above the hero. The hero begins immediately below the header — there is no overlap or z-index dependency between the two components.
- **No carousel, no image, no CTA, no overlay.**

---

## 4. AEM Configuration (Dialog)

| Field                           | Type     | Required | Description                                                                                            |
| ------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| Title                           | text     | Yes      | Main headline (e.g., "Transformando el presente con las mejores soluciones para un futuro sostenible") |
| Title HTML tag                  | select   | No       | H1 (default), H2, H3                                                                                   |
| Canvas — node count             | number   | No       | Number of nodes in the constellation (default: configurable, e.g., 80)                                 |
| Canvas — attraction radius (px) | number   | No       | Mouse attraction radius in pixels (default: e.g., 120)                                                 |
| Canvas — line color             | text     | No       | CSS color for lines (default: corporate teal)                                                          |
| Canvas — node color             | text     | No       | CSS color for nodes (default: corporate teal/green)                                                    |
| Canvas — enable on mobile       | checkbox | No       | Disable canvas on mobile for performance (default: enabled)                                            |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Hero wrapper uses `<section>` with `aria-labelledby` pointing to the `<h1>` title element.
- Title rendered as `<h1>` by default (configurable via dialog).
- The `<canvas>` element is **purely decorative**: must have `aria-hidden="true"` so screen readers skip it entirely. No `alt` text needed.
- No CTA or interactive elements below the title — no focus management needed inside the hero.

### Keyboard Navigation

| Key   | Action                                                                          |
| ----- | ------------------------------------------------------------------------------- |
| `Tab` | Focus passes through the hero without stopping (no interactive elements inside) |

### Color Contrast

- Title teal text on white background: minimum **4.5:1** ratio (WCAG AA). Verify against the exact corporate teal color token.
- Canvas animation is decorative and excluded from contrast requirements.

### Screen Reader

- Canvas element skipped entirely via `aria-hidden="true"`.
- `<h1>` title is the only content read within the hero region.
- No text-over-image contrast dependency — background is white.

### Motion & Reduced Motion

- The canvas animation must respect `prefers-reduced-motion: reduce`. When active, the canvas animation should stop (freeze nodes in place or be hidden) to prevent vestibular triggers.

---

## 6. Responsive Design

| Breakpoint        | Layout                                                                                                          | Canvas behavior                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Mobile (< 768px)  | Title centred; full-width white background; fixed height **500px**; renders below the header                    | Canvas animates in idle mode; no touch/mouse attraction effect |
| Desktop (≥ 768px) | Title left-aligned (large, teal); full-width white background; fixed height **500px**; renders below the header | Canvas animates + mouse attraction active on `mousemove`       |

---

## 7. Style Requirements

| Token                     | Value                                                          |
| ------------------------- | -------------------------------------------------------------- |
| Hero background           | `#FFFFFF` (white)                                              |
| Hero height (desktop)     | `500px` fixed                                                  |
| Hero height (mobile)      | `500px` fixed                                                  |
| Canvas position           | `absolute`; fills 100% width and height of hero                |
| Canvas z-index            | `0` (below title)                                              |
| Title z-index             | `1` (above canvas)                                             |
| Title color               | Corporate teal (`#00A8B5` or designated brand token — confirm) |
| Title font-size (desktop) | `52px`–`64px`                                                  |
| Title font-size (mobile)  | `28px`–`36px`                                                  |
| Title font-weight         | `400` (regular/light — matching screenshot)                    |
| Title line-height         | `1.15`                                                         |
| Title alignment (desktop) | `left`                                                         |
| Title alignment (mobile)  | `center`                                                       |
| Title max-width (desktop) | `65%` of container                                             |
| Canvas line color         | Teal (`rgba(0, 168, 181, 0.5)` approx.)                        |
| Canvas node color         | Teal + green accent dots                                       |
| Canvas line width         | `1px`                                                          |
| Canvas node radius        | `2px`–`3px`                                                    |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders `<section>` wrapper, `<canvas>` element (with `aria-hidden="true"`), and `<h1>` title. No image element, no CTA link, no subtitle.
- **JavaScript (vanilla ES6+):** Canvas animation engine initialised on `DOMContentLoaded`. Responsibilities:
    - Create and size `<canvas>` to match hero dimensions; resize on `window.resize`.
    - Spawn configurable number of nodes with random positions and velocity vectors.
    - On each `requestAnimationFrame`: update positions, draw lines between nearby nodes.
    - `mousemove` listener on hero element (desktop): calculate distance from cursor to each node; apply attraction force within configured radius; reset force on `mouseleave`.
    - Check `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, cancel animation loop and freeze canvas.
    - `data-initialized` guard to prevent double initialisation.
- **SCSS (BEM):** Root block `.cmp-hero`; elements: `__canvas` (absolute, full fill), `__content` (relative, z-index 1), `__title`. Modifier `--text-center` (mobile).

### 8.2 Backend Stack

- **Sling Model:** `HeroModel` extending `AbstractComponentImpl`. Exposes: `title`, `titleTag`, `canvasNodeCount`, `canvasAttractionRadius`, `canvasLineColor`, `canvasNodeColor`, `canvasEnabledOnMobile`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- No external URLs to sanitise within this component.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS loaded at bottom of component HTL with `defer=true`. Canvas engine runs inside the component JS — no external canvas library required (vanilla `requestAnimationFrame`).

---

## 9. Testing

| #   | Scenario                             | Given                                            | When                                | Then                                                                                      |
| --- | ------------------------------------ | ------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Title renders as H1                  | Title is configured in the dialog                | Page loads                          | Title text is visible, rendered as `<h1>`, in corporate teal on white background          |
| 2   | Canvas element is present in DOM     | Component is rendered                            | Page loads                          | A `<canvas>` element exists inside the hero with `aria-hidden="true"`                     |
| 3   | Canvas animation starts on load      | Component is rendered                            | Page loads                          | Canvas visually displays animated nodes and connecting lines                              |
| 4   | Mouse attraction on desktop          | Viewport ≥ 768px                                 | User moves mouse over hero area     | Nodes near the cursor visibly move toward the pointer                                     |
| 5   | Mouse release resets nodes           | Cursor has attracted nodes                       | User moves mouse outside the hero   | Nodes gradually drift back to their organic paths                                         |
| 6   | No mouse interaction on mobile       | Viewport < 768px                                 | Page loads and user taps or scrolls | Canvas animates in idle mode only; no attraction behaviour                                |
| 7   | Reduced motion — canvas freezes      | `prefers-reduced-motion: reduce` is active in OS | Page loads                          | Canvas animation stops; nodes remain static                                               |
| 8   | Title is left-aligned on desktop     | Viewport ≥ 768px                                 | Page loads                          | Title text is left-aligned within the hero container                                      |
| 9   | Title is centred on mobile           | Viewport < 768px                                 | Page loads                          | Title text is centred horizontally                                                        |
| 10  | Canvas is hidden from screen readers | Component is rendered                            | Assistive technology reads the page | `<canvas>` element is not announced; only the `<h1>` title is read within the hero region |

---

## 10. Visual Assets & Screenshots

Reference screenshots provided: desktop hero (teal title left-aligned, white background, constellation canvas visible) and mobile hero (teal title centred, idle canvas). Additional capture recommended: desktop mid-interaction with mouse hovering over canvas (nodes attracted to cursor visible).
