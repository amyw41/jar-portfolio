"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

// Load-in timing shared with every other page's mount animation (see
// app/etc/page.tsx's heading wrapper and app/etc/[category]/page.tsx's
// content wrapper) — same duration/ease, just reused here so this page's
// entrance reads as consistent with the rest of the site rather than
// inventing its own timing.
const LOAD_IN_TRANSITION = { duration: 0.4, ease: "easeOut" as const };

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
//   subheader — the sub-label (e.g. "The Problem"): black/80, regular, 22px
//   content   — body copy: black/60, light, 18px
//   frame     — text sitting inside a colorful/placeholder box: black/60, light, 24px
const TEXT = {
  header: "font-body text-[28px] font-medium text-black text-left",
  subheader: "font-body text-[22px] font-normal text-black/80 text-left",
  content: "font-body text-[18px] font-light leading-relaxed text-black/60 text-left",
  frame: "font-body text-[22px] font-light text-black/60 text-left",
  // Same font-weight as `header` (medium) — for the mid-section group
  // labels that sit above a cluster of Rows (e.g. "Spotify's Design System"
  // above the Main App/Wrapped rows, "Branding" above Mascots/Color Scheme)
  // or, for "Wireframing", directly replacing a Row's own subheader.
  // Bolder than a normal Row heading so it still reads as a grouping label,
  // not just another row in the list, but smaller than the numbered
  // section eyebrow (28px) since it isn't one. Deliberately still 24px, one
  // notch above subheader's own 22px, now that the two no longer match.
  groupHeader: "font-body text-[24px] font-medium text-black/80 text-left",
};

// `ratio` is only meaningful for boxes that stand in for a real
// image/screenshot — omit it (as the short text-only stat callout below
// does) and the box sizes itself off its own text with tight py-[14px]
// padding instead of a fixed aspect-ratio height.
// Real image, dropped into public/images/projects/spotify/ by Amy — `ratio`
// is that file's actual width/height so nothing gets stretched or cropped
// unexpectedly. `bg` (on by default) matches PlaceholderBox's own light
// backdrop for screenshots/diagrams shot on white; the phone mockups in the
// Final Project grid turn it off since those PNGs already have their own
// transparent background and device frame baked in.
// `video` — the hero screen recording (the only video on this page so far)
// needs autoplay/muted/loop instead of next/image, but should still share
// this same box (aspect-ratio, rounded corners, optional bg) rather than
// duplicating that wrapper just for one case.
function CaseStudyImage({
  src,
  alt,
  ratio,
  bg = true,
  video = false,
  className = "",
  sizes = "(min-width: 768px) 900px, 100vw",
}: {
  src: string;
  alt: string;
  ratio: string;
  bg?: boolean;
  video?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden rounded-[8px] ${bg ? "bg-[#EFEDF5]" : ""} ${className}`}
    >
      {video ? (
        <video
          src={src}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          // Turbopack's dev-mode image-optimization cache doesn't bust when
          // a file is replaced at the same path (it keeps serving the
          // first-ever encode indefinitely) — every case-study image gets
          // swapped often during design iteration, so skip the optimizer in
          // dev to always show the current file. Same workaround already
          // used for jar.png in Jar.js and for the gallery/carousel cards
          // in ProjectMedia.tsx. Production still gets normal next/image
          // optimization.
          unoptimized={process.env.NODE_ENV !== "production"}
          className="object-cover"
        />
      )}
    </div>
  );
}

function PlaceholderBox({
  ratio,
  label = "Image placeholder",
  className = "",
}: {
  ratio?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      style={ratio ? { aspectRatio: ratio } : undefined}
      className={`flex w-full items-center justify-center rounded-[8px] bg-[#EFEDF5] px-6 text-center ${TEXT.frame} ${ratio ? "" : "py-[14px]"} ${className}`}
    >
      {label}
    </div>
  );
}

// One row of the page's 2-col rhythm. `eyebrow` only appears on the first
// row of a numbered section, stacked above `heading`.
//
// Real CSS grid (not flexbox) on purpose: `media` is a grid item spanning
// both columns (md:col-span-2), so grid's own auto-placement puts it in a
// *new grid row* that starts below whichever of the label/content columns
// is taller — not just "24px after the paragraph regardless of what's
// happening in the other column". That was the earlier bug: with flexbox,
// each column stacked independently off its own content, so a full-width
// image could land right under a short label with almost no visual gap,
// purely by coincidence of the two columns' heights nearly matching.
// `after` is for the rare case where more text follows the media (e.g.
// "Spotify Wrapped") — it also becomes its own grid row, again positioned
// correctly regardless of media's actual rendered height.
function Row({
  eyebrow,
  heading,
  headingClassName,
  children,
  media,
  after,
  tight,
}: {
  eyebrow?: string;
  heading: string;
  // Overrides the default TEXT.subheader styling on `heading` — used for
  // "Wireframing", which per Amy's reference is the same system as
  // "Spotify's Design System"/"Branding" (TEXT.header, 28px black) rather
  // than the plain TEXT.subheader every other Row on this page uses.
  headingClassName?: string;
  children?: ReactNode;
  media?: ReactNode;
  after?: ReactNode;
  // Forces the tighter heading-to-children gap even when children is
  // present — the one case that needs that is "4 Key Insights", whose
  // heading and its very first line ("This revealed 4 key insights:") read
  // as one header/subheader pair, not two separate ideas, so the normal
  // 36px gap should be tight for it too even though children is present.
  tight?: boolean;
}) {
  // Per-block margins instead of one shared grid `gap-y` — needed so
  // tightening one relationship (heading-to-media) can't also tighten a
  // different one (media-to-after) that happens to sit in the very next
  // grid row. A single `gap-y` can't tell those two gaps apart; explicit
  // margins on each block can.
  //
  // `mediaGap`: a heading with no `children` has nothing standing between
  // it and `media` — the media *is* what the heading is labeling (e.g.
  // "Challenge" directly above its own callout box, "Spotify's Main App"
  // directly above its own screenshot), not a separate idea introduced by a
  // paragraph in between. That's a tight header/caption relationship by
  // default, so it gets the smaller gap automatically rather than needing
  // every such Row to opt in individually — but only when children is
  // genuinely absent; if children *is* present, media is following real
  // paragraph text (not the heading directly) and keeps the normal gap.
  //
  // `after` deliberately always keeps the normal 36px gap regardless of
  // `mediaGap`/`tight` — it's real trailing content (the "Spotify Wrapped"
  // paragraph, the "Screens" Figma link), not a caption, so squeezing it
  // against `media` the same way would read as cramped rather than related.
  const childrenGap = tight ? "mt-2 md:mt-0" : "mt-[36px] md:mt-0";
  const mediaGap = children ? "mt-[36px]" : "mt-2";
  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] md:gap-x-12">
      <div className="md:col-start-1">
        {eyebrow && <p className={TEXT.header}>{eyebrow}</p>}
        {/* mt-1 only when stacked under an eyebrow — unconditional before,
            which nudged every eyebrow-less heading (e.g. "4 Key Insights")
            4px below the top of its column, misaligning it against
            `children`'s own now-flush top (see childrenGap's md:mt-0
            above) instead of sitting on the same row. */}
        <p className={`${eyebrow ? "mt-1 " : ""}${headingClassName ?? TEXT.subheader}`}>{heading}</p>
      </div>
      {children && (
        <div className={`min-w-0 md:col-start-2 ${childrenGap} ${TEXT.content}`}>{children}</div>
      )}
      {media && <div className={`md:col-span-2 ${mediaGap}`}>{media}</div>}
      {/* Full width (md:col-span-2, matching `media`) — `after` follows a
          full-width image with no heading of its own beside it, so
          confining it to just the narrow content column (like `children`,
          which always sits beside an actual heading) left it looking
          squeezed relative to the image directly above it. */}
      {after && <div className={`min-w-0 md:col-span-2 mt-[36px] ${TEXT.content}`}>{after}</div>}
    </div>
  );
}

// One numbered section (01 Initial Planning, 02 Research, ...) — owns the
// spacing system. Amy's original numbers (80/40/20) were a rough 4:2:1
// ratio, not exact values — anchored to the page's own 18px body text
// (TEXT.content) and doubled per Amy's follow-up ("still kinda small,
// let's do 2x"): 8×18=144px between sections, 4×18=72px between
// Rows/subsections (Row's own gap-y-[36px] handles the 2× tier, between
// text/media within a subsection). Previously this className was
// copy-pasted onto all five <section> tags by hand, which is exactly how
// two of them drifted out of sync (missing the subsection gap) — one
// definition here means that can't happen again.
function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-[120px] scroll-mt-24 space-y-[72px]">
      {children}
    </section>
  );
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
    // section (which is itself capped at max-w-[96rem], see
    // app/projects/[id]/page.tsx) so the sidebar below can start at the
    // true left edge of the viewport, per Amy's reference, regardless of
    // how the ancestor page is laid out. `100vw` is the only unit that
    // reaches the true viewport edge regardless of that ancestor's own
    // width — a percentage-based negative-margin breakout (the usual
    // alternative) can't reach past max-w-[96rem] on any viewport wider
    // than 1536px. `100vw` does include the vertical scrollbar's own
    // width, though, which is what actually made the whole site
    // horizontally scrollable by a few px on this page — see the root
    // layout's `overflow-x-clip` (deliberately clip, not hidden — hidden
    // silently breaks position: sticky for every descendant, including the
    // sidebar below), which is the actual fix for that, applied globally
    // rather than by fighting the vw/scrollbar mismatch here (any future
    // full-bleed-style row would hit the same issue).
    <div className="relative left-1/2 w-screen -translate-x-1/2 lg:flex lg:items-start">
      {/* `sticky`, not `fixed` — fixed floats free of the document and
          bled over the footer once you scrolled past the end of the case
          study. Sticky is bounded by this row's own height (which matches
          the content column next to it), so it naturally stops exactly
          where the content ends instead of covering whatever comes after
          — here, the site's global Footer. Still reads as a full-height
          sidebar while scrolling through the case study itself. Separated
          from the content by a single vertical gray rule, same border
          color used elsewhere on the site (Taskbar, ProjectMedia).

          No var(--taskbar-height) anywhere in this page anymore — Taskbar.js
          renders null on case-study routes now (see its own
          isCaseStudyRoute check) per Amy's reference: no top navbar at all
          here, just this sidebar with its own logo (below) running flush to
          the true top of the viewport, top-0/h-dvh, no offset needed since
          there's nothing above it to offset for. */}
      <aside className="hidden lg:sticky lg:top-0 lg:z-10 lg:flex lg:h-dvh lg:w-72 lg:flex-shrink-0 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:px-10 lg:py-8">
        {/* Slides in from the left on mount — the sidebar's own equivalent
            of the hero block's fade-up below, just horizontal since it sits
            beside the content rather than above it. Logo included in the
            same slide so it reads as one unit with the nav below it, not a
            separately-timed piece. */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={LOAD_IN_TRANSITION}
        >
          {/* Stands in for Taskbar's own logo, which doesn't render on this
              route — still links home, same source/size as Taskbar.js's. */}
          <Link href="/" className="block w-fit">
            <Image
              src="/images/logos/logo.png"
              alt="Amy Wang's Jar logo"
              width={44}
              height={44}
              priority
              className="h-11 w-11 object-contain"
            />
          </Link>
          <TableOfContents className="mt-6 flex-col gap-3" />
        </motion.div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* lg:pt-[100px] lines "Spotify Guessr" up with "01 Initial
            Planning" specifically (not the logo above it) — that's the
            sidebar's own py-8 (32px) + logo height (44px) + the gap down to
            the nav list (mt-6, 24px) = 100px before that first link starts.
            Update this if any of those three sidebar values change.

            pb-24 at the bottom — the sidebar is deliberately flush against
            the footer with no gap (see app/projects/[id]/page.tsx's own
            comment), but that's the sidebar's border/background, not this
            text column: without its own bottom padding, the last
            paragraph's text was butting directly up against the footer. */}
        <div className="mx-auto w-full max-w-[1006px] px-4 pb-24 pt-8 text-left lg:px-16 lg:pt-[100px]">
          {/* Mobile/tablet fallback for the sidebar's own logo — Taskbar
              doesn't render on this route at all (see isCaseStudyRoute),
              not just its desktop row, so without this there'd be no way
              back home below the lg breakpoint either. */}
          <Link href="/" className="mb-6 block w-fit lg:hidden">
            <Image
              src="/images/logos/logo.png"
              alt="Amy Wang's Jar logo"
              width={44}
              height={44}
              priority
              className="h-11 w-11 object-contain"
            />
          </Link>

          {/* Same section links, inline — mobile/tablet fallback for the
              sticky sidebar, which is hidden below the lg breakpoint. */}
          <TableOfContents className="mb-8 flex-row flex-wrap gap-x-6 gap-y-2 text-sm lg:hidden" />

          {/* Hero — title, subtitle, hero image, and the timeline/team/role/
              skills box all load in together as one unit, same fade-up
              mount animation every other page uses (see LOAD_IN_TRANSITION
              above), rather than each piece animating independently. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={LOAD_IN_TRANSITION}
          >
            <h1 className="font-body text-[clamp(2.75rem,7.5vw,4.5rem)] font-normal leading-none tracking-[-0.04em] text-black/90">
              Spotify Guessr
            </h1>
            <p className="mt-3 font-body text-lg font-light text-black/70">
              Make your Spotify Blend more fun with a quick minigame!
            </p>

            <CaseStudyImage
              src="/images/projects/spotify/spotify.png"
              alt="Spotify Guessr app screens"
              ratio="3967/2666"
              className="mt-8"
              sizes="(min-width: 768px) 946px, 100vw"
            />

            <div className="mt-8 grid grid-cols-2 items-start justify-items-center gap-6 rounded-[10px] border border-gray-200 p-6 text-center sm:grid-cols-4">
              {/* Extra bottom padding on the three right-side columns only
                  (TEAM/ROLE/SKILLS all wrap to 2 lines; TIMELINE doesn't) —
                  added per-column instead of bumping the box's own shared
                  p-6, which would pad every column (including TIMELINE, which
                  doesn't need it) and grow the box/border taller than
                  necessary just to give the already-tallest columns more
                  breathing room. */}
              {META.map((m, i) => (
                <div key={m.label} className={`text-center ${i !== 0 ? "pb-3" : ""}`}>
                  <p className="font-body text-[22px] font-medium tracking-[-0.035em] text-black/80">
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
          </motion.div>

          {/* 01 / Initial Planning */}
          <Section id="initial-planning">
            <Row
              eyebrow="01 / Initial Planning"
              heading="The Problem"
              media={
                <div className="space-y-[36px]">
                  <PlaceholderBox label="85% of people use Blend but only 40% return." />
                  <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                    <CaseStudyImage
                      src="/images/projects/spotify/survey_use.avif"
                      alt="Chart: Do you use Spotify Blend? 85% yes, 15% no"
                      ratio="512/275"
                    />
                    <CaseStudyImage
                      src="/images/projects/spotify/survey_return.avif"
                      alt="Chart: Do you ever go back to a Blend after the first listen? 40% yes, 60% no"
                      ratio="512/266"
                    />
                  </div>
                </div>
              }
            >
              <p>
                Every Spotify Blend begins with curiosity. People want to know: what&apos;s
                our match percentage? What secret song do we share?
              </p>
              <p className="mt-[36px]">
                But curiosity dies down. By day 2, the playlist lays in your library,
                forgotten.
              </p>
              <p className="mt-[36px]">
                The problem isn&apos;t Spotify or the Blend itself; it&apos;s creating a
                reason to return.
              </p>
            </Row>

            <Row heading="The Solution">
              <p>
                A webapp that turns your Spotify Blend into a minigame — just sign in, play
                a song, and guess whose it is!
              </p>
            </Row>

            <Row
              heading="The Brief"
              media={
                // Full-width — media (unlike children) spans both of Row's
                // columns, so this reads edge-to-edge with the rest of the
                // page's media instead of being squeezed into just the
                // right-hand content column the way it sat before.
                <div className="grid grid-cols-1 gap-8 rounded-[10px] bg-[#f7f7f7] p-6 sm:grid-cols-3 sm:p-8">
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
              }
            >
              <p>
                I structured this project as a simulated client engagement, where my dev
                was the client and provided me with requirements.
              </p>
              <p className="mt-[36px]">
                I asked him a set of questions to make sure I fully understood the vision,
                then split them into 3 categories. This allowed me to visualize the product
                and begin my research.
              </p>
            </Row>
          </Section>

          {/* 02 / Research */}
          <Section id="research">
            <Row
              eyebrow="02 / Research"
              heading="Competitive Analysis"
              media={
                <div className="space-y-[36px]">
                  <CaseStudyImage
                    src="/images/projects/spotify/ca_img.avif"
                    alt="Competitive analysis collage: Kahoot, Codenames, and Jackbox annotated with observations"
                    ratio="1024/553"
                  />
                  <CaseStudyImage
                    src="/images/projects/spotify/ca_result.avif"
                    alt="Comparison table of Kahoot, Jackbox, and Codenames features"
                    ratio="1024/263"
                  />
                </div>
              }
            >
              <p>I compared several existing products to analyze what currently works and what doesn&apos;t.</p>
            </Row>

            <Row
              heading="Affinity Mapping"
              media={
                <CaseStudyImage
                  src="/images/projects/spotify/am.avif"
                  alt="Affinity map grouping survey responses into 4 key insight clusters"
                  ratio="1024/863"
                  bg={false}
                />
              }
            >
              <p>
                Through analysis of 20 user survey responses (aged 17-24), I mapped out the
                responses to better understand the problem.
              </p>
            </Row>

            <Row
              heading="4 Key Insights"
              tight
              media={
                // Full-width (media, not children) with each insight in its
                // own gray card — matches "The Brief"'s Flow/Mechanics/Game
                // box treatment above rather than sitting squeezed into the
                // right-hand content column as a plain list.
                <div className="space-y-4">
                  {INSIGHTS.map((insight, i) => (
                    <div key={insight.title} className="flex gap-4 rounded-[10px] bg-[#f7f7f7] p-6">
                      <span className="font-body text-lg font-medium text-black">
                        {i + 1}
                      </span>
                      <div>
                        {/* Title: full-opacity black (not the page's usual
                            black/80) — content directly below stays
                            TEXT.content's grayish black/60, so the two read
                            as a clear title/body contrast within each card. */}
                        <p className="font-body text-[18px] font-light text-black text-left">
                          {insight.title}
                        </p>
                        <p className={`mt-1 ${TEXT.content}`}>{insight.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <p>This revealed 4 key insights:</p>
            </Row>

            <Row
              heading="Problem Statement:"
              media={
                <div className="rounded-[8px] bg-[#f2f0f5] px-6 py-[14px]">
                  <p className="font-body text-[22px] font-light text-black/60 text-center">
                    How might we extend the social excitement of Spotify Blend beyond the
                    first interaction?
                  </p>
                </div>
              }
            />
          </Section>

          {/* 03 / Design Process */}
          <Section id="design-process">
            <Row
              eyebrow="03 / Design Process"
              heading="Challenge"
              media={
                <div className="rounded-[8px] bg-[#fbeded] px-6 py-[14px]">
                  <p className="font-body text-[22px] font-light text-black/60 text-center">
                    How do we make the product familiar to Spotify while also resembling its
                    own creation?
                  </p>
                </div>
              }
            />

            {/* Group label for the two rows below — same weight as the
                numbered section eyebrow (medium) but sized down to the
                24px subheader tier, since it isn't a new numbered section.
                mt-2 (not the mt-[36px]/space-y-[72px] tiers everything else
                on this page uses) is deliberate here: this label and the
                row heading directly under it ("Spotify's Main App") are a
                header/subheader pair, the same "one family" relationship as
                Row's own eyebrow-to-heading spacing (also mt-1/mt-2, not a
                full block gap) — mt-[72px] before the *next* row
                ("Spotify Wrapped") is untouched, preserving the normal "40"
                tier gap between two actually-separate rows. */}
            <div>
              {/* TEXT.header (not the usual TEXT.groupHeader other group
                  labels on this page use) — per Amy's request, this label
                  matches "03 / Design Process" above it exactly (28px,
                  solid black, not the lighter/smaller group-label style). */}
              <p className={TEXT.header}>Spotify&apos;s Design System</p>
              <div className="mt-2">
                <Row
                  heading="Spotify's Main App"
                  media={
                    <CaseStudyImage
                      src="/images/projects/spotify/main.avif"
                      alt="Spotify main app screens annotated with design observations"
                      ratio="1024/427"
                    />
                  }
                />
              </div>
              <div className="mt-[72px]">
                <Row
                  heading="Spotify Wrapped"
                  media={
                    <CaseStudyImage
                      src="/images/projects/spotify/wrapped.avif"
                      alt="Spotify Wrapped screens annotated with design observations"
                      ratio="991/1024"
                    />
                  }
                  after={
                    <p>
                      Familiarity was easy; I decided to stick with Spotify&apos;s iconic
                      green as an accent color. I emulated the chaotic vibe of Wrapped with
                      pops of neon, shapes, and by creating mascots.
                    </p>
                  }
                />
              </div>
            </div>

            <Row
              heading="Wireframing"
              // TEXT.header — same system as "Spotify's Design System"/
              // "Branding" above (28px, solid black), not the default
              // TEXT.subheader every other Row on this page uses.
              headingClassName={TEXT.header}
              media={
                <CaseStudyImage
                  src="/images/projects/spotify/lowfi.avif"
                  alt="Low-fidelity wireframes of the Spotify Guessr screens and flow"
                  ratio="1445/2048"
                />
              }
            >
              <p>
                I mapped out the screens + flow using low-fidelity wireframes, ensuring
                navigation was smooth.
              </p>
            </Row>

            {/* Same group-label pattern as "Spotify's Design System" above —
                see that block's comment for the spacing rationale. TEXT.header
                (not TEXT.groupHeader), same reasoning as that block too:
                same system as "Spotify's Design System", not the page's
                other, smaller/lighter group labels. */}
            <div>
              <p className={TEXT.header}>Branding</p>
              <div className="mt-2">
                <Row
                  heading="Mascots"
                  media={
                    <CaseStudyImage
                      src="/images/projects/spotify/branding.avif"
                      alt="Triangle, star, and circle mascot characters in three poses each"
                      ratio="1024/773"
                    />
                  }
                />
              </div>
              <div className="mt-[72px]">
                <Row
                  heading="Color Scheme"
                  media={
                    <CaseStudyImage
                      src="/images/projects/spotify/colors.avif"
                      alt="Color palette and typography scale for Spotify Guessr"
                      ratio="1024/563"
                    />
                  }
                />
              </div>
            </div>

            <Row
              heading="Navigation Problem"
              // No `children` here on purpose — the framing statement now
              // lives in its own full-width card (matching "Challenge"'s
              // own bg-[#fbeded] callout box) directly under the heading,
              // same tight-gap treatment every other heading-then-box Row
              // on this page already gets, rather than sitting as plain
              // text beside the heading.
              media={
                <div className="space-y-[36px]">
                  <div className="rounded-[8px] bg-[#fbeded] px-6 py-[14px]">
                    <p className="font-body text-[22px] font-light text-black/60 text-center">
                      Users needed a way to move between stat cards without breaking the
                      visual rhythm of the layout.
                    </p>
                  </div>
                  {/* Between the card and the image, not after it — this
                      answers the card's question before the image shows the
                      options that answer led to. */}
                  <p className={TEXT.content}>
                    Currently, the cards are aligned vertically. Do users swipe, tap, or
                    should they click somewhere else on the screen?
                  </p>
                  <CaseStudyImage
                    src="/images/projects/spotify/choice1.avif"
                    alt="Three navigation options compared: horizontal arrows, vertical arrows, no arrows"
                    ratio="1024/859"
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
                So we went with the no-arrow option. Users can swipe or tap to move onto the
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
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <CaseStudyImage
                      key={i}
                      src={`/images/projects/spotify/${i + 1}.avif`}
                      alt={`Spotify Guessr final screen ${i + 1}`}
                      ratio="1002/2048"
                      bg={false}
                      sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    />
                  ))}
                </div>
              }
              after={
                // Same look as the page's other light-purple callout boxes
                // (PlaceholderBox: rounded-[8px] bg-[#EFEDF5], TEXT.frame),
                // not its own separate blue-pill button style — plus a
                // hover scale (1.05x, i.e. 0.05x bigger) that those static
                // boxes don't need since this one's actually clickable.
                // block w-full (not inline-block) — spans the same full
                // width as the photo grid above it instead of shrink-wrapping
                // to its own text, which read as a small, disconnected pill
                // floating under a full-width grid.
                <a
                  href="https://www.figma.com/proto/0i9bMQFOCCtSDtrcVcJqNO/spotify-game?node-id=66-264&starting-point-node-id=66%3A264"
                  target="_blank"
                  rel="noopener noreferrer"
                  // !text-center — TEXT.frame carries its own text-left,
                  // and Tailwind emits utilities in a fixed internal order
                  // regardless of where they fall in this string, so a plain
                  // text-center here was silently losing to TEXT.frame's
                  // text-left. The ! forces it to actually win.
                  className={`block w-full rounded-[8px] bg-[#EFEDF5] px-6 py-[14px] !text-center transition-transform duration-200 hover:scale-[1.01] ${TEXT.frame}`}
                >
                  Check out the Figma prototype!
                </a>
              }
            />
          </Section>

          {/* 05 / Learnings */}
          <Section id="learnings">
            <Row eyebrow="05 / Learnings" heading="Working with a client">
              <p>
                As the designer taking on a client, it is important to understand ALL of
                their needs &amp; expectations! This means ensuring that you are
                communicating throughout the process, checking in to make sure everything
                is okay, and consistently asking questions.
              </p>
              <p className="mt-[36px]">
                Sometimes, the client doesn&apos;t have a tech background and will not
                understand the plausibility of certain features. Other times, they will not
                be able to communicate what they don&apos;t explicitly like about a design.
                As the sole product designer, it was my job to make sure I was transparent
                and created something that met the client&apos;s standard!
              </p>
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
}
