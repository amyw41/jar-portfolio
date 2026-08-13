import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectMedia from "@/components/WhatsInside/ProjectMedia";
import ProjectCardText from "@/components/WhatsInside/ProjectCardText";
import SpotifyCaseStudy from "@/components/WhatsInside/SpotifyCaseStudy";
import CyberSeaCaseStudy from "@/components/WhatsInside/CyberSeaCaseStudy";
import SkinSproutCaseStudy from "@/components/WhatsInside/SkinSproutCaseStudy";
import { PORTFOLIO_PROJECTS } from "@/lib/projects";
import { ARROW_BUTTON_CLASS } from "@/lib/styles";

// Projects with a full, written case study — rendered via a dedicated
// component instead of the generic "coming soon" shell below. Keyed by
// project id; add to this map as more case studies get written up.
const CASE_STUDIES: Record<string, React.ComponentType> = {
  "spotify-guessr": SpotifyCaseStudy,
  cybersea: CyberSeaCaseStudy,
  skinsprout: SkinSproutCaseStudy,
};

// Prerenders one static page per real project at build time — idiomatic for
// a small, known list like this rather than leaving every /projects/* visit
// to resolve at request time.
export function generateStaticParams() {
  return PORTFOLIO_PROJECTS.map((project) => ({ id: project.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PORTFOLIO_PROJECTS.find((p) => p.id === id);
  if (!project) notFound();

  const CaseStudy = CASE_STUDIES[id];

  return (
    <section
      // Case studies manage their own top/bottom spacing (a full-height
      // sidebar that should sit flush against the taskbar and run flush
      // down to the footer, no gap) — the generic pb-24/pt-6 here is only
      // for the plain "coming soon" shell.
      className={`relative mx-auto flex w-full max-w-[96rem] flex-col px-4 text-center ${
        CaseStudy ? "" : "pb-24 pt-6"
      }`}
      // Taskbar renders on every route now, case studies included, so both
      // branches need the same calc(100dvh - var(--taskbar-height)) —
      // nothing case-study-specific here anymore.
      style={{ minHeight: "calc(100dvh - var(--taskbar-height, 4.375rem))" }}
    >
      {/* Matches /etc/[category]/page.tsx's own back-link positioning
          exactly — fixed (not absolute) so it lines up with Taskbar.js's
          logo inset at any viewport width, not just within this section's
          own max-w-[96rem] box. Case studies get their own full-height
          sidebar nav instead (see SpotifyCaseStudy.tsx), so this floating
          button is skipped there rather than sitting on top of it. */}
      {!CaseStudy && (
        <Link
          href="/"
          aria-label="Back to home"
          className={`fixed left-4 z-20 md:left-8 ${ARROW_BUTTON_CLASS}`}
          style={{ top: "calc(var(--taskbar-height, 4.375rem) + 0.75rem)" }}
        >
          <ArrowLeft size={20} strokeWidth={1.25} />
        </Link>
      )}

      {CaseStudy ? (
        <div className="mx-auto w-full">
          <CaseStudy />
        </div>
      ) : (
        <div className="mx-auto mt-24 w-full max-w-[662px]">
          <ProjectMedia project={project} sizes="(min-width: 640px) 662px, 90vw" />

          <div className="mt-3">
            <ProjectCardText
              name={project.name}
              description={project.description}
              opacity={1}
              nameFontSize={34}
              descriptionFontSize={20}
            />
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-[#2460A4] px-6 py-2 font-body text-sm text-white transition-colors hover:bg-[#1c4a80]"
              >
                Visit project →
              </a>
            )}
          </div>

          {/* No case-study schema/fields exist yet — this is a minimal
              shell, not full content. Same "Coming soon." treatment as the
              /etc category page's own empty-state
              (app/etc/[category]/page.tsx), not invented copy/styling for
              the same idea. */}
          <p className="mt-16 text-left font-body text-sm text-gray-400">
            Case study coming soon.
          </p>
        </div>
      )}
    </section>
  );
}
