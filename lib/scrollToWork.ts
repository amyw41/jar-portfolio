// Shared by both scroll paths that land on the homepage's "Work" section
// (id="work" in components/WhatsInside/index.tsx): the same-page smooth
// click in Taskbar.js, and the cross-page "land at top, then slide down"
// sequence in ScrollToWork.js. One implementation means both always agree on
// exactly where "Work" scrolls to, instead of drifting apart over time.
//
// Deliberately computed manually via window.scrollTo rather than
// el.scrollIntoView — scrollIntoView only respects the element's own
// scroll-margin-top (already reserved for clearing the sticky taskbar, see
// that section's own comment), with no separate way to land a bit further
// past that without changing what scroll-margin-top means everywhere else
// it might matter. EXTRA_DOWN_OFFSET is purely this button's own "go down a
// bit lower than just clearing the taskbar" tuning knob.
const EXTRA_DOWN_OFFSET = 80; // px, additional scroll past the taskbar-clearing position

export function scrollToWorkSection(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;
  const el = document.getElementById("work");
  if (!el) return;

  const scrollMarginTop = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const targetY = window.scrollY + el.getBoundingClientRect().top - scrollMarginTop + EXTRA_DOWN_OFFSET;
  window.scrollTo({ top: Math.max(targetY, 0), behavior });
}
