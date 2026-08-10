"use client";

import Image from "next/image";
import type { PortfolioProject } from "@/lib/projects";

// Fixed 662:510 (≈1.298:1) aspect ratio for every project's media, at every
// breakpoint — replaces the old fixed square (h-*/w-* equal) boxes that
// Carousel.tsx and Gallery.tsx each used to render inline. Centralized here
// so the ratio and the image/video branching only need to be gotten right
// once. Callers control the box's *width* (via their own responsive sizing
// logic); this component derives the height from that width via
// aspect-ratio, never sets it directly.
//
// object-cover (not contain) — Amy's project media isn't all shot/exported
// at exactly 662:510, and cover reads cleaner across a grid of mixed-ratio
// sources than letterboxing would.
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
  return (
    <div className={`relative aspect-[662/510] w-full overflow-hidden rounded-md ${className}`}>
      {project.mediaType === "video" ? (
        // Autoplay-muted-loop — the lower-friction default for a portfolio
        // grid, reads like a GIF with no click needed. playsInline keeps it
        // inline (not fullscreen) on iOS, required for autoplay to work
        // there at all.
        <video
          src={project.media}
          muted
          loop
          playsInline
          autoPlay
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
      ) : (
        <Image
          src={project.media}
          alt={project.name}
          fill
          sizes={sizes}
          draggable={false}
          className="pointer-events-none select-none object-cover"
        />
      )}
    </div>
  );
}
