# Prompt: Fix portfolio card responsiveness/typography, drop the modal for real case-study pages

## Context

Two earlier prompts (`portfolio-projects-prompt.md`,
`portfolio-projects-visual-fix-prompt.md`) already landed — the accent-color
card background is gone, Gallery is a 2-column grid targeting 1374px/662px
cards, and the click→modal system (`ProjectModal.tsx`) works. This prompt
fixes what's still wrong after living with that build, per Amy's reference
screenshot (a "SkinSprout" card: serif title + sans description, both left
-aligned, black text, no visible position shift on hover) and replaces the
modal with real case-study pages.

Files involved: `components/WhatsInside/index.tsx`, `Carousel.tsx`,
`Gallery.tsx`, `ProjectMedia.tsx` (unchanged, just referenced), a new
`ProjectCardText.tsx`, and a new `app/projects/[id]/page.tsx` route.
`ProjectModal.tsx` gets deleted.

## Decided (confirmed with Amy — don't re-litigate these)

- **Root cause of the responsiveness bug**: `WhatsInside/index.tsx`
  currently wraps *both* Carousel and Gallery in one shared container sized
  to `computeLayout(viewportWidth).totalWidth` — Carousel's own
  arrow-to-arrow math, which plateaus around ~1287px once its item size
  hits the 440px ceiling. Gallery's own grid targets 1374px, but trapped
  inside that smaller shared wrapper it can never actually reach it — looks
  "fine" on a smaller screen (both numbers are viewport-scaled together, so
  they happen to agree) but is visibly undersized on a larger monitor
  (Gallery hits the outer cap before its own target). **Fix this at the
  root**: stop coupling the two views' widths together. Each view sizes and
  centers itself independently.
- **Typography, exactly per Amy's reference**: project name in
  `font-instrument` (this project's existing Instrument Serif class — see
  `app/layout.js`, it's already loaded, just not used on these cards today)
  at 34px, black at 80% opacity (`text-black/80`, not `text-[#2460A4]`).
  Description in `font-roboto font-light` at 20px, same `text-black/80`
  color (not `text-gray-600`). **Both left-aligned**, flush with the
  media's own left edge — not centered.
- **Hover changes color only, nothing moves.** No `y` translate, no scale,
  on either the media or the text — opacity is the only thing hover is
  allowed to animate on these cards.
- **Clicking a project navigates to a real page**, not the modal —
  `/projects/[id]` (e.g. `/projects/skinsprout`), reusing each project's
  existing `id` as the route slug. `ProjectModal.tsx` is deleted entirely,
  along with the `selectedProject` state and prop-drilling in `index.tsx`
  that supported it.
- **Case-study pages are a minimal shell for now, not full content**:
  bigger media, name, description, a "Visit project →" link when
  `project.link` is set, and an explicit "case study coming soon"
  placeholder — no case-study schema/fields exist yet, and none are being
  invented here. Amy fills in real content later, same pattern as the
  empty `description` fields.
- **Extract a shared `ProjectCardText` component**, used by both Carousel
  and Gallery, so the name/description markup, font, color, alignment, and
  hover-opacity behavior only need to be right in one place — duplicating
  it across both views is exactly why the last two fixes each had to touch
  both files separately.

## What to build

1. **Fix the width coupling** (root cause of the responsive bug):
   - In `WhatsInside/index.tsx`, remove the `computeLayout`/`useViewportWidth`
     usage that currently drives `style={{ width: totalWidth, maxWidth:
     "100%" }}` on the wrapper around both views — change that wrapper to
     just `className="mx-auto mt-26 w-full"` with no inline width override,
     and drop the now-unused `computeLayout`/`useViewportWidth` import if
     nothing else in that file needs them.
   - Gallery already owns its own responsive width (`w-[90.87%]
     max-w-[1374px] mx-auto` on its grid) — no change needed there.
   - Give Carousel's own outer `<div>` (the one currently returned bare,
     with no width/centering of its own) an explicit `mx-auto` and a width
     derived from its own `computeLayout(viewportWidth)` call (already
     happening inside the component) — e.g. wrap the existing content in a
     container sized to that same `containerWidth`/arrow math it's already
     computing, so Carousel is self-contained and centers correctly without
     depending on a parent to size it.

2. **Build `ProjectCardText`** (`components/WhatsInside/ProjectCardText.tsx`):
   ```tsx
   "use client";
   import { motion } from "framer-motion";

   export default function ProjectCardText({
     name,
     description,
     opacity,
     nameFontSize,
     descriptionFontSize,
   }: {
     name: string;
     description: string;
     opacity: number; // caller computes the final value — see below
     nameFontSize: number; // px
     descriptionFontSize: number; // px
   }) {
     return (
       <motion.div
         animate={{ opacity }}
         transition={{ type: "spring", stiffness: 300, damping: 15 }}
         className="w-full text-left"
       >
         <h3
           style={{ fontSize: nameFontSize }}
           className="font-instrument text-black/80"
         >
           {name}
         </h3>
         <p
           style={{ fontSize: descriptionFontSize }}
           className="mt-1 font-roboto font-light text-black/80"
         >
           {description}
         </p>
       </motion.div>
     );
   }
   ```
   `opacity` is a plain number the caller already computed, not a `hovered`
   boolean — Gallery just passes `hovered ? 0.5 : 1`, while Carousel passes
   its existing combined `textOpacity` (which already accounts for both
   distance-from-center *and* hover on the centered card) unchanged. This
   is what lets one component serve both views without forcing Carousel to
   restructure its distance-based fade logic.

3. **Update `Gallery.tsx`**: replace the inline `<h3>`/`<p>` block with
   `<ProjectCardText name={project.name} description={project.description}
   opacity={hovered ? 0.5 : 1} nameFontSize={34} descriptionFontSize={20}
   />` — this removes the `y: hovered ? 0 : 8` shift as a side effect of
   the swap (the new component never animates `y`). Also drop the
   `text-center`/centering on the card's outer flex container now that
   text is left-aligned and media is already `w-full` — cross-axis
   alignment doesn't visibly change for a full-width child either way, but
   confirm nothing regresses.

4. **Update `Carousel.tsx`**: replace the inline `<span>`/`<p>` block with
   `<ProjectCardText name={project.name} description={project.description}
   opacity={textOpacity} nameFontSize={itemSize * CENTER_NAME_RATIO}
   descriptionFontSize={itemSize * CENTER_DESC_RATIO} />` — same
   `CENTER_NAME_RATIO`/`CENTER_DESC_RATIO` constants already in the file,
   unchanged. This card's `onClick` for the **centered** item changes from
   `onSelectProject(project)` to a route push (see step 6) — non-centered
   items keep their existing `goTo(i)` centering behavior unchanged.

5. **Confirm the star easter egg is actually gone**: search the repo for
   `StarBadge`, `lit`, `toggleLit`, `litItems`. As of this prompt being
   written it already appears fully removed (no `StarBadge.tsx` file, no
   matches in `WhatsInside/`) — if that's still true, this step is just a
   confirmation, not new work. If anything turns up, delete it.

6. **Replace the modal with a real page**:
   - Delete `components/WhatsInside/ProjectModal.tsx`.
   - In `WhatsInside/index.tsx`, remove the `selectedProject` state, the
     `ProjectModal` import and its render, and the `onSelectProject` prop
     passed down to `Carousel`/`Gallery` — neither view needs a lifted
     callback anymore since navigation doesn't require shared state.
   - In `Gallery.tsx` and `Carousel.tsx`, import `useRouter` from
     `next/navigation` and, on the click that used to call
     `onSelectProject(project)`, call `router.push(\`/projects/${project.id}\`)`
     instead.
   - New route: `app/projects/[id]/page.tsx`, modeled on the existing
     `/etc/[category]/page.tsx` pattern (look up the project by
     `params.id` in `PORTFOLIO_PROJECTS`, call `notFound()` if no match).
     Contents: a back link (reuse `/etc/[category]/page.tsx`'s
     `ArrowLeft` + `ARROW_BUTTON_CLASS` back-button pattern, linking to
     `/`), a bigger `<ProjectMedia>`, the project name/description via
     `ProjectCardText` (or plain markup at a bigger size — component
     reuse here is a nice-to-have, not required), a "Visit project →"
     link when `project.link` is set (same styling `ProjectModal.tsx`
     used), and a clearly-labeled placeholder section below — reuse this
     codebase's existing "Coming soon." treatment (see the empty-category
     branch in `/etc/[category]/page.tsx`) rather than inventing new
     copy/styling for the same idea.

## Decisions to confirm before/while implementing

- **Left-aligned text in Carousel**: Amy's reference is a Gallery card
  specifically. Left-aligned text under a horizontally-centered carousel
  item may look slightly asymmetric compared to Gallery's grid — since
  `ProjectCardText` is now shared, both will be left-aligned by default.
  Eyeball it once built; if it reads oddly in Carousel, that's a
  legitimate reason to fork alignment between the two (pass an `align`
  prop), not silently revert the whole component.
- **`generateStaticParams`** for `app/projects/[id]/page.tsx`: not
  required, but a small addition (map `PORTFOLIO_PROJECTS` to `{ id }`)
  that's idiomatic for a static project list like this — include it
  unless there's a reason not to.
- **Route naming** is locked to `/projects/[id]` per Amy's decision — don't
  second-guess this mid-implementation.

## Verification (required before calling this done)

- Resize to a large monitor width (e.g. ≥1920px) — confirm Gallery's grid
  actually reaches its full 1374px/662px-per-card target instead of being
  capped by Carousel's old shared-width ceiling. Resize down through
  tablet/phone widths — confirm both views still scale smoothly and
  nothing overflows.
- Confirm project name renders in a visibly serif font (Instrument Serif),
  34px, black/80% opacity, left-aligned — in both Carousel (centered card)
  and Gallery. Same check for the description (Roboto Light, 20px,
  black/80%, left-aligned).
- Hover a Gallery card and the Carousel's centered card — confirm *only*
  color/opacity changes; use browser dev tools or just watch closely to
  confirm no element's position or size shifts at all.
- Re-run the `StarBadge`/`lit` search from step 5 post-change — confirm
  zero real matches (ignore incidental substring hits like "split").
- Click a project in Gallery, and separately click the centered project in
  Carousel — confirm both navigate to `/projects/<id>` (URL bar changes,
  no modal/backdrop appears), and that the browser back button returns
  cleanly to the homepage.
- Visit `/projects/some-fake-id` directly — confirm it 404s via
  `notFound()`, matching how `/etc/[category]` handles an unknown category.
- On the case-study page, confirm the "Visit project" link only appears
  when `project.link` is actually set (none of the 4 current projects have
  one, so confirm the page doesn't render a broken/empty button for any of
  them today).
- Run `npm run build` (or `next lint`) — confirm no leftover references to
  the deleted `ProjectModal.tsx` or the removed `selectedProject` state
  anywhere in the codebase.

## Process constraints

- Work in `jar-portfolio`.
- Don't touch `components/Jar.js` (the hero jar) — that's covered by a
  separate prompt (`jar-hero-projects-prompt.md`).
- Don't reintroduce any modal/lightbox for project clicks — the whole point
  of this pass is real page navigation.
- Verify against Amy's actual reference screenshot for the typography/
  alignment specifics, not just against the written pixel values.
