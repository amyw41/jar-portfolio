"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Gallery from "./Gallery";
import Carousel from "./Carousel";

type View = "carousel" | "gallery";

const VIEWS: { id: View; label: string }[] = [
  { id: "gallery", label: "Gallery" },
  { id: "carousel", label: "Carousel" },
];

export default function WhatsInside() {
  const [view, setView] = useState<View>("gallery");

  return (
    // pt-36/pb-36 are equal on purpose: this section is self-contained, like
    // Jar's own min-height + flex centering. Don't tune either value to
    // compensate for spacing elsewhere (e.g. margin-top on Footer) — that
    // coupling is exactly what made this fragile before.
    <section
      id="work"
      // Scroll target for the taskbar's "Work" link — offset by the sticky
      // header's live height (same --taskbar-height var used elsewhere) so
      // a hash/anchor scroll here doesn't land with the heading tucked
      // under the header.
      style={{ scrollMarginTop: "var(--taskbar-height, 4.375rem)" }}
      className="mx-auto w-full max-w-[96rem] px-4 pb-36 pt-36 text-center"
    >
      <motion.h2
        id="work-heading"
        // Real scroll anchor for the "Work" link (lib/scrollToWork.ts) — it
        // targets this heading directly instead of the section's own top
        // edge, so the big pt-36 above doesn't turn into empty space between
        // the header and the heading when you land here.
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-instrument text-[clamp(1.6rem,4.5vw,2.5rem)] leading-none text-[#2460A4]"
      >
        What&apos;s inside?
      </motion.h2>

      {/* Same transition (no delay) as the heading above — they fade/slide
          up together instead of the toggle noticeably trailing it. */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-6 flex items-center justify-center"
      >
        <div className="inline-flex overflow-hidden rounded-[5px] border border-[#2460A4] font-body text-[16px] font-normal">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              aria-pressed={view === v.id}
              className={`px-8 py-0.5 transition-colors ${i === 0 ? "border-r border-[#2460A4]" : ""} ${view === v.id
                ? "bg-[#2460A4] text-white"
                : "bg-white text-[#2460A4] hover:bg-[#BFDBFE]"
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* No longer locked to Carousel's own arrow-to-arrow width — each view
          now sizes itself independently (Gallery caps at 1374px via its own
          max-w-*, Carousel sizes from computeLayout) and is simply centered
          within this full-width wrapper via its own internal mx-auto. The
          two views intentionally end up different widths; forcing them
          equal would mean either shrinking Gallery's now much-larger spec
          size or blowing Carousel up to match it (crowding its neighbors/
          arrows off-screen) — flagged as a deliberate call, not an
          oversight, in the "fix portfolio visuals" prompt. */}
      <motion.div
        id="work-grid"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        // amount: "some" (any pixel of the grid on screen), not 0.2 — the
        // taskbar's "Work" link (lib/scrollToWork.ts) deliberately only
        // scrolls as far as the heading, so the heading itself stays
        // visible instead of being scrolled past. That means this grid is
        // usually just barely peeking into view (or not at all yet) right
        // after that scroll lands, not 20% of the way in — requiring 0.2
        // here left it sitting invisible (opacity: 0) until the user
        // scrolled further themselves.
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="mx-auto mt-26 w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={view === "gallery" ? "mt-[2px]" : undefined}
          >
            {view === "gallery" ? <Gallery /> : <Carousel />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
