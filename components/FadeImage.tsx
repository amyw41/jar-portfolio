"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { motion } from "framer-motion";
import { SHIMMER_BLUR_DATA_URL } from "@/lib/blurPlaceholder";

// Every real photo on the site (About's framed photo + border, PlateCircle,
// the /etc overview's scattered photos, the /etc detail wheel) already
// showed SHIMMER_BLUR_DATA_URL — a flat light-gray box — as a placeholder
// while loading, via next/image's own placeholder="blur". But next/image
// only blurs the placeholder itself; it doesn't add any transition for the
// swap from that gray box to the real photo, so the real photo just pops in
// abruptly whenever it happens to finish loading — often after this page's
// own mount/whileInView slide-up animation has already settled, since that
// animation only ever watches scroll position or mount timing, never
// whether the image underneath is actually ready. That mismatch is the
// "jarring gray box" symptom.
//
// FadeImage fixes this once, centrally, instead of every caller re-solving
// it: it keeps the same shimmer placeholder (so there's still something on
// screen immediately), but cross-fades the real <Image> in on top of it via
// onLoad, the same load-gated-opacity fix already used for jar.png in
// Jar.js and for every image in ProjectMedia.tsx. Assumes `fill` (every
// current caller already renders into a sized, position:relative box) —
// pass every other next/image prop straight through.
export default function FadeImage(
  props: Omit<ImageProps, "placeholder" | "blurDataURL" | "onLoad">
) {
  const [loaded, setLoaded] = useState(false);
  const { className, ...rest } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0"
    >
      <Image
        {...rest}
        placeholder="blur"
        blurDataURL={SHIMMER_BLUR_DATA_URL}
        onLoad={() => setLoaded(true)}
        className={className}
      />
    </motion.div>
  );
}
