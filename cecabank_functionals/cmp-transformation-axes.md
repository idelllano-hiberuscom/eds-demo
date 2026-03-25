# cmp-transformation-axes - Functional Documentation

> Functional specification for the `cmp-transformation-axes` component — Cecabank homepage

---

## Table of Contents

- [cmp-transformation-axes - Functional Documentation](#cmp-transformation-axes---functional-documentation)
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

The `cmp-transformation-axes` component presents Cecabank's three strategic transformation pillars — Tecnología, Cultura, and Sostenibilidad — each rendered as a **video card with a play button**. The section sits on a light blue background, displays a centred title with a descriptive paragraph below it, and each card has a per-card "SABER MÁS →" navigation link in addition to the play button that opens a video modal.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-transformation-axes/
├── cmp-transformation-axes.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-transformation-axes/
├── cmp-transformation-axes.scss
```

---

## 3. Flows and Behavior

- **Initial render:** Section title + descriptive paragraph centred above a card grid.
- **Each card:** Renders a video thumbnail with a centred circular white play `<button>` (teal play icon). Below the thumbnail: axis title (dark text) + "SABER MÁS →" navigation link.
- **Play button click:** Opens a video modal/lightbox overlay embedding the configured video URL. Focus is trapped inside the modal. Pressing `Escape` or clicking the backdrop closes it and returns focus to the triggering play button.
- **"SABER MÁS" link click:** Navigates to the configured card destination URL (independent of the video action).
- **Desktop (≥ 768px):** 3-column equal-width grid.
- **Mobile (< 768px):** Single-column stack, cards full-width.

---

## 4. AEM Configuration (Dialog)

| Field               | Type       | Required | Description                                             |
| ------------------- | ---------- | -------- | ------------------------------------------------------- |
| Section title       | text       | Yes      | Heading (e.g., "Nuestros ejes de transformación")       |
| Section title tag   | select     | No       | H2 (default), H3                                        |
| Section description | textarea   | No       | Descriptive paragraph displayed below the section title |
| Axes                | multifield | Yes      | Repeatable axis video card entries                      |
| ↳ Thumbnail image   | image      | Yes      | Video preview thumbnail                                 |
| ↳ Thumbnail alt     | text       | Yes      | Accessible alt text for the thumbnail                   |
| ↳ Axis title        | text       | Yes      | Name of the axis (e.g., "Tecnología")                   |
| ↳ Video URL         | text       | Yes      | URL of the video to embed (YouTube / Vimeo / direct)    |
| ↳ Video provider    | select     | No       | YouTube, Vimeo, Direct (default: YouTube)               |
| ↳ Open in modal     | checkbox   | No       | Play button opens video modal (default: checked)        |
| ↳ CTA label         | text       | No       | Link label; defaults to i18n key "SABER MÁS" if empty   |
| ↳ CTA URL           | pathfield  | Yes      | Destination page URL for the "SABER MÁS" link           |
| ↳ CTA target        | select     | No       | \_self (default), \_blank                               |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Section wrapped in `<section aria-labelledby="[title-id]">` pointing to the heading element.
- Each card: `<article>` containing the `<figure>` (thumbnail + play btn) + axis title + CTA link.
- Play `<button>` carries `aria-label="Reproducir vídeo: [axis title]"`. The triangle SVG icon inside uses `aria-hidden="true"`.
- Thumbnail `<img>` has descriptive `alt` text; if the adjacent axis title is sufficient, `alt=""` is acceptable.
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to a heading inside the modal. Focus trapped on open; returned to trigger play button on close.
- "SABER MÁS" `<a>` uses `aria-label="Saber más sobre [axis title]"` to disambiguate repeated link labels.

### Keyboard Navigation

| Key      | Action                                                       |
| -------- | ------------------------------------------------------------ |
| `Tab`    | Moves focus across play buttons and "SABER MÁS" links        |
| `Enter`  | Activates focused play button or "SABER MÁS" link            |
| `Space`  | Activates focused play button                                |
| `Escape` | Closes open video modal; returns focus to originating button |

### Color Contrast

- Axis title on light blue background: minimum **4.5:1** ratio.
- "SABER MÁS" teal link on light blue background: minimum **4.5:1** ratio.
- Section title and description text on light blue: minimum **4.5:1** ratio.

### Screen Reader

- Play button announces `"Reproducir vídeo: [axis title]"`.
- Thumbnail `alt` is read before the button in document order.
- `prefers-reduced-motion`: any entrance animations are skipped; video autoplay inside modal is disabled.

---

## 6. Responsive Design

| Breakpoint        | Layout              | Card width     | Typography                                                               |
| ----------------- | ------------------- | -------------- | ------------------------------------------------------------------------ |
| Mobile (< 768px)  | 1-column stack      | 100%           | Title ~24px centred; description ~14px centred; axis title ~18px centred |
| Desktop (≥ 768px) | 3-column equal grid | ~33% minus gap | Title ~36px centred; description ~16px centred; axis title ~20px centred |

---

## 7. Style Requirements

| Token                         | Value                                                    |
| ----------------------------- | -------------------------------------------------------- |
| Section background            | Light blue approx. `#B8D9E8` (confirm exact in devtools) |
| Section title color           | Dark navy approx. `#2A3D5C`                              |
| Section title font            | Poppins (or project heading font)                        |
| Section title font-size       | `~36px` desktop / `~24px` mobile                         |
| Section description color     | Dark gray approx. `#333333`                              |
| Section description font-size | `~16px` desktop / `~14px` mobile                         |
| Thumbnail aspect ratio        | `16:9`                                                   |
| Thumbnail border-radius       | None (flat/square)                                       |
| Play button shape             | White circle centred on thumbnail                        |
| Play button size              | `~56px` diameter                                         |
| Play icon color               | Teal approx. `#00A8B5`                                   |
| Axis title color              | Dark `#1A1A1A` / `#000000`                               |
| Axis title font-size          | `~20px` desktop / `~18px` mobile                         |
| Axis title font-weight        | `600` (semi-bold)                                        |
| "SABER MÁS" color             | Teal approx. `#00A8B5`                                   |
| "SABER MÁS" style             | Uppercase, `font-weight: 600`, `→` arrow suffix          |
| Grid gap                      | `~24px`                                                  |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders section title and optional description (`data-sly-test`). Card grid via `data-sly-list` over `${model.axes}`. Each card: `<figure>` with `<img>` thumbnail + play `<button>`, followed by axis title + "SABER MÁS" `<a>`.
- **JavaScript (vanilla ES6+):** Module init on `data-cmp-transformation-axes` attribute. Responsibilities:
    - Bind `click` on each play `<button>` → dynamically create `<iframe>` with configured video URL and inject into modal.
    - Trap focus inside modal; bind `Escape` key and backdrop `click` to close modal and restore focus to trigger.
    - Respect `prefers-reduced-motion` (skip entrance animations).
- **SCSS (BEM):** Root block `.cmp-transformation-axes`; elements: `__header`, `__title`, `__description`, `__grid`, `__card`, `__thumbnail`, `__play-btn`, `__play-icon`, `__card-title`, `__cta`, `__modal`, `__modal-inner`, `__modal-close`.
- **No third-party JS library** — vanilla only.

### 8.2 Backend Stack

- **Sling Model:** `TransformationAxesModel` extending `AbstractComponentImpl`. Exposes:
    - `sectionTitle` (String), `sectionTitleTag` (String), `sectionDescription` (String).
    - `axes` (List\<AxisItem\>): each item exposes `thumbnailPath`, `thumbnailAlt`, `axisTitle`, `videoUrl`, `videoProvider`, `openInModal` (boolean), `ctaLabel`, `ctaUrl`, `ctaTarget`.
- **Annotations:** `@Model`, `@Getter`, `DefaultInjectionStrategy.OPTIONAL`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- Video URLs sanitized server-side before rendering into `data-*` attributes (prevent XSS via URL injection).

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS clientlib loaded at component bottom with `defer=true` via Core Components clientlib template.

---

## 9. Testing

| #   | Scenario                             | Given                                  | When                                | Then                                                                   |
| --- | ------------------------------------ | -------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| 1   | Section title and description render | Title and description are configured   | Page loads                          | Heading and description paragraph are visible above the card grid      |
| 2   | All 3 axis cards render              | 3 axis items configured                | Page loads                          | All 3 cards with thumbnail, title, and "SABER MÁS" link are in the DOM |
| 3   | Thumbnail renders with alt text      | Thumbnail image and alt are configured | Page loads                          | `<img>` is visible and `alt` attribute matches the configured value    |
| 4   | Play button visible on each card     | Axis items are configured              | Page loads                          | A circular play button is centred over each thumbnail                  |
| 5   | Play button opens video modal        | Valid video URL is configured          | User clicks the play button         | Video modal opens with the embedded video; backdrop is visible         |
| 6   | Modal closes on Escape key           | Video modal is open                    | User presses `Escape`               | Modal closes; focus returns to the triggering play button              |
| 7   | Modal closes on backdrop click       | Video modal is open                    | User clicks outside the modal panel | Modal closes and iframe video is removed from the DOM                  |
| 8   | "SABER MÁS" link navigates correctly | CTA URL is configured for an axis      | User clicks "SABER MÁS"             | Browser navigates to the configured URL                                |
| 9   | 3-column layout on desktop           | Viewport ≥ 768px                       | Page loads                          | Three cards are rendered side by side in equal columns                 |
| 10  | Single-column layout on mobile       | Viewport < 768px                       | Page loads                          | Cards stack vertically; each card is full-width                        |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Section confirmed: 3 video cards with circular play button and per-card "SABER MÁS →" link on a light blue background, with centred section title and description paragraph above the grid.
