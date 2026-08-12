import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/social";

// "About" bio section — labeled "About" in the taskbar, route stays "/notes"
// (see the previous version of this file's own comment on why). Framed
// photo on the left (me.webp layered on top of frame.png — the hand-drawn
// frame sits behind, the photo inset within its opening on top, so the
// frame's ornate border still shows around the photo's edges) with the bio
// text beside it on the right, wrapped in Amy's hand-drawn border.png
// instead of a plain CSS border.
function socialHref(id: string) {
  return SOCIAL_LINKS.find((s) => s.id === id)?.href ?? "#";
}

const LINK_CLASS = "underline decoration-black/30 underline-offset-2 transition-colors hover:text-[#2460A4] hover:decoration-[#2460A4]";

export default function NotesPage() {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 pb-36 pt-24">
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
        {/* Framed photo — left. frame.png's own canvas (7432x8912) sets the
            box's aspect ratio; me.webp sits inset within it so the frame's
            drawn border stays visible all the way around. The 11% inset is
            eyeballed off the frame artwork's own opening, not a precise
            trace — nudge it if the photo doesn't sit flush against the
            drawn edge once this is live. */}
        <div className="relative mx-auto w-full max-w-[460px]" style={{ aspectRatio: "7432 / 8912" }}>
          <Image
            src="/images/drawings/frame.png"
            alt=""
            fill
            sizes="460px"
            // Turbopack's dev-mode image-optimization cache doesn't bust
            // when a file is replaced at the same path — same workaround as
            // jar.png, PlateCircle, ProjectMedia.tsx, and CaseStudyImage.
            unoptimized={process.env.NODE_ENV !== "production"}
            className="pointer-events-none object-contain"
          />
          <div className="absolute overflow-hidden" style={{ inset: "11%" }}>
            <Image
              src="/images/etc/me.webp"
              alt="Amy standing at a bus stop"
              fill
              sizes="410px"
              unoptimized={process.env.NODE_ENV !== "production"}
              className="object-cover"
            />
          </div>
        </div>

        {/* Text — right. border.png's own aspect ratio (9587x7787, close to
            square) is nowhere near this card's actual shape once real bio
            text fills it — a tall, narrow rectangle — so a plain stretched
            copy (object-fill) squishes the hand-drawn line more the taller
            the text runs, and hand-cropping just a top/bottom strip drops
            the sides entirely. border-image is the CSS property actually
            built for this: it slices the source into a 3x3 grid, keeps the
            4 corners exactly as drawn (loops included, no distortion), and
            only stretches the 4 edge strips along their own single axis —
            full frame, never squished, whatever the text's own height. */}
        <div
          className="relative p-10 text-left sm:p-12"
          style={{
            borderStyle: "solid",
            borderWidth: "28px",
            borderColor: "transparent",
            borderImageSource: "url('/images/drawings/border.png')",
            // Percentages are relative to border.png's own 9587x7787 pixels
            // — generous enough to fully contain the wavy line's own drift
            // (measured: it wanders roughly 2.5-8% in from each edge)
            // without slicing through it.
            borderImageSlice: "10% 6% 10% 6%",
            // Unlike most CSS props, border-image-width takes a bare number
            // as a *multiplier* of border-width, not implicit px — React
            // knows this and won't auto-append "px" the way it does for
            // borderWidth above, so a plain 28 here rendered as literally
            // "28 (x border-width)" = 784px, which is the giant, broken
            // strokes from the last attempt. Needs the unit spelled out.
            borderImageWidth: "28px",
            borderImageRepeat: "stretch",
          }}
        >
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
    </section>
  );
}
