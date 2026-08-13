"use client";

import { useCallback, useState } from "react";

// Shared step-counter bookkeeping behind both carousels on the site — the
// home page's Carousel.tsx (a straight-line belt) and the /etc category
// page's photo wheel (the same idea wrapped onto a curved arc). Both need
// exactly the same three things from this: an unbounded, monotonically
// advancing step count, the current wrapped center index derived from it,
// and a "jump to an arbitrary target via whichever direction around the
// loop is shorter" helper for UI that can land somewhere other than the
// immediate neighbor (Carousel's dot indicators).
//
// `step` is deliberately never wrapped back into 0..itemCount-1 — that's
// what actually fixes the "one item suddenly sweeps/snaps to the opposite
// side" bug both carousels used to have independently: deriving each item's
// on-screen offset as "shortest path from the wrapped index to this item"
// is correct in isolation, but as the wrapped index ticks over, the
// *shortest* path for whichever item sits near the halfway point can flip
// from one side to the other in a single step — and that one item visibly
// jumps across the whole track/arc while everything else slides normally.
// Driving every item's position from one shared, monotonic step instead
// means there's only ever one motion happening: the whole belt/wheel shifts
// by exactly one slot, in one direction, together, because no individual
// item ever recomputes which side it's "closer" to.
//
// Everything downstream of this stays local to each component — how many
// neighbors actually render, whether they sit on a line or an arc, any
// per-item jump/freeze handling for an odd item count's own halfway ties.
// That part is genuinely different between the two carousels, not
// duplicated, so it isn't pulled in here.
export function useCarouselStep(itemCount: number) {
  const [step, setStep] = useState(0);
  const index = itemCount === 0 ? 0 : ((step % itemCount) + itemCount) % itemCount;

  const goBy = useCallback((delta: number) => setStep((s) => s + delta), []);

  // Only for UI that can jump straight to an arbitrary target, potentially
  // several slots away (e.g. clicking a specific dot indicator) — picks
  // whichever direction around the loop is shorter. Ordinary single-slot
  // moves (arrows, clicking a neighbor) should call goBy directly instead:
  // they only ever move by exactly one slot, so there's no "which
  // direction" choice to make in the first place.
  const goTo = useCallback(
    (targetIndex: number) => {
      if (itemCount === 0) return;
      let delta = (((targetIndex - index) % itemCount) + itemCount) % itemCount;
      if (delta > itemCount / 2) delta -= itemCount;
      goBy(delta);
    },
    [index, itemCount, goBy]
  );

  // Resets back to step 0 — for a carousel whose underlying item list can
  // change out from under an already-mounted instance (the /etc category
  // page swaps `photos` when the route's [category] param changes, without
  // unmounting the component itself).
  const reset = useCallback(() => setStep(0), []);

  return { step, index, goBy, goTo, reset };
}
