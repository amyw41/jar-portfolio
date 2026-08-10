"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Gallery from "./Gallery";
import Carousel from "./Carousel";

type View = "carousel" | "gallery";

const VIEWS: { id: View; label: string }[] = [
  { id: "carousel", label: "Carousel" },
  { id: "gallery", label: "Gallery" },
];

export default function WhatsInside() {
  const [view, setView] = useState<View>("carousel");

  return (
    // pt-36/pb-36 are equal on purpose: this section is self-contained, like
    // Jar's own min-height + flex centering. Don't tune either value to
    // compensate for spacing elsewhere (e.g. margin-top on Footer) — that
    // coupling is exactly what made this fragile before.
    <section className="mx-auto w-full max-w-[96rem] px-4 pb-36 pt-36 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-instrument text-[clamp(1.6rem,4.5vw,2.5rem)] leading-none text-[#2460A4]"
      >
        What&apos;s inside?
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="mt-6 flex items-center justify-center"
      >
        <div className="inline-flex overflow-hidden rounded-[5px] border border-[#2460A4] font-instrument-sans text-[16px] font-normal">
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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
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
