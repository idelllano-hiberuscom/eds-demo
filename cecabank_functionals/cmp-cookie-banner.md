# cmp-cookie-banner - Functional Documentation

> Functional specification for the `cmp-cookie-banner` component — Cecabank homepage

---

## Table of Contents

- [cmp-cookie-banner - Functional Documentation](#cmp-cookie-banner---functional-documentation)
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
        - [Focus Trap](#focus-trap)
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

The `cmp-cookie-banner` is the GDPR-compliant cookie consent overlay displayed on the user's first visit or when consent preferences have not been stored. It renders as a **floating white card** anchored to the bottom-left of the viewport (desktop) or as a full-width bottom card (mobile). The card contains a description text, a close (`×`) button, and three action buttons: "Configuración de cookies" (outlined), "Rechazarlas todas" (filled teal), and "Aceptar todas las cookies" (filled teal). No page backdrop/overlay is applied. Consent is persisted in the browser.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-cookie-banner/
├── cmp-cookie-banner.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-cookie-banner/
├── cmp-cookie-banner.scss
└── cmp-cookie-banner.js
```

---

## 3. Flows and Behavior

- **First visit:** Banner card appears fixed bottom-left (desktop) / full-width bottom (mobile). Page content remains interactive behind the card — no dark overlay or scroll lock.
- **Close `×` button:** Clicking the `×` dismisses the banner without storing explicit consent (equivalent to rejecting optional cookies or closing without choice — [TBD: confirm behaviour]).
- **"Aceptar todas las cookies":** All cookie categories enabled. Consent stored. Banner dismissed.
- **"Rechazarlas todas":** Only strictly necessary cookies enabled. Consent stored. Banner dismissed.
- **"Configuración de cookies":** Opens a separate cookie preference panel (not visible in current screenshots — out of scope for initial implementation if not needed). If not implemented, clicking it may navigate to the cookie policy page.
- **Revisit:** Banner is not shown again if valid consent is already stored.
- **Desktop (≥ 768px):** Floating card bottom-left, fixed width (~640px approx.). Three buttons in a single horizontal row.
- **Mobile (< 768px):** Full-width card at bottom. "Configuración de cookies" alone on first row; "Rechazarlas todas" and "Aceptar todas las cookies" side by side on second row.

---

## 4. AEM Configuration (Dialog)

| Field                 | Type      | Required | Description                                                                   |
| --------------------- | --------- | -------- | ----------------------------------------------------------------------------- |
| Description           | richtext  | Yes      | GDPR consent description text shown in the card body                          |
| Accept all label      | text      | Yes      | Label for the filled teal "accept" button (e.g., "Aceptar todas las cookies") |
| Reject all label      | text      | Yes      | Label for the filled teal "reject" button (e.g., "Rechazarlas todas")         |
| Settings label        | text      | Yes      | Label for the outlined "settings" button (e.g., "Configuración de cookies")   |
| Settings link URL     | pathfield | No       | URL opened by the settings button if preferences panel is not inline          |
| Consent expiry (days) | number    | No       | Days before consent expires (default: 365)                                    |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Banner card uses `role="dialog"` with `aria-modal="true"` and `aria-describedby` pointing to the description element.
- Close `×` button: `<button aria-label="Cerrar banner de cookies">`. The `×` icon uses `aria-hidden="true"`.
- "Aceptar todas las cookies", "Rechazarlas todas", and "Configuración de cookies" are `<button>` elements with their visible label text as the accessible name.
- Page background content does **not** require `aria-hidden` since no dark backdrop is applied — focus trap still recommended.

### Keyboard Navigation

| Key               | Action                                                             |
| ----------------- | ------------------------------------------------------------------ |
| `Tab`             | Cycles focus: close button → Configuración → Rechazarlas → Aceptar |
| `Enter` / `Space` | Activates focused button                                           |
| `Escape`          | Dismisses the banner (same as clicking `×`)                        |

### Color Contrast

- Description text (`#1A1A1A`) on white card background: minimum **4.5:1** ratio.
- "Configuración de cookies" teal text (`#00A8B5` approx.) on white button: minimum **4.5:1** — verify exact value.
- "Rechazarlas todas" / "Aceptar todas las cookies" white text on teal button: minimum **4.5:1** ratio.
- Close `×` button: minimum **3:1** ratio (UI component).

### Screen Reader

- Banner announced as `dialog` with description text as its name.
- Focus moves to the first button (or close button) when the banner appears.
- When dismissed, focus returns to the active document element.

### Focus Trap

- While the banner card is visible, Tab focus is constrained within the card.
- Background page is **not** `aria-hidden` (no full-screen overlay), but focus trap is enforced via JS.

---

## 6. Responsive Design

| Breakpoint        | Card position & width           | Buttons layout                                                            |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------- |
| Mobile (< 768px)  | Full-width, fixed bottom        | "Configuración" alone row 1; "Rechazarlas" + "Aceptar" side-by-side row 2 |
| Desktop (≥ 768px) | Fixed bottom-left, ~640px width | All 3 buttons in a single horizontal row                                  |

---

## 7. Style Requirements

| Token                        | Value                                                 |
| ---------------------------- | ----------------------------------------------------- |
| Card background              | `#FFFFFF`                                             |
| Card position                | `position: fixed; bottom: 0; left: 0; z-index: 9999`  |
| Card width (desktop)         | `~640px` max-width                                    |
| Card width (mobile)          | `100%`                                                |
| Card border/shadow           | `1px solid #CCCCCC` + `box-shadow` subtle             |
| Card padding                 | `~24px`                                               |
| Page backdrop                | None — background content remains visible             |
| Description text color       | `#1A1A1A`                                             |
| Description font-size        | `~14px`                                               |
| Close `×` button color       | `#555555` or `#1A1A1A`                                |
| "Configuración" button style | Outlined — teal border `#00A8B5`, white bg, teal text |
| "Rechazarlas" button style   | Filled teal `#00A8B5`, white text                     |
| "Aceptar todas" button style | Filled teal `#00A8B5`, white text                     |
| Button border-radius         | `~4px`                                                |
| Button padding               | `~10px 16px`                                          |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders fixed card markup: description `<p>`, close `<button>`, and three action `<button>` elements. Hidden via JS if consent already stored. No page backdrop element required.
- **JavaScript (vanilla ES6+):** Reads consent from cookie/localStorage on DOM load. Shows/hides card. Handles close `×`, Accept, Reject, and Settings button clicks. Stores consent state. Dispatches `consentUpdated` custom event. Focus trap within card. `data-initialized` guard. `Escape` key binding to close.
- **SCSS (BEM):** Root block `.cmp-cookie-banner`; elements: `__body`, `__description`, `__close`, `__actions`, `__btn-settings`, `__btn-reject`, `__btn-accept`. Modifiers: `__btn-settings--outlined`, `__btn--filled`. State modifier `--hidden`.

### 8.2 Backend Stack

- **Sling Model:** `CookieBannerModel` extending `AbstractComponentImpl`. Exposes: `description`, `acceptLabel`, `rejectLabel`, `settingsLabel`, `settingsLinkUrl`, `consentExpiryDays`.
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible on all pages. No authentication required.
- Consent stored client-side only (cookie or localStorage). No PII transmitted.
- Cookie names follow GDPR/PECR naming conventions.
- Banner must load before any non-essential scripts execute (script order enforced by Webpack entry point).

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top.
- JS loaded with `defer=true` — must be the first deferred script to execute before analytics/marketing scripts.

---

## 9. Testing

| #   | Scenario                                   | Given                     | When                                    | Then                                                                                    |
| --- | ------------------------------------------ | ------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Banner card displays on first visit        | No consent stored         | Page loads                              | Cookie banner card is visible, fixed bottom-left (desktop) / bottom (mobile)            |
| 2   | Banner hidden after consent stored         | Consent already stored    | Page loads                              | Cookie banner card is not present in the visible DOM                                    |
| 3   | Description text renders                   | Description is configured | Page loads                              | Description text is visible inside the card                                             |
| 4   | Close `×` button dismisses the banner      | Banner card is visible    | User clicks `×`                         | Banner card is hidden; consent may default to reject                                    |
| 5   | "Aceptar todas las cookies" stores consent | Banner card is visible    | User clicks "Aceptar todas las cookies" | Consent stored; banner dismissed                                                        |
| 6   | "Rechazarlas todas" stores minimal consent | Banner card is visible    | User clicks "Rechazarlas todas"         | Only necessary cookies consent stored; banner dismissed                                 |
| 7   | Desktop: 3 buttons in horizontal row       | Viewport ≥ 768px          | Banner is visible                       | All 3 buttons appear in a single horizontal row inside the card                         |
| 8   | Mobile: "Configuración" alone on first row | Viewport < 768px          | Banner is visible                       | "Configuración de cookies" occupies row 1; other 2 buttons appear side-by-side on row 2 |
| 9   | Focus trapped within card                  | Banner card is visible    | User presses Tab repeatedly             | Focus cycles only within the banner card elements                                       |
| 10  | Escape key dismisses the banner            | Banner card is visible    | User presses `Escape`                   | Banner card is dismissed                                                                |

---

## 10. Visual Assets & Screenshots

Desktop and mobile screenshots validated. Component confirmed as a floating white card fixed bottom-left (desktop ~640px) / full-width bottom (mobile). Three teal buttons: "Configuración de cookies" (outlined), "Rechazarlas todas" (filled), "Aceptar todas las cookies" (filled). Close `×` button top-right. No page backdrop. No title, no policy link visible.
