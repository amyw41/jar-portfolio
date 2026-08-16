// Work/community history shown in the homepage's "Experience" view (see
// components/WhatsInside/Experience.tsx) — replaces the old Carousel view,
// which showed the same creative PORTFOLIO_PROJECTS as Gallery just in a
// different layout. This is genuinely different content (real past
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
