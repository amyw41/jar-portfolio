// Intentionally empty — Taskbar and Footer already render at the layout
// level (app/layout.js), so this page just needs to exist as a valid route.
// Labeled "About" in the taskbar now (see Taskbar.js's NAV_LINKS) — the
// route itself stays "/notes" rather than being renamed to match, since the
// label is just display text and changing the URL isn't part of what was
// asked. The bulletin board that used to live here (components/Notes/*) is
// left in place but unreferenced, in case it's wanted again later; delete it
// separately if it's confirmed dead for good.
export default function NotesPage() {
  return null;
}
