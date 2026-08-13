"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToWorkSection } from "@/lib/scrollToWork";

// Handles the "Work" taskbar link when it's clicked from somewhere other
// than "/" (see Taskbar.js's own handleClick for the already-on-"/" case,
// which scrolls immediately instead). That link still carries a real
// "/#work" href/hash — for bookmarking/sharing — but Taskbar.js passes it
// `scroll={false}` so Next's own default navigation scroll (an instant jump
// straight to the hash, skipping the top of the page entirely) never runs.
// This component is what replaces it: land at the top first (ScrollToTop's
// own effect, mounted just before this one), then, once pathname is "/" and
// that hash is still present, slide smoothly down to the Work section —
// the explicit two-beat entrance Amy asked for, instead of an instant jump.
export default function ScrollToWork() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/" || window.location.hash !== "#work") return;

    // A short delay, not just one rAF, before kicking off the smooth
    // scroll. Landing on "/" is also exactly when Jar.js mounts fresh and
    // does its own burst of synchronous work once the jar art loads
    // (building the matter-js physics world, six bodies, walls, etc.) — a
    // single rAF could still land inside that burst and starve the
    // just-started smooth-scroll animation, which reads as this link
    // "doing nothing." Giving the initial mount a beat to settle first
    // makes the slide reliably show up instead of racing it.
    const timer = setTimeout(() => {
      scrollToWorkSection("smooth");
      // Clears the hash without adding a new history entry or triggering a
      // scroll itself — keeps a later refresh/back-navigation from
      // re-triggering this same slide unexpectedly.
      window.history.replaceState(null, "", pathname);
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
