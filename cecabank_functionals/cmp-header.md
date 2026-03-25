# cmp-header - Functional Documentation

> Functional specification for the `cmp-header` component — Cecabank homepage

---

## Table of Contents

- [cmp-header - Functional Documentation](#cmp-header---functional-documentation)
    - [Table of Contents](#table-of-contents)
    - [1. Description](#1-description)
    - [2. Component Structure](#2-component-structure)
    - [3. Flows and Behavior](#3-flows-and-behavior)
        - [Header bar (always visible — both breakpoints)](#header-bar-always-visible--both-breakpoints)
        - [Nav drawer panel (right-side overlay)](#nav-drawer-panel-right-side-overlay)
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

The `cmp-header` is the primary site navigation component, displayed at the top of every page. It contains the Cecabank logo on the left and a "MENÚ" label with a hamburger icon on the right — **identical layout on both mobile and desktop**. Clicking the MENÚ trigger opens a right-side overlay drawer panel containing the full navigation: a language switcher, a search bar, expandable main nav items (each with title and subtitle), secondary utility links, and a cookie preferences shortcut. There is no traditional inline horizontal navigation bar at any breakpoint.

---

## 2. Component Structure

```
ui.apps/src/main/content/jcr_root/apps/repsol-demo-ia/components/content/cmp-header/
├── cmp-header.html
├── .content.xml
└── _cq_dialog/
    └── .content.xml

ui.frontend/src/main/webpack/components/content/cmp-header/
├── cmp-header.scss
└── cmp-header.js
```

---

## 3. Flows and Behavior

### Header bar (always visible — both breakpoints)

- **Initial load:** Header renders with Cecabank logo (left) and "MENÚ ≡" trigger (right) — identical on both mobile and desktop. There is NO inline horizontal navigation at any breakpoint.
- **Logo link:** Always navigates to the homepage (`/`).
- **MENÚ trigger:** Combines a "MENÚ" text label and a hamburger icon (≡). Clicking it opens the nav drawer panel.

### Nav drawer panel (right-side overlay)

- **Open:** Clicking "MENÚ ≡" opens a right-side drawer that overlays the page content (does NOT push content). A semi-transparent backdrop covers the rest of the page.
- **Close:** The panel closes when the user clicks the **X** button (top right of the panel), clicks outside the panel (on the backdrop), or presses `Escape`.
- **Language switcher:** Displayed at the top of the panel — "ES | EN | PT". Clicking a language code switches the site language.
- **Search bar:** Below the language switcher. Placeholder text "¿Qué estás buscando?". Submitting initiates a site search.
- **Main navigation (expandable items):** Each item has a **title** (link) and a **subtitle** (description), plus a **chevron (▼)** if it has child pages. Detected items:
    - "Podemos ayudarte ▼" / subtitle: "Nuestros servicios"
    - "¿Por qué Cecabank? ▼" / subtitle: "Sobre nosotros"
    - "Cecabank al día ▼" / subtitle: "Actualidad y sala de prensa"
    - "¿Hablamos?" / subtitle: "Contacto" (no children)
- **Expandable submenu:** Clicking a chevron item expands its child links in-place within the panel. Only one group can be open at a time (accordion pattern). Clicking the same item again collapses it.
- **Secondary utility links** (below a visual divider): plain link list — "Información corporativa", "Informe de mercados", "Oficina de cambio de divisas", "Banca electrónica", "Portal de proveedores".
- **Cookie preferences icon:** A floating circular button (cookie icon) at the bottom-left corner of the panel. Clicking it opens the cookie preferences panel.

---

## 4. AEM Configuration (Dialog)

| Field                 | Type       | Required | Description                                          |
| --------------------- | ---------- | -------- | ---------------------------------------------------- |
| Logo image            | image      | Yes      | SVG or PNG brand logo                                |
| Logo alt text         | text       | Yes      | Accessible alt text for the logo                     |
| Logo link URL         | pathfield  | Yes      | Destination URL (default: `/`)                       |
| MENÚ trigger label    | text       | Yes      | Label next to hamburger icon (default: "MENÚ")       |
| Languages             | multifield | Yes      | Available language options                           |
| ↳ Language code       | text       | Yes      | Language code displayed (e.g., "ES")                 |
| ↳ Language URL        | pathfield  | Yes      | Root path of the language site                       |
| ↳ Active              | checkbox   | No       | Marks the current active language                    |
| Search placeholder    | text       | No       | Placeholder for the search field (i18n key)          |
| Search action URL     | pathfield  | Yes      | URL that handles the search query                    |
| Main navigation items | multifield | Yes      | Expandable nav entries                               |
| ↳ Nav title           | text       | Yes      | Visible link text (e.g., "Podemos ayudarte")         |
| ↳ Nav subtitle        | text       | No       | Description below title (e.g., "Nuestros servicios") |
| ↳ Nav URL             | pathfield  | Yes      | Destination URL                                      |
| ↳ Has children        | checkbox   | No       | Shows chevron and activates submenu accordion        |
| ↳ Child links         | multifield | No       | Sub-navigation links (if Has children = true)        |
| ↳↳ Child label        | text       | Yes      | Child link text                                      |
| ↳↳ Child URL          | pathfield  | Yes      | Child link destination                               |
| Secondary links       | multifield | No       | Utility links below the divider                      |
| ↳ Link label          | text       | Yes      | Link text                                            |
| ↳ Link URL            | pathfield  | Yes      | Destination URL                                      |
| ↳ Link target         | checkbox   | No       | Open in new tab                                      |

---

## 5. Accessibility (WCAG 2.1 AA)

### ARIA Roles & Labels

- Root `<header>` uses `role="banner"`.
- MENÚ trigger is a `<button>` with `aria-expanded="false|true"` and `aria-controls="nav-drawer-id"`.
- Nav drawer panel uses `role="dialog"` with `aria-modal="true"` and `aria-label="Main navigation"`.
- Language switcher rendered as a `<nav>` with `aria-label="Language selector"`.
- Search field: `<input type="search">` with associated `<label>` (visually hidden if needed).
- Main nav list uses `<ul>` / `<li>`. Items with children use `<button>` (not `<a>`) for the accordion trigger, with `aria-expanded` per item.
- Active language code uses `aria-current="true"`.
- Cookie icon button: `aria-label="Cookie preferences"`.
- Logo image: non-empty `alt` attribute required.

### Keyboard Navigation

| Key                 | Action                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| `Tab`               | Focus: logo → MENÚ button                                                                                 |
| `Enter` / `Space`   | Open / close the nav drawer                                                                               |
| `Tab` (drawer open) | Cycle through: language links → search field → nav items → secondary links → close button → cookie button |
| `Enter` / `Space`   | Expand/collapse an accordion nav item; follow a link                                                      |
| `Escape`            | Close the nav drawer; return focus to MENÚ button                                                         |

### Color Contrast

- Header bar background `#FFFFFF`: logo and "MENÚ" text minimum **4.5:1** ratio.
- Drawer panel background: nav item text on white minimum **4.5:1** ratio.
- Language links (corporate blue on white): minimum **4.5:1** ratio.
- Search field placeholder: minimum **4.5:1** ratio against field background (WCAG AA for placeholder).

### Screen Reader

- When the drawer opens, focus moves programmatically to the first focusable element inside (language switcher or close button).
- Focus is trapped within the drawer while it is open; background content receives `aria-hidden="true"`.
- When the drawer closes, focus returns to the MENÚ trigger button.
- Accordion state changes communicated via `aria-expanded` on the trigger button.

---

## 6. Responsive Design

| Breakpoint        | Header bar layout              | Nav drawer behavior                                               |
| ----------------- | ------------------------------ | ----------------------------------------------------------------- |
| Mobile (< 768px)  | Logo (left) + "MENÚ ≡" (right) | Full-height right drawer; panel width ≈ 100% viewport width       |
| Desktop (≥ 768px) | Logo (left) + "MENÚ ≡" (right) | Right drawer; panel width fixed (≈ 380px–420px); backdrop overlay |

> **Key rule:** There is no inline horizontal navigation at any breakpoint. The MENÚ drawer is the only navigation mechanism.

---

## 7. Style Requirements

| Token                          | Value                                      |
| ------------------------------ | ------------------------------------------ |
| Header bar background          | `#FFFFFF`                                  |
| Header bar height              | `64px` (desktop) / `56px` (mobile)         |
| Logo max-height                | `36px`                                     |
| Logo color                     | Corporate blue + teal (brand SVG)          |
| MENÚ label color               | Corporate dark (`#1A3558` approx.)         |
| MENÚ label font-size           | `14px`                                     |
| MENÚ label font-weight         | `600`                                      |
| Hamburger icon color           | Corporate dark                             |
| Drawer background              | `#FFFFFF`                                  |
| Drawer width (desktop)         | `420px`                                    |
| Drawer width (mobile)          | `100vw`                                    |
| Drawer z-index                 | `2000`                                     |
| Backdrop color                 | `rgba(0, 0, 0, 0.4)`                       |
| Drawer shadow                  | `−4px 0 24px rgba(0,0,0,0.15)` (left edge) |
| Language code color (active)   | Corporate dark                             |
| Language code color (inactive) | Corporate blue / teal (`#00A8B5` approx.)  |
| Nav item title color           | Corporate blue / teal                      |
| Nav item subtitle color        | `#5A5A5A`                                  |
| Nav item title font-size       | `18px`                                     |
| Nav divider color              | `rgba(0,0,0,0.1)`                          |
| Secondary link color           | Corporate blue / teal                      |
| Secondary link font-size       | `14px`                                     |
| Cookie button size             | `40px` circle; corporate blue border       |

---

## 8. Integration & Technical Stack

### 8.1 Frontend Stack

- **HTL:** Renders header bar (logo + MENÚ button) and drawer panel (language links, search input, main nav `data-sly-list`, secondary links `data-sly-list`, cookie button). Drawer rendered in DOM on page load but hidden via CSS; shown by JS class toggle.
- **JavaScript (vanilla ES6+):** Drawer open/close toggle on MENÚ button click; backdrop click close; `Escape` key close; accordion expand/collapse per main nav item (single-open pattern); focus trap within open drawer (`Tab` / `Shift+Tab` cycling); `data-initialized` guard. Dispatches `navDrawerOpen` / `navDrawerClose` custom events.
- **SCSS (BEM):** Root block `.cmp-header`; elements: `__bar`, `__logo`, `__menu-trigger`, `__menu-label`, `__menu-icon`, `__drawer`, `__drawer-close`, `__lang-switcher`, `__lang-item`, `__search`, `__nav-list`, `__nav-item`, `__nav-title`, `__nav-subtitle`, `__nav-chevron`, `__nav-children`, `__secondary-links`, `__cookie-btn`, `__backdrop`. Modifiers: `__drawer--open`, `__nav-item--expanded`.

### 8.2 Backend Stack

- **Sling Model:** `HeaderModel` extending `AbstractComponentImpl`. Exposes: `logoImagePath`, `logoAlt`, `logoLinkUrl`, `menuLabel`, `languages` (List<LanguageItem>), `searchActionUrl`, `searchPlaceholder`, `navItems` (List<NavItem> — each with `title`, `subtitle`, `url`, `hasChildren`, `children` List<NavChild>), `secondaryLinks` (List<LinkItem>).
- **Unit tests:** JUnit 5 + Mockito. Coverage ≥ 80%.
- **Logging:** Log4j2 only.

### 8.3 Authorization & Security

- Publicly accessible. No authentication required.
- Secondary external links use `rel="noopener noreferrer"`.
- Search input sanitised on the server-side before processing; no injection risk from client input.

### 8.4 Clientlib Integration

- CSS loaded at `<head>` top via HTL `<sly>` tag.
- JS loaded at bottom of component HTL with `defer=true`.

---

## 9. Testing

| #   | Scenario                                         | Given                           | When                           | Then                                                                              |
| --- | ------------------------------------------------ | ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| 1   | Logo renders and links to homepage               | Page is loaded                  | Header bar is visible          | Logo image is displayed with alt text; clicking logo navigates to `/`             |
| 2   | MENÚ trigger renders on desktop                  | Viewport ≥ 768px                | Page loads                     | "MENÚ" label and hamburger icon are visible on the right of the header bar        |
| 3   | MENÚ trigger renders on mobile                   | Viewport < 768px                | Page loads                     | "MENÚ" label and hamburger icon are visible; no inline nav is present             |
| 4   | Nav drawer opens on MENÚ click                   | Header is rendered              | User clicks MENÚ trigger       | Right-side drawer slides in; backdrop appears; drawer is visible                  |
| 5   | Nav drawer closes on X button click              | Drawer is open                  | User clicks the X close button | Drawer hides; backdrop disappears; focus returns to MENÚ button                   |
| 6   | Nav drawer closes on Escape key                  | Drawer is open                  | User presses Escape            | Drawer hides; focus returns to MENÚ button                                        |
| 7   | Language switcher renders with correct languages | ES, EN, PT configured           | Drawer is open                 | Three language codes are displayed; active language is visually distinct          |
| 8   | Search bar is present and focusable              | Drawer is open                  | User tabs to the search field  | Search input is focused and displays the placeholder text                         |
| 9   | Expandable nav item expands on click             | "Podemos ayudarte" has children | User clicks the nav item       | Child links appear below the item; chevron rotates; other items stay collapsed    |
| 10  | Secondary utility links render inside drawer     | Secondary links configured      | Drawer is open                 | "Banca electrónica", "Información corporativa" etc. are visible below the divider |

---

## 10. Visual Assets & Screenshots

Reference screenshots provided: desktop header bar (collapsed), mobile header bar (collapsed), and nav drawer panel open (mobile). Additional screenshots of the drawer in submenu-expanded state and with the cookie icon visible should be captured during visual QA.
