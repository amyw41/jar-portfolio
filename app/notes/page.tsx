"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/social";
import FadeImage from "@/components/FadeImage";

// Matches the "/etc" page's own mount animation exactly (see SLIDE_UP_DURATION
// there) — fades up from 40px below on load, same feel across both pages.
const SLIDE_UP_DURATION = 0.35;

// Same "the rest of the viewport below the sticky header" idea Jar.js uses
// for its own hero section, so this section fits one screen too instead of
// needing a scroll to see all of it. Kept as a plain calc() string (not a
// shared CSS custom property, unlike Jar.js's own --available-height) only
// because this is a .tsx file — TypeScript's CSSProperties type doesn't
// know about arbitrary custom properties without an `as` cast, and one
// repeated calc() string is simpler than fighting that for a single page.
const AVAILABLE_HEIGHT = "calc(100dvh - var(--taskbar-height, 4.375rem))";

// "About" bio section — labeled "About" in the taskbar, route stays "/notes"
// (see the previous version of this file's own comment on why). Framed
// photo on the left (me-framed.webp — a single pre-composited image, photo
// and hand-drawn frame already combined) with the bio text beside it on the
// right, wrapped in Amy's hand-drawn border.png instead of a plain CSS
// border.
function socialHref(id: string) {
  return SOCIAL_LINKS.find((s) => s.id === id)?.href ?? "#";
}

const LINK_CLASS = "underline decoration-black/30 underline-offset-2 transition-colors hover:text-[#2460A4] hover:decoration-[#2460A4]";

// Every size below that used to be a fixed value (photo width, padding,
// gap, heading/body font-size, paragraph spacing) is now a dvh-based
// clamp() instead, so the whole section shrinks together on a short
// viewport rather than holding fixed sizes and overflowing it. This
// matters even more on the stacked (below lg) layout than the side-by-side
// one — a fixed photo plus 5 fixed-size paragraphs stacked on top of each
// other is what was blowing past one screen on phones/short windows.
const PARAGRAPH_CLASS = "mt-[clamp(0.4rem,1.9dvh,1rem)] font-body text-[clamp(0.8125rem,1.9dvh,1rem)] font-light leading-snug text-black/70";

export default function NotesPage() {
  return (
    <section
      className="mx-auto flex w-full max-w-[1100px] flex-col justify-center px-4 py-4"
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
        <div className="grid grid-cols-1 items-center gap-[clamp(0.75rem,3dvh,3rem)] lg:grid-cols-[minmax(0,460px)_minmax(320px,1fr)]">
          {/* Framed photo — left. Used to be two layered images (frame.png
              behind, me.webp inset on top) — replaced with a single
              pre-composited image (frame drawn around the photo already).
              Aspect ratio is this file's own (1368x1600). */}
          <div
            className="relative mx-auto w-full"
            style={{
              aspectRatio: "1368 / 1600",
              // Same shape as Jar.js's own hero-art width formula: the
              // largest width that's simultaneously ≤460px (original
              // design cap), ≤100% of the column, and short enough that
              // the photo's own height (width * 1600/1368) never eats more
              // than ~34% of the available viewport height. 34%, not
              // Jar's own 60% — this page also has a full text block
              // sharing that same vertical space on the stacked layout,
              // where Jar's hero art is the only thing in its section.
              width: `min(460px, 100%, calc(${AVAILABLE_HEIGHT} * 0.34 * 1368 / 1600))`,
            }}
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
          <div className="relative p-[clamp(1.25rem,3dvh,3rem)] text-left">
            <FadeImage
              src="/images/drawings/border.png"
              alt=""
              fill
              sizes="640px"
              unoptimized={process.env.NODE_ENV !== "production"}
              className="pointer-events-none object-fill"
            />
            <div className="relative">
              <h1 className="font-instrument text-[clamp(1.15rem,3.2dvh,1.75rem)] text-black/90">Hello! I&apos;m Amy</h1>

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
    </section>
  );
}
