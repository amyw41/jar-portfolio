"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioProject } from "@/lib/projects";
import { useAutoPlayInView } from "@/lib/useAutoPlayInView";

// Fixed 846:635 (≈1.332:1, ~4:3 — matches the real 848x636 export
// resolution of Amy's screen-recorded project videos) aspect ratio for
// every project's media, at every breakpoint — replaces the old fixed
// square (h-*/w-* equal) boxes that Carousel.tsx and Gallery.tsx each used
// to render inline, and before that a slightly-off 662:510 that cropped
// more of each video's real frame than necessary. Centralized here so the
// ratio and the image/video branching only need to be gotten right once.
// Callers control the box's *width* (via their own responsive sizing
// logic); this component derives the height from that width via
// aspect-ratio, never sets it directly.
//
// object-cover (not contain) — not every piece of project media is shot/
// exported at exactly 846:635 (e.g. Spotify Guessr's screenshot grid), and
// cover reads cleaner across a grid of mixed-ratio sources than
// letterboxing would.
export default function ProjectMedia({
  project,
  sizes,
  className = "",
}: {
  project: PortfolioProject;
  // Only used for the image branch — see next/image's own `sizes` prop.
  sizes: string;
  className?: string;
}) {
  const videoRef = useAutoPlayInView<HTMLVideoElement>();
  // Gates the media's own fade-in on it actually being decoded, same fix
  // already used for jar.png in Jar.js — without this, the card's
  // whileInView slide/fade (in Gallery.tsx / Carousel.tsx) fires purely off
  // scroll position, with no idea whether the image/video underneath has
  // actually finished loading. That mismatch is what caused the "empty box
  // then a late pop-in" jump: the card animates into place on schedule, but
  // slower-loading media just appears whenever it happens to arrive,
  // sometimes well after. Gating opacity on `loaded` means the media only
  // ever becomes visible via its own smooth fade, never a hard pop.
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative aspect-[846/635] w-full overflow-hidden rounded-md border border-gray-200 ${className}`}>
      {project.mediaType === "video" ? (
        // Muted-loop, but no `autoPlay` — see useAutoPlayInView, it starts
        // this fresh from the beginning once actually scrolled into view
        // instead of every video on the page trying to play at once on
        // mount. playsInline keeps it inline (not fullscreen) on iOS,
        // required for autoplay to work there at all. onLoadedData (not
        // onLoadedMetadata) — fires once an actual decoded frame is ready
        // to paint, so the fade-in reveals real video, not a still-black box.
        <motion.video
          ref={videoRef}
          src={project.media}
          muted
          loop
          playsInline
          onLoadedData={() => setLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={project.media}
            alt={project.name}
            fill
            sizes={sizes}
            draggable={false}
            onLoad={() => setLoaded(true)}
            // Turbopack's dev-mode image-optimization cache doesn't bust when
            // a file is replaced at the same path/filename (it keeps serving
            // the first-ever encode indefinitely) — this is exactly the
            // "swapped the file but the site won't show it" symptom, and
            // project media/thumbnails get swapped often during design
            // iteration. Same workaround already used for jar.png in Jar.js
            // and, below, for every image in CaseStudyImage. Production still
            // gets normal next/image optimization.
            unoptimized={process.env.NODE_ENV !== "production"}
            className="pointer-events-none select-none object-cover"
          />
        </motion.div>
      )}
    </div>
  );
}
