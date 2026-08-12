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

    // One frame so this runs after ScrollToTop's own instant reset-to-0
    // above has actually taken effect, rather than racing it.
    const raf = requestAnimationFrame(() => {
      scrollToWorkSection("smooth");
      // Clears the hash without adding a new history entry or triggering a
      // scroll itself — keeps a later refresh/back-navigation from
      // re-triggering this same slide unexpectedly.
      window.history.replaceState(null, "", pathname);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
