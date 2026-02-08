# SEO: How-To Content and FAQs

**Goal:** Use how-to and FAQ content + structured data to compete for “how to X” and question-style queries and earn rich results (steps, FAQ expandables) in search.

---

## 1. Target keyword and intent mapping

| Intent | Query examples | Content type | Rich result |
|--------|----------------|-------------|-------------|
| **How-to (task)** | "how to create npm package", "how to build node backend 2025", "how to publish npm package" | Step-by-step tutorial with clear steps | HowTo (steps in SERP) |
| **Question / FAQ** | "what is package.json exports field", "how long does npm publish take", "node backend best practices" | Q&A or FAQ section on same page or dedicated | FAQ (expandable Q&A in SERP) |

**Relevance to your blog:**
- **HowTo candidates:** "Ultimate Guide to Building a Production Node.js Backend", NPM series (creating package, publishing, private registry). These are procedural; structure them as clear steps.
- **FAQ candidates:** Same posts + any post where readers commonly ask “what is X?”, “how do I X?”, “why use X?”. Add an FAQ section (3–8 questions) that answers those questions in one place.

---

## 2. On-page recommendations

### How-to content

1. **Title and H1**  
   Use the target “how to” phrase where it fits naturally (e.g. “How to Build a Production Node.js Backend in 2025” or “How to Create Your First NPM Package”).

2. **Clear step structure**  
   - One **H2 per main step** (e.g. “Step 1: Set up the project”, “Step 2: Add TypeScript”).  
   - Sub-steps as H3.  
   - Short intro sentence per step, then detail. This makes it easy to map content to HowTo schema and to featured snippets.

3. **Step content**  
   - Each step: what to do, why (briefly), and optional code/command.  
   - Keep one main idea per step so the step “name” in schema can match the H2.

4. **Internal links**  
   Link to related posts (e.g. “Publishing your package” from “Creating your first package”) and to the blog index so Google and users can discover more how-to content.

5. **Optional extras**  
   - Total time (e.g. “About 20 min”) → use for HowTo `totalTime` (ISO 8601, e.g. `PT20M`).  
   - Tools/supplies if relevant (e.g. Node, npm, VS Code) → optional HowTo `tool` / `supply`.

### FAQ content

1. **Placement**  
   - **Option A:** Dedicated “FAQ” or “Common questions” section (H2) near the end of the post.  
   - **Option B:** One short FAQ block after the intro for “what you’ll learn” / “who this is for”.  
   Prefer one clear section so both users and schema are consistent.

2. **Format**  
   - One **H3 (or visible Q) per question**, with the answer in the following paragraph(s).  
   - Question = exact wording people might search; answer = concise (2–4 sentences or a short list).  
   - 3–8 questions per post is a good range for SEO and readability.

3. **Question choice**  
   - Real questions from comments, support, or “people also ask”.  
   - Clarifications (“What is X?”, “Why use Y?”).  
   - Next-step questions (“How do I publish after building?”).  
   Use the same phrasing in the FAQ schema as on the page.

4. **Internal links**  
   In answers, link to relevant sections or other posts (e.g. “See [Publishing your NPM package](/blog/...) for the full process”).

---

## 3. Technical SEO (schema and implementation)

### HowTo schema (JSON-LD)

- **Required:** `name` (how-to title), `step` (array of steps).  
- **Each step:** `@type: "HowToStep"`, `name` (short step title), `text` (description). Use `position: 1, 2, 3...` when possible.  
- **Optional:** `description`, `totalTime` (e.g. `PT20M`), `image`, `tool`, `supply`.  
- **Placement:** One HowTo block per page that is a single how-to; output next to your existing BlogPosting schema.

**Implementation in this site:**  
- Add optional frontmatter (e.g. `howTo`) with `name` and `steps: [{ name, text }]`.  
- Optionally derive `totalTime` from `readingTime` (e.g. `PT{readingTime}M`).  
- In the blog post layout, if `howTo` is present, output HowTo JSON-LD (and optionally a visible “Steps” list for consistency).

### FAQ schema (JSON-LD)

- **Type:** `FAQPage`.  
- **Required:** `mainEntity` = array of `Question` items.  
- **Each item:** `@type: "Question"`, `name` (question text), `acceptedAnswer`: `{ @type: "Answer", text }`.  
- **Placement:** One FAQPage per page; can sit alongside BlogPosting and HowTo.

**Implementation in this site:**  
- Add optional frontmatter `faqs: [{ question, answer }]`.  
- In the blog post layout, if `faqs` is present, output FAQPage JSON-LD and render an FAQ section (e.g. H2 “FAQ” + list of Q/A) so the page content matches the schema.

### Validation and monitoring

- **Validate:** [Google Rich Results Test](https://search.google.com/test/rich-results) for a URL that has HowTo and/or FAQ; fix any errors.  
- **Monitor:** Google Search Console → Enhancements → FAQ / How-to (if available) for impressions, clicks, and indexing.  
- **Track:** Use the same URL in GSC Performance to see which queries show FAQ or how-to rich results and adjust questions/steps accordingly.

---

## 4. Checklist (per how-to or FAQ post)

**How-to**
- [ ] Title/H1 includes or aligns with “how to X”.  
- [ ] Main steps as H2s; one clear action per step.  
- [ ] Optional: total time, tools.  
- [ ] HowTo JSON-LD with `name` and `step` (name + text, position).  
- [ ] Internal links to related posts.

**FAQ**
- [ ] One FAQ section with 3–8 questions.  
- [ ] Each question as H3 (or visible Q); answer directly below.  
- [ ] FAQPage JSON-LD with same Q/A as on the page.  
- [ ] Internal links in answers where relevant.

---

## 5. Summary

- **How-to:** Structure tutorials as clear steps (H2 per step), add HowTo schema with `name` and `step` (and optional `totalTime`).  
- **FAQ:** Add a dedicated FAQ section with real questions and concise answers; add FAQPage schema that mirrors it.  
- **Content and schema must match:** Only add schema for content that is visible on the page.  
- Use GSC and Rich Results Test to validate and improve how-to and FAQ visibility in search.

---

## 6. Implementation in this site

- **Blog schema** (in `src/content/config.ts`): Optional `howTo: { name, steps: [{ name, text }] }` and `faqs: [{ question, answer }]` in frontmatter.
- **Blog post layout** (`src/pages/blog/[...slug].astro`): When `howTo` is set, HowTo JSON-LD is output (with `totalTime` from `readingTime`). When `faqs` is set, FAQPage JSON-LD is output and a “Frequently asked questions” section is rendered so visible content matches the schema.
- **Example:** The post “Creating Your First NPM Package” includes sample `faqs` in frontmatter; view that post to see the FAQ section and validate FAQ rich results.
- **Adding HowTo:** In a tutorial post, add a `howTo` block to frontmatter with a short `name` and one `step` per main action (each `name` and `text` should align with your H2s and body copy).
