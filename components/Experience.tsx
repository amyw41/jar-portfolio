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
// Below lg: same stacked shape as the original homepage version (logo left,
// company/title and date stacked in a text block to its right) — narrow
// screens don't have room for a wide date-on-the-far-right layout. At lg+
// (this now lives in a full max-w-[1100px] section, not a narrow 640px
// column — see app/notes/page.tsx's own comment on why): company/title stay
// left, and the date moves out to the far right of the row instead of
// sitting underneath, with the gap between them stretching to fill
// whatever room is left — that's what actually lines the date up with the
// bio text box's own right edge above, and keeps each row shorter
// (one line, not two) so the whole list reads as more compact.
function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 lg:py-2.5">
      <div className="flex items-center gap-4">
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
          {/* Date stacked here below lg only — at lg+ it moves to the
              standalone right-aligned one below instead. */}
          <p className="font-body text-base font-light text-black/50 lg:hidden">{entry.date}</p>
        </div>
      </div>
      <p className="hidden flex-shrink-0 font-body text-base font-light text-black/50 lg:block">
        {entry.date}
      </p>
    </div>
  );
}

export default function Experience() {
  // No max-width/mx-auto here anymore — this fills whatever width its
  // parent section gives it (max-w-[1100px], the bio grid's own width; see
  // app/notes/page.tsx) instead of capping itself to a narrower column, so
  // ExperienceRow's date-on-the-right layout actually has the full row
  // width to spread across at lg+.
  return (
    <div className="w-full text-left">
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
