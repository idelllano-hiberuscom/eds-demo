# cmp-clients-logos - Functional Documentation

> Functional specification for the `cmp-clients-logos` component — Cecabank homepage

---

## Table of Contents

- [cmp-clients-logos - Functional Documentation](#cmp-clients-logos---functional-documentation)
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

The `cmp-clients-logos` component displays client/partner logos under the "Llevamos nuestras soluciones más allá del sector financiero" heading as a **logo carousel** with previous/next arrow navigation. On desktop, 4 logos are visible per slide; on mobile, 1 logo is visible per slide and centred. Logos are displayed in full colour with no grayscale effect. No dot indicators are shown — navigation is arrow-only.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-clients-logos/
├── cmp-clients-logos.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-clients-logos/
├── cmp-clients-logos.scss
└── cmp-clients-logos.js
```

---

## 3. Flows and Behavior

- **Initial render:** Section title displayed above the logo carousel. Previous (`‹`) and next (`›`) arrow buttons are visible on both sides of the logo track only when the total number of logos exceeds the visible count for the current breakpoint.
- **Carousel library:** Implemented with **Swiper.js**.
- **Cyclic (loop):** Carousel loops infinitely — after the last logo, it wraps back to the first and vice versa.
- **Arrows hidden when unnecessary:** If the configured logo count ≤ visible slots (4 on desktop, 1 on mobile), navigation arrows are not rendered.
- **Desktop (≥ 768px):** 4 logos visible simultaneously.
- **Mobile (< 768px):** 1 logo visible per slide, centred.
- **No dot indicators.** Navigation is arrow-only.
- **No autoplay** — user-driven navigation only.
- **Logos are full colour** — no grayscale filter.
- **Logos are not linked** — displayed as image-only items.

---

## 4. AEM Configuration (Dialog)

| Field             | Type       | Required | Description                                       |
| ----------------- | ---------- | -------- | ------------------------------------------------- |
| Section title     | text       | Yes      | Heading (e.g., "Llevamos nuestras soluciones...") |
| Section title tag | select     | No       | H2 (default), H3                                  |
| Logos             | multifield | Yes      | Repeatable logo entries                           |
| ↳ Logo image      | image      | Yes      | SVG or PNG client logo                            |
| ↳ Logo alt text   | text       | Yes      | Accessible alt text (e.g., "Eurocaja Rural")      |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Section uses `<section aria-labelledby="[title-id]">` pointing to the section title.
- Logo list rendered as `<ul>` with `<li>` items inside a carousel track.
- Each logo `<img>` requires a descriptive `alt` attribute (e.g., "Eurocaja Rural").
- Logos are non-interactive (no `<a>` wrapping) — rendered as decorative images. `alt` text provides identification.
- Previous/next arrow `<button>` elements carry `aria-label="Logotipo anterior"` / `aria-label="Logotipo siguiente"`.
- `aria-live="polite"` on the track so screen readers announce slide changes.

### Keyboard Navigation

| Key     | Action                                          |
| ------- | ----------------------------------------------- |
| `Tab`   | Moves focus to previous and next arrow buttons  |
| `Enter` | Activates focused arrow button to advance slide |
| `Space` | Activates focused arrow button                  |

### Color Contrast

- Section title text on white background: minimum **4.5:1** ratio.
- Arrow buttons: UI component contrast minimum **3:1** against background.

### Screen Reader

- Each logo image read by its `alt` text in the current slide.
- Arrow buttons announced as "Logotipo anterior" / "Logotipo siguiente".
- Off-screen logos should be `aria-hidden="true"` (or hidden via `visibility: hidden`) when not in the visible slide.

---

## 6. Responsive Design

| Breakpoint        | Logos per slide | Logo layout | Navigation    |
| ----------------- | --------------- | ----------- | ------------- |
| Mobile (< 768px)  | 1, centred      | Single item | Arrow buttons |
| Desktop (≥ 768px) | 4, in a row     | Horizontal  | Arrow buttons |

---

## 7. Style Requirements

| Token                     | Value                              |
| ------------------------- | ---------------------------------- |
| Section background        | `#FFFFFF`                          |
| Section title font-size   | `~32px` desktop / `~22px` mobile   |
| Section title font-weight | `400` (regular/light)              |
| Section title color       | Dark `#1A1A1A` / `#000000`         |
| Logo max-height           | `~60px` desktop / `~50px` mobile   |
| Logo filter               | None — full colour, no grayscale   |
| Logo display              | `object-fit: contain`; no cropping |
| Arrow button color        | Dark gray `#555555` or similar     |
| Arrow button font-size    | `~20px`                            |
| Arrow button background   | None / transparent                 |
| Carousel gap              | `~32px` between logos (desktop)    |
| Transition                | Smooth slide `~300ms ease`         |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders section title. Carousel markup follows Swiper.js required structure: `swiper` wrapper > `swiper-wrapper` > `swiper-slide` per logo. Navigation prev/next `<div>` elements rendered inside the Swiper container.
- **JavaScript (Swiper.js):** Swiper instance initialised on `data-cmp-clients-logos`. Configuration:
    - `loop: true` — cyclic infinite scroll.
    - `slidesPerView: 4` (desktop) / `1` (mobile), responsive via `breakpoints`.
    - `navigation: true` — prev/next arrow buttons.
    - `navigation.hideOnClick: false`; arrows are conditionally rendered in HTL only when `logos.size > slidesPerView` for the current breakpoint — Swiper handles visibility for the loop clones.
    - `allowTouchMove: true` for swipe on mobile.
    - Respect `prefers-reduced-motion` (disable CSS transitions via `cssMode: false` + custom media query check).
- **SCSS (BEM):** Root block `.cmp-clients-logos`; elements: `__title`, `__carousel`. Swiper default classes (`swiper`, `swiper-wrapper`, `swiper-slide`, `swiper-button-prev`, `swiper-button-next`) scoped inside `.cmp-clients-logos`.

### 8.2 Backend Stack

- **Sling Model:** `ClientsLogosModel` extending `AbstractComponentImpl`. Exposes: `sectionTitle`, `sectionTitleTag`, `logos` (List\<LogoItem\>). Each `LogoItem`: `imagePath`, `imageAlt`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS clientlib loaded at component bottom with `defer=true` via Core Components clientlib template.

---

## 9. Testing

| #   | Scenario                                 | Given                                         | When                         | Then                                                             |
| --- | ---------------------------------------- | --------------------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| 1   | Section title renders                    | Title is configured                           | Page loads                   | Heading text is visible above the logo carousel                  |
| 2   | 4 logos visible on desktop               | Multiple logos configured                     | Viewport ≥ 768px; page loads | 4 logo images are visible in the Swiper track                    |
| 3   | 1 logo visible on mobile                 | Multiple logos configured                     | Viewport < 768px; page loads | 1 logo is visible and centred in the Swiper track                |
| 4   | Arrows visible when logos exceed slots   | 5+ logos configured; viewport ≥ 768px         | Page loads                   | Prev and next arrow buttons are visible beside the track         |
| 5   | Arrows hidden when logos ≤ visible slots | 4 or fewer logos configured; viewport ≥ 768px | Page loads                   | No navigation arrow buttons are rendered in the DOM              |
| 6   | Next arrow advances the carousel         | Carousel is at initial position               | User clicks next arrow       | Track slides to show the next logo(s)                            |
| 7   | Previous arrow retreats the carousel     | Carousel is not at position 0                 | User clicks previous arrow   | Track slides back to show the previous logo(s)                   |
| 8   | Carousel loops forward (cyclic)          | Last logo is visible                          | User clicks next arrow       | Carousel wraps cyclically to show the first logo(s)              |
| 9   | Carousel loops backward (cyclic)         | First logo is visible                         | User clicks previous arrow   | Carousel wraps cyclically to show the last logo(s)               |
| 10  | Logo renders with alt text               | Alt text is configured                        | Page loads                   | Logo `<img>` has its `alt` attribute set to the configured value |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Component confirmed as a logo carousel with arrow navigation (4 logos per slide on desktop, 1 per slide on mobile). Logos are full colour, not linked, and no grayscale effect is applied. No dot indicators — arrows only.
