# cmp-services-cards - Functional Documentation

> Functional specification for the `cmp-services-cards` component — Cecabank homepage

---

## Table of Contents

- [cmp-services-cards - Functional Documentation](#cmp-services-cards---functional-documentation)
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

The `cmp-services-cards` component displays a set of expert video cards under the "Podemos ayudarte" heading. Each card consists of a **video thumbnail with a centred play button overlay** and a service title below. Clicking the play button or the thumbnail plays the associated video (inline or in a modal). A section subtitle and a single section-level "SABER MÁS" CTA link are rendered alongside the cards. Detected services: Securities Services, Tesorería, Pagos y Plataformas Tecnológicas.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-services-cards/
├── cmp-services-cards.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-services-cards/
├── cmp-services-cards.scss
└── cmp-services-cards.js
```

---

## 3. Flows and Behavior

- **Initial render:** Section title (centred, dark) and subtitle (centred, smaller) are displayed above the card grid.
- **Video cards:** Each card displays a static video thumbnail image with a **semi-transparent circular play button** centred over it. Below the thumbnail the service title is rendered in dark text.
- **Play interaction:** Clicking the thumbnail or the play button triggers video playback. The video may open in a **lightbox/modal overlay** or play inline depending on implementation. The play button is the primary interactive element per card.
- **Desktop (≥ 768px):** 3 cards arranged in a horizontal row.
- **Mobile (< 768px):** Cards stack in a single column.
- **Section CTA:** A single "SABER MÁS →" link in corporate teal is rendered centred below all cards. It navigates to a configurable destination page.
- **No per-card navigation link** — card interaction is video playback only, not page navigation.
- **No autoplay** — video only plays on explicit user action.

---

## 4. AEM Configuration (Dialog)

| Field              | Type       | Required | Description                                                         |
| ------------------ | ---------- | -------- | ------------------------------------------------------------------- |
| Section title      | text       | Yes      | Heading (e.g., "Podemos ayudarte")                                  |
| Section title tag  | select     | No       | H2 (default), H3                                                    |
| Section subtitle   | text       | No       | Subtitle below heading (e.g., "Nuestros expertos te cuentan cómo.") |
| Cards              | multifield | Yes      | Repeatable video card entries                                       |
| ↳ Video thumbnail  | image      | Yes      | Static preview image for the video                                  |
| ↳ Thumbnail alt    | text       | Yes      | Accessible alt text for the thumbnail                               |
| ↳ Card title       | text       | Yes      | Service name (e.g., "Securities Services")                          |
| ↳ Video URL / ID   | text       | Yes      | URL or embed ID of the video to play                                |
| ↳ Video provider   | select     | No       | YouTube / Vimeo / Self-hosted                                       |
| ↳ Open in modal    | checkbox   | No       | Play in lightbox modal (default: true)                              |
| Section CTA label  | text       | No       | Text for the section CTA (e.g., "SABER MÁS")                        |
| Section CTA URL    | pathfield  | No       | Destination URL for the CTA                                         |
| Section CTA target | checkbox   | No       | Open in new tab                                                     |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Section uses `<section>` with `aria-labelledby` pointing to the section title.
- Each card rendered as a `<figure>` or `<article>` element.
- Play button is a `<button>` with `aria-label="Play [Card title] video"`. It is the focusable interactive element — not the entire card.
- Thumbnail image uses descriptive `alt` text (e.g., "Securities Services expert video thumbnail").
- If video opens in a modal: modal uses `role="dialog"` with `aria-modal="true"` and `aria-label="[Card title] video"`; focus moves into the modal on open; `Escape` closes the modal.
- Section CTA rendered as `<a>` with descriptive text.

### Keyboard Navigation

| Key                | Action                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| `Tab`              | Move focus from play button to play button across cards, then to section CTA |
| `Enter` / `Space`  | Activate focused play button — opens video modal or starts inline playback   |
| `Escape`           | Close video modal (if open in modal)                                         |
| `Tab` (modal open) | Focus cycles within video modal (video controls + close button)              |

### Color Contrast

- Section title (dark `#000000`) on white: passes **4.5:1** (WCAG AA).
- Card title (dark `#000000`) on white: passes **4.5:1**.
- Section CTA (teal) on white: verify minimum **4.5:1** against brand teal token.
- Play button icon on semi-transparent circle overlay: minimum **3:1** (UI component).

### Screen Reader

- Play button read as: "Play [Card title] video".
- Thumbnail `alt` text describes the visual content.
- Section CTA text is self-describing.
- Video modal (if used) announced as a dialog with video title.

---

## 6. Responsive Design

| Breakpoint        | Layout                  | Behavior                                                                            |
| ----------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| Mobile (< 768px)  | 1-column stack          | Cards displayed vertically one below the other; section CTA centred below all cards |
| Desktop (≥ 768px) | 3-column horizontal row | All 3 cards visible side by side; section CTA centred below the row                 |

---

## 7. Style Requirements

| Token                      | Value                              |
| -------------------------- | ---------------------------------- |
| Section background         | `#FFFFFF`                          |
| Section title color        | `#000000` (dark)                   |
| Section title font-size    | `40px` (desktop) / `28px` (mobile) |
| Section title font-weight  | `700`                              |
| Section title alignment    | `center`                           |
| Section subtitle color     | `#1A1A1A`                          |
| Section subtitle font-size | `16px`                             |
| Section subtitle alignment | `center`                           |
| Font family                | `Poppins, sans-serif`              |
| Card background            | `#FFFFFF`                          |
| Card border / shadow       | None (flat design)                 |
| Thumbnail aspect ratio     | `16:9`                             |
| Play button size           | `56px` circle                      |
| Play button background     | `rgba(255,255,255,0.85)`           |
| Play button icon color     | Corporate teal                     |
| Card title color           | `#000000`                          |
| Card title font-size       | `22px` (desktop) / `18px` (mobile) |
| Card title font-weight     | `400` (regular)                    |
| Card title alignment       | `center`                           |
| Section CTA color          | Corporate teal                     |
| Section CTA font-size      | `14px`                             |
| Section CTA font-weight    | `700` uppercase                    |
| Section CTA alignment      | `center`                           |
| Grid gap                   | `24px`                             |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders section title, subtitle, card list (`data-sly-list` over multifield items), and section CTA link. Each card: `<figure>` with thumbnail `<img>`, play `<button>`, and `<figcaption>` for the title.
- **JavaScript (vanilla ES6+):** Play button `click` listener per card. Opens a video modal (or triggers inline embed). Modal management: open/close, focus trap, `Escape` to close, `aria-modal`. Dispatches `videoPlay` custom event on play. `data-initialized` guard.
- **SCSS (BEM):** Root block `.cmp-services-cards`; elements: `__header`, `__title`, `__subtitle`, `__grid`, `__card`, `__thumbnail`, `__play-btn`, `__play-icon`, `__card-title`, `__cta`. Modal overlay: `.cmp-services-cards__modal`, `__modal-close`, `__modal-video`.

### 8.2 Backend Stack

- **Sling Model:** `ServicesCardsModel` extending `AbstractComponentImpl`. Exposes: `sectionTitle`, `sectionTitleTag`, `sectionSubtitle`, `cards` (List<VideoCardItem>), `ctaLabel`, `ctaUrl`, `ctaTarget`. Each `VideoCardItem`: `thumbnailPath`, `thumbnailAlt`, `title`, `videoUrl`, `videoProvider`, `openInModal`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- External links use `rel="noopener noreferrer"`.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS loaded at bottom of component HTL with `defer=true`.

---

## 9. Testing

| #   | Scenario                               | Given                                       | When                                | Then                                                            |
| --- | -------------------------------------- | ------------------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| 1   | Section title renders centred          | Title configured                            | Page loads                          | Title text is visible, dark, centred above the card grid        |
| 2   | Section subtitle renders               | Subtitle configured                         | Page loads                          | Subtitle text appears below the title, centred                  |
| 3   | All 3 cards render                     | 3 cards configured                          | Page loads                          | All 3 video cards are visible in the DOM                        |
| 4   | Thumbnail renders with alt text        | Thumbnail and alt configured                | Page loads                          | Thumbnail image is visible with correct `alt` attribute         |
| 5   | Play button is visible on each card    | Cards are rendered                          | Page loads                          | Centred circular play button overlays each thumbnail            |
| 6   | Play button opens video modal          | Video URL configured; `openInModal` is true | User clicks play button             | Video modal appears with embedded video ready to play           |
| 7   | Modal closes on X button               | Modal is open                               | User clicks close button            | Modal hides; focus returns to the play button                   |
| 8   | Modal closes on Escape key             | Modal is open                               | User presses Escape                 | Modal hides; focus returns to the play button                   |
| 9   | Section CTA renders and navigates      | CTA label and URL configured                | Page loads; user clicks "SABER MÁS" | CTA is visible centred below cards; navigates to configured URL |
| 10  | Cards stack in single column on mobile | Viewport < 768px                            | Page loads                          | Each card occupies full width; cards are stacked vertically     |

---

## 10. Visual Assets & Screenshots

Screenshots of the "Podemos ayudarte" card section from desktop and mobile viewports should be captured from `https://www.cecabank.es/` during visual QA.
