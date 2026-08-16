"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PlateCircle from "@/components/Etc/PlateCircle";
import FadeImage from "@/components/FadeImage";
import { PLATE_IMAGES, type EtcCategorySlug } from "@/lib/etc";

// How long a plate takes to slide up into view — on page load for the
// heading, and again per-category (matching Carousel.tsx's own reveal) as
// each plate scrolls into the viewport — before that category's photos
// start their roll-out (below), so the two entrances read as sequential
// instead of overlapping. Kept short so scrolling down feels responsive
// instead of laggy.
const SLIDE_UP_DURATION = 0.35;
const PHOTO_DURATION = 0.35;
const STAGGER_STEP = 0.03;
// How much of an element needs to be on-screen before its whileInView
// entrance fires — lower than Carousel.tsx's own 0.3 so plates/photos start
// animating as soon as they're barely in view, instead of waiting for a
// third of them to have scrolled past the fold first.
const VIEWPORT_AMOUNT = 0.1;

// Fixed desktop collage — a poster-style composition, not a responsive one.
// The stage below is a fixed-width box that never grows or shrinks with the
// viewport (see EtcPage: no scale factor anywhere, just overflow-x-auto so
// a narrower window scrolls instead of squishing it). Its height is
// computed below from GALLERY itself, not hardcoded — see computeStageHeight.
const STAGE_WIDTH = 1277;
const PLATE_SIZE = 480; // estimate — the mockup didn't give an exact measurement for the plate's own diameter

type CollagePhoto = {
  src: string;
  caption: string;
  xPct: number; // left, as a % of STAGE_WIDTH
  yPct: number; // top, as a % of STAGE_HEIGHT
  width: number; // literal px, mockup-measured — matches the stage's own fixed coordinate space
  height: number;
  z: number;
  extraDelay?: number; // added on top of the usual rank-based stagger delay, for a photo that should noticeably lag behind the rest
};

type CollageCategory = {
  slug: EtcCategorySlug;
  label: string;
  plateXPct: number;
  plateYPct: number;
  plateSize: number;
  photos: CollagePhoto[];
};

// Every position/size below is mockup-measured, then run through two passes
// by hand: each category's photos were pulled ~25% in toward their own
// group's center (the raw mockup anchors read as separate floating photos,
// not the dense overlapping stack the reference shows), and the whole
// cluster was then shifted so its nearest photo bites ~75px into its
// plate's edge (the raw anchors merely touch the plate, not overlap it).
// These are the resolved numbers from that tuning — editing one photo now
// just means changing its own field here directly, nothing to recompute.
// Plate yPct values are uniformly spaced — 9.7, 36.8, 63.9, 91.0, each 27.1
// apart — anchored at drawing (9.7, row 1) and content (91.0, row 4).
// Dancing now sits in row 2 (36.8) and nails in row 3 (63.9) — swapped from
// their original rows per Amy's request. Rows alternate left/right
// (drawing left, row 2 right, row 3 left, content right) — dancing's plate
// and all 7 of its photos were mirrored horizontally as one rigid unit
// (newXPct = 100 - oldXPct) to move from row 3's left side to row 2's
// right side, since its original cluster already sat symmetrically between
// x=14.1 and x=86 (centered on 50), so a straight mirror keeps its own
// internal composition — spacing, overlap, everything — exactly intact,
// just facing the other way. Only positions moved; none of the actual
// photo files were flipped (no scaleX anywhere), so every photo still
// displays right-reading. Dancing's photos also shifted by the same -27.1
// yPct delta as its plate (63.9 → 36.8), staying glued to it as the same
// unit. Nails has no photos, so its move (36.8 → 63.9, 76.0 → 14.1, taking
// dancing's old row-3 slot) is just the two plate fields.
const GALLERY: CollageCategory[] = [
  {
    slug: "drawing",
    label: "Drawing",
    plateXPct: 14.1,
    plateYPct: 9.7,
    plateSize: PLATE_SIZE,
    photos: [
      {
        src: "/images/etc/drawing1.webp",
        caption: "Niu Zaizai - 2023.",
        xPct: 30,
        yPct: 10,
        width: 202,
        height: 269,
        z: 1,
      },
      {
        src: "/images/etc/drawing2.webp",
        caption: "Jo Yuri (Squid Games) - 2025.",
        xPct: 42,
        yPct: 14,
        width: 222,
        height: 224,
        z: 2,
      },
      {
        src: "/images/etc/drawing3.webp",
        caption: "Cha Woongki (AHOF) - 2023.",
        xPct: 45,
        yPct: 7,
        width: 233,
        height: 236,
        z: 3,
      },
      {
        src: "/images/etc/drawing4.png",
        caption: "Chihen (WIP, AHOF) - 2026).",
        xPct: 57,
        yPct: 11,
        width: 209,
        height: 253,
        z: 4,
      },
    ],
  },
  {
    slug: "dancing",
    label: "Dancing",
    // Mirrored from the original 14.1 (100 - 14.1 = 85.9) — see the GALLERY
    // comment above.
    plateXPct: 85.9,
    plateYPct: 36.8,
    plateSize: PLATE_SIZE,
    photos: [
      {
        src: "/images/etc/dance1.webp",
        caption: "Curtain call after a group recital.",
        xPct: 48,
        yPct: 34.6,
        width: 268,
        height: 193,
        z: 1,
      },
      {
        src: "/images/etc/dance3.webp",
        caption: "Korean traditional hanbok dance.",
        xPct: 63,
        yPct: 37,
        width: 200,
        height: 270,
        z: 3,
      },
      {
        src: "/images/etc/dance4.webp",
        caption: "Fan dance in blue stage light.",
        xPct: 32,
        yPct: 31,
        width: 270,
        height: 180,
        z: 4,
      },
      {
        // Swapped with dance7 ("Fan in hand, between poses") — that one,
        // not dance4, is the other "fan" photo Amy meant.
        src: "/images/etc/dance5.webp",
        caption: "Extension into an arabesque.",
        xPct: 46,
        yPct: 40,
        width: 260,
        height: 172,
        z: 5,
      },
      {
        src: "/images/etc/dance6.webp",
        caption: "Backstage at the Abstract Dance Challenge.",
        xPct: 14.61,
        yPct: 34,
        width: 186,
        height: 244,
        z: 10,
      },
      {
        // Swapped with dance5 ("Extension into an arabesque") per Amy's
        // correction — was previously moved/nudged to rest between dance5
        // and dance3; now sits at dance5's old spot instead.
        src: "/images/etc/dance7.webp",
        caption: "Fan in hand, between poses.",
        xPct: 28,
        yPct: 36.5,
        width: 280,
        height: 190,
        z: 3,
      },
    ],
  },
  {
    slug: "nails",
    label: "Nails",
    plateXPct: 14.1,
    plateYPct: 63.9,
    plateSize: PLATE_SIZE,
    // Spread rightward from the plate the same way drawing's own 4-photo
    // cluster does (drawing also sits at x=14.1) — widths/heights carried
    // over from each real photo's own intrinsic ratio (nails1 is ~2160x2373;
    // nails2-5 are all ~2160x2880, the standard 3:4 phone-photo ratio).
    photos: [
      {
        src: "/images/etc/nails2.jpg",
        caption: "Negative space French with a crystal lattice accent.",
        xPct: 65,
        yPct: 61,
        width: 200,
        height: 267,
        z: 2,
      },
      {
        src: "/images/etc/nails3.jpg",
        caption: "Leopard print with 3D star charms.",
        xPct: 36,
        yPct: 63,
        width: 220,
        height: 293,
        z: 0,
      },
      {
        src: "/images/etc/nails4.jpg",
        caption: "Nude nails with bold number decals.",
        xPct: 50.2,
        yPct: 58,
        width: 185,
        height: 253,
        z: 4,
      },
      {
        src: "/images/etc/nails5.jpg",
        caption: "Shimmery mauve coffin nails with a chrome accent.",
        xPct: 52.6,
        yPct: 65,
        width: 205,
        height: 277,
        z: 0,
      },
    ],
  },
];

// Where a photo falls in its category's own top-to-bottom order (0 =
// highest up), independent of the order it's listed in GALLERY.
function topToBottomRank(photos: CollagePhoto[], target: CollagePhoto): number {
  return [...photos].sort((a, b) => a.yPct - b.yPct).indexOf(target);
}

// STAGGER_STEP is per-photo, so a category's *total* cascade time grows with
// its photo count — drawing (4 photos) spans 3 * STAGGER_STEP, but dancing
// (7 photos) nearly doubles that to 6 * STAGGER_STEP, which reads as
// noticeably slower to roll in even though nothing about dancing itself is
// meant to be different. Scaling the step down for categories with more
// photos than drawing keeps every category's total cascade within the same
// budget drawing already uses (REFERENCE_PHOTO_COUNT - 1 steps), instead of
// letting it stretch out further the more photos a category has. Categories
// with 4 or fewer photos are untouched (the min just gives back
// STAGGER_STEP).
const REFERENCE_PHOTO_COUNT = 4; // matches drawing's own photo count
const STAGGER_SPAN = (REFERENCE_PHOTO_COUNT - 1) * STAGGER_STEP;
function categoryStaggerStep(photos: CollagePhoto[]): number {
  return Math.min(STAGGER_STEP, STAGGER_SPAN / Math.max(1, photos.length - 1));
}

// Since every element is positioned by `top: yPct%`, a taller container
// pushes every element further down for the *same* percentage — so the
// container's own height can't just be guessed once and left alone; it has
// to satisfy whichever element sits closest to the top or bottom edge for
// its own size. This solves that directly: for a plate/photo centered at
// yPct with the given pixel size, the smallest container height that keeps
// it from clipping top or bottom is size/2 divided by the smaller of yPct
// and (100 - yPct). Taking the max of that across everything in GALLERY
// gives a height that always fits the content, however PLATE_SIZE or any
// position changes later — no more re-guessing a literal number by hand.
//
// It also has to account for each element's own *unsettled* whileInView
// state, not just its resting size: a plate/photo below the fold sits at
// its `initial` transform offset (translated, not yet animated in) until
// scrolled into view, and CSS counts that transformed position toward the
// nearest scrollable ancestor's overflow — so on first load, before
// anything below the fold has been scrolled to, those still-offset
// elements stick out past a tightly-fit container and force a scrollbar
// that then disappears element-by-element as each one settles into place.
// PLATE_SLIDE_OFFSET/PHOTO_SLIDE_OFFSET below match the y values in each
// motion.div's own `initial` prop, so the container is sized for their
// worst-case (unsettled) extent, not just their resting one.
const PLATE_SLIDE_OFFSET = 40; // matches the plate motion.div's initial y
const PHOTO_SLIDE_OFFSET = 70; // matches the photo motion.div's initial y (upward, so it only affects the top edge)
// Small flat safety margin on top of the precise calc below — covers the
// page-level heading wrapper's own initial y:40 mount animation (which
// isn't scroll-gated like the plate/photo ones above, so it briefly offsets
// the whole stage on first paint regardless of scroll position) plus
// general rounding.
const STAGE_HEIGHT_PADDING = 48;

function requiredStageHeight(yPct: number, size: number, topExtra: number, bottomExtra: number): number {
  const half = size / 2;
  const fraction = yPct / 100;
  return Math.max((half + topExtra) / fraction, (half + bottomExtra) / (1 - fraction));
}

function computeStageHeight(gallery: CollageCategory[]): number {
  let required = 0;
  for (const cat of gallery) {
    // Plate slides up from below (initial y:40) — only its bottom edge
    // needs the extra room.
    required = Math.max(required, requiredStageHeight(cat.plateYPct, cat.plateSize, 0, PLATE_SLIDE_OFFSET));
    for (const photo of cat.photos) {
      // Photo drops in from above (initial y:-70) — only its top edge
      // needs the extra room.
      required = Math.max(required, requiredStageHeight(photo.yPct, photo.height, PHOTO_SLIDE_OFFSET, 0));
    }
  }
  return Math.ceil(required) + STAGE_HEIGHT_PADDING;
}

const STAGE_HEIGHT = computeStageHeight(GALLERY);

// STAGE_HEIGHT above is set by whichever element needs the most room to
// avoid clipping — in practice that's always been the top-anchored drawing
// row (very close to y=0, so keeping it fully on-screen demands a tall
// stage), completely independent of whatever sits at the bottom. That's
// fine when a bottom row (like content/"Me") actually reaches down near
// STAGE_HEIGHT's own edge, but pulling that row (see GALLERY above) leaves
// nails, well short of the bottom, as the new lowest content — and the gap
// between nails and the still-tall STAGE_HEIGHT reads as dead space where
// that row used to be. This computes how far down the real content actually
// reaches (in the same STAGE_HEIGHT-relative px every element's `top: X%`
// already resolves to) so the stage box can be visually cropped to that —
// nothing's percentage position changes, only how much blank room is left
// showing below the lowest thing actually there.
function computeVisibleStageHeight(gallery: CollageCategory[], stageHeight: number): number {
  let bottom = 0;
  for (const cat of gallery) {
    bottom = Math.max(bottom, (cat.plateYPct / 100) * stageHeight + cat.plateSize / 2);
    for (const photo of cat.photos) {
      bottom = Math.max(bottom, (photo.yPct / 100) * stageHeight + photo.height / 2);
    }
  }
  return Math.ceil(bottom) + 40; // small breathing room below the lowest element
}

const VISIBLE_STAGE_HEIGHT = computeVisibleStageHeight(GALLERY, STAGE_HEIGHT);

// Every element's yPct was authored as a % of STAGE_HEIGHT (the tall,
// worst-case reference height — see computeStageHeight's own comment), so
// this converts that once into a literal px offset. Doing it this way
// (instead of leaving top as a live "X%" and relying on the container's own
// height to equal STAGE_HEIGHT) is what lets the container itself just be
// VISIBLE_STAGE_HEIGHT tall — position and container size are fully
// decoupled, so there's nothing left to keep in sync by hand.
function toPx(yPct: number): number {
  return (yPct / 100) * STAGE_HEIGHT;
}

export default function EtcPage() {
  const router = useRouter();
  // Next.js unmounts this page the instant a Link navigation fires, with no
  // chance to play an exit animation — so clicking a plate instead flips
  // this (storing which category it was headed to), lets the page
  // fade+slide up (continuing the same upward direction the entrance
  // arrived from) and only navigates once that animation actually
  // finishes. Matches the category detail page's own back-button exit.
  const [exitHref, setExitHref] = useState<string | null>(null);
  // Next's <Link> auto-prefetches routes once they scroll into the
  // viewport, but only in production — in dev mode every dynamic route
  // still compiles from scratch on the first real navigation to it, which
  // is most of why clicking a plate feels slow. Kicking off router.prefetch
  // for all 3 category routes as soon as this page mounts (rather than
  // waiting on each Link's own viewport-based prefetch) gives Next a head
  // start compiling them in the background before you've even clicked one.
  useEffect(() => {
    for (const cat of GALLERY) {
      router.prefetch(`/etc/${cat.slug}`);
    }
  }, [router]);
  // Which categories' plates have entered the viewport — the single shared
  // trigger every one of that category's photos keys off (see the photo
  // motion.div below). Each photo used to carry its own whileInView, which
  // fires the moment *that photo* individually crosses the viewport
  // threshold — for a category's higher-up photos that happens within a
  // few pixels of each other, so their rank-based delays read as intended,
  // but a photo further down the cluster crosses the threshold later (more
  // real scroll time has passed) and then gets the same fixed delay
  // stacked on top of that late start, breaking the steady cadence for
  // everything after the first couple. Anchoring all of a category's
  // photos to one shared moment (the plate's own entry) instead keeps the
  // stagger uniform regardless of how spread out the photos are on screen.
  const [revealedCats, setRevealedCats] = useState<Set<EtcCategorySlug>>(new Set());

  return (
    <section className="w-full px-4 pb-16 pt-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: exitHref ? 0 : 1, y: exitHref ? -16 : 0 }}
        // Was 0.4s on exit — with the route now prefetched (see above),
        // there's no more upside to a long fade masking a slow navigation;
        // it was just adding fixed delay to every single click. Shortened
        // to still read as a deliberate transition, not a jump cut.
        transition={{ duration: exitHref ? 0.18 : SLIDE_UP_DURATION, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (exitHref) router.push(exitHref);
        }}
      >
        <h1 className="font-singsong text-[clamp(2rem,6vw,3.5rem)] leading-none text-[#2460A4]">
          What&apos;s on my plate?
        </h1>

        {/* Desktop-only fixed composition — never rescales with the
            viewport, so there's no need for percentage-based positioning at
            all: every plate/photo's yPct is converted to a literal px offset
            below (toPx), computed once against STAGE_HEIGHT (the tallest
            room any single element needs — see computeStageHeight). That
            decouples position from this box's own height entirely, so the
            box itself can just be sized to VISIBLE_STAGE_HEIGHT (where the
            real content actually ends) with nothing left over before the
            footer — no nested wrapper, no scroll container, overflow stays
            the default `visible` throughout so the drawing plate's
            intentional left-edge bleed still shows uncropped. */}
        <div className="relative mx-auto mt-8" style={{ width: STAGE_WIDTH, height: VISIBLE_STAGE_HEIGHT }}>
          {GALLERY.map((cat) => (
            <div key={cat.slug}>
              <Link
                href={`/etc/${cat.slug}`}
                aria-label={`View ${cat.label} photos`}
                // group — lets PlateCircle's own label span react to this
                // link's hover (see its group-hover:text-[#2460A4] class)
                // without PlateCircle needing to know anything about hover
                // itself.
                className="absolute group"
                style={{
                  left: `${cat.plateXPct}%`,
                  top: toPx(cat.plateYPct),
                  transform: "translate(-50%, -50%)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setExitHref(`/etc/${cat.slug}`);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: VIEWPORT_AMOUNT }}
                  onViewportEnter={() =>
                    setRevealedCats((prev) => (prev.has(cat.slug) ? prev : new Set(prev).add(cat.slug)))
                  }
                  transition={{ duration: SLIDE_UP_DURATION, ease: "easeOut" }}
                >
                  <PlateCircle label={cat.label} src={PLATE_IMAGES[cat.slug]} size={cat.plateSize} />
                </motion.div>
              </Link>

              {cat.photos.map((photo) => (
                // Plain div, not a Link — only the plate itself should
                // navigate to /etc/{slug}; these photos are decorative.
                <div
                  key={photo.src}
                  className="pointer-events-none absolute block"
                  style={{
                    left: `${photo.xPct}%`,
                    top: toPx(photo.yPct),
                    width: photo.width,
                    height: photo.height,
                    transform: "translate(-50%, -50%)",
                    zIndex: photo.z,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -70 }}
                    animate={revealedCats.has(cat.slug) ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                      duration: PHOTO_DURATION,
                      ease: "easeOut",
                      // Ranked by each photo's own yPct (not array order) so
                      // whichever photo sits highest up the page rolls in
                      // first, matching the order they actually appear as
                      // you scroll down past the category — plus any
                      // photo-specific extraDelay on top, for a future
                      // one-off exception that should lag behind the rest.
                      delay:
                        SLIDE_UP_DURATION +
                        topToBottomRank(cat.photos, photo) * categoryStaggerStep(cat.photos) +
                        (photo.extraDelay ?? 0),
                    }}
                    className="relative h-full w-full overflow-hidden shadow-md"
                  >
                    <FadeImage
                      src={photo.src}
                      alt=""
                      fill
                      sizes={`${Math.round(photo.width)}px`}
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
