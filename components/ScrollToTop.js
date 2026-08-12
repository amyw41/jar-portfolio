"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Forces a real, instant reset to the very top of the page on every route
// change.
//
// Why this is still needed even without global scroll-behavior: smooth
// (see globals.css's own comment on that): client-side navigations use the
// History API's pushState, and most browsers' *native* scroll restoration
// (history.scrollRestoration, defaults to "auto") tries to be "helpful" by
// carrying over roughly where you were scrolled to, rather than resetting —
// that's the actual source of "loads in a little scrolled," independent of
// the earlier smooth-scroll animation bug. Setting scrollRestoration to
// "manual" once turns that native behavior off, and the effect below then
// explicitly snaps to (0, 0) itself after every pathname change — with no
// CSS smoothing left to animate it, this is now a single clean instant
// jump, not the two-step "slide then snap" motion the smooth-scroll version
// had.
//
// No longer guarded on the presence of a hash — a link like "/#work"
// (Taskbar.js's "Work" link, navigated from anywhere other than "/") used to
// skip this reset so it wouldn't fight the browser's own native hash-jump.
// Taskbar.js now passes that link `scroll={false}`, so Next never performs
// that jump in the first place, and ScrollToWork.js (mounted right after
// this component) explicitly slides down to the section afterward — this
// effect can unconditionally land every navigation at the top first, which
// is exactly the "load in at the top, then slide down" beat that two-step
// sequence needs to start from.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
