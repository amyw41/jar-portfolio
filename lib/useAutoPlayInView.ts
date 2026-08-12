"use client";

import { useEffect, useRef } from "react";

// Attach the returned ref to a <video>. Instead of `autoPlay` firing the
// instant the element mounts — which fires for every video on the page at
// once, several of them still off-screen, and is what was making them show
// up slow/stuck by the time you actually scrolled down to them — this waits
// until the video has actually scrolled into view, then plays it fresh from
// the beginning. Scrolling back out pauses it, so scrolling back in plays
// from the start again rather than resuming mid-clip.
export function useAutoPlayInView<T extends HTMLVideoElement>(threshold = 0.4) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.currentTime = 0;
          el.play().catch(() => {
            // Autoplay can still be blocked in some browsers even
            // muted/inline (e.g. low-power mode) — nothing to do but let it
            // sit on its poster/first frame rather than throw.
          });
        } else {
          el.pause();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
