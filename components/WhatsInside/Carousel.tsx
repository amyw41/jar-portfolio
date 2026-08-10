"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PORTFOLIO_PROJECTS } from "@/lib/projects";
import { MAX_ITEM_SIZE, NEIGHBOR_SCALE, computeLayout, useViewportWidth } from "./layout";
import ProjectMedia from "./ProjectMedia";
import ProjectCardText from "./ProjectCardText";

const PROJECT_COUNT = PORTFOLIO_PROJECTS.length;
const ARROW_BUTTON_CLASS =
  "flex h-[2.25rem] w-[2.25rem] flex-shrink-0 items-center justify-center rounded-full border border-black/50 bg-white text-black/50 transition-colors hover:border-[#2460A4] hover:text-[#2460A4]";
// Ratio of the original desktop design (track height 448px at itemSize 360px)
// — kept constant so the track always has enough headroom for the center
// item's 1.3x hover/active scale without clipping it against overflow-hidden.
const TRACK_HEIGHT_RATIO = 448 / 360;
const CENTER_SCALE = 1.3;
const FAR_SCALE = 0.55;
// No more carousel-specific 0.8x cap on top of the shared MAX_ITEM_SIZE —
// removed so the centered project reads comparably large/prominent to
// Gallery's now much bigger cards. computeLayout's own width-solve still
// guarantees the row can never overflow at any viewport (see layout.ts) —
// raising this ceiling only affects how much of that already-safe headroom
// gets used on wide viewports, it can't introduce clipping.
const ITEM_SIZE_CEILING = MAX_ITEM_SIZE;
// Name/description font sizes are itemSize-relative (so they keep shrinking
// proportionally on narrower viewports, like the rest of the carousel), but
// rebased here so that at the carousel's desktop ceiling (ITEM_SIZE_CEILING)
// the *centered* card's rendered text lands on Gallery's own typography
// spec — 34px name, 20px description. The /CENTER_SCALE accounts for the
// CSS transform that visually enlarges the whole centered card on top of
// this base font-size (the outer item div's own `scale: CENTER_SCALE`
// below) — without it these numbers would only be right pre-transform.
const CENTER_NAME_RATIO = 34 / (ITEM_SIZE_CEILING * CENTER_SCALE);
const CENTER_DESC_RATIO = 20 / (ITEM_SIZE_CEILING * CENTER_SCALE);
// How many slots on each side of center get a rendered (if invisible past
// dist 1) element — 2 matches the original three visible tiers (center,
// near neighbor, far/invisible peek). See the `slots` comment below for why
// this window, not a per-item "closest real project" lookup, is what
// actually drives motion now.
const WINDOW_RADIUS = 2;

export default function Carousel() {
  const router = useRouter();
  // `step` is unbounded — it just counts how many single-slot advances
  // you've made in total, positive or negative, and is never wrapped back
  // into 0..PROJECT_COUNT-1. That's the whole fix for the old "one item
  // suddenly sweeps/snaps to the opposite side" bug: the old code derived
  // each item's on-screen offset independently, as "shortest path from the
  // wrapped index to this item" — which is correct in isolation, but as the
  // wrapped index ticks over, the *shortest* path for whichever item sits
  // near the halfway point can flip from one side to the other in a single
  // step, and that one item visibly jumps across the whole track while
  // everything else slides normally. Driving every item's position from
  // one shared, monotonic `step` instead means there's only ever one
  // motion happening — the whole belt shifts by exactly one slot, in one
  // direction, together — because no individual item ever recomputes which
  // side it's "closer" to; see `slots` below.
  const [step, setStep] = useState(0);
  const centerIndex = ((step % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
  // Which card (by id) is currently hovered/focused — only ever changes the
  // centered card's own media/text opacity (see mediaOpacity/textOpacity
  // below); a hovered neighbor doesn't dim, since only the centered card is
  // the "featured" one this rule applies to.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const viewportWidth = useViewportWidth();
  const { itemSize, imageSize, spacing, containerWidth, gap, totalWidth } = computeLayout(viewportWidth, ITEM_SIZE_CEILING);
  const trackHeight = itemSize * TRACK_HEIGHT_RATIO;

  const goBy = (delta: number) => setStep((s) => s + delta);
  // Only the dot indicators need this — they can jump straight to any
  // project, potentially several slots away, so picking the shorter
  // direction around the loop makes sense there. The arrows/neighbor clicks
  // never need it: they only ever move by exactly one slot (see the render
  // loop below), so there's no "which direction" choice to make in the
  // first place.
  const goToProject = (targetIndex: number) => {
    let delta = ((targetIndex - centerIndex) % PROJECT_COUNT + PROJECT_COUNT) % PROJECT_COUNT;
    if (delta > PROJECT_COUNT / 2) delta -= PROJECT_COUNT;
    goBy(delta);
  };

  // Every integer `k` within WINDOW_RADIUS of `step` gets its own rendered
  // slot, mapped onto a real project by `k mod PROJECT_COUNT` — `k` itself
  // (not "whichever project this currently is") is each element's stable
  // identity (see `key={k}` below). As `step` changes, a given k's own
  // on-screen offset (`k - step`) changes by exactly the same amount as
  // every other k's — that uniform, shared delta is what makes the whole
  // belt read as one consistent sliding motion. (With PROJECT_COUNT smaller
  // than the window's full span, the same project can occupy two slots at
  // once — but only ever at the two farthest, already-invisible dist-2
  // positions, never anywhere visible, so it's harmless.)
  const slots = [];
  for (let k = step - WINDOW_RADIUS; k <= step + WINDOW_RADIUS; k++) {
    const projectIndex = ((k % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
    slots.push({ k, project: PORTFOLIO_PROJECTS[projectIndex] });
  }

  return (
    // Sized to Carousel's own arrow-to-arrow width (totalWidth, the same
    // computeLayout call already driving everything else here) and
    // centered via mx-auto — self-contained rather than relying on a
    // parent to size/center it. Previously WhatsInside/index.tsx's wrapper
    // did that job (forcing Gallery to match this width too, which is the
    // root cause the "fix portfolio responsiveness" prompt exists to fix);
    // now that the parent is just a plain w-full wrapper, Carousel has to
    // own its own width or it'd stretch full-bleed instead of centering as
    // a fixed-size unit.
    <div className="mx-auto" style={{ width: totalWidth, maxWidth: "100%" }}>
      {/* Arrows are laid out as flex siblings of the item track, not
          absolutely positioned over it, so they always sit clear of the
          items. The flex gap here matches the gap baked into `spacing` below,
          so every gutter (arrow-neighbor, neighbor-center, ...) is equal. */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex items-center justify-center"
        style={{ gap }}
      >
        <button
          type="button"
          onClick={() => goBy(-1)}
          aria-label="Previous project"
          className={ARROW_BUTTON_CLASS}
        >
          <ChevronLeft size={23} strokeWidth={1.25} />
        </button>

        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            width: containerWidth,
            height: trackHeight,
            // Fades items out toward the container's own edges instead of
            // hard-clipping them there — the overflow-hidden crop was
            // otherwise producing a visible straight edge as items slid
            // past it.
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          {/* Keyed so the one-time correction from the unmeasured
              (viewportWidth===0) default to the real viewport width remounts
              this fresh instead of animating a spring transition between the
              two — without the key, Framer Motion sees that as a prop change
              on an already-mounted tree and springs the items from
              clustered-near-center out to their real positions, which read
              as an unwanted "pop" on first paint. Later resizes
              (viewportWidth already nonzero either way) don't remount, so
              they animate smoothly instead of popping. */}
          <motion.div key={viewportWidth === 0 ? "measuring" : "ready"} className="absolute inset-0">
            {slots.map(({ k, project }) => {
              const offset = k - step;
              const dist = Math.abs(offset);
              const isCenter = dist === 0;
              const isHovered = hoveredId === project.id;
              // The centered item renders visually larger than its neighbors
              // by scaling the whole slot (including the media inside it) up
              // beyond its normal 1:1 size, rather than just avoiding the
              // neighbor shrink — a more dramatic "featured item" emphasis.
              const scale = isCenter ? CENTER_SCALE : dist === 1 ? NEIGHBOR_SCALE : FAR_SCALE;
              // Media/text dim together, as one rule: full opacity at rest,
              // 50% on hover — for the centered card only. Non-centered
              // cards keep their existing distance-based fade (unaffected by
              // hover, since hovering a neighbor should still just look like
              // "the neighbor," not the featured card).
              const mediaOpacity = isCenter ? (isHovered ? 0.5 : 1) : dist === 1 ? 0.55 : 0;
              const textOpacity = isCenter ? (isHovered ? 0.5 : 1) : dist === 1 ? 0.5 : 0;

              return (
                // div with role="button", not an actual <button> — role +
                // onClick + onKeyDown reproduces native button semantics
                // (click + Enter/Space activation, tab stop).
                <motion.div
                  role="button"
                  key={k}
                  onClick={() => (isCenter ? router.push(`/projects/${project.id}`) : goBy(offset))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      isCenter ? router.push(`/projects/${project.id}`) : goBy(offset);
                    }
                  }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(project.id)}
                  onBlur={() => setHoveredId(null)}
                  aria-label={isCenter ? `Open ${project.name}` : `Go to ${project.name}`}
                  aria-hidden={dist > 1}
                  tabIndex={dist > 1 ? -1 : 0}
                  initial={false}
                  animate={{ x: offset * spacing, scale }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex: 10 - dist, width: itemSize, gap: itemSize * (4 / 360) }}
                  className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 select-none flex-col items-center justify-center cursor-pointer"
                >
                  {/* No card background — the media itself is the card (see
                      the "fix portfolio visuals" prompt). Matches Gallery's
                      media box width exactly at desktop size (see imageSize
                      in layout.ts) so a project reads as the same size in
                      both views there; below that it scales down with the
                      rest of the carousel to stay on-screen. Height comes
                      from ProjectMedia's own fixed 662:510 aspect ratio, not
                      set here. */}
                  <motion.div
                    animate={{ opacity: mediaOpacity }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ width: imageSize }}
                  >
                    <ProjectMedia project={project} sizes="(min-width: 640px) 320px, 230px" />
                  </motion.div>

                  <div style={{ width: imageSize }}>
                    <ProjectCardText
                      name={project.name}
                      description={project.description}
                      opacity={textOpacity}
                      nameFontSize={itemSize * CENTER_NAME_RATIO}
                      descriptionFontSize={itemSize * CENTER_DESC_RATIO}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => goBy(1)}
          aria-label="Next project"
          className={ARROW_BUTTON_CLASS}
        >
          <ChevronRight size={23} strokeWidth={1.25} />
        </button>
      </motion.div>

      <div className="mt-20 flex items-center justify-center gap-3">
        {PORTFOLIO_PROJECTS.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goToProject(i)}
            aria-label={`Go to ${project.name}`}
            className={`rounded-full border transition-all ${i === centerIndex
              ? "h-[1.125rem] w-[1.125rem] border-[#2460A4] bg-[#2460A4]"
              : "h-[0.9375rem] w-[0.9375rem] border-black/50 bg-transparent hover:border-[#2460A4]"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
