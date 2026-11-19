# Illustrated homepage footer

**Goal:** End the homepage with Dhruv and his motorcycle surrounded by twenty work/travel illustrations, followed by the existing footer navigation.

**Architecture:** The homepage opts into `illustratedFooter` on Layout. The shared Footer renders ClosingCTA only for that opt-in. Component-scoped CSS and native pointer scripting own the scene. Site tokens, fonts and the shared theme remain authoritative. No runtime dependency is added.

## Completed

- [x] Preserve the approved rider PNG and all twenty Streamline SVG exports byte-for-byte, with provenance hashes.
- [x] Keep the rider in the foreground of a curved 3D illustration field, with autonomous float and hover emphasis. No scene click/held-selection behavior.
- [x] Add small per-scene masked accents: blue in light mode and yellow in dark mode. Decorative overlays reuse the cached original asset and exclude themselves from accessible names. Source artwork remains unchanged.
- [x] Make the scene part of the homepage footer. Remove extra divider lines; the thin road is the visual separator.
- [x] Remove visible pause controls and hover instructions at the user's request. Honor system reduced motion and pause float offscreen/background.
- [x] Place the bike and road contact baseline 95% down the scene. Keep only slight illustration crossing below the road, while preserving room around tyres.
- [x] Integrate an 11px muted credit inside the scene, above pointer layers so its link works.
- [x] Preserve `/contact` and `/projects` destinations and other pages' existing footer layout.

## Verification

Local browser checks cover footer membership, no extra controls or separators, road presence, rendered blue/yellow accent pixels, default/hover restoration, theme switching, system reduced motion, responsive overflow at 1440/1024/768/390/320px, other routes returning 200 with their original footer, and original SVG hashes. No browser errors. Road baseline is 95% at all tested widths; maximum crossing below its center is 15px over sampled float extrema. Reviewer independently checked other-page isolation and identified a credit stacking defect, which was fixed with a local z-index and a pointer trial-click check.

The Astro production build is the repository's configured validation command. No lint/typecheck/test suite is configured. Source/asset scope is isolated from pre-existing CV, blog, project and ranking work in this checkout. The user authorized pushing and production deployment after these refinements.
