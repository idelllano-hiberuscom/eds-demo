# cmp-footer - Functional Documentation

> Functional specification for the `cmp-footer` component — Cecabank homepage

---

## Table of Contents

- [cmp-footer - Functional Documentation](#cmp-footer---functional-documentation)
    - [Table of Contents](#table-of-contents)
    - [1. Description](#1-description)
    - [2. Component Structure](#2-component-structure)
    - [3. Flows and Behavior](#3-flows-and-behavior)
        - [Footer bar zones (always rendered, no interaction required)](#footer-bar-zones-always-rendered-no-interaction-required)
        - [Mapa web overlay (full-screen layer)](#mapa-web-overlay-full-screen-layer)
    - [4. AEM Configuration (Dialog)](#4-aem-configuration-dialog)
        - [Footer bar](#footer-bar)
        - [Mapa web overlay content](#mapa-web-overlay-content)
    - [5. Accessibility (WCAG 2.1 AA)](#5-accessibility-wcag-21-aa)
        - [ARIA Roles \& Labels](#aria-roles--labels)
        - [Keyboard Navigation](#keyboard-navigation)
        - [Color Contrast](#color-contrast)
        - [Screen Reader](#screen-reader)
    - [6. Responsive Design](#6-responsive-design)
    - [7. Style Requirements](#7-style-requirements)
        - [Footer bar](#footer-bar-1)
        - [Mapa web overlay](#mapa-web-overlay)
    - [8. Integration \& Technical Stack](#8-integration--technical-stack)
        - [8.1 Frontend Stack](#81-frontend-stack)
        - [8.2 Backend Stack](#82-backend-stack)
        - [8.3 Authorization \& Security](#83-authorization--security)
        - [8.4 Clientlib Integration](#84-clientlib-integration)
    - [9. Testing](#9-testing)
    - [10. Visual Assets \& Screenshots](#10-visual-assets--screenshots)

---

## 1. Description

The `cmp-footer` is the site-wide bottom component rendered on every page. It features a corporate teal background and is organised in five stacked zones: (1) utility links row, (2) centred logo, (3) CTA links + social icons row, (4) a "mapa web" trigger that opens a full-screen site-map overlay, and (5) a legal links row. There is **no accordion pattern** — on mobile the utility links simply stack vertically. The mapa web overlay is a full-screen dark teal layer containing a structured mega-menu (multi-column on desktop, single-column on mobile) covering the complete site hierarchy, contact details, and a cookie preferences button.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-footer/
├── cmp-footer.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-footer/
├── cmp-footer.scss
└── cmp-footer.js
```

---

## 3. Flows and Behavior

### Footer bar zones (always rendered, no interaction required)

- **Zone 1 — Utility links row:** Horizontal list of secondary/corporate links separated by `|`. Desktop: single row. Mobile: each link on its own line, still separated by `|`. Links detected: "Oficina de cambio de divisas", "Banca electrónica", "Portal de proveedores", "Tablón de anuncios", "Información corporativa", "Gobierno corporativo y política de remuneraciones", "Canal de conducta corporativa".
- **Zone 2 — Logo:** Cecabank logo centred. Links to homepage (`/`).
- **Zone 3 — CTA + Social:** Left side: "¿Hablamos?" link (with chat bubble icon) and "Banca electrónica" link (with checkmark icon). Right side: LinkedIn, X (Twitter), YouTube social icons. On mobile this row is reorganised: "¿Hablamos?" (left) aligned with social icons (right); "Banca electrónica" appears on the next line below.
- **Zone 4 — Mapa web trigger:** Centred element with an upward arrow icon (∧) and the text "mapa web" (underlined). Clicking it opens the full-screen site-map overlay.
- **Zone 5 — Legal links:** Centred inline row — "Aviso legal | Derechos de privacidad | Política de cookies".
- **Cookie icon:** Floating circular button (cookie pictogram) fixed at the bottom-left corner of the page. Clicking it opens the cookie preferences panel.

### Mapa web overlay (full-screen layer)

- **Open:** Clicking "mapa web" opens a full-screen dark teal overlay covering the entire viewport. The footer and page content are hidden behind it. An **X** close button appears in the top-right corner.
- **Close:** Clicking the **X** button or pressing `Escape` closes the overlay and returns focus to the "mapa web" trigger.
- **Desktop layout (≥ 768px):** Two rows of columns, 4 columns per row:
    - **Row 1:** "Podemos ayudarte" (section heading in teal accent) spanning 4 sub-columns:
        - "Securities Services" → Servicios Integrales de Valores / Depositaría / Custodia y liquidación de valores
        - "Tesorería" → Mercados financieros / Debt Capital Markets / Billetes
        - "Pagos" → Procesamiento de Pagos con Tarjeta / Acceso a Cámaras de Compensación y Otros Esquemas de Pagos con Cuenta / Soluciones de Pagos Digitales / Pagos Internacionales y Cross-Currency Payments
        - "Plataformas Tecnológicas" → Soluciones de Banca Digital / Servicios de Tesorería, Riesgos y Reporting / Outsourcing Tecnológico
    - **Row 2:** 4 columns:
        - "¿Por qué Cecabank?" → Especialización y Solvencia / Sostenibilidad y Compromiso / Negocio Internacional / Sucursal en Portugal / Sucursal en Luxemburgo / Información corporativa
        - "Cecabank al día" → Notas de prensa / Cecabank en los medios / Brand Center
        - "¿Hablamos?" → Oficinas y sucursales / Calle Alcalá 27, 28014 Madrid / ☎ 91 596 58 61 / ☎ 91 596 50 00
        - _(empty or reserved column)_
    - **Overlay bottom:** Cecabank logo centred + "Aviso legal | Derechos de privacidad | Política de cookies" inline.
    - **Cookie icon:** Floating in bottom-left corner of the overlay.
- **Mobile layout (< 768px):** Single-column stacked list. Section headings visible (e.g., "Podemos ayudarte"); sub-group headings (e.g., "Securities Services", "Tesorería") as secondary headings; child links listed below each. All content is statically visible — no accordion inside the overlay.

---

## 4. AEM Configuration (Dialog)

### Footer bar

| Field             | Type       | Required | Description                                |
| ----------------- | ---------- | -------- | ------------------------------------------ |
| Utility links     | multifield | Yes      | Zone 1 — corporate/secondary links         |
| ↳ Link label      | text       | Yes      | Visible text                               |
| ↳ Link URL        | pathfield  | Yes      | Destination URL                            |
| ↳ Link target     | checkbox   | No       | Open in new tab                            |
| Logo image        | image      | Yes      | Footer Cecabank logo (white SVG/PNG)       |
| Logo alt text     | text       | Yes      | Accessible alt text                        |
| Logo link URL     | pathfield  | Yes      | Default: `/`                               |
| CTA 1 label       | text       | Yes      | "¿Hablamos?"                               |
| CTA 1 URL         | pathfield  | Yes      | Destination URL                            |
| CTA 1 icon        | select     | No       | Chat bubble / none                         |
| CTA 2 label       | text       | No       | "Banca electrónica"                        |
| CTA 2 URL         | pathfield  | No       | External URL                               |
| CTA 2 icon        | select     | No       | Checkmark / none                           |
| Social links      | multifield | No       | LinkedIn, X, YouTube entries               |
| ↳ Social platform | select     | Yes      | LinkedIn / X (Twitter) / YouTube           |
| ↳ Social URL      | pathfield  | Yes      | Profile/channel URL                        |
| Mapa web label    | text       | Yes      | Label of the trigger (default: "mapa web") |
| Legal links       | multifield | Yes      | Zone 5 — bottom legal row                  |
| ↳ Legal label     | text       | Yes      | Link text (e.g., "Aviso legal")            |
| ↳ Legal URL       | pathfield  | Yes      | Destination URL                            |

### Mapa web overlay content

| Field               | Type       | Required | Description                                                |
| ------------------- | ---------- | -------- | ---------------------------------------------------------- |
| Overlay sections    | multifield | Yes      | Top-level sections (e.g., "Podemos ayudarte")              |
| ↳ Section heading   | text       | Yes      | Primary section title (rendered in teal accent)            |
| ↳ Sub-groups        | multifield | Yes      | Sub-sections within the column                             |
| ↳↳ Sub-group title  | text       | Yes      | Sub-group heading (e.g., "Securities Services")            |
| ↳↳ Sub-group links  | multifield | Yes      | Links within the sub-group                                 |
| ↳↳↳ Link label      | text       | Yes      | Visible link text                                          |
| ↳↳↳ Link URL        | pathfield  | Yes      | Destination URL                                            |
| ↳ Contact block     | multifield | No       | Optional contact details (address, phone) for "¿Hablamos?" |
| ↳↳ Contact line     | text       | Yes      | Address line or phone number                               |
| ↳↳ Is phone         | checkbox   | No       | Renders as `<a href="tel:...">` if checked                 |
| Overlay legal links | multifield | Yes      | Legal links in overlay bottom row                          |
| Overlay logo image  | image      | Yes      | Logo repeated inside overlay                               |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Root `<footer>` uses `role="contentinfo"`.
- Utility links rendered in a `<nav>` with `aria-label="Utility links"`.
- Logo image: non-empty `alt` attribute required.
- CTA links include icon with `aria-hidden="true"`; link text must be descriptive.
- Social icon links: `aria-label="Visit our [Platform] channel"`. Icons are `aria-hidden="true"`.
- "Mapa web" trigger is a `<button>` with `aria-expanded="false|true"` and `aria-controls="mapa-web-overlay-id"`.
- Legal links rendered in a `<nav>` with `aria-label="Legal links"`.
- **Mapa web overlay:** `role="dialog"` with `aria-modal="true"` and `aria-label="Site map"`.
- Overlay X close button: `aria-label="Close site map"`.
- Each overlay section heading uses `<h2>` (primary) / `<h3>` (sub-group) semantic hierarchy.
- Phone links: `<a href="tel:+34915965861">` with visible number as text.
- Cookie button: `aria-label="Cookie preferences"`.

### Keyboard Navigation

| Key                  | Action                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Tab`                | Cycle through utility links → logo → CTA 1 → CTA 2 → social icons → mapa web trigger → legal links → cookie button |
| `Enter` / `Space`    | Activate mapa web trigger — opens overlay                                                                          |
| `Tab` (overlay open) | Cycle through overlay links and close button; focus is trapped inside                                              |
| `Escape`             | Close overlay; return focus to mapa web trigger                                                                    |
| `Enter`              | Follow focused link                                                                                                |

### Color Contrast

- All white text on corporate teal background: minimum **4.5:1** ratio.
- Utility links, legal links, CTA labels on teal: minimum **4.5:1**.
- Social icons on teal background: minimum **3:1** (graphical element, WCAG AA).
- Overlay link text (teal accent on dark teal): minimum **4.5:1**.
- Section headings (cyan/light teal on dark teal): minimum **4.5:1**.

### Screen Reader

- Footer region announced as "contentinfo".
- When mapa web overlay opens, focus moves to the close button or first heading inside the overlay.
- `aria-hidden="true"` applied to page content behind the overlay while it is open.
- When overlay closes, focus returns to the mapa web trigger button.

---

## 6. Responsive Design

| Breakpoint        | Footer bar layout                                                      | Mapa web overlay layout                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile (< 768px)  | Zone 1: utility links stacked vertically (one per line with `          | `). Zone 3: "¿Hablamos?" (left) + social icons (right) on one line; "Banca electrónica" on next line. Zone 4: mapa web centred. Zone 5: legal links wrap to multiple lines. | Full-screen single-column. Section headings + sub-group headings + child links stacked vertically. No accordion — all content visible. |
| Desktop (≥ 768px) | Zone 1: all utility links in one or two horizontal rows separated by ` | `. Zone 3: CTAs (left) + social icons (right) on same row. Zone 4: mapa web centred. Zone 5: legal links inline single row.                                                 | Full-screen two-row multi-column grid (4 columns per row). Section headings at top of each column.                                     |

> **Key rule:** No accordion pattern exists at any breakpoint in the footer bar. The mapa web overlay is the primary site navigation reference.

---

## 7. Style Requirements

### Footer bar

| Token                    | Value                                                          |
| ------------------------ | -------------------------------------------------------------- | ----------------------- |
| Footer background        | Corporate teal (`#006272` approx. — confirm with design token) |
| Text color (default)     | `#FFFFFF`                                                      |
| Utility link color       | `#FFFFFF`                                                      |
| Utility link separator ` | `                                                              | `rgba(255,255,255,0.4)` |
| Logo max-height          | `32px` (white version)                                         |
| CTA icon color           | `#FFFFFF`                                                      |
| CTA label font-size      | `14px`                                                         |
| Social icon size         | `20px`                                                         |
| Social icon color        | `#FFFFFF`                                                      |
| "Mapa web" label color   | `#FFFFFF`                                                      |
| "Mapa web" arrow icon    | `∧` or SVG chevron up, `#FFFFFF`                               |
| "Mapa web" underline     | `text-decoration: underline`                                   |
| Legal link color         | `#FFFFFF`                                                      |
| Legal link separator `   | `                                                              | `rgba(255,255,255,0.4)` |
| Legal link font-size     | `12px`                                                         |
| Cookie button size       | `40px` circle; teal/white contrast background                  |
| Footer padding           | `40px 24px` (desktop) / `32px 16px` (mobile)                   |

### Mapa web overlay

| Token                       | Value                                             |
| --------------------------- | ------------------------------------------------- |
| Overlay background          | Same corporate teal as footer (`#006272` approx.) |
| Overlay z-index             | `3000`                                            |
| Section heading color       | Cyan/light teal accent (`#00C8D7` approx.)        |
| Section heading font-size   | `18px` (desktop) / `16px` (mobile)                |
| Sub-group heading color     | `#FFFFFF`                                         |
| Sub-group heading font-size | `16px`                                            |
| Child link color            | `rgba(255,255,255,0.75)`                          |
| Child link font-size        | `13px`–`14px`                                     |
| Child link hover color      | `#FFFFFF`                                         |
| Close button color          | `#FFFFFF`                                         |
| Close button size           | `32px`                                            |
| Phone link color            | Cyan accent                                       |
| Overlay padding             | `48px 40px` (desktop) / `24px 16px` (mobile)      |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders five stacked zones using `data-sly-list` for utility links, social icons, and legal links. CTAs rendered with icon wrapper. Mapa web trigger rendered as `<button>`. Overlay markup rendered in the DOM on page load but hidden via CSS (`display: none` or `visibility: hidden`); revealed by JS class toggle.
- **JavaScript (vanilla ES6+):** Mapa web trigger click → overlay show; X button click and `Escape` key → overlay hide; focus trap inside overlay while open; `aria-expanded` update on trigger; `data-initialized` guard. Dispatches `mapWebOpen` / `mapWebClose` custom events. Phone links in overlay rendered as `<a href="tel:...">`.
- **SCSS (BEM):** Root block `.cmp-footer`; elements: `__utility-nav`, `__utility-link`, `__logo`, `__cta-row`, `__cta`, `__cta-icon`, `__social-row`, `__social-link`, `__sitemap-trigger`, `__sitemap-arrow`, `__legal-nav`, `__legal-link`, `__cookie-btn`. Overlay: `.cmp-footer__overlay`, `__overlay-close`, `__overlay-section`, `__overlay-section-title`, `__overlay-subgroup`, `__overlay-subgroup-title`, `__overlay-link`, `__overlay-contact`, `__overlay-phone`, `__overlay-bottom`.

### 8.2 Backend Stack

- **Sling Model:** `FooterModel` extending `AbstractComponentImpl`. Exposes: `utilityLinks` (List<LinkItem>), `logoImagePath`, `logoAlt`, `logoLinkUrl`, `cta1Label`, `cta1Url`, `cta1Icon`, `cta2Label`, `cta2Url`, `cta2Icon`, `socialLinks` (List<SocialLink>), `sitemapLabel`, `legalLinks` (List<LinkItem>), `overlaySections` (List<OverlaySection> — each with `heading`, `subGroups` List<SubGroup>, optional `contactLines` List<ContactLine>), `overlayLegalLinks` (List<LinkItem>), `overlayLogoImagePath`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- External utility/social links use `rel="noopener noreferrer"`.
- Phone numbers rendered as `<a href="tel:...">` — no server-side logic required.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS loaded at bottom of component HTL with `defer=true`.

---

## 9. Testing

| #   | Scenario                               | Given                                                | When                                  | Then                                                                                                 |
| --- | -------------------------------------- | ---------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------- |
| 1   | Utility links render on desktop        | Utility links configured                             | Page loads on desktop (≥ 768px)       | All links display in one or two horizontal rows separated by `                                       | `               |
| 2   | Utility links stack on mobile          | Utility links configured                             | Page loads on mobile (< 768px)        | Each link renders on its own line; separator `                                                       | ` still visible |
| 3   | Logo renders centred                   | Logo configured                                      | Page loads                            | Logo appears centred between utility links and CTA row                                               |
| 4   | CTA row on desktop — horizontal        | Viewport ≥ 768px                                     | Page loads                            | "¿Hablamos?" and "Banca electrónica" (left) + social icons (right) on same row                       |
| 5   | CTA row on mobile — split              | Viewport < 768px                                     | Page loads                            | "¿Hablamos?" aligned left with social icons right; "Banca electrónica" on next line                  |
| 6   | Mapa web trigger is visible            | Component is rendered                                | Page loads                            | "mapa web" text with upward arrow icon is visible and centred                                        |
| 7   | Mapa web overlay opens on click        | Footer is rendered                                   | User clicks "mapa web" trigger        | Full-screen teal overlay appears; close button (X) is visible                                        |
| 8   | Mapa web overlay closes on X           | Overlay is open                                      | User clicks X button                  | Overlay hides; focus returns to "mapa web" trigger                                                   |
| 9   | Mapa web overlay closes on Escape      | Overlay is open                                      | User presses Escape                   | Overlay hides; focus returns to "mapa web" trigger                                                   |
| 10  | Overlay desktop: multi-column sections | Viewport ≥ 768px                                     | Overlay is open                       | Sections displayed in two rows of four columns; section headings in teal accent; child links visible |
| 11  | Overlay mobile: single column          | Viewport < 768px                                     | Overlay is open                       | All sections stacked in a single column; all links visible without accordion                         |
| 12  | Overlay contact block renders          | "¿Hablamos?" section has address + phones configured | Overlay is open                       | Address, and both phone numbers are visible; phone links use `tel:` protocol                         |
| 13  | Social links open in new tab           | Social URLs configured                               | User clicks LinkedIn/X/YouTube icon   | External profile opens in a new browser tab                                                          |
| 14  | Legal links render and navigate        | Legal links configured                               | Page loads; user clicks "Aviso legal" | Link navigates to configured legal page                                                              |
| 15  | Cookie button triggers preferences     | Cookie button is rendered                            | User clicks the cookie icon           | Cookie preferences panel opens                                                                       |

---

## 10. Visual Assets & Screenshots

Reference screenshots provided: desktop footer bar (all zones), mobile footer bar (all zones), mapa web overlay desktop (two-row multi-column), mapa web overlay mobile (single-column). Additional screenshots of the overlay with the "¿Hablamos?" contact block fully visible should be captured during visual QA.
