export type PortfolioProject = {
  id: string;
  name: string;
  media: string; // path to an image or video file
  mediaType: "image" | "video";
  // Explicit rather than inferred from the file extension — more reliable
  // than sniffing .mp4 vs .png, and self-documenting when Amy is filling in
  // entries herself.
  description: string; // tagline, e.g. "Sprint · TikTok"
  link?: string; // optional — live site, video, case study
  // Hex accent behind the card's media/text — chosen per project to be a
  // lighter complement of that project's own footage (e.g. SkinSprout's
  // video reads pink, so its card accent is a lighter pink; Cybersea's
  // reads blue, so its card accent is a lighter blue), not one shared
  // brand color for every card.
  accent: string;
};

// Project ids with a full written case study (their own dedicated layout —
// see SpotifyCaseStudy.tsx and app/projects/[id]/page.tsx) rather than the
// generic "coming soon" shell. Shared with Footer.js so it can skip its own
// top padding on these routes — the case-study layout provides a flush
// full-height sidebar that should run right down to the footer with no gap,
// unlike the generic shell.
export const CASE_STUDY_PROJECT_IDS: string[] = ["spotify-guessr", "cybersea", "skinsprout"];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "skinsprout",
    name: "SkinSprout",
    media: "/images/projects/skinsprout.mp4",
    mediaType: "video",
    description: "Personal Project · 2026", // TODO(Amy): swap for the real tagline
    accent: "#FBDCE7",
  },
  {
    id: "cybersea",
    name: "CyberSea",
    media: "/images/projects/cybersea/cybersea.mp4",
    mediaType: "video",
    description: "1st Overall @uOttahacks · 2026", // TODO(Amy): swap for the real tagline
    accent: "#CFE8F7",
  },
  {
    id: "spotify-guessr",
    name: "Spotify Guessr",
    media: "/images/projects/spotify/spotify.png",
    mediaType: "image",
    description: "Webapp · 2026", // TODO(Amy): swap for the real tagline
    accent: "#DAF2DE",
  },
];
