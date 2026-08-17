"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/social";
import FadeImage from "@/components/FadeImage";
import Experience from "@/components/Experience";

const SLIDE_UP_DURATION = 0.35;

const AVAILABLE_HEIGHT = "calc(100dvh - var(--taskbar-height, 4.375rem))";

function socialHref(id: string) {
  return SOCIAL_LINKS.find((s) => s.id === id)?.href ?? "#";
}

const LINK_CLASS = "underline decoration-black/30 underline-offset-2 transition-colors hover:text-[#2460A4] hover:decoration-[#2460A4]";

// Discrete per-breakpoint tiers (not one continuous height formula) for the
// photo/heading/paragraph sizing below — deliberately, after a first attempt
// that used a single dvh-driven formula everywhere shrank things even on
// perfectly roomy desktop windows (the formula never actually reached its
// own "full size" ceiling on any real screen). lg+ (side-by-side) keeps the
// original fixed sizes almost untouched; only <lg (stacked) gets a real
// shrink, since that's the layout where photo+text compete for the same
// vertical space. A light height-clamp on lg+ text/spacing only handles the
// edge case of a short-but-wide desktop window.
const PARAGRAPH_CLASS =
  "mt-[clamp(0.2rem,1.2dvh,0.375rem)] font-body text-[clamp(0.65rem,1.7dvh,0.8125rem)] font-light leading-snug text-black/70 sm:mt-2 sm:text-sm md:mt-3 md:text-base lg:mt-[clamp(0.5rem,1.6dvh,1rem)] lg:text-[clamp(0.875rem,1.8dvh,1rem)] lg:leading-relaxed";

export default function NotesPage() {
  return (
    <section
      className="mx-auto flex w-full max-w-[1100px] flex-col justify-center px-4 py-3"
      style={{ minHeight: AVAILABLE_HEIGHT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: SLIDE_UP_DURATION, ease: "easeOut" }}
      >
        {/* Single column (both items full-width, stacked) below lg — same
          breakpoint as before. minmax(0,460px) lets the photo column
          itself shrink first when space is tight (down to its own natural
          minimum), while minmax(320px,1fr) guarantees the text column
          never drops below a readable width. */}
        <div className="grid grid-cols-1 items-center gap-[clamp(0.5rem,2dvh,0.75rem)] sm:gap-6 lg:grid-cols-[minmax(0,460px)_minmax(320px,1fr)] lg:gap-12">
          {/* Framed photo — left. Used to be two layered images (frame.png
              behind, me.webp inset on top) — replaced with a single
              pre-composited image (frame drawn already). Aspect ratio is
              this file's own (1368x1600). Small on mobile (this is what
              actually made the stacked layout fit one screen — the photo,
              not the text, was the biggest single chunk of the old
              overflow) and grows back to its original 460px cap at lg,
              where it sits beside the text instead of above it. */}
          <div
            className="relative mx-auto w-[clamp(90px,16dvh,130px)] sm:w-[180px] md:w-[220px] lg:w-full lg:max-w-[460px]"
            style={{ aspectRatio: "1368 / 1600" }}
          >
            <FadeImage
              src="/images/etc/me-framed.webp"
              alt="Amy standing at a bus stop, framed"
              fill
              sizes="460px"
              unoptimized={process.env.NODE_ENV !== "production"}
              className="pointer-events-none object-contain"
            />
          </div>

          {/* Text — right, wrapped in border.png instead of a plain CSS
            border. border.png is stretched with object-fill to exactly
            match this box's own rendered size, since it's a simple outline
            meant to wrap whatever height the bio text ends up being, not a
            fixed-ratio frame like the photo on the left. */}
          <div className="relative p-[clamp(0.625rem,2.2dvh,1rem)] text-left sm:p-6 md:p-8 lg:p-12">
            <FadeImage
              src="/images/drawings/border.png"
              alt=""
              fill
              // No `sizes` prop — matches jar.png's own (accidental, but
              // proven-good-looking) treatment in Jar.js. Bumping `quality`
              // alone (previously the only change here) only softened
              // compression artifacts — it didn't fix this thin hand-drawn
              // line visibly pixelating once actually stretched back out to
              // real size, which is genuine under-resolution, not a
              // compression issue. Omitting `sizes` makes next/image assume
              // this could need full-viewport width, so it always fetches a
              // much bigger source than this ~640px box actually needs —
              // wasteful, but the only way this asset reliably looks sharp.
              quality={95}
              unoptimized={process.env.NODE_ENV !== "production"}
              className="pointer-events-none object-fill"
            />
            <div className="relative">
              <h1 className="font-instrument text-[clamp(0.95rem,3dvh,1.125rem)] text-black/90 sm:text-xl md:text-2xl lg:text-[28px]">Hello! I&apos;m Amy</h1>

              <p className={PARAGRAPH_CLASS}>
                I like pretty things and cool people... so I like design!
              </p>

              <p className={PARAGRAPH_CLASS}>
                Growing up, my friends called me a perfectionist. I&apos;d say it&apos;s a
                flaw if it wasn&apos;t the reason I slave over every one of my
                creations, waiting for it to look <em> good </em> enough to post.
                (And I guess it isn&apos;t necessarily SLOW, just tedious...)
              </p>

              <p className={PARAGRAPH_CLASS}>
                I&apos;m also known as...
                <br />- a dancer! I&apos;m currently re-learning ballet pointe
                <br />- an overthinker. I&apos;m a big fan of lore (harry potter, hunger
                games, just finished aot... talk about it with me)
                <br />- an engineer. I&apos;m studying Management Engineering at
                Waterloo!
              </p>

              <p className={PARAGRAPH_CLASS}>
                You can reach me on{" "}
                <a href={socialHref("linkedin")} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                  Linkedin
                </a>
                ,{" "}
                <a href={socialHref("x")} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                  X/Twitter
                </a>
                , or by{" "}
                <a href={socialHref("email")} className={LINK_CLASS}>
                  email
                </a>
                !
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Work/community history — used to live behind a Gallery/Experience
          toggle on the homepage (see WhatsInside/index.tsx's own git
          history for that); moved here instead, right below the bio, once
          that toggle was removed. Centered on its own (not part of the grid
          above), slightly delayed so it reads as a second beat after the
          bio settles rather than everything landing at once. This section
          no longer fits one viewport once this is added — expected, it's
          new content, not a regression of the bio's own one-viewport fit. */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: SLIDE_UP_DURATION, ease: "easeOut", delay: 0.1 }}
        className="mt-16 sm:mt-20"
      >
        <Experience />
      </motion.div>
    </section>
  );
}
