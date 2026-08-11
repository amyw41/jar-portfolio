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
// Guarded on the presence of a hash: a link like "/#work" changes pathname
// (e.g. navigating from a project page back to "/") *and* carries a hash
// that should scroll to that section once the home page has mounted —
// forcing an instant top-scroll here would fight that, so this effect steps
// aside whenever a hash is present.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
