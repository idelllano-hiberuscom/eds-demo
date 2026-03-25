# cmp-values - Functional Documentation

> Functional specification for the `cmp-values` component — Cecabank homepage

---

## Table of Contents

- [cmp-values - Functional Documentation](#cmp-values---functional-documentation)
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

The `cmp-values` component presents Cecabank's corporate values as a series of **full-width stacked image panels**. A white header zone displays the section title and a short description. Below it, each value (Especialización, Solvencia, Sostenibilidad, Compromiso) occupies a full-width panel with a background image, semi-transparent dark overlay, and overlaid text (title + description + "SABER MÁS →" link). Text content alternates between right-aligned and left-aligned across consecutive panels.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-values/
├── cmp-values.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-values/
├── cmp-values.scss
└── cmp-values.js
```

---

## 3. Flows and Behavior

- **Initial render:** White header zone with section title and description paragraph rendered above the panels.
- **Panel stack:** Each value renders as a full-width panel in document flow (no carousel, no JS toggle). Panels are stacked vertically.
- **Each panel:** Background image fills the panel (`background-size: cover`, `background-position: center`). A semi-transparent dark overlay (`rgba(0,0,0,~0.45)`) is applied on top. Value title, description, and "SABER MÁS →" link are overlaid in white/teal.
- **Text alignment alternates:** Odd-indexed panels (1st, 3rd…) align text to the right; even-indexed panels (2nd, 4th…) align text to the left (or vice-versa — confirm with devtools class logic). The text block is constrained to roughly 40–50% of the panel width on desktop.
- **"SABER MÁS" link:** Navigates to the configured CTA URL. No modal or in-page interaction.
- **No JavaScript animation** visible in the static view; pure CSS layout.
- **Mobile (< 768px):** Panels remain full-width and stacked; text block becomes full-width, centred or left-aligned; font sizes reduce.

---

## 4. AEM Configuration (Dialog)

| Field               | Type       | Required | Description                                                           |
| ------------------- | ---------- | -------- | --------------------------------------------------------------------- |
| Section title       | text       | Yes      | Heading displayed in the white header zone (e.g., "Nuestros valores") |
| Section title tag   | select     | No       | H2 (default), H3                                                      |
| Section description | textarea   | No       | Introductory paragraph below the section title in the header zone     |
| Values              | multifield | Yes      | Repeatable value panel entries                                        |
| ↳ Background image  | image      | Yes      | Full-bleed background image for the panel                             |
| ↳ Background alt    | text       | Yes      | Accessible alt text for the background image                          |
| ↳ Value title       | text       | Yes      | Value name (e.g., "Especialización")                                  |
| ↳ Value description | textarea   | No       | Short description paragraph overlaid on the panel                     |
| ↳ Text alignment    | select     | No       | Right (default), Left — controls which side the text block appears    |
| ↳ CTA label         | text       | No       | Link label; defaults to i18n key "SABER MÁS" if empty                 |
| ↳ CTA URL           | pathfield  | Yes      | Destination URL for the "SABER MÁS" navigation link                   |
| ↳ CTA target        | select     | No       | \_self (default), \_blank                                             |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Component wrapped in `<section aria-labelledby="[title-id]">` pointing to the header zone heading.
- Each panel rendered as `<article>` (or `<div role="region">`) with `aria-label` matching the value title.
- Background image applied via CSS `background-image`; an `<img>` with `alt` text OR a visually hidden `<span>` describes the image if purely decorative — if the image is purely atmospheric, `alt=""` is acceptable.
- Dark overlay `<div>` carries `aria-hidden="true"`.
- "SABER MÁS" `<a>` uses `aria-label="Saber más sobre [value title]"` to differentiate repeated link text.

### Keyboard Navigation

| Key     | Action                                                       |
| ------- | ------------------------------------------------------------ |
| `Tab`   | Moves focus across "SABER MÁS" links in document order       |
| `Enter` | Activates focused "SABER MÁS" link (navigates to target URL) |

### Color Contrast

- White value title on dark overlay: minimum **4.5:1** ratio required.
- White description text on dark overlay: minimum **4.5:1** ratio required.
- Teal "SABER MÁS" on dark overlay: minimum **4.5:1** ratio required.
- Section title (dark text) on white header background: minimum **4.5:1** ratio.

### Screen Reader

- Section heading announces "Nuestros valores".
- Each panel region is announced with its value title.
- "SABER MÁS" links are contextualised by `aria-label` to avoid ambiguity.

---

## 6. Responsive Design

| Breakpoint        | Panel height | Text block width | Text alignment          |
| ----------------- | ------------ | ---------------- | ----------------------- |
| Mobile (< 768px)  | `100vh`      | 100%             | Centred or left-aligned |
| Desktop (≥ 768px) | `100vh`      | ~40–50% of panel | Alternates right / left |

---

## 7. Style Requirements

| Token                         | Value                                             |
| ----------------------------- | ------------------------------------------------- |
| Header zone background        | `#FFFFFF`                                         |
| Section title color           | Dark `#1A1A1A` or `#2A3D5C`                       |
| Section title font-size       | `~28px` desktop / `~22px` mobile                  |
| Section description color     | Dark gray `#333333`                               |
| Section description font-size | `~14px` desktop / `~13px` mobile                  |
| Panel background              | `background-image` (full-bleed, `cover`, centred) |
| Panel dark overlay            | `rgba(0, 0, 0, ~0.45)` semi-transparent layer     |
| Panel height                  | `100vh` (both desktop and mobile)                 |
| Value title color             | `#FFFFFF`                                         |
| Value title font-size         | `~32px` desktop / `~24px` mobile                  |
| Value title font-weight       | `400` (light/regular)                             |
| Value description color       | `#FFFFFF`                                         |
| Value description font-size   | `~14px` desktop / `~13px` mobile                  |
| "SABER MÁS" color             | Teal approx. `#00A8B5`                            |
| "SABER MÁS" style             | Uppercase, `font-weight: 600`, `→` arrow suffix   |
| Text block padding            | `~40px` (desktop), `~24px` (mobile)               |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders white header zone (title + optional description). Panel list rendered via `data-sly-list` over `${model.values}`. Each panel: outer `<div>` with inline `style="background-image: url(...)"`, inner overlay `<div>`, and a text content block containing value title, description, and "SABER MÁS" `<a>`.
- **Text alignment modifier:** `data-sly-test` applies a BEM modifier class (e.g., `.cmp-values__panel--align-right` / `--align-left`) based on the configured `textAlignment` property.
- **JavaScript:** Minimal or none required for the base static layout. May be added for optional scroll-reveal entrance animations — must respect `prefers-reduced-motion`.
- **SCSS (BEM):** Root block `.cmp-values`; elements: `__header`, `__header-title`, `__header-description`, `__panels`, `__panel`, `__panel--align-right`, `__panel--align-left`, `__overlay`, `__content`, `__title`, `__description`, `__cta`.

### 8.2 Backend Stack

- **Sling Model:** `ValuesModel` extending `AbstractComponentImpl`. Exposes:
    - `sectionTitle` (String), `sectionTitleTag` (String), `sectionDescription` (String).
    - `values` (List\<ValueItem\>): each item exposes `backgroundImagePath`, `backgroundImageAlt`, `valueTitle`, `valueDescription`, `textAlignment`, `ctaLabel`, `ctaUrl`, `ctaTarget`.
- **Annotations:** `@Model`, `@Getter`, `DefaultInjectionStrategy.OPTIONAL`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS clientlib (if scroll-reveal is added) loaded at component bottom with `defer=true`.

---

## 9. Testing

| #   | Scenario                                 | Given                                        | When                    | Then                                                                          |
| --- | ---------------------------------------- | -------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| 1   | Header zone title and description render | Section title and description are configured | Page loads              | White header zone with heading and paragraph is visible above the panels      |
| 2   | All value panels render                  | 4 value items configured                     | Page loads              | 4 full-width panels are present in the DOM in correct order                   |
| 3   | Background image applied to each panel   | Background image is configured               | Page loads              | Panel has `background-image` CSS property set to the configured image URL     |
| 4   | Dark overlay is visible on each panel    | Panel renders                                | Page loads              | A semi-transparent dark overlay layer covers the background image             |
| 5   | Value title renders in white on panel    | Value title is configured                    | Page loads              | Title text is visible in white over the dark overlay                          |
| 6   | Value description renders on panel       | Description is configured                    | Page loads              | Description paragraph is visible below the value title                        |
| 7   | "SABER MÁS" link renders and navigates   | CTA URL is configured                        | User clicks "SABER MÁS" | Browser navigates to the configured CTA URL                                   |
| 8   | Text alignment right modifier applies    | Text alignment set to "right"                | Page loads              | Text content block is positioned on the right side of the panel               |
| 9   | Text alignment left modifier applies     | Text alignment set to "left"                 | Page loads              | Text content block is positioned on the left side of the panel                |
| 10  | Mobile layout: panels stack full-width   | Viewport < 768px                             | Page loads              | All panels render full-width, stacked vertically; text block spans full width |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Component confirmed as 4 full-width stacked image panels (Especialización, Solvencia, Sostenibilidad, Compromiso) with dark overlay and alternating left/right text alignment. White header zone with section title and description sits above the panels.
