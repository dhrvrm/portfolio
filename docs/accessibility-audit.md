# Accessibility Audit Report

**Site:** Dhruv Verma Portfolio  
**Date:** February 7, 2025  
**Scope:** Whole website (Layout, Header, Footer, all pages, shared components)

---

## Executive Summary

The portfolio has several accessibility strengths (skip link, focus styles, reduced motion support, semantic HTML) but also issues that affect keyboard users, screen readers, and color contrast. This report groups findings by WCAG 2.2 principles and severity.

---

## 1. Perceivable

### 1.1 Text Alternatives

| Severity     | Issue                                    | Location                                                                                                                     | Remediation                                                                                                                                                                   |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Serious**  | Activity and gallery images use `alt=""` | `ActivityCard.astro`, `ActivitySection.astro`, `PinnedScrollGallery.astro`, `ImageGallery` (when called with `{ src }` only) | Provide descriptive alt text. For cards, use `alt={item.data.title}` or similar. For galleries linked to activity data, pass through alt from the activity title/description. |
| **Moderate** | ImageGallery called without alt          | `activities/[...slug].astro` line 59: `images.map((src) => ({ src }))`                                                       | Map to `{ src, alt: item.data.title + ' — image ' + (i+1) }` or similar.                                                                                                      |
| **Good**     | Hero portrait has descriptive alt        | `index.astro` line 40                                                                                                        | `alt='Portrait of Dhruv Verma'`                                                                                                                                               |
| **Good**     | Decorative SVGs use `aria-hidden="true"` | Hero blob SVG, nav arrows                                                                                                    | ✓                                                                                                                                                                             |
| **Good**     | Projects use `alt={project.data.title}`  | `projects/index.astro`                                                                                                       | ✓                                                                                                                                                                             |

### 1.2 Color & Contrast

| Severity     | Issue                            | Location                                            | Remediation                                                                                                                   |
| ------------ | -------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Moderate** | Muted text contrast not verified | `--color-muted` on `--color-bg` / `--color-surface` | Verify contrast ratios (WCAG AA: 4.5:1 for normal text). Light: `71 85 105` on `248 250 252`; Dark: `163 163 163` on `9 9 9`. |
| **Minor**    | Footer/scrollbar thumb colors    | `base.css`, Layout scrollbar                        | Audit with a contrast checker; consider slightly darker muted for AA.                                                         |

### 1.3 Adaptable

| Severity | Issue                               | Location                          | Remediation |
| -------- | ----------------------------------- | --------------------------------- | ----------- |
| **Good** | `lang="en"` on `<html>`             | `Layout.astro`                    | ✓           |
| **Good** | Logical heading hierarchy (h1 → h2) | Index, Activities, Projects, etc. | ✓           |

### 1.4 Distinguishable

| Severity     | Issue                              | Location                                                              | Remediation |
| ------------ | ---------------------------------- | --------------------------------------------------------------------- | ----------- |
| **Good**     | `:focus-visible` outline           | `tokens.css`                                                          | ✓           |
| **Moderate** | `prefers-reduced-motion` respected | CursorFollower, TransitionOverlay, PinnedScrollGallery | ✓           |

---

## 2. Operable

### 2.1 Keyboard Accessible

| Severity         | Issue                                         | Location                    | Remediation                                                                    |
| ---------------- | --------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| ~~**Critical**~~ | ~~Skip link may not become visible on focus~~ | `Layout.astro`              | **Fixed:** Custom `.skip-link:focus` in `base.css` overrides sr-only on focus. |
| **Good**         | Native `<dialog>` for ImageGallery            | `ImageGallery.astro`        | Escape closes; focus trapped; arrow keys handled in script.                    |
| **Good**         | Buttons and links are focusable               | Header, Footer, ThemeToggle | ✓                                                                              |
| ~~**Moderate**~~ | ~~CursorFollower hides system cursor~~        | `CursorFollower.astro`      | **Fixed:** On Tab key, custom cursor is disabled and system cursor restored.   |

### 2.2 Enough Time

| Severity | Issue                     | Location | Remediation |
| -------- | ------------------------- | -------- | ----------- |
| **Good** | No time limits on content | —        | ✓           |

### 2.3 Seizures & Physical Reactions

| Severity | Issue                     | Location | Remediation |
| -------- | ------------------------- | -------- | ----------- |
| **Good** | No rapid flashing content | —        | ✓           |

### 2.4 Navigable

| Severity | Issue                                        | Location            | Remediation                     |
| -------- | -------------------------------------------- | ------------------- | ------------------------------- |
| **Good** | Skip link present                            | `Layout.astro`      | Fix focus visibility (see 2.1). |
| **Good** | `main` with `id="main-content"`              | `Layout.astro`      | ✓                               |
| **Good** | `scroll-padding-top: 100px` for fixed header | Layout head         | ✓                               |
| **Good** | Page titles unique and descriptive           | Layout `title` prop | ✓                               |

### 2.5 Input Modalities

| Severity     | Issue                                                        | Location             | Remediation                                                                         |
| ------------ | ------------------------------------------------------------ | -------------------- | ----------------------------------------------------------------------------------- |
| **Moderate** | Mobile menu toggle ~36×32px                                  | `Header.astro`       | WCAG 2.2 recommends min 24×24; best practice 44×44. Increase padding to meet 44×44. |
| **Moderate** | ImageGallery close/arrows 40×40 / 36×36 (mobile)             | `ImageGallery.astro` | Arrows are 44×44 desktop, 36×36 mobile. Consider 44×44 minimum on mobile.           |
| **Moderate** | ThemeToggle ~40×40                                           | `ThemeToggle.astro`  | Increase hit area to 44×44.                                                         |
| **Good**     | Footer social links have `min-width: 2.5rem; height: 2.5rem` | `Footer.astro`       | Still under 44px; consider 44×44.                                                   |

---

## 3. Understandable

### 3.1 Readable

| Severity | Issue       | Location | Remediation |
| -------- | ----------- | -------- | ----------- |
| **Good** | `lang="en"` | Layout   | ✓           |

### 3.2 Predictable

| Severity     | Issue                            | Location                        | Remediation                                                                                                      |
| ------------ | -------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Good**     | Consistent nav structure         | Header, Footer                  | ✓                                                                                                                |
| **Moderate** | External links (footer, contact) | `Footer.astro`, `contact.astro` | Have `rel="noopener noreferrer"` ✓. Consider `aria-describedby` or visible "(opens in new tab)" for major links. |

### 3.3 Input Assistance

| Severity | Issue                                                      | Location              | Remediation |
| -------- | ---------------------------------------------------------- | --------------------- | ----------- |
| **Good** | No forms requiring validation                              | Contact is link-based | ✓           |
| **Good** | Copy-code button has `aria-label="Copy code to clipboard"` | Layout script         | ✓           |

---

## 4. Robust

### 4.1 Compatible

| Severity     | Issue                                                                | Location                  | Remediation                      |
| ------------ | -------------------------------------------------------------------- | ------------------------- | -------------------------------- |
| **Good**     | Semantic elements (header, nav, main, footer, section)               | Layout, Header, Footer    | ✓                                |
| **Good**     | Mobile menu: `aria-expanded`, `aria-controls`, `aria-label`          | `Header.astro`            | ✓                                |
| **Good**     | ThemeToggle: `aria-label`, `aria-pressed`                            | `ThemeToggle.astro`       | ✓                                |
| **Good**     | Footer nav: `aria-label` on nav groups, `aria-label` on social links | `Footer.astro`            | ✓                                |
| **Good**     | ImageGallery: `aria-label` on close, prev, next                      | `ImageGallery.astro`      | ✓                                |
| **Good**     | Transition overlay: `aria-hidden="true"`                             | `TransitionOverlay.astro` | ✓                                |
| **Moderate** | SVG attributes: `stroke-width`, `stroke-linecap`                     | Various components        | Valid in HTML; no change needed. |

---

## Priority Remediation Checklist

### Critical

- [x] **Skip link visibility on focus** – ~~Add a custom utility or inline styles so the skip link becomes visible when focused.~~ Fixed in `base.css` with `.skip-link:focus`. Example:

  ```css
  .skip-link:focus {
  	position: fixed;
  	top: 1rem;
  	left: 1rem;
  	z-index: 9999;
  	width: auto;
  	height: auto;
  	padding: 0.5rem 1rem;
  	overflow: visible;
  	clip: auto;
  	white-space: normal;
  }
  ```

  Apply `.skip-link` to the skip link and remove reliance on `focus:not-sr-only` if it has no effect.

### Serious

- [ ] **Alt text for activity and gallery images** – Pass descriptive alt (e.g. activity title + "image N") to `ImageGallery`, `PinnedScrollGallery`, `ActivitySection`, and `ActivityCard`.

### Moderate

- [ ] **Touch targets** – Ensure interactive elements are at least 44×44px (mobile menu, ThemeToggle, footer socials, ImageGallery arrows on mobile).
- [ ] **Color contrast** – Verify muted text meets WCAG AA (4.5:1).
- [ ] **External link indication** – Add "(opens in new tab)" or similar for key external links.

### Minor

- [ ] **Cursor and keyboard** – Consider disabling custom cursor when user is navigating by keyboard (e.g. after Tab/focus use).

---

## Summary Table

| Severity | Count |
| -------- | ----- |
| Critical | 1     |
| Serious  | 1     |
| Moderate | 6     |
| Minor    | 1     |

---

## Tools Used

- Manual code review
- WCAG 2.2 guidelines
- Semantic HTML and ARIA patterns

## Recommended Next Steps

1. Implement the skip link focus visibility fix immediately.
2. Add descriptive alt text for all meaningful images.
3. Run automated tools (e.g. axe, Lighthouse) and fix any additional issues.
4. Test with a screen reader (NVDA, VoiceOver) and keyboard-only navigation.
5. Verify color contrast with a tool like WebAIM Contrast Checker.
