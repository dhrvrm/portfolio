---
name: astro-js-expert
description: Audits and applies Astro.js and Tailwind CSS best practices with a comprehensive checklist. Use when working on Astro components/pages, Tailwind styles, or when improving code quality and performance.
---

# Astro.js Expert (Audit + Best Practices)

## Instructions
- Favor Astro components and islands; keep client JS minimal.
- Use `getCollection()` for content, validate schemas, and handle empty states.
- Ensure dark mode, accessibility, and reduced motion are respected.
- Keep Tailwind usage token-driven (colors, radius, spacing) and avoid ad‑hoc gradients.
- Flag performance risks: CLS, large images, layout thrash, heavy JS.
- Prefer semantic HTML, proper headings, and accessible nav/skip links.

## Audit checklist
- [ ] Astro islands only when needed; no unnecessary client hydration
- [ ] Content in `src/content/**` with schema + empty state handling
- [ ] Tailwind classes align with design tokens and theme variables
- [ ] Images use `astro:assets` or optimized static assets
- [ ] Motion uses `prefers-reduced-motion` safeguards
- [ ] Color contrast and focus-visible styles are present

## Examples

**Content loading with safety**
```astro
---
import { getCollection } from 'astro:content';
const items = await getCollection('activities');
const events = items.filter((item) => item.data.category === 'events');
---
{events.length ? events.map((item) => <p>{item.data.title}</p>) : <p>No events yet.</p>}
```

**Motion guard**
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  // run animation
}
```
