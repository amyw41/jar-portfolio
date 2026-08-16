"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Gallery from "./Gallery";
import Experience from "./Experience";

type View = "experience" | "gallery";

const VIEWS: { id: View; label: string }[] = [
  { id: "gallery", label: "Gallery" },
  { id: "experience", label: "Experience" },
];

// Shared fade-up shape for the heading/toggle/grid below — each one just
// supplies its own `transition` (for the grid's extra delay), the actual
// hidden/visible values live here once instead of being copy-pasted three
// times.
const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

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
      {/* Single scroll-trigger for the whole reveal — heading, toggle, and
          grid all key off this one observer instead of each watching its
          own position, and just fade up together (grid slightly delayed).
          Previously the grid had its own separate whileInView, and since
          it sits well below the heading (mt-26, below the toggle too), it
          often hadn't crossed into the viewport yet by the time the
          heading had already revealed itself — so the projects visibly sat
          hidden until the user scrolled further, even though the section
          itself was already on screen. amount: 0.1 here (low, and checked
          against this whole wrapper rather than the heading alone) means
          the trigger fires as soon as the section starts entering view. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2
          id="work-heading"
          // Real scroll anchor for the "Work" link (lib/scrollToWork.ts) —
          // it targets this heading directly instead of the section's own
          // top edge, so the big pt-36 above doesn't turn into empty space
          // between the header and the heading when you land here.
          variants={REVEAL_VARIANTS}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-instrument text-[clamp(1.6rem,4.5vw,2.5rem)] leading-none text-[#2460A4]"
        >
          What&apos;s inside?
        </motion.h2>

        {/* Same transition (no delay) as the heading above — they fade/slide
            up together instead of the toggle noticeably trailing it. */}
        <motion.div
          variants={REVEAL_VARIANTS}
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

        {/* Each view sizes itself independently (Gallery caps at 1374px via
            its own max-w-*, Experience at 640px via its own border-wrapped
            column) and is simply centered within this full-width wrapper
            via its own internal mx-auto — the two views intentionally end
            up different widths, same reasoning as Gallery vs. the old
            Carousel view this replaced. Only a small delay (0.2s) now, not
            a second scroll-triggered wait — see the wrapper comment
            above. */}
        <motion.div
          id="work-grid"
          variants={REVEAL_VARIANTS}
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
              className={view === "gallery" ? "mt-[2px]" : "-mt-12"}
            >
              {view === "gallery" ? <Gallery /> : <Experience />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
