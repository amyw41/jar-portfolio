import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectMedia from "@/components/WhatsInside/ProjectMedia";
import ProjectCardText from "@/components/WhatsInside/ProjectCardText";
import SpotifyCaseStudy from "@/components/WhatsInside/SpotifyCaseStudy";
import { PORTFOLIO_PROJECTS } from "@/lib/projects";

// Projects with a full, written case study — rendered via a dedicated
// component instead of the generic "coming soon" shell below. Keyed by
// project id; add to this map as more case studies get written up.
const CASE_STUDIES: Record<string, React.ComponentType> = {
  "spotify-guessr": SpotifyCaseStudy,
};

// Matches the /etc category page's own back-button styling exactly
// (app/etc/[category]/page.tsx's ARROW_BUTTON_CLASS).
const ARROW_BUTTON_CLASS =
  "flex h-[2.25rem] w-[2.25rem] flex-shrink-0 items-center justify-center rounded-full border border-black/50 bg-white text-black/50 transition-colors hover:border-[#2460A4] hover:text-[#2460A4]";

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
      // Case studies hide the taskbar entirely (see Taskbar.js's
      // isCaseStudyRoute check) — nothing above them to subtract, so their
      // own minHeight is just the full 100dvh, not
      // calc(100dvh - var(--taskbar-height)) like the generic shell (which
      // still sits below a visible taskbar) needs.
      style={{ minHeight: CaseStudy ? "100dvh" : "calc(100dvh - var(--taskbar-height, 4.375rem))" }}
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
                className="mt-4 inline-block rounded-full bg-[#2460A4] px-6 py-2 font-instrument-sans text-sm text-white transition-colors hover:bg-[#1c4a80]"
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
