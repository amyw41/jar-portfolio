import { EXPERIENCE, type ExperienceEntry } from "@/lib/experience";
import FadeImage from "@/components/FadeImage";

// Amy's work/community history — logo, company, title, date, grouped under
// "Work"/"Community" headings. Used to live behind a Gallery/Experience
// toggle on the homepage's "What's inside?" section (see WhatsInside/
// index.tsx's own git history) — moved onto the About page instead, right
// below the bio, once that toggle was removed. Dropped the hand-drawn
// border.png frame it used to render inside there on the move: that frame
// was sized to wrap the *entire* homepage view on its own; sitting directly
// under the bio's already-framed text column here, a second frame read as
// too heavy, so this is just the list now, centered on its own.
function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {/* Fixed square, not `fill`-to-row-height — logos come in whatever
          aspect ratio each company's own brand mark is (square icon vs.
          wide wordmark), so object-contain inside a fixed box is what
          keeps every one the same visual weight in the list regardless of
          its native shape. rounded-[5px] (slight rounding, not full
          circle) + no border — softens the square without turning it into
          an avatar-style badge, and at this size doesn't need an outline
          to read as its own distinct shape against the page. */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[5px] bg-white">
        <FadeImage
          src={entry.logo}
          alt={`${entry.company} logo`}
          fill
          sizes="64px"
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
  // max-w-[640px] — matches the About page's own bio text-column width
  // (see app/notes/page.tsx), not the wider 760px this used when it was a
  // standalone full-width homepage view with nothing else beside it.
  return (
    <div className="mx-auto w-full max-w-[640px] text-left">
      {EXPERIENCE.map((group) => (
        <div key={group.label} className="mt-10 first:mt-0">
          <h3 className="font-instrument text-[28px] text-black/80">{group.label}</h3>
          <div className="mt-1 divide-y divide-gray-100">
            {group.entries.map((entry) => (
              <ExperienceRow key={entry.company} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
