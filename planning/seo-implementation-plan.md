# SEO Implementation Plan

**Source:** [docs/seo-audit-whole-website.md](../docs/seo-audit-whole-website.md)  
**Created:** 2025-02-08  
**Last verified:** 2026-02-08

---

## Verification summary (2025-02-08)

| Phase | Status | Notes |
|-------|--------|--------|
| **Phase 1** | Done | robots.txt no Crawl-delay; sitemap has lastmod for blog, projects, activities; canonical from pathname; rel prev/next on blog pagination. |
| **Phase 2** | Done | Layout has imageWidth/imageHeight (default 1200×630 for default OG image); twitter:creator @verma1300; prevHref/nextHref. |
| **Phase 3** | Done | All key pages have unique title + description. Blog index has sr-only H1 "Blog". Contact title unchanged (optional variant not applied). |
| **Phase 4** | Done | Person + WebSite on home ✓; Blog index Blog schema ✓; blog post BlogPosting + BreadcrumbList ✓; projects index/detail absolute URLs + BreadcrumbList ✓; Experience Person with worksFor ✓. |
| **Phase 5** | Done | Blog OG fallback `/og-image.png`; post title suffix " \| Dhruv Verma"; project schema changed to CreativeWork ✓. |
| **Phase 6** | Done | lastmod for activities in sitemap ✓; og:image dimensions in Layout ✓; RSS feed at `/feed.xml` ✓; FAQ/HowTo optional (skipped). |

**Remaining (optional):** Contact title variant "Contact Dhruv Verma | Hire & Collaborate"; FAQ or HowTo schema on step-by-step posts if you add structured content.

---

## Scope

- **In scope:** All on-page SEO (titles, meta descriptions, headings), structured data (JSON-LD), technical fixes (robots.txt, sitemap, canonicals), and Layout-level meta/social (OG, Twitter). Applied across static and dynamic routes (home, blog, projects, experience, activities, contact, tag, pagination).
- **Out of scope:** Content strategy (new posts/pages), GA4/GSC configuration (only documented as tracking suggestions), RSS feed implementation (optional phase), and design/UX changes unrelated to SEO.

## Goals

1. **Discoverability:** Every key page has a unique, intent-aligned title and meta description.
2. **Rich results:** Home, blog index, blog posts, projects index, and project detail have valid JSON-LD (Person, WebSite, Blog/CollectionPage, Article/BlogPosting, BreadcrumbList) with absolute URLs.
3. **Crawlability:** No crawl throttling (robots.txt), sitemap includes lastmod for blog/projects where feasible.
4. **Social:** Consistent OG/Twitter meta and optional image dimensions; twitter creator set.

## Non-goals

- Changing URL structure or adding new routes (except optional RSS).
- Rewriting body copy or adding new content for keywords.
- Implementing site search or SearchAction schema in this plan.

## Success metrics

- **Delivery:** All checklist items in Phases 1–5 completed and verified.
- **Validation:** No invalid or missing required fields in JSON-LD (test via Rich Results Test / Schema Validator).
- **Crawl:** robots.txt and sitemap validated; GSC sitemap submitted (manual step).
- **Optional:** rel prev/next on blog pagination; lastmod in sitemap; RSS feed.

---

## Risks and edge cases

| Risk | Mitigation |
|------|------------|
| Layout receives new props (description, image dimensions) and some pages omit them | Layout already has defaults for description/image; new optional props (e.g. `imageWidth`, `imageHeight`) default to undefined so existing pages unchanged. |
| Blog OG image fallback uses `.png` but assets are `.webp` | Use a single fallback (e.g. default OG image or resolve from slug to actual path) and document in audit. |
| Sitemap lastmod requires a date per URL | Use frontmatter `publishDate` for blog/projects; activity slug pages can use `date`; static pages use build time or omit lastmod. |
| BreadcrumbList and Article schema on blog need correct base URL | Use `Astro.site` or env `SITE` everywhere for absolute URLs. |
| Pagination rel prev/next wrong on first/last page | prev only when page > 1; next only when page < totalPages; canonical always current page. |

## Validation steps (run after each phase or at end)

1. **Structured data:** [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/) on home, one blog post, one project, blog index.
2. **Meta:** View source on key URLs; confirm unique title/description per page type.
3. **Sitemap:** Open `/sitemap-index.xml` and spot-check lastmod on a few blog/project URLs.
4. **robots.txt:** Fetch `https://dhruvverma.dev/robots.txt` and confirm no Crawl-delay.
5. **Absolute URLs in JSON-LD:** Grep or inspect script type="application/ld+json" for `http`/`https` for image and url fields.

---

## Phase 1 — Technical and crawlability

**Goal:** Fix robots.txt and sitemap; ensure canonical and base URL usage are consistent. No new schema yet.

**Dependencies:** None.

### Checklist

- [x] Remove `Crawl-delay: 10` from `public/robots.txt`.
- [x] Add `lastmod` to sitemap entries for blog posts and projects (from frontmatter); keep static pages with optional lastmod or omit.
- [x] Confirm `Layout.astro` canonical uses `Astro.url.pathname` (no trailing slash) and document convention (no trailing slash site-wide).
- [x] (Optional) Add `rel="prev"` / `rel="next"` in `<head>` on blog pagination pages (`/blog/page/[page].astro`) when page > 1 and page < totalPages.

**Validation:** robots.txt no Crawl-delay; sitemap XML has `<lastmod>` for at least blog and project URLs.

---

## Phase 2 — Layout and global meta

**Goal:** Extend Layout so any page can pass description, OG image dimensions, and Twitter creator; set defaults where needed.

**Dependencies:** None.

### Checklist

- [x] Add optional Layout props: `imageWidth`, `imageHeight` (numbers, optional). When present, output `<meta property="og:image:width">` and `og:image:height` (e.g. 1200, 630 for default).
- [x] Add `twitter:creator` to Layout (e.g. `@verma1300`) — from constant or prop.
- [x] Ensure default OG image path `/og-image.png` is correct and file exists (no code change if already correct).
- [x] (Optional) Add `twitter:site` if you have a site handle.

**Validation:** View source on a page; confirm og:image and twitter meta present; optional dimensions on a page that passes them.

---

## Phase 3 — Unique titles and meta descriptions

**Goal:** Every key page passes a unique `title` and `description` to Layout (no generic default for those pages).

**Dependencies:** None. Layout already accepts title and description.

### Checklist

- [x] **Home** (`index.astro`): Pass `description="Software engineer and frontend developer. Portfolio, projects, and writing on React, Node.js, and building products. Based in India."` (or approved copy). Optionally adjust title to "Dhruv Verma — Frontend Developer | Portfolio".
- [x] **Blog index** (`blog/index.astro`): Title "Blog – Dhruv Verma | Writing on Node.js, React & Product". Description "Articles and tutorials on Node.js, React, TypeScript, and building products. By Dhruv Verma." Add visible H1 "Writing" or "Blog"; keep "Posts" as H2.
- [x] **Blog pagination** (`blog/page/[page].astro`): Title "Blog – Page {N} | Dhruv Verma". Description "Blog posts, page {N}. Articles on Node.js, React, and more."
- [x] **Blog tag** (`blog/tag/[tag].astro`): Add description "Posts tagged '{tag}'. By Dhruv Verma." Title already "Tag: {tag} - Dhruv Verma" (optional: "Posts tagged: {tag}" as H1).
- [x] **Experience** (`experience.astro`): Title "Experience | Dhruv Verma – Software Engineer". Description "Work history and roles. Dhruv Verma – software engineer, frontend lead, and product builder."
- [x] **Activities index** (`activities/index.astro`): Title "Activities | Events, Speaking & Travel – Dhruv Verma". Description one sentence summarizing events, hackathons, speaking, awards, travel.
- [x] **Activity detail** (`activities/[...slug].astro`): Pass `description` from `item.data.summary` (truncate to ~155 chars).
- [x] **Contact** (`contact.astro`): Description "Get in touch with Dhruv Verma for collaboration, speaking, or hiring. Email and LinkedIn." Optional title "Contact Dhruv Verma | Hire & Collaborate".

**Validation:** View source on each page type; confirm unique title and description.

---

## Phase 4 — Structured data (schema)

**Goal:** Add and fix JSON-LD so home, blog index, blog post, projects index, and project detail have valid schema with absolute URLs.

**Dependencies:** Phase 1 (base URL convention). Use `Astro.site` or `import.meta.env.SITE` for all absolute URLs.

### Checklist

- [x] **Home** (`index.astro`): Add Person JSON-LD (name, jobTitle, url, sameAs, description). [x] WebSite JSON-LD (name, url, description).
- [x] **Blog index** (`blog/index.astro`): Add Blog or CollectionPage with mainEntity ItemList: list blog posts (name, url absolute, datePublished).
- [x] **Blog post** (`blog/[...slug].astro`): Add Article or BlogPosting: headline, description, image (absolute URL from post.data.image or default), datePublished, author (Person name + url). Add BreadcrumbList (Home > Blog > post title).
- [x] **Projects index** (`projects/index.astro`): In existing CollectionPage/ItemList, ensure each item’s image and url are absolute (e.g. `new URL(project.data.image, Astro.site).toString()` and same for project URL).
- [x] **Project detail** (`projects/[slug].astro`): Fix image in existing schema to absolute URL. Add BreadcrumbList (Home > Projects > project title).
- [x] **Experience** (optional): Add Person or ProfilePage with worksFor/jobTitle if desired; lower priority.

**Validation:** Rich Results Test / Schema Validator on home, one blog post, one project, blog index. All image and url values must be absolute.

---

## Phase 5 — Blog post OG image and small fixes

**Goal:** Align blog post OG image fallback with actual assets; optional schema tweaks.

**Dependencies:** Phase 4 (blog post schema already uses absolute image).

### Checklist

- [x] **Blog post OG image** (`blog/[...slug].astro`): Fallback is currently `post.data.image || \`/blogs/${post.slug}.png\``. Change to use default site OG image when `!post.data.image`, or resolve path to existing asset (e.g. .webp if that’s the convention). Document in audit.
- [x] **Blog post title:** Optionally append " | Dhruv Verma" to post title in Layout or in page (if not already).
- [x] **Project schema type:** Optionally change project detail from Article to CreativeWork if it fits content better (audit suggested this).

**Validation:** Share one blog post with and without frontmatter image; confirm OG image correct. Re-run schema validator.

---

## Phase 6 — Optional enhancements

**Goal:** lastmod in sitemap (if not done in Phase 1), RSS feed, og:image dimensions on Layout when image is known.

**Dependencies:** Phase 1 (sitemap), Phase 2 (Layout).

### Checklist

- [x] Sitemap: Ensure lastmod for activities (from activity date) if not already in Phase 1.
- [x] Add RSS/Atom feed for blog (e.g. `/blog/feed.xml` or `/feed.xml`) listing recent posts with title, link, description, date.
- [x] When Layout receives image and imageWidth/imageHeight, output og:image:width and og:image:height (Phase 2 may already cover this).
- [ ] (Optional) FAQ or HowTo schema on specific blog posts that are step-by-step guides — only if you add structured FAQ/how-to content.

**Validation:** RSS feed loads and has valid items; sitemap lastmod present where expected.

---

## Execution notes

- **Batches:** Execute Phase 1 → 2 → 3 → 4 → 5 in order. Phase 6 can be done anytime after Phase 2/3.
- **Verification:** After each phase, run the validation steps for that phase; before closing, run the full "Validation steps" list above.
- **Summary:** After completion, update the audit doc or this plan with "Implemented on …" and any deviations (e.g. skipped optional phases).
