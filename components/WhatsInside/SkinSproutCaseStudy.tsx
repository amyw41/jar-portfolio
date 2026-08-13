"use client";

import {
  CaseStudyHero,
  CaseStudyImage,
  CaseStudyLayout,
  PlaceholderBox,
  Row,
  Section,
  TEXT,
  type SectionNavItem,
} from "@/components/WhatsInside/CaseStudyKit";

// SkinSprout case study — same shell/primitives as Spotify Guessr and
// CyberSea (see CaseStudyKit.tsx), copy transcribed verbatim from Amy's own
// pasted text (not a screenshot read this time — she flagged the source
// page as still a WIP, and a couple of spots below still show it, see the
// `// CHECK:` comments).
//
// Highlight color: no explicit hex was given for this one (unlike CyberSea's
// e5eef7) — using the project's own homepage accent (#FBDCE7, lib/projects.ts)
// since that's the pink already associated with SkinSprout across the site,
// and matches the pink tone visible in the source screenshots. Flag if you
// want a different one.
const HIGHLIGHT = "#FBDCE7";

const SECTION_NAV: SectionNavItem[] = [
  { id: "initial-planning", label: "01 Initial Planning" },
  { id: "research", label: "02 Research" },
  { id: "design-process", label: "03 Design Process" },
  { id: "final-project", label: "04 Final Project" },
  { id: "learnings", label: "05 Learnings" },
];

const META = [
  { label: "TIMELINE", values: ["May 2026"] },
  { label: "TEAM", values: ["1 designer (me!)"] },
  { label: "ROLE", values: ["Product design", "Visual design"] },
  { label: "SKILLS", values: ["Product design", "Branding"] },
];

const INSIGHTS = [
  {
    title: "Too many voices with no way to weigh them.",
    body: "Influencers, brands, and buzzwords all compete for trust, leaving users unable to tell good advice from marketing.",
  },
  {
    title: "Generic advice doesn't work for everyone.",
    body: "Broad categories like “oily” or “sensitive” hide the fact that two people can react completely differently to the same product.",
  },
  {
    title: "Ingredients are unreadable, so cause and effect stays hidden.",
    body: "Users can't connect a reaction to its cause when they don't understand what's in the product to begin with.",
  },
  {
    title: "Without a record, past products vanish, so nothing gets learned.",
    body: "People can't recall what they've tried before, and tracking tools don't have enough payoff to motivate real use.",
  },
];

// Small 3-column stat callout — same shape as CyberSea's "Why does this
// matter?" block, reused here since SkinSprout's page has two of these
// (the discovery-stats block in 01, the usability-testing block in 03).
function StatRow({ stats }: { stats: { stat: string; caption: string }[] }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 rounded-[10px] p-6 text-center sm:grid-cols-3 sm:p-8"
      style={{ backgroundColor: HIGHLIGHT }}
    >
      {stats.map((s) => (
        <div key={s.stat}>
          <p className="font-body text-[32px] font-medium text-black/90">{s.stat}</p>
          <p className={`mt-1 ${TEXT.content}`}>{s.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default function SkinSproutCaseStudy() {
  return (
    <CaseStudyLayout sectionNav={SECTION_NAV}>
      <CaseStudyHero
        title="SkinSprout"
        subtitle="Make skincare easier."
        heroSrc="/images/projects/skinsprout.mp4"
        heroAlt="SkinSprout app preview"
        heroVideo
        highlightColor={HIGHLIGHT}
        meta={META}
      />

      {/* Amy's source page still carries this literal banner — keeping it
          verbatim per "accurately put this onto my website," but it's an
          easy one-line delete in this file once the page is actually done. */}
      <div className="mt-8 rounded-[8px] px-6 py-[14px]" style={{ backgroundColor: HIGHLIGHT }}>
        <p className="font-body text-[16px] font-medium text-black/70 text-center">
          THIS PAGE IS CURRENTLY A WIP!
        </p>
      </div>

      {/* 01 / Initial Planning */}
      <Section id="initial-planning">
        <Row
          eyebrow="01 / Initial Planning"
          heading="The Problem"
          media={
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <CaseStudyImage
                src="/images/projects/skinsprout/current1.webp"
                alt="A skincare recommendations app recommending a product"
                ratio="1024/598"
                highlightColor={HIGHLIGHT}
              />
              <CaseStudyImage
                src="/images/projects/skinsprout/current2.avif"
                alt="A dense skincare ingredient list"
                ratio="1024/527"
                highlightColor={HIGHLIGHT}
              />
            </div>
          }
          after={
            <>
              <p>
                Even users who do know skincare have a hard time. Ingredient lists are
                dense and never optimized for a consumer.
              </p>
              <p className="mt-[36px]">
                Users are stuck choosing between two bad options: trust marketing they
                know is unreliable, or self-educate through a system that was never
                built to be understood.
              </p>
              <div className="mt-[36px]">
                <StatRow
                  stats={[
                    { stat: "13/20", caption: "people discover products on social media." },
                    { stat: "10/13", caption: "find the products ineffective." },
                    { stat: "9/10", caption: "struggle to figure out why." },
                  ]}
                />
              </div>
            </>
          }
        >
          <p>Finding skincare that actually works for your skin shouldn&apos;t be this difficult.</p>
          <p className="mt-[36px]">
            But the industry is built to sell, not to inform. Influencers promote
            anything that would give them a brand deal, and marketing is hinged on
            exaggerations.
          </p>
          <p className="mt-[36px]">
            The result: Users end up buying based on who has the biggest following, not
            what they actually need.
          </p>
        </Row>

        <Row
          heading="The Solution"
          media={
            <div className="space-y-[56px]">
              {[
                {
                  caption: 'A tracking system where you can log your skincare in your "shelf".',
                  src: "/images/projects/skinsprout/sol1.avif",
                  alt: "SkinSprout's My Shelf screen, showing tracked skincare products",
                },
                {
                  caption: "Product info, based on your own opinions and other general facts.",
                  src: "/images/projects/skinsprout/sol2.avif",
                  alt: "A tracked product's detail screen with rating, cost, and personal notes",
                },
                {
                  caption:
                    "A comparison page listing out which product is recommended — and the reasoning based on your skincare history.",
                  src: "/images/projects/skinsprout/sol3.avif",
                  alt: "A product comparison screen showing a recommended vs. not recommended product",
                },
              ].map((f) => (
                <div key={f.src} className="mx-auto max-w-[280px]">
                  <CaseStudyImage src={f.src} alt={f.alt} ratio="906/1824" highlightColor={HIGHLIGHT} />
                  <p className={`mt-3 text-center ${TEXT.content}`}>{f.caption}</p>
                </div>
              ))}
            </div>
          }
        >
          <p>
            A mobile app that allows users to track products, and recommends future
            products based on their skincare history.
          </p>
        </Row>
      </Section>

      {/* 02 / Research */}
      <Section id="research">
        <Row
          eyebrow="02 / Research"
          heading="Affinity Mapping"
          media={
            <div className="space-y-[36px]">
              <CaseStudyImage
                src="/images/projects/skinsprout/am.avif"
                alt="Affinity map grouping survey responses into 4 key insight clusters"
                ratio="1024/803"
                highlightColor={HIGHLIGHT}
              />
              <div className="space-y-4">
                {INSIGHTS.map((insight, i) => (
                  <div key={insight.title} className="flex gap-4 rounded-[10px] bg-[#f7f7f7] p-6">
                    <span className="font-body text-lg font-medium text-black">{i + 1}</span>
                    <div>
                      <p className="font-body text-[18px] font-light text-black text-left">{insight.title}</p>
                      <p className={`mt-1 ${TEXT.content}`}>{insight.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <p>
            Through analysis of 20 user survey responses (aged 17-24), I mapped out the
            responses to better understand the problem.
          </p>
          <p className="mt-[36px]">This revealed 4 key insights:</p>
        </Row>

        <Row
          heading="Personas"
          media={
            // CHECK: Amy's pasted text didn't include the actual persona
            // details (names/needs/pain points) — only the intro line
            // below. The source page shows 2 named persona cards; add them
            // here once you've got the real copy.
            <PlaceholderBox
              ratio="4/3"
              label="2 user personas"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          <p>To truly embody the issue, I created 2 personas and narrowed down our target audience.</p>
        </Row>

        <Row
          heading="Competitive Analysis"
          media={
            // CHECK: no real competitive-analysis image yet.
            <PlaceholderBox
              ratio="4/3"
              label="Competitive analysis of existing skincare apps"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          <p>
            Finally, I needed to understand what the market currently looks like, so I
            conducted some quick competitive analysis!
          </p>
        </Row>

        <Row
          heading="Problem Statement:"
          media={
            <div className="rounded-[8px] px-6 py-[14px]" style={{ backgroundColor: HIGHLIGHT }}>
              <p className="font-body text-[22px] font-light text-black/60 text-center">
                How can we make skincare easier to purchase based on each user&apos;s
                personalized skincare history?
              </p>
            </div>
          }
        />
      </Section>

      {/* 03 / Design Process */}
      <Section id="design-process">
        <Row
          eyebrow="03 / Design Process"
          heading="Moodboard"
          media={
            <CaseStudyImage
              src="/images/projects/skinsprout/moodboard.avif"
              alt="Moodboard of skincare apps and modern, simplistic UI references"
              ratio="1024/648"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          <p>
            In order to fully understand the vision, I created a mood board. The main
            inspiration was made of skincare apps and other apps with modern,
            simplistic UI.
          </p>
        </Row>

        <Row
          heading="User Flow Chart"
          media={
            <CaseStudyImage
              src="/images/projects/skinsprout/map.avif"
              alt="User flow chart for adding a new item to the shelf"
              ratio="1024/300"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          <p>
            I didn&apos;t feel the need to make a chart for every interaction as I
            already had a pretty good idea of what the app should look like. However, I
            did make one for some areas where I felt unsure, such as how adding new
            items to the shelf would look.
          </p>
        </Row>

        {/* CHECK: "Branding" had no body copy in what you sent — just the
            heading, matching the group-label rows in Spotify's own page
            ("Spotify's Design System", "Branding"). Add real copy once
            it's ready. */}
        <div>
          <p className={TEXT.header}>Branding</p>
          <div className="-mt-0.5">
            <CaseStudyImage
              src="/images/projects/skinsprout/branding.avif"
              alt="SkinSprout brand mark, color palette, typography, and buttons"
              ratio="1024/590"
              highlightColor={HIGHLIGHT}
            />
          </div>
        </div>

        <Row
          heading="Wireframing"
          headingClassName={TEXT.header}
          media={
            <CaseStudyImage
              src="/images/projects/skinsprout/wireframe.avif"
              alt="Low-fidelity wireframes of the SkinSprout screens and flow"
              ratio="1516/2048"
              highlightColor={HIGHLIGHT}
            />
          }
        >
          <p>
            I mapped out the screens + flow using low-fidelity wireframes, ensuring
            navigation was smooth.
          </p>
        </Row>

        <Row
          heading="Testing"
          media={
            <StatRow
              stats={[
                { stat: "5/5", caption: "Completed the flow without any help." },
                { stat: "4/5", caption: "found the information easy to read." },
                { stat: "3/5", caption: "Had trouble editing products inside the shelf." },
              ]}
            />
          }
        >
          <p>
            The low-fi was my first iteration to ensure everything made sense. I tested
            the flow with 5 users who all know different amounts of skincare.
          </p>
        </Row>

        <Row
          heading="Design Choices"
          media={
            <div className="space-y-[36px]">
              <div className="rounded-[8px] bg-[#fbeded] px-6 py-[14px]">
                <p className="font-body text-[22px] font-light text-black/60 text-center">
                  Navigation problem: Users needed a way to move between stat cards
                  without breaking the visual rhythm of the layout.
                </p>
              </div>
              <p className={TEXT.content}>
                Currently, the cards are aligned vertically. Do users swipe, tap, or
                should they click somewhere else on the screen?
              </p>
              {/* CHECK: no real comparison-mockup image yet. */}
              <PlaceholderBox
                ratio="16/9"
                label="Navigation options compared: vertical arrows vs. no arrows"
                highlightColor={HIGHLIGHT}
              />
            </div>
          }
        />

        <Row heading="Decision">
          <p>
            Despite the vertical arrows having a clear next step, I decided against it
            because it cluttered the screen too much.
          </p>
          <p className="mt-[36px]">
            So we went with the no arrow option. Users can swipe or tap to move onto the
            next screen. The layering is intuitive enough for the next step to be
            obvious.
          </p>
        </Row>
      </Section>

      {/* 04 / Final Project */}
      <Section id="final-project">
        <Row
          eyebrow="04 / Final Project"
          heading="Screens"
          media={
            // CHECK: no real final-screens grid yet.
            <PlaceholderBox
              ratio="16/9"
              label="Final SkinSprout app screens"
              highlightColor={HIGHLIGHT}
            />
          }
          after={
            // CHECK: this is the biggest one — the Figma link Amy pasted
            // (".../spotify-game?...") is literally the Spotify Guessr
            // prototype link, carried over from that case study while this
            // page was being drafted. Swap in the real SkinSprout Figma URL
            // before this goes live.
            <a
              href="https://www.figma.com/proto/0i9bMQFOCCtSDtrcVcJqNO/spotify-game?node-id=66-264&starting-point-node-id=66%3A264&t=hoMOqtYUHmmOuSGe-1"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: HIGHLIGHT }}
              className={`block w-full rounded-[8px] px-6 py-[14px] !text-center transition-transform duration-200 hover:scale-[1.01] ${TEXT.frame}`}
            >
              Check out the Figma prototype!
            </a>
          }
        />
      </Section>

      {/* 05 / Learnings */}
      <Section id="learnings">
        <Row eyebrow="05 / Learnings" heading="Research first">
          <p>
            This was my first complete solo project. As silly as it sounds, I
            didn&apos;t realize the importance of research in the past (my old workflow
            was pretty messed up, it was idea &rarr; execution &rarr; maybe conduct a
            bit of research to back it up). I now know that research is quite literally
            the most important step in UX. (Maybe I can even say I&apos;m pretty good
            at it now.)
          </p>
        </Row>
      </Section>
    </CaseStudyLayout>
  );
}
