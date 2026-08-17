// Work/community history shown on the About page, below the bio (see
// components/Experience.tsx). Originally shown in a toggle on the
// homepage's "What's inside?" section, replacing the old Carousel view
// there — moved to the About page once that toggle was removed. Genuinely
// different content from the homepage's own portfolio grid (real past
// roles, not creative projects), so it gets its own small data file
// instead of reusing lib/projects.ts.
export type ExperienceEntry = {
  company: string;
  title: string;
  // Pre-formatted display string (not a real Date) — matches how dates are
  // handled elsewhere on the site (e.g. PortfolioProject's own
  // "description" tagline), and every entry's own date range reads
  // differently enough (single month vs. a span) that a shared formatter
  // wouldn't save much.
  date: string;
  // Path under /public/images/logos.
  logo: string;
};

export type ExperienceGroup = {
  label: string;
  entries: ExperienceEntry[];
};

export const EXPERIENCE: ExperienceGroup[] = [
  {
    label: "Work",
    entries: [
      {
        company: "RRC Companies",
        title: "APM Intern",
        date: "May – Aug 2026",
        logo: "/images/logos/rrc_companies_logo.jpg",
      },
    ],
  },
  {
    label: "Community",
    entries: [
      {
        company: "UW Blueprint",
        title: "Product Designer",
        date: "Sep 2026",
        logo: "/images/logos/uw_blueprint_logo.jpg",
      },
      {
        company: "UW Cube",
        title: "Design Engineer",
        date: "May – Aug 2026",
        logo: "/images/logos/uwcube_logo.jpg",
      },
      {
        company: "Technova",
        title: "Product Designer",
        date: "May – Aug 2026",
        logo: "/images/logos/technova_logo.jpg",
      },
    ],
  },
];
