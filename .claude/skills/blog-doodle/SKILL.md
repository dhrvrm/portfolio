---
name: blog-doodle
description: Hand-drawn minimalist SVG doodles for blog posts — stick/bean characters with scribble-fill texture, storytelling diagrams (expectation-vs-reality, venn, emotional chart), in the site's brand palette. Use when the user asks for a doodle, illustration, sketch, spot illustration, or inline diagram for a blog post or page. Not for photo processing or cover images (covers use scripts/covers/generate.mjs).
---

# Minimalist Blog Doodle Generator

Hand-authored SVG doodles in the style of minimalist visual journalists (Janis Ozolins, Wait But Why, xkcd) crossed with loose sketchbook characters: wobbly ink lines, scribble-fill texture, one accent color, geometry that tells the story.

SVG is code: lightweight, semantic, human-readable, scalable. No AI image generation, no raster output — the deliverable is a clean `.svg` file managed in this project's assets.

## 1. Delivery & asset management (do this, always)

- **Default delivery is an inline SVG block in the post markdown**, not an `<img>`-referenced file. Only inlined SVG can see the site's class-based theme toggle (`.dark` on `<html>`), so only inlined SVG is dark-mode adaptive. Astro markdown passes raw HTML through — paste the `<svg>…</svg>` directly at the insertion point, **with no blank lines inside the block** (a blank line ends the markdown HTML block and truncates the SVG).
- **Theme adaptivity via semantic tokens:** no background rect — the doodle sits transparently on the page. Colors come from `src/styles/tokens.css` variables with light-theme fallbacks, set as `style` attributes on the `<g>` groups (never bare presentation attributes — `var()` doesn't work in them, and never a `<style>` tag — inlined SVG styles leak into the whole document):
  - ink: `style="stroke:rgb(var(--color-ink, 30 30 36))"` (and `fill:` for text/dot eyes)
  - accent: `style="stroke:rgb(var(--color-accent, 245 158 11))"` — this makes the accent follow the theme (blue in light, amber in dark), which is correct; do not hardcode a theme's accent hex.
  - de-emphasis stays `stroke-opacity=".35"` / `.4` — opacity works in both themes.
- **Root element:** `class="blog-doodle" style="width:100%;height:auto"` plus `role="img"` `aria-labelledby` pointing at a `<title>` with a **page-unique** id (`doodle-<name>-title` — inline SVGs share the document's id space).
- **File mode (exception):** only when a standalone file is genuinely needed (embedding outside the site, RSS-only contexts): `public/images/blog/doodles/<post-slug>/NN-<name>.svg` referenced via `![idea-level alt](…)`. File mode cannot adapt to the class-based theme.
- **Placement must be legible:** the doodle sits immediately AFTER the paragraph that states the idea it draws — the reader should hit the sentence, then see the sentence. Never between a heading and its first paragraph, never mid-argument, never before the idea has been said in prose. Land it at a natural pause (end of a beat or section). Max one doodle per section; a post rarely needs more than two or three total.
- **No orphans:** never leave a generated doodle unwired. If the user is only exploring, draw in the scratchpad and inline into the post only on approval.
- **Visual feedback loop (mandatory before delivering):** never ship a doodle you have only seen as path data, and never judge it from a full-size render alone — small-scale flaws (open contours, doubled lines, label collisions) hide at full size, and theme bugs hide in whichever theme you didn't render. Each iteration:
  1. **Dual-theme harness** — write a scratchpad HTML that stacks the SVG twice with the real token values, then screenshot it:
     ```html
     <style>
     .light{--color-ink:15 23 42;--color-accent:37 99 235;background:rgb(248 250 252)}
     .dark{--color-ink:250 250 250;--color-accent:251 191 36;background:rgb(9 9 9)}
     .wrap{width:600px;padding:5px 0}
     </style>
     <div class="wrap light"><!-- svg --></div>
     <div class="wrap dark"><!-- svg --></div>
     ```
     `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=2 --window-size=600,830 --screenshot=out.png file://<abs-path>.html`
     (Keep the harness token values in sync with `src/styles/tokens.css` if the palette ever changes.)
  2. **Zoomed crop** of every character and every dense region (run `node` from the project root so `sharp` resolves):
     `node -e "require('sharp')('out.png').extract({left:L,top:T,width:W,height:H}).resize(720).toFile('zoom.png')"`
  3. Read the images and check: legible in BOTH themes, contours close within the pen-gap budget, arms/limbs don't double the torso silhouette, strokes attach where they should, no label touches a drawn line. Fix and re-render until clean.
  4. After wiring into the post: `npm run build`, then confirm the built page still contains the full `<svg>` (a stray blank line inside the block silently truncates it).
  Note: headless Chrome inherits the OS color scheme, so screenshotting the live site only shows one theme — that's why the harness, which forces both, is the review tool.
- **Covers are a different tool:** featured/OG images stay with `scripts/covers/generate.mjs`. A doodle can appear *inside* a post; it is not the post's `image:` frontmatter.

## 2. Visual style constraints (absolute)

- **Canvas:** always a responsive `viewBox` (default `0 0 600 400`; taller for archetype B). No fixed `width`/`height` attributes, no background rect — transparent over the page, theme handled by the token colors above.
- **Ink:** the `--color-ink` token (falls back to `30 30 36`, soft dark slate — never pure black). All strokes: `stroke-linecap="round"` `stroke-linejoin="round"`, `fill="none"` unless scribble-filling.
- **Stroke profile:** constant weights only — `2.5` for figures and main shapes, `3` for the single most important line, `1.5–1.75` for scribble texture and specks. Never taper, never vary within a path.
- **Accent (exactly one accent element per doodle):** the `--color-accent` token (blue in light theme, amber in dark — falls back to amber `245 158 11`), reserved purely for the "aha" — the turning point, the intersection, the flag, the one word that matters. Never a second accent, never a third color.
- **Max 3 colors total:** page background (transparent) + ink + accent. Grays for de-emphasis: use ink at `stroke-opacity=".35"`, not new hex values.

### Hand-drawn line technique

Perfectly straight lines are forbidden except when "machine-perfect" IS the joke (the Expectation side of archetype A). To wobble a line, replace `L` segments with shallow quadratic beziers whose control points sit 1.5–4px off the straight path, alternating sides:

```
M60 300 Q160 296 260 302 T460 298   <!-- wobbly "horizontal" -->
```

Circles are never `<circle>` for drawn outlines — use a path of 3–4 arcs/beziers that almost closes, with a tiny gap or overshoot where the pen "finished". **The gap must be 2–4px, never more** — it should read as a pen lift, not a missing piece. Heads especially: a wide-open head arc looks broken, not sketchy; close it to within 2–4px (e.g. `a11 11 0 1 0 4 -2.5`) or overshoot slightly. (`<circle>`/`<ellipse>` are fine for dot eyes and specks.)

### Character anatomy (the sketchbook look)

Characters follow the loose-sketchbook proportions:

- **Small head, big body:** head is ~1/6 of figure height. Bean or blob torso drawn as one open contour — the outline may have small gaps; do not close every path.
- **Arms depart from the silhouette:** arm paths must leave the torso contour and travel outside it — an arm drawn just inside or parallel to the body outline reads as a doubled line, not a limb.
- **Oversized hands** when the character holds or presents something (a heart, a sign, a lightbulb, a flag) — hands/props are the emotional focus, so they get the size.
- **Dot eyes** (`r="2.5"` filled ink circles), eyebrow slants for emotion, mouth as a single short arc — or no mouth at all. No noses, no fingers (mitten hands), no detail creep.
- **Emotion lives in posture,** not the face: slumped shoulders = burnout, leaning forward = curiosity, arms overhead = triumph, sitting cross-legged hunched at a phone = doomscroll. Pick the physical gesture first, then draw.
- **Scribble fill** for exactly one or two garment zones per character (pants, skirt, hair, sock): a tight back-and-forth scribble path at stroke-width 1.5, clipped loosely inside the zone — it may poke past the contour; that's the charm. Stripes (4–6 imperfect horizontal wobble-lines) are the alternative texture for shirts. Everything else stays empty white.
- **Floating specks:** 4–8 tiny marks (1–2px dots, short ticks) scattered around the figure at `stroke-opacity=".4"` — the paper dust of the reference style. Action marks cluster near the head or the prop. **Never plus/cross marks** (`v8 M… h8` crosses read as UI icons, not paper dust); dots and single ticks only.

## 3. Storytelling layout archetypes

Choose exactly one per doodle, driven by the post's core idea:

**A — Expectation vs Reality (split):** left zone = one pristine straight arrow or clean geometric shape; right zone = a chaotic looping scribble path that eventually crawls to the same goal, the goal/arrival marked in accent. Thin wobbly divider or headroom labels "PLAN" / "REALITY". Best for: hustle culture, goal-setting, learning curves.

**B — Hidden Overlap (venn twist):** 2–3 irregular hand-drawn near-circles (arc paths, not `<circle>`), minimal one-or-two-word labels in each; the small intersection filled solid accent with the sharp takeaway label pointing at it. Best for: decision making, focus, trade-offs, work-life balance.

**C — Mindset Vector (emotional chart):** wobbly X/Y axes with hand-lettered axis labels; a relational line that is emphatically not straight (valley of despair dip, hockey-stick, plateau); a tiny character sitting ON the line at the meaningful point — holding a small accent flag, or slumped, matching the moment. Best for: consistency, habits, burnout timelines, time-vs-skill.

**D — Spot character (no diagram):** one character + one prop carrying the whole concept — holding an oversized broken heart, buried under a giant speech bubble, raising a crown overhead, sitting with a laptop as paper planes fly off. The prop (or its key part) is the accent element. Best for: essay section breaks, single-emotion beats, pull-quote companions.

## 4. Implementation rules

1. **Semantic groups:** `<g id="paper">`, `<g id="figure">`, `<g id="props">`, `<g id="labels">`, `<g id="specks">` — in that paint order.
2. **Typography:** labels use `font-family="'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif"` (site display font; system-ui fallback keeps standalone SVGs safe), `font-size` 14–18, fill ink (or accent for the takeaway). Letter-spacing `.05em`, uppercase for axis/zone labels. Hardcode every `x`/`y` and check labels cannot collide with drawn elements.
3. **Minimal text:** ≤3 words per label, ≤4 labels per doodle. If the doodle needs a paragraph, the geometry has failed — redraw.
4. **Accessibility:** every SVG opens with `<title>` (one sentence, the idea) and `<desc>` (one short sentence describing the scene), both with page-unique ids, and `role="img"` `aria-labelledby="<id>-title <id>-desc"` on the root.
5. **Draw-on animation (site-provided, free):** `Layout.astro` animates every `svg.blog-doodle` on scroll (GSAP/ScrollTrigger stroke-dashoffset; `prefers-reduced-motion` disables it). The sequencing model, and the perception science it encodes:
   - **One `data-step` group = one semantic gesture.** Paths inside a `[data-step]` `<g>` draw together with a tight stagger — Gestalt common fate makes them read as a single event ("threads burst out"), not N events. Paths outside any `data-step` group each draw alone.
   - **Steps run sequentially in DOM order.** Order steps by reading order (left zone completes before right zone starts — the attention spotlight can't watch two distant things at once) and by causality (draw the actor before what happens to them: mentor, then the threads bursting from him).
   - **`data-beat="0.3"` on a step group pauses before it** — comic timing; put a beat before each zone's payoff.
   - **The accent element is its own step, last, after a beat** — peak–end rule: the ending dominates memory, so the "aha" lands alone at the end.
   - **`<circle>`/`<text>` fade in after all drawing** — dot eyes and labels arrive as closure; characters "come alive" last. If a drawn element must appear mid-sequence (e.g. crowd heads that threads point at), author it as an arc path inside the right step, not a circle.
   - Keep total feel ≤ ~3.5s; if a doodle needs more, it has too many strokes.
6. **No filters, no gradients, no external refs, no `<style>` tags:** wobble is authored in path data, not `feTurbulence`; texture is scribble paths, not patterns; colors are `style` attributes on groups (a `<style>` tag inside an inlined SVG leaks CSS into the whole page).
7. **Output discipline:** return the finished SVG written to its asset path plus the one-line markdown embed snippet. No architectural essays unless asked.

## 5. Quality bar (check before delivering)

- [ ] Would it survive being redrawn on a whiteboard in 30 seconds? (If not: too complex — cut.)
- [ ] Is the accent used exactly once, on the actual point of the post?
- [ ] Does at least one line have visible wobble, and at least one contour a gap/overshoot (2–4px, no wider)?
- [ ] Did you run the visual feedback loop — full render AND zoomed character crops — and fix what the zoom exposed?
- [ ] Is emotion carried by posture/gesture, not facial detail?
- [ ] Legible in both themes (dual-theme harness reviewed), colors via tokens with fallbacks, no hardcoded theme hex?
- [ ] `viewBox` only, transparent background, groups semantic, `<title>` with page-unique id?
- [ ] Inlined in the post markdown with no blank lines inside the block (or explicitly parked in scratchpad), and the built page carries the full SVG?
