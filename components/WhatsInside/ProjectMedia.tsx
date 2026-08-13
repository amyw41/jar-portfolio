"use client";

import Image from "next/image";
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

  return (
    <div className={`relative aspect-[846/635] w-full overflow-hidden rounded-md border border-gray-200 ${className}`}>
      {project.mediaType === "video" ? (
        // Muted-loop, but no `autoPlay` — see useAutoPlayInView, it starts
        // this fresh from the beginning once actually scrolled into view
        // instead of every video on the page trying to play at once on
        // mount. playsInline keeps it inline (not fullscreen) on iOS,
        // required for autoplay to work there at all.
        <video
          ref={videoRef}
          src={project.media}
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
      ) : (
        <Image
          src={project.media}
          alt={project.name}
          fill
          sizes={sizes}
          draggable={false}
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
      )}
    </div>
  );
}
