# cmp-testimonials - Functional Documentation

> Functional specification for the `cmp-testimonials` component — Cecabank homepage

---

## Table of Contents

- [cmp-testimonials - Functional Documentation](#cmp-testimonials---functional-documentation)
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

The `cmp-testimonials` component displays a single client video testimonial under the "Nuestros clientes opinan" heading. On desktop it uses a **two-column layout**: a video thumbnail with a circular play button on the left, and the quote text (italic) plus author name and role on the right. On mobile both columns stack vertically. The author's name and role are overlaid at the bottom of the video thumbnail. No slider, carousel, or multi-item navigation is implemented.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-testimonials/
├── cmp-testimonials.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-testimonials/
├── cmp-testimonials.scss
└── cmp-testimonials.js
```

---

## 3. Flows and Behavior

- **Initial render:** Section title centred above the testimonial block. A single testimonial is always displayed — no navigation controls.
- **Two-column layout (desktop ≥ 768px):** Left column (~60%): video thumbnail + overlaid author name/role at the bottom + centred circular play button. Right column (~40%): italic quote text + bold author name + author role/company in regular weight.
- **Stacked layout (mobile < 768px):** Video thumbnail full-width, then quote text, then author name and role below — all centred.
- **Play button click:** Opens a video modal/lightbox with an embedded `<iframe>` (YouTube / Vimeo / direct video). Focus trapped inside modal. `Escape` or backdrop click closes the modal and returns focus to the play button.
- **Author overlay on thumbnail:** Author name and role displayed in white text over a semi-transparent gradient at the bottom of the video thumbnail (decoration, duplicated in the text column for screen readers).
- **No carousel, no slider, no previous/next navigation.**

---

## 4. AEM Configuration (Dialog)

| Field             | Type     | Required | Description                                                     |
| ----------------- | -------- | -------- | --------------------------------------------------------------- |
| Section title     | text     | Yes      | Heading (e.g., "Nuestros clientes opinan")                      |
| Section title tag | select   | No       | H2 (default), H3                                                |
| Thumbnail image   | image    | Yes      | Video preview thumbnail                                         |
| Thumbnail alt     | text     | Yes      | Accessible alt text for the thumbnail                           |
| Video URL         | text     | Yes      | URL of the video to embed (YouTube / Vimeo / direct)            |
| Video provider    | select   | No       | YouTube, Vimeo, Direct (default: YouTube)                       |
| Open in modal     | checkbox | No       | Play button opens video modal (default: checked)                |
| Quote text        | textarea | Yes      | The client testimonial quote displayed in the right column      |
| Author name       | text     | Yes      | Full name (displayed in both thumbnail overlay and text column) |
| Author role       | text     | No       | Job title (e.g., "Consejero Director General")                  |
| Author company    | text     | No       | Company name (e.g., "VidaCaixa")                                |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Component wrapped in `<section aria-labelledby="[title-id]">`.
- Play `<button>` carries `aria-label="Reproducir vídeo: [author name]"`. The play SVG icon uses `aria-hidden="true"`.
- Thumbnail `<img>` has descriptive `alt` text matching the configured thumbnail alt.
- Author overlay (name + role on thumbnail): wrapped in `aria-hidden="true"` — this content is duplicated in the visible text column for screen readers.
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to a heading inside. Focus trapped on open; returned to play button on close.

### Keyboard Navigation

| Key      | Action                                                          |
| -------- | --------------------------------------------------------------- |
| `Tab`    | Moves focus to play button; if arrows present, to arrow buttons |
| `Enter`  | Activates focused play button or navigation arrow               |
| `Space`  | Activates focused play button                                   |
| `Escape` | Closes open video modal; returns focus to play button           |

### Color Contrast

- Italic quote text (dark gray) on white background: minimum **4.5:1** ratio.
- Bold author name (dark) on white background: minimum **4.5:1** ratio.
- Author overlay white text on semi-transparent dark gradient: minimum **4.5:1** ratio.

### Screen Reader

- Quote text is read in document order in the right column.
- Play button announces `"Reproducir vídeo: [author name]"`.
- Thumbnail overlay text is hidden from screen readers (duplicated in text column).

---

## 6. Responsive Design

| Breakpoint        | Layout                                  | Media width | Quote column width |
| ----------------- | --------------------------------------- | ----------- | ------------------ |
| Mobile (< 768px)  | 1-column stack (thumbnail → quote text) | 100%        | 100% centred       |
| Desktop (≥ 768px) | 2-column (thumbnail left, quote right)  | ~60%        | ~40%               |

---

## 7. Style Requirements

| Token                         | Value                                              |
| ----------------------------- | -------------------------------------------------- |
| Section background            | `#FFFFFF`                                          |
| Section title color           | Dark `#1A1A1A` / `#000000`                         |
| Section title font-size       | `~36px` desktop / `~24px` mobile                   |
| Section title font-weight     | `400` (regular/light)                              |
| Thumbnail aspect ratio        | `16:9`                                             |
| Thumbnail border-radius       | None (flat/square)                                 |
| Play button shape             | White circle centred on thumbnail                  |
| Play button size              | `~56px` diameter                                   |
| Play icon color               | Teal approx. `#00A8B5`                             |
| Author overlay background     | Semi-transparent dark gradient at thumbnail bottom |
| Author overlay text color     | `#FFFFFF`                                          |
| Author overlay name font-size | `~14px`, `font-weight: 700`                        |
| Author overlay role font-size | `~11px`, uppercase                                 |
| Quote font-style              | Italic                                             |
| Quote color                   | Dark gray approx. `#444444` / `#555555`            |
| Quote font-size               | `~20px` desktop / `~16px` mobile                   |
| Author name color             | `#1A1A1A`                                          |
| Author name font-weight       | `700` (bold)                                       |
| Author role/company color     | `#555555`                                          |
| Author role font-size         | `~14px`                                            |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders section title. Testimonial block structured as a two-column wrapper. Left column: `<figure>` with `<img>` thumbnail + play `<button>` + author overlay `<div>`. Right column: `<blockquote>` for quote text + `<cite>` for author name + role/company paragraph.
- **JavaScript (vanilla ES6+):** Module init on `data-cmp-testimonials`. Responsibilities:
    - Bind `click` on play `<button>` → create `<iframe>` with video URL and inject into modal.
    - Trap focus in modal; bind `Escape` and backdrop `click` to close and restore focus.
    - Respect `prefers-reduced-motion`.
- **No Swiper.js, no carousel, no navigation arrows** — single testimonial, static layout.
- **SCSS (BEM):** Root block `.cmp-testimonials`; elements: `__title`, `__item`, `__media`, `__thumbnail`, `__play-btn`, `__play-icon`, `__author-overlay`, `__overlay-name`, `__overlay-role`, `__content`, `__quote`, `__author-name`, `__author-role`, `__modal`, `__modal-inner`, `__modal-close`.

### 8.2 Backend Stack

- **Sling Model:** `TestimonialsModel` extending `AbstractComponentImpl`. Exposes:
    - `sectionTitle` (String), `sectionTitleTag` (String).
    - `thumbnailPath` (String), `thumbnailAlt` (String), `videoUrl` (String), `videoProvider` (String), `openInModal` (boolean), `quoteText` (String), `authorName` (String), `authorRole` (String), `authorCompany` (String).
- **Annotations:** `@Model`, `@Getter`, `DefaultInjectionStrategy.OPTIONAL`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- Video URLs sanitized server-side before rendering into `data-*` attributes.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS clientlib loaded at component bottom with `defer=true` via Core Components clientlib template.

---

## 9. Testing

| #   | Scenario                                    | Given                            | When                        | Then                                                                           |
| --- | ------------------------------------------- | -------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| 1   | Section title renders                       | Title is configured              | Page loads                  | "Nuestros clientes opinan" heading is visible above the testimonial block      |
| 2   | Two-column layout on desktop                | Viewport ≥ 768px                 | Page loads                  | Thumbnail occupies left column (~60%); quote text occupies right column (~40%) |
| 3   | Stacked layout on mobile                    | Viewport < 768px                 | Page loads                  | Thumbnail is full-width; quote text appears below the thumbnail                |
| 4   | Video thumbnail renders with alt text       | Thumbnail and alt are configured | Page loads                  | `<img>` is visible with the correct `alt` attribute                            |
| 5   | Play button is centred over the thumbnail   | Component is configured          | Page loads                  | Circular play button is visible and centred on the thumbnail                   |
| 6   | Play button opens video modal               | Valid video URL is configured    | User clicks the play button | Video modal opens with embedded video; backdrop is visible                     |
| 7   | Modal closes on Escape key                  | Video modal is open              | User presses `Escape`       | Modal closes; focus returns to the triggering play button                      |
| 8   | Modal closes on backdrop click              | Video modal is open              | User clicks outside modal   | Modal closes; iframe is removed from the DOM                                   |
| 9   | Author overlay visible on thumbnail         | Author name and role configured  | Page loads                  | Name and role are overlaid in white at the bottom of the thumbnail             |
| 10  | Quote and author info render in text column | Quote, name, role configured     | Page loads                  | Italic quote + bold author name + role/company visible in the right column     |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Component confirmed as a single static testimonial — two-column layout (video thumbnail with play button left, italic quote + bold author name + role right) on a white background. No slider or navigation. Author name and role overlaid at bottom of thumbnail.
