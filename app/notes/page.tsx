"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/social";
import { SHIMMER_BLUR_DATA_URL } from "@/lib/blurPlaceholder";

// Matches the "/etc" page's own mount animation exactly (see SLIDE_UP_DURATION
// there) — fades up from 40px below on load, same feel across both pages.
const SLIDE_UP_DURATION = 0.35;

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

export default function NotesPage() {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 pb-36 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: SLIDE_UP_DURATION, ease: "easeOut" }}
      >
        {/* Single column (both items full-width, stacked) below lg — bumped up
          from md, and the photo column below now flexes instead of holding
          a rigid 460px, because a fixed-width column plus a "1fr" text
          column doesn't degrade gracefully in between: at just-barely-md
          widths there's nowhere near enough room left over for the fixed
          460px photo AND a readable text column, so text got squeezed down
          to a couple words per line. minmax(0,460px) lets the photo column
          itself shrink first when space is tight (down to its own
          max-w-[460px] div's natural minimum), while minmax(320px,1fr)
          guarantees the text column never drops below a readable width. */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,460px)_minmax(320px,1fr)]">
          {/* Framed photo — left. Used to be two layered images (frame.png
              behind, me.webp inset on top) — replaced with a single
              pre-composited image (frame drawn around the photo already).
              Aspect ratio is this file's own (1368x1600). */}
          <div className="relative mx-auto w-full max-w-[460px]" style={{ aspectRatio: "1368 / 1600" }}>
            <Image
              src="/images/etc/me-framed.webp"
              alt="Amy standing at a bus stop, framed"
              fill
              sizes="460px"
              unoptimized={process.env.NODE_ENV !== "production"}
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR_DATA_URL}
              className="pointer-events-none object-contain"
            />
          </div>

          {/* Text — right, wrapped in border.png instead of a plain CSS
            border. border.png is stretched with object-fill to exactly
            match this box's own rendered size, since it's a simple outline
            meant to wrap whatever height the bio text ends up being, not a
            fixed-ratio frame like the photo on the left. */}
          <div className="relative p-10 text-left sm:p-12">
            <Image
              src="/images/drawings/border.png"
              alt=""
              fill
              sizes="640px"
              unoptimized={process.env.NODE_ENV !== "production"}
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR_DATA_URL}
              className="pointer-events-none object-fill"
            />
            <div className="relative">
              <h1 className="font-instrument text-[28px] text-black/90">Hello! I&apos;m Amy</h1>

              <p className="mt-4 font-body text-base font-light leading-relaxed text-black/70">
                I like pretty things and cool people... so I like design!
              </p>

              <p className="mt-4 font-body text-base font-light leading-relaxed text-black/70">
                Growing up, my friends called me a perfectionist. I&apos;d say it&apos;s a
                flaw if it wasn&apos;t the reason I slave over every one of my
                creations, waiting for it to look <em> good </em> enough to post.
                (And I guess it isn&apos;t necessarily SLOW, just tedious...)
              </p>

              <p className="mt-4 font-body text-base font-light leading-relaxed text-black/70">
                I&apos;m also known as...
                <br />- a dancer! I&apos;m currently re-learning ballet pointe
                <br />- an overthinker. I&apos;m a big fan of lore (harry potter, hunger
                games, just finished aot... talk about it with me)
                <br />- an engineer. I&apos;m studying Management Engineering at
                Waterloo!
              </p>

              <p className="mt-4 font-body text-base font-light leading-relaxed text-black/70">
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
