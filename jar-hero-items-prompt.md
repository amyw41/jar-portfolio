# Prompt: Finish the jar hero's project tiles

This replaces `jar-hero-projects-prompt.md` and
`jar-hero-projects-fix-prompt.md` — use this one file, the other two can be
ignored/deleted. It's a single spec covering what's already been built and
everything still left to fix, so there's no need to reconcile multiple
prompts.

## Current state (already implemented — verified in the code as of this
## writing, don't redo)

`components/Jar.js`'s `ITEMS` array already holds one tile per real
project — Cybersea, SkinSprout, Spotify (see `lib/projects.ts`) — replacing
the original 12 personal items. Each tile already:
- Renders as a `<video muted loop playsInline autoPlay>` (Cybersea,
  SkinSprout) or `<Image>` (Spotify), branching on `item.mediaType`.
- Participates in the existing Matter.js physics sim (gravity, collision,
  the pointer-driven "rustle" force) — this engine itself is tuned and
  working, don't touch its core constants (gravity, restitution, friction,
  rustle strength).
- Is deliberately sparse (3 tiles, no repeats) — intentional, not a gap.

## What's still wrong (the actual scope of this prompt)

1. **Tiles are square**, cropped via `object-cover` to a 1:1 box —
   cropping out real content. Should be a 662:510 rectangle, matching
   `ProjectMedia.tsx`'s own ratio used elsewhere on this site.
2. **Tiles are too big** — `item.size: 200` needs to come down.
3. **All 3 tiles have `lockRotation: true`**, which freezes each one at
   essentially its spawn angle (-8°/5°/-4° — all near-upright) for the
   entire simulation, including through collisions. That's why they read
   as "all facing up" instead of tumbled — this was added deliberately in
   an earlier pass to stop spinning, but Amy wants the opposite now:
   organic tumbling, falling over each other at varied angles. Visual
   busyness is explicitly not a concern.
4. **DOM stacking order (z-index) is frozen at the array's initial
   order**, not tied to each tile's live physics position — so which tile
   paints on top doesn't necessarily match which one is actually
   physically in front/lower in the pile.

## What to build

1. **Convert every size calculation from square to a 662:510 rectangle.**
   `item.size` becomes the tile's **width** only; derive height as
   `size * (510 / 662)` everywhere it's used. This touches several spots
   that currently assume width === height — update each:
   - **Spawn stacking** (`spawnCursor` loop): use each item's *height*
     for the vertical gap between stacked spawn positions, not its width.
   - **`collisionHalf`/`visualHalf`**: split into width/height pairs
     (`collisionHalfW`/`collisionHalfH`, `visualHalfW`/`visualHalfH`)
     instead of one value reused for both axes.
   - **Body creation** (`Matter.Bodies.rectangle(...)`): pass distinct
     `hitboxW`/`hitboxH`. `chamfer.radius` should key off the *smaller*
     dimension (`Math.min(hitboxW, hitboxH) * 0.4`), not one square side.
   - **Containment clamp** in the tick loop: check `x` against
     `collisionHalfW`, `y` against `collisionHalfH` — currently both use
     the same `half`.
   - **Render transform**: offset by `visualHalfW`/`visualHalfH`
     respectively, not one shared `half`.
   - **Initial + resize DOM sizing** (both places `el.style.width`/
     `el.style.height` get set): width from `item.size * scale`, height
     from `item.size * scale * (510/662)` — currently both set to the
     same value.
   - Add `rounded-md` to each tile's media element (currently unrounded),
     matching `ProjectMedia.tsx`'s own corner treatment.
   - Achieve this via matching styles (ratio + `object-cover` +
     `rounded-md`), not by importing `ProjectMedia.tsx` directly —
     `Jar.js` sizes everything imperatively through the physics tick loop,
     not CSS `aspect-ratio`, and needs an explicit JS-known height
     regardless (for hitboxes/clamping/transforms), so matching the look
     inline is more correct here than forcing in a component built for a
     CSS-driven layout.

2. **Scale down**: try `size: 160` (from `200`) on all 3 `ITEMS` entries as
   a starting point — tune live once rendered (see verification).

3. **Unlock rotation**: delete `lockRotation: true` from all 3 `ITEMS`
   entries so collisions actually torque the tiles into varied resting
   angles. Also widen each item's initial `rotate` value well past the
   current -8/5/-4 (e.g. something like -25/35/-15) so there's visible
   variety even before physics adds more. If fully free rotation ends up
   looking too chaotic once actually running (a wide rectangle spinning
   past 90° can look stranger than a square did — this is why the earlier
   pass locked it in the first place), fall back to a large-but-finite
   inertia (`Matter.Body.setInertia(body, someLargeNumber)`) instead of
   the fully free default, as a middle ground. Try fully unlocked first;
   only reach for the fallback if it visibly looks wrong.

4. **Make DOM stacking track physics position live**: in the same tick
   loop that already sets each tile's `transform`, also set its
   `z-index` from the body's current position (e.g. `el.style.zIndex =
   Math.round(body.position.y)`) so whichever tile is physically
   lower/further-forward also paints on top — updated every frame (cheap
   enough with only 3 bodies), not just once on landing.

## Decisions to confirm before/while implementing (don't guess silently)

- **Exact tile width** (160px suggested) and **exact rotate spread**
  (-25/35/-15 suggested) are starting guesses, not measured values —
  eyeball the live result and adjust. With only 3 tiles (vs. the original
  design's 12), the outcome is less self-correcting than before, so this
  needs an actual look, not just trusting the formula.
- **Fully unlocked rotation vs. the finite-inertia fallback** — try free
  rotation first; only fall back if it visibly looks wrong once running.

## Verification (required before calling this done)

- Confirm tiles render as visibly rectangular (662:510) with noticeably
  less content cropped than the previous square version.
- Confirm tiles are smaller than the previous 200px baseline.
- Let the drop-in animation finish — confirm the 3 tiles settle at
  visibly different, non-upright angles, overlapping/resting against each
  other rather than sitting cleanly side by side.
- Hover/drag near the settled pile — confirm tiles can still rotate at
  least somewhat in response, not frozen at their landing angle.
- Confirm DOM stacking now matches physical layering, both at rest and
  while being actively rustled — not stuck in the original array order.
- Confirm no tile escapes the drawn jar outline or clips oddly at a
  corner now that hitboxes are rectangular — check all four sides of the
  containment clamp.
- Resize the window — confirm tiles keep their 662:510 proportions at
  every size and stay proportionally placed within the jar.
- Confirm the two video tiles still autoplay/loop correctly and aren't
  stretched/squashed by the new ratio.

## Process constraints

- Work in `jar-portfolio`, scoped to `Jar.js` only.
- Don't touch `WhatsInside/*`, `lib/projects.ts`, or the physics engine's
  gravity/restitution/friction/rustle constants.
- Verify live at each meaningful step (rectangle conversion, scale-down,
  rotation, z-index) rather than stacking all changes before looking once
  — the rectangle conversion alone touches several interdependent spots
  (spawn spacing, hitboxes, clamping, transforms), so a mistake in one
  could look like a bug in another.
