# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to ./dist/
npm run preview   # Preview the production build locally
npm run astro -- --help   # Astro CLI (e.g. `npm run astro add`, `astro check`)
```

There is no test suite, linter, or formatter configured. Validation is `npm run build` (catches content-schema and type errors) plus visual review via `npm run dev`.

## Project

Personal portfolio for Dhruv Verma — a static **Astro 4** site deployed at `https://dhruvverma.dev`. React, GSAP, and Tailwind are layered on top. There is no backend; all data is file-based content collections.

## Architecture

### Content collections are the data layer

All user-facing content lives as markdown under `src/content/**`, never hardcoded in components or pages. Four collections are defined with Zod schemas in `src/content/config.ts`:

- **projects** — case studies (`challenge`/`solution`/`impact`, `category: client|personal`)
- **blog** — articles with `series`/`seriesPart`, optional `howTo` and `faqs` for SEO rich results
- **activities** — `category: events|hackathons|speaking|awards|travel`; events nest under year folders
- **experience** — work history sorted by an explicit `order` field

Pages load content with `getCollection()` and filter/group/sort by frontmatter. When adding a content type or field, update the schema in `config.ts` first — the build fails on schema mismatch. Always handle empty states and missing optional fields (per `.cursor/rules/content-delivery.mdc`).

### Layout.astro is the single page shell

`src/layouts/Layout.astro` wraps every page and owns:
- All SEO meta (canonical URL, Open Graph, Twitter cards) driven by `title`/`description`/`image`/`article` props
- Inline theme bootstrap (reads `localStorage.theme` / `prefers-color-scheme`, toggles `.dark` on `<html>` before paint to avoid flash)
- Google Analytics via `@astrojs/partytown` (off-main-thread)
- Global clipboard buttons injected into all code blocks on `DOMContentLoaded`
- Page-transition overlay and `CursorFollower`

`ActivityLayout.astro` composes `Layout` and adds the activities sub-navigation with per-category counts. Pass `prevHref`/`nextHref` to `Layout` for paginated `rel=prev/next`.

### Theming via CSS custom properties

Tailwind colors (`ink`, `muted`, `surface`, `border`, `accent`, `accentStrong`, `onAccent`) and radii map to CSS variables defined in `src/styles/tokens.css`. Light values live under `:root`, dark under `:root.dark` (class-based dark mode). **Use the semantic Tailwind color names, not raw hex**, so both themes work. Variables are space-separated RGB triples consumed via `rgb(var(--color-x) / <alpha>)`.

### Animation

GSAP with `ScrollTrigger` is registered globally in `Layout.astro` and exposed as `window.gsap` / `window.ScrollTrigger`. Component scripts use these globals for scroll-driven animation (e.g. `PinnedScrollGallery`).

### SEO is a first-class concern

JSON-LD structured data is emitted per page (Breadcrumbs, index, blog, projects, experience). Blog posts opt into HowTo/FAQPage rich results through `howTo`/`faqs` frontmatter — only add schema for content actually rendered on the page, and align `howTo` steps with the post's visible H2s (see `.cursor/rules/blog-seo-howto-faq.mdc` and `docs/seo-how-to-and-faq.md`). `sitemap-index.xml.ts` and `feed.xml.ts` generate the sitemap and RSS feed. `docs/seo-audit-whole-website.md` and `docs/accessibility-audit.md` track standing requirements.

## Conventions

- **Site-wide values** (author name, bio, social links) live in `src/data/constants.ts` (`AUTHOR`). Reuse them rather than duplicating.
- **Tabs** for indentation across `.astro`/`.ts` files.
- **Planning docs** in `planning/` follow a phased checklist structure (scope → phases → validation); `work-log.md` is the running log. See `.cursor/rules/planning-optimizer.mdc`.
- Static assets go in `public/`; routes are file-based under `src/pages/`.
