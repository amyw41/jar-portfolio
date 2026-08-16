import { EXPERIENCE, type ExperienceEntry } from "@/lib/experience";
import FadeImage from "@/components/FadeImage";

// Replaces the old Carousel view (see WhatsInside/index.tsx) — that showed
// the same creative PORTFOLIO_PROJECTS as Gallery, just spinning; this is
// real work/community history instead, which reads better as a plain list
// than as a wheel. Wrapped in the same hand-drawn border.png frame the
// About page uses for its bio text, so the two "read about Amy" surfaces
// (About's bio, this) share a visual language.
function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {/* Fixed square, not `fill`-to-row-height — logos come in whatever
          aspect ratio each company's own brand mark is (square icon vs.
          wide wordmark), so object-contain inside a fixed box is what
          keeps every one the same visual weight in the list regardless of
          its native shape. */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
        <FadeImage
          src={entry.logo}
          alt={`${entry.company} logo`}
          fill
          sizes="48px"
          unoptimized={process.env.NODE_ENV !== "production"}
          className="object-contain p-1.5"
        />
      </div>
      <div className="text-left">
        <p className="font-body text-base text-black/90">
          <span className="font-medium">{entry.company}</span>{" "}
          <span className="text-black/60">— {entry.title}</span>
        </p>
        <p className="font-body text-sm font-light text-black/50">{entry.date}</p>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    // mx-auto w-full max-w-[640px] — About's own border-wrapped text column
    // is sized by its parent grid there (minmax(320px,1fr)); this isn't in
    // a grid, so it needs an explicit width instead. 640px matches the
    // `sizes` hint passed to border.png below and reads as a comfortable
    // single reading column, similar to About's own text column width.
    <div className="relative mx-auto w-full max-w-[640px] p-10 text-left sm:p-12">
      <FadeImage
        src="/images/drawings/border.png"
        alt=""
        fill
        sizes="640px"
        unoptimized={process.env.NODE_ENV !== "production"}
        className="pointer-events-none object-fill"
      />
      <div className="relative">
        {EXPERIENCE.map((group) => (
          <div key={group.label} className="mt-8 first:mt-0">
            <h3 className="font-instrument text-[22px] text-black/80">{group.label}</h3>
            <div className="mt-1 divide-y divide-gray-100">
              {group.entries.map((entry) => (
                <ExperienceRow key={entry.company} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
