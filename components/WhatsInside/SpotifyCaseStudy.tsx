import type { CSSProperties, ReactNode } from "react";

// Full case-study content for the Spotify Guessr project, replicated from
// Amy's old portfolio (https://amywang.framer.website/spotify) at her
// request: "copy this case study exactly." Every image is a placeholder box
// — real files get dropped into the repo and swapped in later.
//
// Layout, per Amy's correction: the whole page reads as a 2-column split.
// Left column (1fr) carries the label — the numbered section eyebrow
// ("01 / Initial Planning") stacked directly on top of the first
// subheading ("The Problem") for that section, then just the bare
// subheading for every row after that. Right column (1.5fr) carries the
// actual content — paragraphs, lists, placeholder media. No serif font
// anywhere on this page; Roboto only, weight does the differentiating.
//
// Rendered only for the "spotify-guessr" project id — see
// app/projects/[id]/page.tsx. Every other project keeps the existing
// minimal "coming soon" shell.

const SECTION_NAV = [
  { id: "initial-planning", label: "01 Initial Planning" },
  { id: "research", label: "02 Research" },
  { id: "design-process", label: "03 Design Process" },
  { id: "final-project", label: "04 Final Project" },
  { id: "learnings", label: "05 Learnings" },
];

// Solid, softly-colored rounded box with the caption/description baked in
// as centered text — matches Amy's reference exactly (a colored rectangle
// with text inside), not an empty dashed frame.
// Text system for this page:
//   header    — section number/title (e.g. "01 / Initial Planning"): black, medium, 28px
//   subheader — the sub-label (e.g. "The Problem"): black/80, regular, 24px
//   content   — body copy: black/60, light, 18px
//   frame     — text sitting inside a colorful/placeholder box: black/60, light, 24px
const TEXT = {
  header: "font-body text-[28px] font-medium text-black text-left",
  subheader: "font-body text-[24px] font-normal text-black/80 text-left",
  content: "font-body text-[18px] font-light leading-relaxed text-black/60 text-left",
  frame: "font-body text-[24px] font-light text-black/60 text-left",
};

function PlaceholderBox({
  ratio = "662/510",
  label = "Image placeholder",
  className = "",
}: {
  ratio?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`flex w-full items-center justify-center rounded-xl bg-[#EFEDF5] px-6 text-center ${TEXT.frame} ${className}`}
    >
      {label}
    </div>
  );
}

// One row of the page's 2-col rhythm. `eyebrow` only appears on the first
// row of a numbered section, stacked above `heading`. Label column is a
// fixed 16rem (w-64) gapped 3rem (gap-12) from the content column — fixed,
// not fr-based, so FullWidth below can cancel out exactly that combined
// 19rem via a negative margin, regardless of viewport.
function Row({
  eyebrow,
  heading,
  children,
}: {
  eyebrow?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-12">
      <div className="md:w-64 md:flex-shrink-0">
        {eyebrow && <p className={TEXT.header}>{eyebrow}</p>}
        <p className={`mt-1 ${TEXT.subheader}`}>{heading}</p>
      </div>
      <div className={`min-w-0 md:flex-1 ${TEXT.content}`}>{children}</div>
    </div>
  );
}

// Breaks a media block (image/colored-rectangle placeholder) out of the
// narrower content column so it spans the row's *full* width — reaching
// all the way to the same left edge as the label column, per Amy's ask
// ("some certain parts should expand the full width such as these colored
// rectangles, images"). The negative margin (19rem = the label's 16rem +
// the 3rem gap, both above) exactly cancels the label column, so this only
// needs to be dropped in wherever a Row's children currently has a big
// image/box — order relative to surrounding text is untouched.
function FullWidth({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`md:-ml-[19rem] md:w-[calc(100%+19rem)] ${className}`}>{children}</div>;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-body text-[18px] font-light text-black/80 text-left">{title}</p>
      <ul className={`mt-2 space-y-1 ${TEXT.content}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">–</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// `values` is an array, not a comma-joined string — each entry renders on
// its own line instead of being run together after a comma.
const META = [
  { label: "TIMELINE", values: ["June 2026"] },
  { label: "TEAM", values: ["1 designer (me!)", "1 dev"] },
  { label: "ROLE", values: ["Product design", "Visual design"] },
  { label: "SKILLS", values: ["Product design", "Branding"] },
];

const INSIGHTS = [
  {
    title: "Blend misrepresents actual listening taste",
    body: "Spotify Blends lose user trust because they don't accurately depict users' music tastes, choosing shared songs over unique music.",
  },
  {
    title: "Blend quality decays the longer it's used",
    body: "Infrequent updates and an unbalanced algorithm (one friend's plays dominating) make Blend feel increasingly homogeneous and unrepresentative over time.",
  },
  {
    title: "Blend's value is social, not musical",
    body: "Users are drawn to Blends for the shared experience, where they compare statistics, music, etc. Losing the social hook kills engagement.",
  },
  {
    title: "Lack of long-term draw",
    body: "Blend playlists are no longer relevant when the social factor is gone; users prefer listening to their own playlists, causing them to become irrelevant quick.",
  },
];

// `className` supplies the full flex layout (direction/wrap/gap) so the
// fixed sidebar version and the mobile inline-row fallback below don't
// fight each other over a shared default. Larger, gray, un-tinted links —
// per Amy's reference (no blue accent here).
function TableOfContents({
  className,
  style,
}: {
  className: string;
  style?: CSSProperties;
}) {
  return (
    <nav className={`flex text-left font-body text-lg font-light text-black/60 ${className}`} style={style}>
      {SECTION_NAV.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="text-left transition-colors hover:text-black">
          {s.label}
        </a>
      ))}
    </nav>
  );
}

export default function SpotifyCaseStudy() {
  return (
    // Full-bleed row — breaks out of this page's own centered/padded
    // section so the sidebar below can start at the true left edge of the
    // viewport, per Amy's reference, regardless of how the ancestor page
    // is laid out.
    <div className="relative left-1/2 w-screen -translate-x-1/2 lg:flex lg:items-start">
      {/* `sticky`, not `fixed` — fixed floats free of the document and
          bled over the footer once you scrolled past the end of the case
          study. Sticky is bounded by this row's own height (which matches
          the content column next to it), so it naturally stops exactly
          where the content ends instead of covering whatever comes after
          — here, the site's global Footer. Still reads as a full-height
          sidebar while scrolling through the case study itself. Separated
          from the content by a single vertical gray rule, same border
          color used elsewhere on the site (Taskbar, ProjectMedia). */}
      <aside
        className="hidden lg:sticky lg:z-10 lg:flex lg:w-72 lg:flex-shrink-0 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:px-10 lg:py-12"
        style={{
          top: "var(--taskbar-height, 4.375rem)",
          height: "calc(100dvh - var(--taskbar-height, 4.375rem))",
        }}
      >
        <TableOfContents className="flex-col gap-3" />
      </aside>

      <div className="min-w-0 flex-1">
        {/* pt-8/lg:pt-12 match the sidebar's own py-12 exactly, so "Spotify
            Guessr" lines up with "01 Initial Planning" on the same
            baseline instead of starting lower than the nav. */}
        <div className="mx-auto w-full max-w-4xl px-4 pt-8 text-left lg:px-16 lg:pt-12">
          {/* Same section links, inline — mobile/tablet fallback for the
              sticky sidebar, which is hidden below the lg breakpoint. */}
          <TableOfContents className="mb-8 flex-row flex-wrap gap-x-6 gap-y-2 text-sm lg:hidden" />

          {/* Hero */}
          <h1 className="font-body text-[clamp(2.25rem,6vw,3.5rem)] font-medium leading-none text-black/80">
            Spotify Guessr
          </h1>
          <p className="mt-3 font-body text-lg font-light text-black/70">
            Make your Spotify Blend more fun with a quick minigame!
          </p>

          <PlaceholderBox ratio="2220/1664" label="Hero image placeholder" className="mt-8" />

          <div className="mt-8 grid grid-cols-2 items-start justify-items-center gap-6 rounded-[10px] border border-gray-200 p-6 text-center sm:grid-cols-4">
            {META.map((m) => (
              <div key={m.label} className="text-center">
                <p className="font-body text-sm font-medium tracking-wide text-black/40">
                  {m.label}
                </p>
                {m.values.map((v) => (
                  <p key={v} className="mt-1 font-body text-base font-light text-black/70">
                    {v}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* 01 / Initial Planning */}
          <section id="initial-planning" className="mt-24 scroll-mt-24 space-y-16">
        <Row eyebrow="01 / Initial Planning" heading="The Problem">
          <p>
            Every Spotify Blend begins with curiosity. People want to know: what&apos;s
            our match percentage? What secret song do we share?
          </p>
          <p className="mt-3">
            But curiosity dies down. By day 2, the playlist lays in your library,
            forgotten.
          </p>
          <p className="mt-3">
            The problem isn&apos;t Spotify or the Blend itself; it&apos;s creating a
            reason to return.
          </p>

          <FullWidth className="mt-6">
            <PlaceholderBox ratio="1000/280" label="85% of people use Blend but only 40% return." />
          </FullWidth>
        </Row>

        <Row heading="The Solution">
          <p>
            A webapp that turns your Spotify Blend into a minigame — just sign in, play
            a song, and guess whose it is!
          </p>
        </Row>

        <Row heading="The Brief">
          <p>
            I structured this project as a simulated client engagement, where my dev
            was the client and provided me with requirements.
          </p>
          <p className="mt-3">
            I asked him a set of questions to make sure I fully understood the vision,
            then split them into 3 categories. This allowed me to visualize the product
            and begin my research.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <BulletList
              title="Flow"
              items={[
                "someone creates a room",
                "room code → use to join room",
                "start game after everyone joins",
                "game begin",
                "play song",
                "list players",
                "pick who the song belongs to",
              ]}
            />
            <BulletList
              title="Mechanics"
              items={[
                "user chooses # rounds",
                "default = 10 songs",
                "rounds based on # songs",
                "every correct guess = 1 point",
                "first person gets most — top 3",
              ]}
            />
            <BulletList
              title="Game"
              items={[
                "audience: teens+",
                "no account",
                "no player limit",
                "spotify stats showing at the end of the game",
                "spotify wrapped?",
                "spotify compatibility",
                "x and y listen to this genre",
                "designed for mobile but can also play on desktop",
              ]}
            />
          </div>
        </Row>
      </section>

      {/* 02 / Research */}
      <section id="research" className="mt-24 scroll-mt-24 space-y-16">
        <Row eyebrow="02 / Research" heading="Competitive Analysis">
          <p>I compared several existing products to analyze what currently works and what doesn&apos;t.</p>
          <FullWidth className="mt-6 space-y-6">
            <PlaceholderBox ratio="1200/650" label="Competitive analysis collage placeholder" />
            <PlaceholderBox ratio="1200/300" label="Comparison table placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Affinity Mapping">
          <p>
            Through analysis of 20 user survey responses (aged 17-24), I mapped out the
            responses to better understand the problem.
          </p>
          <FullWidth className="mt-6">
            <PlaceholderBox ratio="1200/1010" label="Affinity map placeholder" />
          </FullWidth>
        </Row>

        <Row heading="4 Key Insights">
          <p>This revealed 4 key insights:</p>
          <div className="mt-4 space-y-6">
            {INSIGHTS.map((insight, i) => (
              <div key={insight.title} className="flex gap-4">
                <span className="font-body text-lg font-medium text-[#2460A4]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-body text-[18px] font-light text-black/80 text-left">
                    {insight.title}
                  </p>
                  <p className={`mt-1 ${TEXT.content}`}>{insight.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Row>

        <Row heading="Problem Statement">
          <FullWidth>
            <div className="rounded-xl bg-[#DAF2DE] p-6">
              <p className={TEXT.frame}>
                How might we extend the social excitement of Spotify Blend beyond the
                first interaction?
              </p>
            </div>
          </FullWidth>
        </Row>
      </section>

      {/* 03 / Design Process */}
      <section id="design-process" className="mt-24 scroll-mt-24 space-y-16">
        <Row eyebrow="03 / Design Process" heading="Challenge">
          <FullWidth>
            <div className="rounded-xl bg-gray-50 p-6">
              <p className={TEXT.frame}>
                How do we make the product familiar to Spotify while also resembling its
                own creation?
              </p>
            </div>
          </FullWidth>
        </Row>

        <Row heading="Spotify's Main App">
          <FullWidth>
            <PlaceholderBox ratio="1600/670" label="Spotify app reference placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Spotify Wrapped">
          <FullWidth>
            <PlaceholderBox ratio="1200/1240" label="Spotify Wrapped reference placeholder" />
          </FullWidth>
          <p className="mt-6">
            Familiarity was easy; I decided to stick with Spotify&apos;s iconic green as
            an accent color. I emulated the chaotic vibe of Wrapped with pops of neon,
            shapes, and by creating mascots.
          </p>
        </Row>

        <Row heading="Wireframing">
          <p>
            I mapped out the screens + flow using low-fidelity wireframes, ensuring
            navigation was smooth.
          </p>
          <FullWidth className="mt-6">
            <PlaceholderBox ratio="1000/1420" label="Wireframes placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Mascots">
          <FullWidth>
            <PlaceholderBox ratio="1400/1060" label="Mascots placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Color Scheme">
          <FullWidth>
            <PlaceholderBox ratio="1450/800" label="Color scheme placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Navigation Problem">
          <p>
            Users needed a way to move between stat cards without breaking the visual
            rhythm of the layout.
          </p>
          <p className="mt-3">
            Currently, the cards are aligned vertically. Do users swipe, tap, or should
            they click somewhere else on the screen?
          </p>
          <FullWidth className="mt-6">
            <PlaceholderBox ratio="1200/1010" label="Navigation exploration placeholder" />
          </FullWidth>
        </Row>

        <Row heading="Decision">
          <p>
            Despite the vertical arrows having a clear next step, I decided against it
            because it cluttered the screen too much.
          </p>
          <p className="mt-3">
            So we went with the no-arrow option. Users can swipe or tap to move onto the
            next screen. The layering is intuitive enough for the next step to be
            obvious.
          </p>
        </Row>
      </section>

      {/* 04 / Final Project */}
      <section id="final-project" className="mt-24 scroll-mt-24">
        <Row eyebrow="04 / Final Project" heading="Screens">
          <FullWidth>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <PlaceholderBox key={i} ratio="1800/3680" label={`Screen ${i + 1}`} />
              ))}
            </div>
          </FullWidth>

          <a
            href="https://www.figma.com/proto/0i9bMQFOCCtSDtrcVcJqNO/spotify-game?node-id=66-264&starting-point-node-id=66%3A264"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#2460A4] px-6 py-2 font-body text-sm text-white transition-colors hover:bg-[#1c4a80]"
          >
            Check out the Figma prototype!
          </a>
        </Row>
      </section>

      {/* 05 / Learnings */}
      <section id="learnings" className="mt-24 scroll-mt-24">
        <Row eyebrow="05 / Learnings" heading="Working with a client">
          <p>
            As the designer taking on a client, it is important to understand ALL of
            their needs &amp; expectations! This means ensuring that you are
            communicating throughout the process, checking in to make sure everything
            is okay, and consistently asking questions.
          </p>
          <p className="mt-3">
            Sometimes, the client doesn&apos;t have a tech background and will not
            understand the plausibility of certain features. Other times, they will not
            be able to communicate what they don&apos;t explicitly like about a design.
            As the sole product designer, it was my job to make sure I was transparent
            and created something that met the client&apos;s standard!
          </p>
        </Row>
      </section>
        </div>
      </div>
    </div>
  );
}
