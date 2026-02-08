# SEO Audit — Whole Website (dhruvverma.dev)

**Date:** February 8, 2025  
**Scope:** All pages, content collections, technical setup, and discoverability.

---

## 1. Target keyword and intent mapping

| Page / Section | Primary intent | Target queries (examples) | Priority |
|----------------|----------------|---------------------------|----------|
| **Home** | Brand + portfolio discovery | "Dhruv Verma", "Dhruv Verma developer", "frontend developer portfolio" | High |
| **Projects index** | Work samples, hiring | "Dhruv Verma projects", "React developer portfolio", "frontend developer work" | High |
| **Project [slug]** | Case study / hiring | "[Project name] case study", "Dhruv Verma [company/project]" | Medium |
| **Blog index** | Content hub, expertise | "Dhruv Verma blog", "Node.js blog", "frontend articles" | High |
| **Blog post** | Informational / tutorial | Long-tail: "building production Node.js backend 2025", "npm package publishing guide", "mentoring college students" | High |
| **Experience** | Hiring, credibility | "Dhruv Verma experience", "software engineer experience" | Medium |
| **Activities** | Community, speaking, hiring | "Dhruv Verma speaking", "React Delhi", "hackathon mentor" | Medium |
| **Contact** | Conversion | "contact Dhruv Verma", "hire Dhruv Verma" | Medium |
| **Blog tag/category** | Topic discovery | "Node.js articles", "TypeScript tutorials" (via tag pages) | Low–Medium |

**Intent summary:** The site supports **brand (name)**, **portfolio/work**, and **blog/topical** intent. Strongest SEO opportunity is blog content (tutorials, guides) and project case studies; home and section pages should reinforce name + role + differentiators.

---

## 2. On-page recommendations

### 2.1 Home (`/`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Dhruv Verma - Frontend Developer" | Keep; consider adding site name: "Dhruv Verma — Frontend Developer \| Portfolio" for consistency with other pages. |
| **Meta description** | Layout default (generic) | Pass a **page-specific** description from `index.astro`, e.g. "Software engineer and frontend developer. Portfolio, projects, and writing on React, Node.js, and building products. Based in India." |
| **H1** | "Engineering thoughtful software while living a curious, human life." | Strong and unique. Ensure only one H1. |
| **Headings** | "Track record", "Featured projects", etc. | Structure is clear. Add an **optional** visible H2 for "About" or "Work" if you add a short bio section for snippet clarity. |
| **Internal links** | Projects, Contact, nav | Good. Add a text link to `/blog` and `/experience` in the hero or proof band if not redundant with nav. |
| **Schema** | None | Add **JSON-LD Person** (and optionally **WebSite**) on home: name, jobTitle, url, sameAs (social), description. Helps brand panels and knowledge graph. |

### 2.2 Blog index (`/blog`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Blog - Dhruv Verma" | Improve: "Blog – Dhruv Verma \| Writing on Node.js, React & Product" (or your main topics). |
| **Meta description** | Layout default | Override with: "Articles and tutorials on Node.js, React, TypeScript, and building products. By Dhruv Verma." |
| **H1** | Missing; "Posts" is H2 | Add a single **H1**, e.g. "Writing" or "Blog", and keep "Posts" as H2. |
| **Schema** | None | Add **CollectionPage** or **Blog** schema with `mainEntity` ItemList of blog posts (title, url, datePublished). |

### 2.3 Blog post (`/blog/[...slug]`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | `post.data.title` | Good. Consider suffix: " \| Dhruv Verma" for brand (already common pattern). |
| **Meta description** | `post.data.excerpt` | Good. Ensure excerpts are 150–160 chars and include a primary keyword where natural. |
| **OG image** | `post.data.image` or `/blogs/${slug}.png` | Verify fallback path: content uses `.webp` (e.g. `/blogs/ultimate-guide-....webp`). Fallback uses `.png`; align to actual assets or use a default OG image. |
| **Schema** | None | Add **Article** or **BlogPosting** JSON-LD: headline, description, image (absolute URL), datePublished, dateModified (if you have it), author (Person with name/url). |
| **Breadcrumbs** | Present (nav) | Add **BreadcrumbList** JSON-LD for rich results. |
| **Canonical** | Via Layout | Ensure `canonicalURL` uses path without trailing slash consistently (e.g. `/blog/my-post`). |

### 2.4 Blog pagination (`/blog/page/[page]`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Blog, Page {N} - Dhruv Verma" | Prefer "Blog – Page {N} \| Dhruv Verma" and add meta description: "Blog posts, page {N}. Articles on Node.js, React, and more." |
| **Canonical** | Layout | Set **canonical to current page** (e.g. `/blog/page/2`). Add **rel prev/next** for page 2+ (prev=/blog or /blog/page/(n-1), next=/blog/page/(n+1)). |

### 2.5 Blog tag (`/blog/tag/[tag]`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Tag: {tag} - Dhruv Verma" | Good. Add meta description: "Posts tagged '{tag}'. By Dhruv Verma." |
| **H1** | Tag name | Good. Optional: "Posts tagged: {tag}" for clarity. |

### 2.6 Projects index (`/projects`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Projects - Dhruv Verma \| Frontend Developer Portfolio" | Good. |
| **Meta description** | Good, specific. | Keep. |
| **Schema** | CollectionPage + ItemList | Good. Ensure **image** in each ListItem uses **absolute URL** (e.g. `https://dhruvverma.dev${project.data.image}`). |

### 2.7 Project detail (`/projects/[slug]`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "{title} - Project by Dhruv Verma" | Good. |
| **Schema** | Article with headline, description, image | **Image** must be **absolute URL** for Google (e.g. `new URL(project.data.image, Astro.site).toString()`). Consider **CreativeWork** or **Project** type if it fits your content better than Article. |
| **Breadcrumbs** | Present | Add **BreadcrumbList** JSON-LD. |

### 2.8 Experience (`/experience`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Experience - Dhruv Verma" | Consider "Experience \| Dhruv Verma – Software Engineer" for keyword. |
| **Meta description** | Layout default | Override: "Work history and roles. Dhruv Verma – software engineer, frontend lead, and product builder." |
| **Schema** | None | Add **Person** with **worksFor** / **jobTitle** or **ProfilePage** with structured experience if you want rich results. |

### 2.9 Activities index & detail

| Item | Current | Recommendation |
|------|--------|----------------|
| **Activities index** | "Activities - Dhruv Verma" | Title: "Activities \| Events, Speaking & Travel – Dhruv Verma". Add meta description summarizing events, hackathons, speaking, awards, travel. |
| **Activity detail** | "{title} - Dhruv Verma" | Add **meta description** from `item.data.summary` (e.g. first 155 chars). Add **Event** or **Article** schema where appropriate (e.g. for events). |

### 2.10 Contact (`/contact`)

| Item | Current | Recommendation |
|------|--------|----------------|
| **Title** | "Contact - Dhruv Verma" | Good. Optional: "Contact Dhruv Verma \| Hire & Collaborate". |
| **Meta description** | Layout default | Override: "Get in touch with Dhruv Verma for collaboration, speaking, or hiring. Email and LinkedIn." |

---

## 3. Technical SEO checklist

### 3.1 Crawlability & indexing

| Check | Status | Action |
|-------|--------|--------|
| **robots.txt** | Present, allows `/`, sitemap declared | Remove **Crawl-delay: 10**. Google ignores it; it can slow other crawlers unnecessarily. |
| **Sitemap** | Custom `sitemap-index.xml.ts`, URLSet | Good. Add **lastmod** (and optionally **changefreq**) for important URLs (blog, projects) so crawlers prioritize fresh content. |
| **Canonical** | In Layout, from `Astro.url.pathname` | Ensure no duplicate content: same URL with/without trailing slash. Astro default is no trailing slash; keep one convention site-wide. |
| **Internal links** | Header, footer, in-content | Good. Add 1–2 contextual links from home to key content (e.g. "Latest post", "Featured project"). |

### 3.2 URLs

| Check | Status | Action |
|-------|--------|--------|
| **Structure** | Clean: `/blog/slug`, `/projects/slug`, `/activities/slug` | Good. |
| **Tag pages** | `/blog/tag/kebab-case` | Good. Ensure 404 or redirect for empty/invalid tags. |

### 3.3 Meta & social

| Check | Status | Action |
|-------|--------|--------|
| **OG/Twitter** | In Layout (title, description, image) | Good. Add **og:image:width** and **og:image:height** (e.g. 1200×630) where possible for predictable previews. |
| **Twitter handle** | Not set | Add **twitter:site** or **twitter:creator** (e.g. @verma1300) for attribution. |
| **Default OG image** | `/og-image.png` | Ensure file exists and is at least 1200×630. |

### 3.4 Schema (structured data)

| Check | Status | Action |
|-------|--------|--------|
| **Home** | None | Add **Person** + optional **WebSite** (with potential **SearchAction** if you add search). |
| **Blog index** | None | Add **Blog** or **CollectionPage** + ItemList. |
| **Blog post** | None | Add **Article** / **BlogPosting** + **BreadcrumbList**; image and author as absolute URLs. |
| **Projects index** | CollectionPage + ItemList | Fix image URLs to absolute. |
| **Project detail** | Article | Fix image to absolute URL; add **BreadcrumbList**; consider **CreativeWork** type. |

### 3.5 Performance & Core Web Vitals (indirect SEO)

| Check | Status | Action |
|-------|--------|--------|
| **Images** | WebP, some `astro:assets` Image | Good. Ensure all content images have **width/height** or **aspect-ratio** to avoid CLS. |
| **Fonts** | @fontsource, likely preloaded | Consider **preconnect** to font origin if external; keep font-display for text. |
| **GA** | Partytown, G-3VCWW3H8PM | Good. Ensure GA4 property is linked to Search Console and no critical content is behind heavy JS that blocks indexing. |

### 3.6 Mobile & UX

| Check | Status | Action |
|-------|--------|--------|
| **Viewport** | Set in Layout | Good. |
| **Web manifest** | site.webmanifest, theme_color | Good. **theme_color** and **background_color** are #ffffff; consider matching a brand color or dark theme for consistency. |

### 3.7 Content & duplicate content

| Check | Status | Action |
|-------|--------|--------|
| **Unique titles/descriptions** | Per-page where set | Ensure every generated page (all blog, all projects, all activities, tag, pagination) has a **unique** title and, where possible, description. |
| **RSS** | Not seen | Optional: add RSS/Atom feed for blog for discovery and syndication. |

---

## 4. Measurable improvements and tracking

### 4.1 Quick wins (implement first)

1. **Add Person + WebSite schema on home** — supports brand and sitelinks.
2. **Absolute URLs in all JSON-LD** — especially `image` on projects and project detail.
3. **Remove Crawl-delay from robots.txt** — avoid unnecessary crawl throttling.
4. **Unique meta descriptions** for: Home, Blog index, Experience, Activities index, Contact, and all activity detail pages.
5. **Blog post and project BreadcrumbList** — better SERP display and navigation signals.
6. **Article/BlogPosting schema** on blog posts with author and absolute image.

### 4.2 Tracking suggestions

| Goal | Suggestion |
|------|------------|
| **Search visibility** | Google Search Console: verify property for `https://dhruvverma.dev`, submit sitemap, monitor Coverage and Enhancements (e.g. Breadcrumbs, Article). |
| **Traffic by intent** | GA4: segment by landing page (e.g. /blog vs /projects vs /) and by source (organic). Create custom dimension or event for "contact click" from contact page. |
| **Content performance** | GSC: track impressions/clicks by URL and by query for blog and project pages. Prioritize content with high impressions and low CTR for title/description tests. |
| **Conversions** | GA4: mark "Contact" actions (email click, LinkedIn click) as events or conversions to tie SEO to outcomes. |

### 4.3 Optional enhancements

- **RSS feed** for blog for `/blog` and tag pages.
- **lastmod** in sitemap for blog and projects (from frontmatter `publishDate` or a dedicated `updated` field).
- **rel prev/next** on blog pagination.
- **FAQ or HowTo** schema on posts that are step-by-step guides, if you add dedicated FAQ/how-to sections.
- **og:image dimensions** in Layout when image is known (e.g. 1200×630 default).

---

## 5. Summary

| Area | Grade | Notes |
|------|--------|--------|
| **URLs & structure** | A | Clean, logical, good internal linking. |
| **Titles & meta** | B | Many pages use generic Layout description; key pages need unique titles/descriptions. |
| **Structured data** | C+ | Projects have schema; home, blog, and articles lack it; image URLs in schema must be absolute. |
| **Crawlability** | B+ | Sitemap and canonicals good; remove Crawl-delay; consider lastmod. |
| **Content & intent** | B+ | Strong blog and project content; align meta and schema to target queries. |

Implementing the **quick wins** (schema on home and blog, absolute URLs in schema, robots.txt fix, unique descriptions, breadcrumbs and Article schema) will give the largest SEO benefit. Then add **Search Console** and **GA4** tracking as above to measure impact.
