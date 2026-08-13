"use client";

import {
  CaseStudyHero,
  CaseStudyImage,
  CaseStudyLayout,
  Row,
  Section,
  TEXT,
  type SectionNavItem,
} from "@/components/WhatsInside/CaseStudyKit";
import TextHighlight from "@/components/WhatsInside/TextHighlight";

// CyberSea case study — same shell/primitives as Spotify Guessr (see
// CaseStudyKit.tsx), ported from Amy's old Framer portfolio
// (https://amywang.framer.website, "CyberSea" project) per her request:
// "copy the exact style of the spotify guessr case study and replace the
// images and text and update the highlight color to match this."
//
// A few pieces of copy below were transcribed from a compressed screenshot
// of the old page and were genuinely hard to read at full confidence —
// every one of those spots is marked with a `// CHECK:` comment so they're
// easy to find and fix. See the chat response for the full list.

const HIGHLIGHT = "#e5eef7";

const SECTION_NAV: SectionNavItem[] = [
  { id: "initial-planning", label: "01 Initial Planning" },
  { id: "research", label: "02 Research" },
  { id: "the-solution", label: "03 The Solution" },
  { id: "implementation", label: "04 Implementation" },
  { id: "final-project", label: "05 Final Project" },
  { id: "learnings", label: "06 Learnings" },
];

// CHECK: TEAM/ROLE/SKILLS values are a best-effort read of a very small
// meta box in the source screenshot — flagged in chat for Amy to confirm/
// correct. TIMELINE is the most confident one since it matches the
// "1st Overall @uOttahacks" project blurb already used on the homepage
// (lib/projects.ts), and was a single line in the source, not two.
const META = [
  { label: "TIMELINE", values: ["January 2026 · 36 hrs"] },
  { label: "TEAM", values: ["4 members"] },
  { label: "ROLE", values: ["Product Designer", "Visual Designer"] },
  { label: "SKILLS", values: ["Product Design", "Product Strategy", "Prototyping"] },
];

// Persona cards for the Research section — same "one card per person" idea
// as Spotify's 4 Key Insights cards, just with a name/role header instead
// of a number.
const PERSONAS = [
  {
    name: "Percy",
    // CHECK: role line was small/blurry in the source screenshot.
    role: "Maritime route planner",
    needs: [
      "Easy-to-use platform to make quick decisions",
      "Accurate data that's ready whenever it's needed",
    ],
    // CHECK: pain point wording is a best-effort read.
    painPoints: "Existing tools aren't accurate or accessible enough to trust for real planning work.",
  },
  {
    name: "Johnny",
    // CHECK: role line was small/blurry in the source screenshot.
    role: "A bit curious about the Arctic",
    needs: ["A simple interface that feels as familiar as apps he already uses"],
    // CHECK: pain point wording is a best-effort read.
    painPoints: "Simplicity over technical accuracy — no interest in complexity for its own sake.",
  },
];

// The web app's 3 core features, each backed by one of the real demo
// clips dropped into public/images/projects/cybersea/.
const FEATURES = [
  {
    label: "Visual · Live Map",
    // CHECK: caption is a best-effort read of a very small line of text.
    caption: "See live route conditions across the Arctic on one interactive map.",
    src: "/images/projects/cybersea/live%20map.mp4",
  },
  {
    label: "Mental · Dashboard",
    caption: "Get route data at a glance on a clean, focused dashboard.",
    src: "/images/projects/cybersea/dashboard.mp4",
  },
  {
    label: "Physical · Interactive 3D Models",
    caption: "Explore real 3D models to understand terrain and routes hands-on.",
    src: "/images/projects/cybersea/3d%20mesh.mp4",
  },
];

export default function CyberSeaCaseStudy() {
  return (
    <CaseStudyLayout sectionNav={SECTION_NAV}>
      <CaseStudyHero
        title="CyberSea"
        subtitle="1st Overall @ uOttaHacks 2026"
        heroSrc="/images/projects/cybersea/cybersea.mp4"
        heroAlt="CyberSea app preview"
        heroVideo
        highlightColor={HIGHLIGHT}
        meta={META}
      />

      {/* 01 / Initial Planning */}
      <Section id="initial-planning">
        <Row
          // CHECK: "The Thales Challenge" — read with reasonable confidence
          // by cross-referencing the Result callout in 05/Final Project
          // ("2nd for the Thales Challenge"), which suggests this section's
          // heading names the hackathon's Thales-sponsored prompt.
          eyebrow="01 / Initial Planning"
          heading="The Thales Challenge"
          media={
            <div className="space-y-[36px]">
              <p className={`${TEXT.content} text-center`}>3+ different views are needed to plan ONE route</p>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
                <CaseStudyImage
                  src="/images/projects/cybersea/route1.avif"
                  alt="Arctic shipping route view 1"
                  ratio="512/339"
                  highlightColor={HIGHLIGHT}
                />
                <CaseStudyImage
                  src="/images/projects/cybersea/route2.avif"
                  alt="Arctic shipping route view 2"
                  ratio="512/230"
                  highlightColor={HIGHLIGHT}
                />
                <CaseStudyImage
                  src="/images/projects/cybersea/route3.avif"
                  alt="Arctic shipping route view 3"
                  ratio="512/338"
                  highlightColor={HIGHLIGHT}
                />
              </div>
            </div>
          }
        >
          <p>
            The Arctic is unpredictable. Conditions constantly change, and routes shift
            without warning. For maritime operators, this is a problem, and for the
            average person, even beginning to understand the Arctic feels impossible.
          </p>
          <p className="mt-[36px]">
            This led us to ask:{" "}
            <TextHighlight>
              &ldquo;Why is understanding the Arctic still so complicated that even
              professionals report it as overwhelming?&rdquo;
            </TextHighlight>
          </p>
        </Row>

        <Row
          heading="Why does this matter?"
          media={
            <div className="grid grid-cols-1 gap-6 rounded-[10px] p-6 text-center sm:grid-cols-3 sm:p-8" style={{ backgroundColor: HIGHLIGHT }}>
              {/* CHECK: the three captions below are a best-effort read of
                  very small text — the stat numbers themselves (12-15%,
                  80%, 4x) were legible with confidence. */}
              {[
                { stat: "12-15%", caption: "of global shipping passes through Arctic waters" },
                { stat: "80%", caption: "of Arctic data requires expert interpretation" },
                { stat: "4x", caption: "more challenging to plan Arctic routes globally" },
              ].map((s) => (
                <div key={s.stat}>
                  <p className="font-body text-[32px] font-medium text-black/90">{s.stat}</p>
                  <p className={`mt-1 ${TEXT.content}`}>{s.caption}</p>
                </div>
              ))}
            </div>
          }
        >
          <p>
            <TextHighlight>
              Understanding the Arctic isn&apos;t just an industry concern — it has
              real-world impacts.
            </TextHighlight>
          </p>
        </Row>
      </Section>

      {/* 02 / Research */}
      <Section id="research">
        <Row
          eyebrow="02 / Research"
          heading="Personas"
          media={
            <div className="space-y-4">
              {PERSONAS.map((p) => (
                <div key={p.name} className="rounded-[10px] bg-[#f7f7f7] p-6">
                  <p className="font-body text-[18px] font-medium text-black text-left">{p.name}</p>
                  <p className={`mt-0.5 ${TEXT.content}`}>{p.role}</p>

                  <p className="mt-4 font-body text-[16px] font-medium text-black/80 text-left">Needs</p>
                  <ul className={`mt-1 space-y-1 ${TEXT.content}`}>
                    {p.needs.map((n, i) => (
                      <li key={n} className="flex gap-2">
                        <span aria-hidden="true">{i + 1}.</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 font-body text-[16px] font-medium text-black/80 text-left">Pain Points</p>
                  <p className={TEXT.content}>{p.painPoints}</p>
                </div>
              ))}
            </div>
          }
        />

        <Row
          heading="Problem Statement:"
          media={
            <div className="rounded-[8px] px-6 py-[14px]" style={{ backgroundColor: HIGHLIGHT }}>
              <p className="font-body text-[22px] font-light text-black/60 text-center">
                How might we close the gap between Arctic expertise and public
                understanding?
              </p>
            </div>
          }
        />
      </Section>

      {/* 03 / The Solution */}
      <Section id="the-solution">
        <Row
          eyebrow="03 / The Solution"
          heading="3 main features"
          media={
            <div className="space-y-[56px]">
              {FEATURES.map((f) => (
                <div key={f.label}>
                  <p className={TEXT.groupHeader}>{f.label}</p>
                  <p className={`mt-1 ${TEXT.content}`}>{f.caption}</p>
                  <CaseStudyImage
                    src={f.src}
                    alt={f.label}
                    ratio="16/9"
                    video
                    highlightColor={HIGHLIGHT}
                    className="mt-4"
                  />
                </div>
              ))}
            </div>
          }
        >
          <p>
            We designed a web app that simplifies the complexities of the Arctic through{" "}
            <TextHighlight>3 main features:</TextHighlight>
          </p>
        </Row>
      </Section>

      {/* 04 / Implementation */}
      <Section id="implementation">
        <Row
          eyebrow="04 / Implementation"
          heading="Challenge"
          media={
            <div className="rounded-[8px] bg-[#fbeded] px-6 py-[14px]">
              <p className="font-body text-[22px] font-light text-black/60 text-center">
                How can we balance heavy branding with accessibility?
              </p>
            </div>
          }
        />

        <Row
          heading="Moodboard"
          media={
            <CaseStudyImage
              src="/images/projects/cybersea/inspo.webp"
              alt="CyberSea moodboard collage of visual references"
              ratio="1024/650"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          {/* CHECK: paraphrased from a partially-legible paragraph. */}
          <p>
            Creating a moodboard early on helped us actually see the visual direction
            before committing to it, rather than guessing at what &ldquo;heavy branding&rdquo;
            should look like.
          </p>
        </Row>

        <Row
          heading="Initial Sketches"
          media={
            <div className="space-y-2">
              {/* Only one sketch asset exists in the repo — the original
                  page showed this as two side-by-side labeled versions
                  ("Version 1: Globe" / "Version 2: Ship"); CHECK whether a
                  second sketch image should be added once available. */}
              <p className={TEXT.content}>Version 1: Globe · Version 2: Ship</p>
              <CaseStudyImage
                src="/images/projects/cybersea/sketch.webp"
                alt="Initial sketches: globe concept and ship concept"
                ratio="1024/753"
                highlightColor={HIGHLIGHT}
              />
            </div>
          }
        />

        <Row
          heading="Select Iterations"
          media={
            // Only one iteration asset exists in the repo — the original
            // page showed several iteration screenshots each paired with a
            // "Problem" (pink) / "Solution" (green) caption; those captions
            // were too small to transcribe reliably, so CHECK this section
            // once more iteration images are available.
            // Real asset is a tall app-screen capture (1503x2048) — capped
            // and centered rather than stretched full-width, same idea as
            // Spotify's own narrow "Screens" grid images.
            <div className="mx-auto max-w-[380px]">
              <CaseStudyImage
                src="/images/projects/cybersea/design1.webp"
                alt="An early design iteration of the CyberSea interface"
                ratio="1503/2048"
                highlightColor={HIGHLIGHT}
              />
            </div>
          }
        />
      </Section>

      {/* 05 / Final Project */}
      <Section id="final-project">
        <Row
          eyebrow="05 / Final Project"
          heading="CyberSea"
          media={
            <CaseStudyImage
              src="/images/projects/cybersea/fullvid.gif"
              alt="CyberSea final product walkthrough"
              ratio="1280/772"
              highlightColor={HIGHLIGHT}
            />
          }
          after={
            // CHECK: swap in the real repo URL — placeholder for now.
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: HIGHLIGHT }}
              className={`block w-full rounded-[8px] px-6 py-[14px] !text-center transition-transform duration-200 hover:scale-[1.01] ${TEXT.frame}`}
            >
              Check it out on GitHub!
            </a>
          }
        />

        <Row
          heading="Result"
          media={
            <div className="rounded-[10px] bg-[#f7f7f7] p-6">
              <p className={TEXT.content}>We&apos;re extremely proud of winning:</p>
              <ul className={`mt-2 space-y-1 ${TEXT.content}`}>
                <li className="flex gap-2">
                  <span aria-hidden="true">–</span>
                  <span>1st overall</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">–</span>
                  <span>2nd for the Thales Challenge</span>
                </li>
              </ul>
            </div>
          }
        />
      </Section>

      {/* 06 / Learnings */}
      <Section id="learnings">
        <Row eyebrow="06 / Learnings" heading="Working on a team of non-designers">
          <p>
            Design is often reduced to just &ldquo;making things look aesthetic,&rdquo;
            something I especially noticed while working with a team of non-designers. I
            often found myself in a position where teammates wanted to add a feature or
            element that would just make the interface feel cluttered.
          </p>
          <p className="mt-[36px]">
            {/* CHECK: paraphrased from a partially-legible paragraph. */}
            That meant my job wasn&apos;t just deciding how things looked — spacing and
            content aren&apos;t just visual choices, they shape how usable the whole
            experience is. It taught me that a huge part of design isn&apos;t just
            creating solutions, but{" "}
            <TextHighlight>communicating effectively to others</TextHighlight> why those
            solutions matter.
          </p>
        </Row>

        <Row heading="The Hackathon Mindset">
          {/* CHECK: this section was legible but paraphrased in places —
              worth a read-through against the original page. */}
          <p>
            Unlike traditional projects, hackathons push you to turn quick concepts into
            something polished, fast. Our short timeframe forced us to reach clarity in
            our decisions without overthinking or wasting time.
          </p>
          <p className="mt-[36px]">
            Through this experience, I learned the importance of iterating quickly and
            refining ideas as a team, rather than perfecting every part in isolation.
            That said, the end result was more impactful than I ever expected.
          </p>
          <p className="mt-[36px]">
            Overall, I&apos;m extremely proud of what we accomplished in the 36-hour
            timeframe.
          </p>
        </Row>
      </Section>
    </CaseStudyLayout>
  );
}
