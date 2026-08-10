# Prompt: Fix portfolio projects visuals — no accent cards, restore original animation feel, correct type spec, scale up

## Context

The previous prompt (`portfolio-projects-prompt.md`) got implemented, but it
drifted from what Amy actually wants — compare her reference mockup
(2-per-row, media itself as the visual, generous size) against the current
build (3-per-row in Gallery, a solid accent-color box behind every project's
media, everything noticeably smaller than the reference). This prompt is a
correction pass on top of that work, not a rebuild — the data model
(`lib/projects.ts`), the click→modal behavior, and the hover-dims-to-50%
direction are all already correct and **should not change**.

Files involved: `components/WhatsInside/Gallery.tsx`, `Carousel.tsx`,
`ProjectMedia.tsx`, `index.tsx`, `layout.ts`.

## The actual problems

1. **There's a colored rectangle behind every project's media** — both
   `Gallery.tsx`'s `GalleryCard` and `Carousel.tsx` wrap `<ProjectMedia>` in
   a `motion.div` styled `backgroundColor: project.accent` with its own
   padding/rounded corners. Amy's reference has no such box — the media
   (video or image) *is* the card. Remove that wrapper in both files;
   `ProjectMedia`'s own `rounded-md` on the media itself is enough visual
   framing.

2. **Gallery is 3 columns and too small; Amy's spec is 2 columns, much
   bigger, with exact measurements**: at her reference viewport (1512px
   wide), the whole grid is 1374px wide (≈90.87% of viewport), 2 cards per
   row, with **50px gaps** between cards both horizontally and vertically.
   That works out to each card's media being exactly **662px wide** —
   `(1374 - 50) / 2 = 662` — which is not a coincidence, it's the same
   662:510 ratio `ProjectMedia.tsx` already uses. Today's Gallery caps at 3
   columns (`lg:grid-cols-3`) with cards maxing out around 230px wide —
   nowhere close.

3. **Typography doesn't match spec.** Amy's spec: project name in
   **Instrument Sans, 34px**; description in **Roboto Light, 20px**.
   - Gallery currently renders the name at `text-lg font-semibold` (18px,
     semibold) and the description at plain `font-roboto text-base` (16px,
     regular weight, no `font-light`).
   - Carousel currently derives both from `itemSize`-relative formulas
     (`itemSize * (18/360)` for the name, `itemSize * (14/360)` for the
     description) — also off-spec, and worth rebasing so the *centered*
     card's rendered size actually lands on 34px/20px, not just "somewhat
     bigger."

4. **The infinite-loop carousel feel must survive this untouched.** The
   existing `goTo`/`wrappedOffset` modulo math (same technique the original
   items carousel used) is what makes cycling through projects read as an
   endless loop with no visible "snap back to start" — confirm none of the
   sizing/styling changes above accidentally disturb it.

## A structural conflict to resolve (don't guess silently)

`WhatsInside/index.tsx` currently makes **Carousel's own arrow-to-arrow
width the shared source of truth**, and forces Gallery to match it exactly
("switching views never changes the section's overall width" — see that
file's own comment). Carousel's width comes from `computeLayout`, capped at
`CAROUSEL_MAX_ITEM_SIZE = 352`, which produces a `totalWidth` nowhere near
1374px. If Gallery needs to be 1374px wide on its own terms, this coupling
breaks — either Carousel has to get proportionally huge too (likely cramming
its neighbors/arrows off-screen), or the "shared width" rule has to be
relaxed.

**Recommended fix**: relax the coupling. Let each view size itself
independently within the section — Gallery targets the 1374px-at-1512px
(≈90.87vw, capped at 1374px) width described above; Carousel keeps sizing
itself from `computeLayout` (see item 3 below for how much to grow it) and
is simply centered within whatever width Gallery's box ends up being,
rather than dictating that width. Flag this decision explicitly to Amy
rather than silently picking it — the alternative (forcing Carousel to also
reach ~1374px) is a much bigger, riskier change to that page's arc math.

## What to build

1. **Remove the accent-card wrapper** in both `Gallery.tsx`'s `GalleryCard`
   and `Carousel.tsx`'s per-item render — delete the `backgroundColor:
   project.accent` `motion.div` and its padding/rounded-2xl styling, and
   render `<ProjectMedia>` (plus the name/description block) directly.
   `project.accent` in `lib/projects.ts` can stay in the data as an unused
   field for now (see decisions below) — don't need to delete it as part of
   this fix.

2. **Rebuild Gallery's grid to spec**:
   - Container: capped at `max-w-[1374px]` and `w-[90.87%]` (or the
     equivalent via a viewport-relative calc), `mx-auto`.
   - `grid-cols-1 sm:grid-cols-2` — **drop the `lg:grid-cols-3` tier
     entirely**, 2 columns is the ceiling at every width.
   - `gap-x-[50px] gap-y-[50px]` at the 2-column tier (this is where the
     662px card width falls out of the math — don't hardcode 662px
     directly on the media, let `w-full` inside each grid cell derive it,
     so it stays correct if the container width ever changes).
   - On the single-column mobile tier, keep the 50px row gap; horizontal
     gap is moot with one column.

3. **Update Gallery's typography**:
   - Name: `font-instrument-sans text-[34px]` (drop `font-semibold` — spec
     doesn't call for bold, just Instrument Sans at that size).
   - Description: `font-roboto font-light text-[20px]` (drop `text-base`,
     add `font-light`, set 20px).

4. **Grow Carousel's centered project + fix its typography**, without
   necessarily forcing it to the exact 662px Gallery uses (see structural
   conflict above):
   - Bump `CAROUSEL_MAX_ITEM_SIZE` (currently 352, 0.8× the shared 440px
     ceiling) up — enough that the centered project reads as similarly
     large/prominent as Gallery's new bigger cards, without clipping
     neighbors or arrows at a normal desktop width. Pick a concrete number
     and sanity-check it live (see verification), don't just guess and move
     on.
   - Rebase the name/description font formulas so that at the carousel's
     *actual* desktop itemSize (post-bump), the centered card's name lands
     on 34px and its description on 20px — same target as Gallery, reached
     via the existing itemSize-relative scaling approach so it still
     shrinks proportionally on narrower viewports.

5. **Confirm the loop is intact**: re-read `goTo` and `wrappedOffset` in
   `Carousel.tsx` — they shouldn't need to change at all for this fix. If
   any edit here touches them, that's a sign of scope creep — back out and
   reconsider.

## Decisions to confirm before/while implementing

- **The structural width-coupling conflict above** — confirm relaxing it
  (each view sizes itself independently) is acceptable, versus some other
  resolution.
- **`project.accent` field**: leave it unused in the data for now, or strip
  it from `lib/projects.ts`'s type/data since nothing renders it anymore?
  Either is fine — just pick one and note it.
- **Carousel's exact size ceiling** — see item 4 above, needs a live
  sanity-check at a normal laptop width (e.g. 1440px), not just a formula
  prediction.

## Verification (required before calling this done)

- Compare directly against Amy's reference screenshots, side by side — not
  just against this written spec.
- Confirm **no colored rectangle** appears behind or around any project's
  media in either view, in any state (rest, hover, centered).
- At a 1512px-wide viewport, measure Gallery's grid: container ≈1374px
  wide, exactly 2 columns, 50px gaps both directions, and each card's media
  measuring 662×510.
- Measure text: project name renders at 34px Instrument Sans, description
  at 20px Roboto Light — check both Carousel (centered card) and Gallery.
- Cycle the Carousel forward and backward past the wrap point (project 4 →
  1, and 1 → 4) repeatedly — confirm it loops seamlessly with no visible
  jump, snap, or reset, matching the feel of the original items carousel.
- Resize across breakpoints: confirm Gallery drops cleanly to 1 column
  below the 2-column breakpoint (no overflow, no orphaned half-card), and
  Carousel's bigger centered item doesn't clip its neighbors or arrows off
  the visible track at any supported width.
- Confirm switching between Carousel and Gallery still feels intentional —
  even without the strict "identical width" rule, it shouldn't jump or
  reflow jarringly when toggled.
- Run `npm run build` (or `next lint`) — confirm no leftover unused-style
  or type errors from removing the accent-card wrapper.

## Process constraints

- Work in `jar-portfolio`.
- This is a visual/sizing correction, not a re-architecture — don't touch
  the click→modal behavior, the hover-dims-to-50% direction, the data
  model fields, or the star-easter-egg removal already locked in by the
  previous prompt. Only touch what's listed above.
- Verify against Amy's actual reference screenshots at each meaningful step
  (accent removal, Gallery regrid, typography, Carousel size bump) rather
  than stacking all of them before looking once.
