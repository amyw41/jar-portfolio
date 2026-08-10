# Prompt: Turn "What's inside?" into a projects portfolio

## Context

`jar-portfolio` is a copy of `amy-wangs-jar` (same code, no shared git
history) — build this change here, not in `amy-wangs-jar`.

The homepage's "What's inside?" section (`components/WhatsInside/`) currently
shows Amy's personal items (ballet shoes, snacks, plushies — see
`lib/items.ts`) in two toggleable views, Carousel and Gallery, both reading
from the same `WHATS_INSIDE_ITEMS` array. The nav's "Portfolio" link
currently points off-site to `https://amywang.framer.website`
(`components/Taskbar.js`) — replacing that external link is a separate,
later step, not part of this change. This change is only about swapping the
*content* of the "What's inside?" section from items to projects.

Reference mockups (attached in chat) show the same two views, restyled:
project cards in a solid pink accent color, each showing a project name
("SkinSprout") and a short tagline underneath ("Sprint · TikTok").

Real project media already lives in `public/images/projects/`:
`cybersea.mp4`, `skinsprout.mp4` (both video), and `spotify.png` (image).
That's only 3 projects — use one of them again as a 4th placeholder entry
(any of the three is fine) until Amy adds a real 4th.

## Decided (confirmed with Amy — don't re-litigate these)

- **Content model stays two fields, same shape as today's items**: a project
  `name` and a `description` (used as the tagline, e.g. "Sprint · TikTok") —
  no extra fields (no role/tools/stack/case-study text). Keep it simple.
- **Clicking a project opens an in-page detail modal**, not an immediate
  new-tab jump — reuse the exact "bouncing up" entrance from the `/etc`
  category page's photo lightbox (`app/etc/[category]/page.tsx`): a dark
  `bg-black/50` backdrop that fades in (`opacity 0 → 1`), behind a white
  card that enters with `initial={{ opacity: 0, y: 40 }}`, `animate={{
  opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: 40 }}`,
  `transition={{ duration: 0.4, ease: "easeOut" }}` — same values, don't
  retune them. Clicking the backdrop or a close (×) button closes it,
  matching that page's existing pattern. The modal shows the project's
  media (bigger), name, and description.
- **The `link` field becomes a button/link inside that modal** (e.g. "Visit
  project →"), not something that fires on the card's own click — a project
  with no `link` just omits that button, everything else in the modal still
  shows. Clicking a non-centered card in Carousel still just centers it
  (doesn't open the modal) — only the already-centered/hovered card's click
  opens the modal.
- **Hovering a card dims it to 50% opacity — media *and* text together.**
  This is the opposite of Gallery's current hover behavior (today: 50%
  un-hovered → 100% on hover) — flip it, and bring Carousel's centered card
  in line with the same rule (hovering the centered card also drops it to
  50%, where today it has no hover-opacity behavior at all).
- **Keep both views** — Carousel and Gallery, same toggle UI, same
  animations. Don't collapse to a single layout.
- **Remove the star-toggle easter egg entirely** — Amy doesn't want it
  anymore. Delete `StarBadge.tsx` and all `lit`/`onToggleLit` plumbing in
  `WhatsInside/index.tsx`, `Carousel.tsx`, and `Gallery.tsx` (currently
  lifted to the parent so it survives switching views — that whole mechanism
  goes away, not just its UI).
- **Project media can be an image or a video** — not every project needs a
  still photo; some should be able to show a short video clip instead.
- **Media box ratio is fixed at 662:510 (≈1.298:1), responsively.** Every
  project's image/video sits in a box of that aspect ratio at every
  breakpoint — use CSS `aspect-ratio: 662 / 510` (Tailwind arbitrary value
  `aspect-[662/510]`) on the media container, with `object-fit: contain` (or
  `cover`, see decisions below) on the `<Image>`/`<video>` inside it, rather
  than the current fixed square (`h-*/w-*` equal) boxes in both
  `Carousel.tsx` and `Gallery.tsx`. The container's *width* still scales
  with the existing responsive sizing logic (`layout.ts`'s `itemSize`/
  `imageSize` breakpoints) — only the *shape* changes from square to
  662:510, at every size.

## What to build

1. **New data file** `lib/projects.ts`, replacing `lib/items.ts`:
   ```ts
   export type PortfolioProject = {
     id: string;
     name: string;
     media: string;             // path to an image or video file
     mediaType: "image" | "video";
     description: string;       // tagline, e.g. "Sprint · TikTok"
     link?: string;              // optional — live site, video, case study
   };

   export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
     {
       id: "cybersea",
       name: "Cybersea",
       media: "/images/projects/cybersea.mp4",
       mediaType: "video",
       description: "", // Amy to fill in the tagline, e.g. "Sprint · TikTok"
     },
     {
       id: "skinsprout",
       name: "SkinSprout",
       media: "/images/projects/skinsprout.mp4",
       mediaType: "video",
       description: "",
     },
     {
       id: "spotify",
       name: "Spotify",
       media: "/images/projects/spotify.png",
       mediaType: "image",
       description: "",
     },
     {
       // Placeholder 4th slot — only 3 real projects exist right now.
       // Reuses cybersea's media so the layout/grid can be verified with 4
       // items; swap in a real project + media whenever Amy has one.
       id: "placeholder-4",
       name: "Coming soon",
       media: "/images/projects/cybersea.mp4",
       mediaType: "video",
       description: "",
     },
   ];
   ```
   `mediaType` is an explicit field rather than inferred from the file
   extension — more reliable than sniffing `.mp4` vs `.png`, and self-
   documenting when Amy is filling in entries herself. Fill in each
   `description` (tagline) and any `link`s — those aren't decided yet.

2. **New `ProjectMedia` component** (e.g.
   `components/WhatsInside/ProjectMedia.tsx`), used by both `Carousel.tsx`
   and `Gallery.tsx` in place of their current inline `<Image>`: renders a
   container at the fixed 662:510 aspect ratio (see "Decided" above) and,
   based on `project.mediaType`, either a `next/image` `<Image fill>` or an
   HTML `<video>` (`muted loop playsInline autoPlay` — see decisions below
   on whether video should autoplay or wait for hover/center) sized to
   fill that same container. Centralizing this in one component means the
   662:510 ratio and image/video branching only need to be gotten right
   once, not duplicated across both views.

3. **Update `Carousel.tsx` and `Gallery.tsx`** to import `PORTFOLIO_PROJECTS`
   / `PortfolioProject` from `@/lib/projects` instead of `WHATS_INSIDE_ITEMS`
   / `WhatsInsideItem`, rename local variables accordingly (`item` →
   `project` reads clearer, but this is a style call, not a requirement),
   and swap their current image box for `<ProjectMedia>` from step 2.

4. **Build the project detail modal**, e.g.
   `components/WhatsInside/ProjectModal.tsx`, closely modeled on the
   `/etc` category page's `selected`/`selectedIndex` lightbox pattern
   (`app/etc/[category]/page.tsx`, the `AnimatePresence`/backdrop/card block
   near the bottom): a piece of state in `WhatsInside/index.tsx` (e.g.
   `selectedProject: PortfolioProject | null`, lifted above both views like
   `litItems` used to be, so it survives switching Carousel ↔ Gallery)
   holds which project's modal is open. Render the backdrop + card with the
   exact animation values specified in "Decided" above. Inside the card:
   the project's `<ProjectMedia>` (bigger than the card size), `name`,
   `description`, and — only if `project.link` is set — a link/button to
   it (`target="_blank" rel="noopener noreferrer"`).

5. **Wire up open/close**: clicking the centered card in Carousel, or a
   hovered card in Gallery, sets `selectedProject`; clicking the backdrop or
   a close (×) button (same `ARROW_BUTTON_CLASS` + `X` icon as `/etc`'s
   lightbox close button) clears it. Clicking a non-centered card in
   Carousel still just centers it via the existing `goTo` behavior — it
   should *not* also open the modal.

6. **Card background styling**: give cards a solid accent-color
   background — `lib/items.ts`'s old `accent` field existed but was never
   actually rendered anywhere; decide below whether to revive a per-project
   `accent` field or just use one shared brand pink for all cards, since the
   mockup shows every card the same color, not individually varied.

7. **Remove the star easter egg** per "Decided" above — delete the file,
   the imports, the `litItems`/`toggleLit` state in `index.tsx`, and the
   badge-rendering blocks in both views. Double check no leftover unused
   props/types reference it after removal.

8. **Delete `lib/items.ts`** once nothing imports it anymore (confirm with a
   repo-wide search before deleting, in case something else still uses it).

## Decisions to confirm before/while implementing (don't guess silently)

- **Section heading**: "What's inside?" was written for the items framing.
  Does it change (e.g. "Projects," "What I've built," something else), or
  does Amy want to keep the jar metaphor as-is even for a portfolio? Ask
  before changing copy, since it's a small thing but easy to get wrong
  without her sign-off.
- **Accent color**: one shared brand pink for every card vs. a per-project
  `accent` field (like the old unused one) for future variety — pick
  whichever's simpler to start (shared color), but flag it as an easy
  follow-up if Amy wants per-project color later.
- **Placeholder icon**: the mockup shows a small white icon centered on each
  pink card (heart/flower-ish) standing in for a real project photo. Use a
  simple `lucide-react` icon (or similar) as the placeholder — confirm which
  one reads fine at both Carousel and Gallery sizes.
- **Nav "Portfolio" link**: still points externally to
  `amywang.framer.website`. Not part of this change, but flag it as an
  obvious next step once this section is live — don't touch it here without
  Amy asking.
- **Video playback behavior**: should a project's video autoplay (muted,
  looping) as soon as it's on screen/centered, or only play on
  hover/tap-to-play with visible controls? Autoplay-muted-loop is the
  lower-friction default for a portfolio (reads like a GIF), but confirm —
  it also affects whether a `poster` frame is needed for the split second
  before playback starts.
- **`object-fit` inside the 662:510 box**: `contain` (whole image/video
  visible, may letterbox if the source isn't already that ratio) vs.
  `cover` (fills the box, crops edges as needed). Given Amy's media may not
  all be shot/exported at exactly 662:510, confirm which behavior she wants
  for sources that don't match — `cover` reads cleaner for a portfolio grid
  but can crop content she cares about.

## Verification (required before calling this done)

- Toggle between Carousel and Gallery — confirm both render project
  name/description correctly and neither references removed item fields.
- Confirm the star badge is fully gone — no leftover import errors, no dead
  `lit`/`toggleLit` state, no visible badge in either view.
- Hover a card in Gallery — confirm both its media and its text drop to 50%
  opacity together (not one before the other), and return to full opacity
  on mouse-out. Repeat for the centered card in Carousel.
- Click the centered card in Carousel (or a card in Gallery) — confirm the
  modal bounces up from below with a fade, matching the `/etc` lightbox
  timing (0.4s, easeOut, 40px), over a dark backdrop.
- With a project that has a `link`, open its modal — confirm the link
  button is present and opens in a new tab without closing/navigating the
  underlying page.
- With a project that has no `link` (or an empty placeholder), open its
  modal — confirm it just omits the link button, nothing errors.
- Close the modal via the backdrop and via the × button — confirm both
  work and the exit animation plays (reverse of the entrance, not an
  instant disappear).
- Click a non-centered card in Carousel — confirm it centers instead of
  opening the modal.
- Resize across breakpoints — confirm card layout still holds up now that
  content/styling changed (no overflow/wrapping regressions from the old
  item-photo sizing assumptions).
- At each breakpoint, confirm the media box is actually 662:510 (measure it,
  don't eyeball) — both when it's the centered/large card and when it's a
  shrunk neighbor in Carousel, and in every Gallery grid column count.
- Confirm the two real videos (`cybersea.mp4`, `skinsprout.mp4`) play
  (or show their poster, depending on the decision above), loop cleanly if
  autoplaying, and don't distort out of the 662:510 box — and that the real
  image (`spotify.png`) and the reused-video placeholder 4th entry render
  correctly alongside them without one breaking the other's layout.
- Run `npm run build` (or `next lint`) and confirm no unused-import/type
  errors from the `items.ts` → `projects.ts` swap.

## Process constraints

- Work in `jar-portfolio`, not `amy-wangs-jar`.
- Don't touch the nav's external "Portfolio" link or the `/etc`/`/notes`
  pages as part of this change.
- Verify visually at each meaningful step (data swap, hover-dim, modal
  open/close, star removal) rather than stacking several unverified pieces
  before looking at it once.
