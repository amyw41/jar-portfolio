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
  // The detail page (app/etc/[category]/page.tsx) wraps this whole
  // component in its own CSS `transform: scale(...)` afterward, to fit the
  // composition to whatever viewport space is available — up to 1.5x
  // bigger than `size` itself. Left at its default (`size`), next/image
  // would only ever fetch a `size`-appropriate resolution, then the browser
  // blows that up another 1.5x on top via the transform — real, visible
  // upscale blur, unrelated to `quality` below. Callers doing that pass
  // their actual post-transform on-screen size here instead, so the fetch
  // itself already covers it.
  renderedSize,
  className = "",
}: {
  label: string;
  src: string;
  size?: number;
  renderedSize?: number;
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
        sizes={`${Math.round(renderedSize ?? size)}px`}
        // Same fix as border.png (see the About page's own comment) —
        // default next/image quality (75) visibly softens this hand-drawn
        // linework once resized to its real, fairly small render size.
        // jar.png doesn't have this problem only because it has no `sizes`
        // prop at all, so it's served near-full-resolution regardless of
        // its box — not something to copy here, since these plates do want
        // the smaller/faster request their real size implies.
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
