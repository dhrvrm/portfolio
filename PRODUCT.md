# PRODUCT.md

## What this is

Personal portfolio and essay site for Dhruv Verma (dhruvverma.dev). Static Astro 4 site: projects, blog essays (series + standalone), activities, experience. The blog is the living part; essays are lowercase, plain-spoken, illustrated with hand-drawn inline SVG doodles.

## Register

Brand. Design is part of the product; a visitor's impression of craft is the point. Voice: grounded, warm, hand-made, quietly confident. Not corporate, not loud.

## Audience

Hiring managers, peers, and readers arriving from search/social into individual essays. Reading is the primary activity; the article page is the most important surface.

## Existing design system

- Tokens in `src/styles/tokens.css`: semantic CSS variables (`--color-ink`, `--color-muted`, `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-strong`, `--color-on-accent`), space-separated RGB triples, light under `:root`, dark under `:root.dark`.
- Tailwind mapped to those tokens (`ink`, `muted`, `surface`, `border`, `accent`, ...). Use semantic names, never raw hex.
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels/code) via @fontsource. Identity-committed; do not swap.
- Motion: GSAP + ScrollTrigger registered globally in `Layout.astro` (`window.gsap`). Doodles (`svg.blog-doodle`) get scroll-driven draw-on animation. `prefers-reduced-motion` respected.
- Hand-drawn doodle language (see `.claude/skills/blog-doodle`) is the site's signature visual element.

## Constraints

- No client frameworks on content pages beyond what exists; keep pages static and fast.
- SEO is first-class: JSON-LD, canonical, OG images per post.
- Tabs for indentation. Content lives in markdown collections; page templates in `src/pages`.
