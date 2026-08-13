// Shared style for the small circular "back"/arrow buttons used across the
// site — the home page carousel's prev/next controls (Carousel.tsx), the
// /etc category page's back-to-plates link, and each project page's
// back-to-home link. Previously each of the three redefined this exact same
// class string by hand, with a comment on each one pointing at the other two
// ("matches X's own styling exactly") as the only thing keeping them in
// sync — a real style tweak had to be copied into all three by hand, with
// nothing enforcing that it actually was. One shared constant means there's
// only ever one place to change.
export const ARROW_BUTTON_CLASS =
  "flex h-[2.25rem] w-[2.25rem] flex-shrink-0 items-center justify-center rounded-full border border-black/50 bg-white text-black/50 transition-colors hover:border-[#2460A4] hover:text-[#2460A4]";
