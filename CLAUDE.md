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

## Media & images

**No AI image-generation in this env.** Make images with code; process photos with `sharp` (a dependency). Tools: `sharp`, Chrome (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`). Missing: `magick`, `cwebp`, `exiftool`; `mdls` unreliable.

**"Create an image" (e.g. the `imagegen-frontend-web` skill, blog covers) → render from code, not generation.** HTML/CSS → headless Chrome screenshot → `sharp` webp; don't claim AI/photographic art. Reusable template: **`scripts/covers/generate.mjs`** (add to its `POSTS` array, re-run). Match `src/styles/tokens.css` + brand fonts from `node_modules/@fontsource*` (Space Grotesk / Inter / JetBrains Mono) via `@font-face file://`; semantic colors, no invented hex. Render 2× scale then resize → `.webp({ quality: 82 })`. Chrome: `--headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=2 --window-size=W,H --screenshot=out.png file://page.html`.

**Photo → webp:** `sharp(src).rotate().resize(2400,2400,{fit:'inside',withoutEnlargement:true}).webp({quality:82})`. `.rotate()` bakes EXIF orientation. Metadata (EXIF/GPS/IPTC/XMP) is dropped by default — **never `.withMetadata()` on user photos**; the default is what strips personal data (GPS). q82 / 2400px longest edge = house default ("visually lossless"); true lossless only if asked (it exceeds the JPEG size).

**Galleries:** name `<slug>-NN.webp` (zero-padded) beside the source in `public/images/activities/<cat>/<slug>/`. Order chronologically by EXIF `DateTimeOriginal` — read via `npm install --no-save exif-reader` (don't add to `package.json`); unset-clock cameras (date ~2011) place manually + flag as approximate. Delete original JPEGs. Wire into frontmatter `images: string[]` (`activities` schema; rendered by `src/pages/activities/[...slug].astro`) — display = array order, so reordering needs no re-encode. Adding photos: stage existing aside, merge by capture time, renumber `01..N` (rename existing, encode only new).
