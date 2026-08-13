// Shared by both scroll paths that land on the homepage's "Work" section
// (id="work" in components/WhatsInside/index.tsx): the same-page smooth
// click in Taskbar.js, and the cross-page "land at top, then slide down"
// sequence in ScrollToWork.js. One implementation means both always agree on
// exactly where "Work" scrolls to, instead of drifting apart over time.
//
// Deliberately computed manually via window.scrollTo rather than
// el.scrollIntoView — scrollIntoView only respects an element's own
// scroll-margin-top, with no separate way to land a bit further past that
// without changing what scroll-margin-top means everywhere else it matters.
//
// Anchors on the "What's inside?" HEADING itself (id="work-heading" in
// WhatsInside/index.tsx), not the section's own top edge. The section has a
// large pt-36 (144px) top padding before the heading starts, so landing on
// the section's edge left a big gap of empty space above the heading —
// reads as "scrolled too little, heading isn't at the top." A previous fix
// tried to compensate with a second hand-tuned pixel offset added on top of
// that (EXTRA_DOWN_OFFSET), which was fragile and drifted out of sync any
// time the padding (or the offset) changed. Anchoring directly on the
// heading and adding only a small, fixed HEADING_TOP_GAP means the heading
// always lands the same short distance below the sticky header, regardless
// of the section's own padding — and because that also means scrolling
// further down (past the padding, not just to the section's edge), the
// toggle row and the projects grid below the heading now have enough of the
// remaining viewport to actually be on screen when it lands, instead of
// requiring a second manual scroll from the user.
const HEADING_TOP_GAP = 24; // px of breathing room between the sticky header and the heading

export function scrollToWorkSection(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;
  // Falls back to the section itself if the heading id isn't found for some
  // reason, so this never silently no-ops.
  const heading = document.getElementById("work-heading") ?? document.getElementById("work");
  if (!heading) return;

  // --taskbar-height is set as a live inline custom property on <html> by
  // Taskbar.js (its own useLayoutEffect) — read directly off the element's
  // own inline style rather than getComputedStyle, since that's exactly
  // where it's written and avoids any doubt about cascade/computation.
  const taskbarHeight = parseFloat(document.documentElement.style.getPropertyValue("--taskbar-height")) || 70;
  const targetY = window.scrollY + heading.getBoundingClientRect().top - taskbarHeight - HEADING_TOP_GAP;
  window.scrollTo({ top: Math.max(targetY, 0), behavior });
}
