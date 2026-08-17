import FadeImage from "@/components/FadeImage";

// "Plate" circle used both small (overview grid) and large (detail page,
// centered) — a hand-drawn plate illustration with the category name
// centered inside. Purely decorative/presentational aside from the image
// itself, so it renders fine from either a Server or Client Component.
//
// `src` — each category now has its own distinct plate illustration (see
// PLATE_IMAGES in lib/etc.ts) instead of every category sharing the one
// generic plate-1.png this used to hardcode; callers look theirs up from
// that map and pass it in here.
export default function PlateCircle({
  label,
  src,
  size = 220,
  className = "",
}: {
  label: string;
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none relative flex items-center justify-center text-gray-600 ${className}`}
      style={{ width: size, height: size }}
    >
      <FadeImage
        src={src}
        alt=""
        fill
        priority
        // No `sizes` prop — matches jar.png's own (accidental, but
        // proven-good-looking) treatment in Jar.js. This used to specify
        // `sizes` (with a `renderedSize` override on the detail page, to
        // account for that page's own CSS transform: scale() enlarging this
        // past `size` afterward) so next/image would only fetch the exact
        // resolution needed — but this fine hand-drawn linework visibly
        // pixelates at that resolution once actually stretched back out to
        // real size at any real zoom/DPR, the same issue border.png had.
        // Omitting `sizes` makes next/image assume this could need
        // full-viewport width, so it always fetches a much bigger source
        // than any actual use of this component needs (small overview grid
        // icon, larger detail-page centerpiece, or that detail page's own
        // further CSS scale-up) — wasteful, but the only way this asset
        // reliably looks sharp, and it also means the detail page doesn't
        // need its own extra prop just to compensate for its transform
        // anymore.
        quality={95}
        // Turbopack's dev-mode image-optimization cache doesn't bust when a
        // file is replaced at the same path (it keeps serving the
        // first-ever encode indefinitely) — these plate illustrations just
        // got swapped from one shared file to per-category ones and may get
        // swapped again, so skip the optimizer in dev to always show the
        // current file. Same workaround as jar.png, ProjectMedia.tsx, and
        // CaseStudyImage. Production still gets normal next/image
        // optimization.
        unoptimized={process.env.NODE_ENV !== "production"}
        // Rotated 180° — plate-1.png's pen strokes didn't fully close near
        // the top (a visible gap in both rings, plus a stray tail mark),
        // while the bottom was clean; flipping it moved that gap to the
        // bottom, which the detail page's bleed-clip crops away anyway. Each
        // category's new plate art may not have the same gap — worth
        // rechecking per plate now that they're no longer all the same file.
        className="rotate-180 object-contain"
      />
      {/* group-hover — reacts to the overview page's Link wrapping this
          (marked `group` there); does nothing on the detail page, where
          label is always "" anyway. */}
      <span
        className="relative px-4 font-instrument text-gray-600 transition-colors group-hover:text-[#2460A4]"
        style={{ fontSize: size * 0.1 }}
      >
        {label}
      </span>
    </div>
  );
}
