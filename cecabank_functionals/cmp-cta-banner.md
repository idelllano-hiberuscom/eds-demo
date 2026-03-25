# cmp-cta-banner - Functional Documentation

> Functional specification for the `cmp-cta-banner` component — Cecabank homepage

---

## Table of Contents

- [cmp-cta-banner - Functional Documentation](#cmp-cta-banner---functional-documentation)
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

The `cmp-cta-banner` component is a **two-zone section**: a **stats strip** followed by a **full-bleed CTA image panel**. The stats strip displays two key performance metrics side by side (e.g., "9 — Recomendaré sus servicios" and "8,7 — Valoración promedio de Cecabank"), each with a large number and a short label. The CTA image panel is a full-width block with a background image, dark overlay, a title ("Informe de mercados"), and a "SABER MÁS →" navigation link — no button widget.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-cta-banner/
├── cmp-cta-banner.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-cta-banner/
└── cmp-cta-banner.scss
```

---

## 3. Flows and Behavior

- **Static component:** No JavaScript interaction required.
- **Stats strip (top zone):** White/light background. Two metric items rendered side by side on desktop. Each item: large number (with distinct style — one dark/boxed, one green) + short quote label in regular weight.
- **CTA image panel (bottom zone):** Full-width panel. Background image (`background-size: cover`, `background-position: center`) with a semi-transparent dark overlay. Title text and "SABER MÁS →" teal link rendered bottom-left over the overlay.
- **"SABER MÁS" link:** Navigates to the configured CTA URL. No modal.
- **Desktop (≥ 768px):** Stats strip — 2 columns side by side. CTA panel — title and link pinned to the left.
- **Mobile (< 768px):** Stats strip — metrics stacked vertically. CTA panel — full-width, title and link centred or left-aligned.

---

## 4. AEM Configuration (Dialog)

| Field                | Type      | Required | Description                                                       |
| -------------------- | --------- | -------- | ----------------------------------------------------------------- |
| **Stats strip**      |           |          |                                                                   |
| Metric 1 number      | text      | Yes      | Large number for metric 1 (e.g., "9")                             |
| Metric 1 style       | select    | No       | Dark/boxed (default), Green — controls number colour/style        |
| Metric 1 label       | text      | Yes      | Short quote/description (e.g., "Recomendaré sus servicios")       |
| Metric 2 number      | text      | Yes      | Large number for metric 2 (e.g., "8,7")                           |
| Metric 2 style       | select    | No       | Dark/boxed, Green (default for 2nd metric)                        |
| Metric 2 label       | text      | Yes      | Short quote/description (e.g., "Valoración promedio de Cecabank") |
| **CTA image panel**  |           |          |                                                                   |
| Background image     | image     | Yes      | Full-bleed background image for the panel                         |
| Background image alt | text      | Yes      | Accessible alt text for the background image                      |
| Panel title          | text      | Yes      | Title overlaid on the panel (e.g., "Informe de mercados")         |
| Panel title tag      | select    | No       | H2 (default), H3                                                  |
| CTA label            | text      | No       | Link label; defaults to i18n key "SABER MÁS" if empty             |
| CTA URL              | pathfield | Yes      | Destination URL for the navigation link                           |
| CTA target           | select    | No       | \_self (default), \_blank                                         |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Component wrapped in `<section aria-labelledby="[panel-title-id]">`.
- Stats strip: each metric item rendered as `<div>` or `<p>` — no interactive elements. Numbers announced as plain text.
- CTA panel: background image applied via CSS `background-image`; overlay `<div>` carries `aria-hidden="true"`.
- Panel title uses the configured heading tag (`<h2>` default), referenced by `aria-labelledby` on the `<section>`.
- "SABER MÁS" `<a>` uses `aria-label="Saber más sobre [panel title]"` to provide full context.

### Keyboard Navigation

| Key     | Action                                                     |
| ------- | ---------------------------------------------------------- |
| `Tab`   | Moves focus to the "SABER MÁS" link in the CTA image panel |
| `Enter` | Activates the link and navigates to the configured URL     |

### Color Contrast

- Dark/boxed metric number on white background: minimum **4.5:1** ratio.
- Green metric number (`#00A8B5` approx.) on white background: minimum **4.5:1** ratio — verify exact value.
- Metric label text on white background: minimum **4.5:1** ratio.
- White panel title on dark overlay: minimum **4.5:1** ratio.
- Teal "SABER MÁS" on dark overlay: minimum **4.5:1** ratio.

### Screen Reader

- Stats strip numbers and labels are read in document order.
- "SABER MÁS" link is contextualised by `aria-label` to avoid ambiguity.

---

## 6. Responsive Design

| Breakpoint        | Stats strip                        | CTA image panel                              |
| ----------------- | ---------------------------------- | -------------------------------------------- |
| Mobile (< 768px)  | 1-column stack, metrics centred    | Full-width, title + link centred or left     |
| Desktop (≥ 768px) | 2-column row, metrics side by side | Full-width, title + link pinned to left ~40% |

---

## 7. Style Requirements

| Token                           | Value                                                |
| ------------------------------- | ---------------------------------------------------- |
| Stats strip background          | `#FFFFFF` (white) / light with background image hint |
| Metric number (dark/boxed)      | Large dark digit inside a light gray square/box      |
| Metric number (dark) font-size  | `~80–100px` desktop / `~60px` mobile                 |
| Metric number (green)           | Color approx. `#5CB85C` or `#4CAF50` green           |
| Metric number (green) font-size | `~80–100px` desktop / `~60px` mobile                 |
| Metric label color              | Dark `#1A1A1A`                                       |
| Metric label font-size          | `~16px` desktop / `~14px` mobile                     |
| Metric label style              | In quotes (e.g., `"Recomendaré sus servicios"`)      |
| Panel background                | `background-image` full-bleed, `cover`, centred      |
| Panel overlay                   | `rgba(0, 0, 0, ~0.50)` dark semi-transparent         |
| Panel height                    | `~400–500px` desktop / auto mobile                   |
| Panel title color               | `#FFFFFF`                                            |
| Panel title font-size           | `~40px` desktop / `~28px` mobile                     |
| Panel title font-weight         | `400` (light/regular)                                |
| "SABER MÁS" color               | Teal approx. `#00A8B5`                               |
| "SABER MÁS" style               | Uppercase, `font-weight: 600`, `→` arrow suffix      |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders two zones. Stats strip: two metric items (number + label) using `data-sly-attribute` for conditional style modifier class. CTA image panel: outer `<div>` with inline `style="background-image: url(...)"`, inner overlay `<div aria-hidden="true">`, and content block with panel title + "SABER MÁS" `<a>`.
- **JavaScript:** Not required.
- **SCSS (BEM):** Root block `.cmp-cta-banner`; elements: `__stats`, `__metric`, `__metric--dark`, `__metric--green`, `__metric-number`, `__metric-label`, `__panel`, `__overlay`, `__panel-content`, `__panel-title`, `__panel-cta`.

### 8.2 Backend Stack

- **Sling Model:** `CtaBannerModel` extending `AbstractComponentImpl`. Exposes:
    - `metric1Number`, `metric1Style`, `metric1Label` (String).
    - `metric2Number`, `metric2Style`, `metric2Label` (String).
    - `panelImagePath`, `panelImageAlt`, `panelTitle`, `panelTitleTag`, `ctaLabel`, `ctaUrl`, `ctaTarget` (String).
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- External CTA links use `rel="noopener noreferrer"`.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- No JS clientlib required for this component.

---

## 9. Testing

| #   | Scenario                               | Given                                     | When                    | Then                                                                      |
| --- | -------------------------------------- | ----------------------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| 1   | Both metrics render in stats strip     | Metric 1 and 2 configured                 | Page loads              | Both numbers and their labels are visible in the stats strip              |
| 2   | Metric 1 renders with dark/boxed style | Metric 1 style set to dark                | Page loads              | First number is displayed in dark colour inside a boxed/squared container |
| 3   | Metric 2 renders with green style      | Metric 2 style set to green               | Page loads              | Second number is displayed in green colour                                |
| 4   | Stats strip is 2-column on desktop     | Both metrics configured; viewport ≥ 768px | Page loads              | Two metrics appear side by side in a horizontal row                       |
| 5   | Stats strip stacks on mobile           | Both metrics configured; viewport < 768px | Page loads              | Two metrics stack vertically                                              |
| 6   | CTA panel background image renders     | Background image is configured            | Page loads              | Panel displays the configured background image via CSS                    |
| 7   | Dark overlay is visible on CTA panel   | Panel renders                             | Page loads              | Semi-transparent dark overlay covers the background image                 |
| 8   | Panel title renders in white           | Panel title is configured                 | Page loads              | Title text is visible in white over the dark overlay                      |
| 9   | "SABER MÁS" link renders and navigates | CTA URL is configured                     | User clicks "SABER MÁS" | Browser navigates to the configured URL                                   |
| 10  | Component renders correctly on mobile  | Viewport < 768px                          | Page loads              | Stats strip stacks vertically; CTA panel is full-width with title visible |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Component confirmed as two zones: (1) stats strip with two key metrics ("9" dark/boxed + "8,7" green, each with a quote label) on a white background; (2) full-bleed CTA image panel with dark overlay, "Informe de mercados" title, and "SABER MÁS →" teal link. No button widget.
