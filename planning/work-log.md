# Work Log

## 2025-02-07

### Phase 1 ✓

- Tokens, base.css, deps verified. Meta desc updated.

### Phase 2 ✓

- Header fixed, mobile menu, footer links, skip link OK.

### Phase 3–6 ✓ (prior)

- Hero with gooey blob, studio cards, highlights. Activities, blog tags. CursorFollower reduced-motion. Dark mode, ThemeToggle.

### Phase 7 ✓

- Footer redesigned: grouped nav (Work, Explore, Connect, Social), hierarchy, links.
- Nav IA: footer has grouping; header stays flat for simplicity.

### Phase 8 ✓

- Header persists across nav (transition:persist).
- TransitionOverlay shows destination name on link click; respects reduced-motion.
- Overlay fades out on astro:page-load.

### Phase 9 ✓

- Schema: narrative, hackathonType, image (optional).
- Events: narrative blockquote when present.
- Hackathons: split by participated/mentored/judged/other.
- Awards: AwardsGallery with GSAP scroll reveal; handles missing image.
- ActivityCard component; line-clamp for long text.

### Phase 10 ✓

- StudioCard: asymmetric variant, reusable.
- StudioBadge: pill labels.
- **ActivityCard: asymmetric variant; shared card styles.
- Index uses StudioCard.**

### Phase 11 ✓

- Studio cards: GSAP scroll reveal with stagger; respects reduced-motion/touch.
- Nav links: CSS underline on hover/focus; reduced-motion fallback.
- AwardsGallery: GSAP scroll reveal (existing).
- Layout main entrance: GSAP (existing).

### Follow-up ✓

- Activities schema: images[] + optional video.
- ActivityCard: media block, category badges, consistent variants.
- AwardsGallery: image-first mosaic; added mock awards.
- Home: proof band + CTA panel for stronger landing flow.
- Blog: series grouped, no category stacking, no repeats.
- Activities: removed case studies; awards 3D rotating gallery (10 images).
- Activities: detail pages added; year grouping per section; cards link to detail.
- Gallery modal: teleported to `<body>` via `<template>` to escape CSS perspective containing block — fixes `position: fixed` bug. Added keyboard nav (Esc/Arrow), scroll lock, backdrop click-to-close. Renamed section "Awards" → "Recognition"; list section wrapped in container.
- Gallery modal removed; carousel is now purely decorative auto-rotating.

### Activities — Doc-style navigation

- Created `ActivityNav` component (pills on mobile, sidebar on desktop) and `ActivityLayout` wrapper.
- Split monolithic `/activities` into per-category pages: `/activities/events`, `/hackathons`, `/speaking`, `/awards`.
- Rewrote `/activities` index as overview with category summary cards (count, latest item).
- Detail page `[...slug].astro` back link now points to parent category.

### ImageGallery component

- New reusable `ImageGallery.astro`: adaptive grid (1–5+ images, LinkedIn-style layouts).
- Fullscreen slider uses native `<dialog>` element (top layer, no z-index battles).
- Arrow nav, keyboard support, counter, captions, backdrop-click-to-close.
- Integrated into activity detail pages replacing raw image grid.

### Experience — Timeline redesign

- Migrated experience data from TypeScript (`src/data/experience.ts`) to content collection (`src/content/experience/*.md`).
- Added `experience` collection schema in `config.ts` (title, company, startDate, endDate?, order, achievements).
- Redesigned `ExperienceItem` as timeline node: vertical line, accent dot (pulsed for current role), card with eyebrow/title/duration-tag/achievements.
- Deleted old `src/data/experience.ts`.

## 2026-02-08

### SEO implementation ✓

- robots.txt: removed Crawl-delay.
- Sitemap: added lastmod for blog, projects, activities; pagination URLs start at page 2.
- Layout: imageWidth/imageHeight, twitter:creator (@verma1300), rel prev/next for pagination, default og:image 1200×630.
- Unique meta descriptions: Home, Blog index, Experience, Activities, Contact, activity detail, blog pagination, blog tag.
- Schema: Person on home; Blog + ItemList on blog index; BlogPosting + BreadcrumbList on blog posts; Article + BreadcrumbList on projects; CollectionPage with absolute URLs; Breadcrumbs component with BreadcrumbList JSON-LD site-wide.
- Blog post OG image fallback: use /og-image.png when no post image.
- Experience: sort by startDate descending (recent first).

### Content and imagery

- Speaking section: use dhruv-speaking.webp.
- Travel bento: use workation-1.png.
- ImageGallery: blurred background fills letterbox space for horizontal images (grid and lightbox).

### Bento animations

- Chat loop: repeatDelay 8s → 2s.
- Community label loop: duration 0.24s → 0.45s, stagger 0.07s → 0.12s, repeatDelay 5s → 3s.


## 2026-11-19

### Illustrated closing CTA

- Replaced the homepage's closing product-sprint panel with the approved rider/bike scene and twenty original Streamline illustrations.
- Reused site fonts, semantic colours and shared theme, with Contact/Projects links and the existing footer below.
- Preserved clear resting illustrations, hover-only emphasis, autonomous float, accessible pause and reduced motion. No scene click or held-selection behavior.
- Checked source hashes, production build (174 pages), desktop/mobile browser behavior, responsive overflow and tyre clearance. See `2026-11-19-illustrated-secondary-cta.md` for validation and the whole-page Lighthouse result.

### Footer refinement and deployment

- Made the scene the homepage footer's top portion, without extra separator lines, pause UI or hover instructions.
- Added small theme-aware blue/yellow hover accents without editing source artwork; muted and integrated the attribution.
- Lowered bike and road together; checked float extrema across five viewport widths, with at most 15px illustration crossing below the road center.
- Preserved system reduced motion, offscreen/background pausing and the original footer on other routes.


### Hover boundaries, scene entrance and travel links

- Replaced hover on moving artwork with fixed hit areas and a forgiving exit margin; scrolling clears the active scene.
- Added a slow, staggered first entrance on scroll, with independent transforms and reduced-motion fallback.
- Added per-photo travel-log links on hover/focus, visible on touch; preserved card dragging. Updated BookBNB to bnbhost.ca/stays/.
- Browser checks cover stationary pointer stability, entrance progression, scroll reset, travel navigation, touch, reduced motion, responsive overflow and the updated destination.
