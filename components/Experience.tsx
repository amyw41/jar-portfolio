import { EXPERIENCE, type ExperienceEntry } from "@/lib/experience";
import FadeImage from "@/components/FadeImage";

// Amy's work/community history — logo, company, title, date, grouped under
// "Work"/"Community" headings. Used to live behind a Gallery/Experience
// toggle on the homepage's "What's inside?" section (see WhatsInside/
// index.tsx's own git history) — moved onto the About page instead, in its
// own section right below the bio, once that toggle was removed. Dropped
// the hand-drawn border.png frame it used to render inside there on the
// move: that frame was sized to wrap the *entire* homepage view on its own;
// sitting directly under the bio's already-framed text column here, a
// second frame read as too heavy, so this is just the list now.
//
// Date sits stacked under the title here (not out to the far right like an
// earlier version of this component tried) — that only worked as one wide
// row spanning the full section width; once Work/Community sit side by
// side (see the grid below) each column is roughly half that width, not
// enough room left for a right-aligned date without crowding or wrapping.
function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* Fixed square, not `fill`-to-row-height — logos come in whatever
          aspect ratio each company's own brand mark is (square icon vs.
          wide wordmark), so object-contain inside a fixed box is what
          keeps every one the same visual weight in the list regardless of
          its native shape. rounded-[5px] (slight rounding, not full
          circle) + no border — softens the square without turning it into
          an avatar-style badge, and at this size doesn't need an outline
          to read as its own distinct shape against the page. */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[5px] bg-white">
        <FadeImage
          src={entry.logo}
          alt={`${entry.company} logo`}
          fill
          sizes="56px"
          unoptimized={process.env.NODE_ENV !== "production"}
          className="object-contain"
        />
      </div>
      <div className="text-left">
        <p className="font-body text-lg text-black/90">
          <span className="font-medium">{entry.company}</span>{" "}
          <span className="text-black/60">— {entry.title}</span>
        </p>
        <p className="font-body text-base font-light text-black/50">{entry.date}</p>
      </div>
    </div>
  );
}

export default function Experience() {
  // Work/Community side by side at lg+ (stacked below that, same as one
  // column per group reads on mobile regardless) — deliberately left
  // top-aligned rather than balanced/centered even though Work (1 entry)
  // and Community (3 entries) end up very different heights right now, per
  // Amy's own call. Revisit if that gap reads as more than "these two
  // groups happen to be different sizes right now" once Work has more in
  // it.
  return (
    <div className="grid w-full grid-cols-1 gap-x-16 gap-y-8 text-left lg:grid-cols-2">
      {EXPERIENCE.map((group) => (
        <div key={group.label}>
          <h3 className="font-instrument text-[28px] text-black/80">{group.label}</h3>
          <div className="mt-4 divide-y divide-gray-100">
            {group.entries.map((entry) => (
              <ExperienceRow key={entry.company} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
