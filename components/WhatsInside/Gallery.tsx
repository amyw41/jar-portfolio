"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/lib/projects";
import ProjectMedia from "./ProjectMedia";
import ProjectCardText from "./ProjectCardText";

// The media itself is the card — no background box, no padding frame around
// it. ProjectMedia's own rounded-md is the only visual framing. Card width
// comes entirely from the grid cell (w-full), not a fixed rem size: at the
// 2-column desktop tier that cell is exactly 662px (see Gallery's own
// max-w-[1374px]/gap-[50px] math below), matching ProjectMedia's 662:510
// design ratio exactly.
function GalleryCard({
  project,
  column,
}: {
  project: PortfolioProject;
  column: number;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    // div with role="button", not an actual <button> — matches Carousel's
    // own reasoning: role + onClick + onKeyDown reproduces native button
    // semantics (click + Enter/Space activation, tab stop).
    <motion.div
      role="button"
      onClick={() => router.push(`/projects/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.id}`);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`Open ${project.name}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: column * 0.08 }}
      className="relative flex cursor-pointer flex-col items-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2460A4]"
    >
      {/* Media and text dim together, to 50%, on hover. No hover-scale-zoom
          here (unlike the old items design this inherited it from) — with
          media now filling the grid cell edge-to-edge (w-full, no padding
          cushion), zooming it on hover would overflow into the 50px gap and
          overlap the neighboring card. */}
      <motion.div
        animate={{ opacity: hovered ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-full"
      >
        <ProjectMedia project={project} sizes="(min-width: 640px) 45vw, 90vw" />
      </motion.div>

      <div className="mt-3">
        <ProjectCardText
          name={project.name}
          description={project.description}
          opacity={hovered ? 0.5 : 1}
          nameFontSize={34}
          descriptionFontSize={20}
        />
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  return (
    // w-[90.87%] + max-w-[1374px]: at Amy's 1512px reference viewport,
    // 90.87% of 1512 ≈ 1374px, so the two constraints meet exactly there —
    // below that width the grid scales down proportionally with the
    // viewport; above it, the max-w cap holds it at 1374px instead of
    // growing unbounded. This is now the *only* thing driving Gallery's
    // width — nothing above it in WhatsInside/index.tsx overrides it, so
    // this cap is actually reachable on a wide monitor instead of being
    // trapped inside Carousel's smaller shared wrapper (the bug this
    // "fix portfolio responsiveness" prompt exists to fix). gap-[50px]
    // (both axes) + 2 columns is what makes each card's media land on
    // exactly 662px wide at that reference width: (1374 - 50) / 2 = 662,
    // matching ProjectMedia's own 662:510 ratio. grid-cols-1 sm:grid-cols-2
    // — 2 columns is the ceiling at every width, no lg:grid-cols-3 tier.
    <div className="mx-auto grid w-[90.87%] max-w-[1374px] grid-cols-1 gap-[50px] sm:grid-cols-2">
      {PORTFOLIO_PROJECTS.map((project, i) => (
        <GalleryCard key={project.id} project={project} column={i % 2} />
      ))}
    </div>
  );
}
