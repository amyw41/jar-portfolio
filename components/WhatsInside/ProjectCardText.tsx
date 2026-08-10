"use client";

import { motion } from "framer-motion";

// Shared by Carousel.tsx and Gallery.tsx so the name/description markup,
// font, color, alignment, and hover-opacity behavior only need to be right
// in one place — per Amy's reference screenshot: serif name (font-instrument
// — this project's Instrument Serif, not font-instrument-sans), black at 80%
// opacity, both left-aligned. `opacity` is a plain number the caller already
// computed (Gallery's simple hovered ? 0.5 : 1, or Carousel's existing
// textOpacity which already folds in both distance-from-center and hover on
// the centered card) rather than a `hovered` boolean, so this component
// doesn't need to know anything about either view's own fade logic — and
// nothing here animates position/scale, only opacity, per Amy's "hover
// changes color only, nothing moves" decision.
export default function ProjectCardText({
  name,
  description,
  opacity,
  nameFontSize,
  descriptionFontSize,
}: {
  name: string;
  description: string;
  opacity: number;
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
        className="mt-1 font-body font-light text-black/80"
      >
        {description}
      </p>
    </motion.div>
  );
}
