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

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "cybersea",
    name: "Cybersea",
    media: "/images/projects/cybersea.mp4",
    mediaType: "video",
    description: "Sprint · TikTok", // TODO(Amy): swap for the real tagline
    accent: "#CFE8F7",
  },
  {
    id: "skinsprout",
    name: "SkinSprout",
    media: "/images/projects/skinsprout.mp4",
    mediaType: "video",
    description: "Hackathon · Figma", // TODO(Amy): swap for the real tagline
    accent: "#FBDCE7",
  },
  {
    id: "spotify",
    name: "Spotify",
    media: "/images/projects/spotify.png",
    mediaType: "image",
    description: "Personal project · Web", // TODO(Amy): swap for the real tagline
    accent: "#DAF2DE",
  },
  {
    // Placeholder 4th slot — only 3 real projects exist right now. Reuses
    // Cybersea's media (and its accent, since it's the same footage) so the
    // layout/grid can be verified with 4 items; swap in a real project +
    // media + accent whenever Amy has one.
    id: "placeholder-4",
    name: "Coming soon",
    media: "/images/projects/cybersea.mp4",
    mediaType: "video",
    description: "More projects on the way", // TODO(Amy): swap for the real tagline
    accent: "#CFE8F7",
  },
];
