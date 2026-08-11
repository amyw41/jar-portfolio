"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { CASE_STUDY_PROJECT_IDS } from "@/lib/projects";

const NAV_LINKS = [
  // Scrolls to the "What's inside?" projects section (id="work") on the
  // home page. Global smooth-scroll was deliberately removed (see
  // globals.css) since it fought Next's own scroll-to-top on real page
  // navigations — this link instead gets its own explicit, scoped
  // scrollIntoView smooth-scroll below, only when already on "/".
  { label: "Work", href: "/#work" },
  { label: "About", href: "/etc" },
  { label: "Play", href: "/notes" },
];

function Logo({ linkClassName, onClick }) {
  return (
    <Link href="/" onClick={onClick} className={linkClassName}>
      <Image
        src="/images/logos/logo.png"
        alt="Amy Wang's Jar logo"
        width={44}
        height={44}
        priority
        className="h-11 w-11 object-contain"
      />
    </Link>
  );
}

function NavLinks({ linkClassName, onLinkClick }) {
  const pathname = usePathname();

  // Only the "Work" link (href="/#work") has a hash to worry about. When
  // we're already on the page that hash lives on, intercept the click and
  // scrollIntoView smoothly instead of letting the browser jump instantly —
  // that's the one interaction on the site that should still feel animated.
  // From any other page, this falls through to Link's normal navigation: a
  // real route change to "/" followed by the browser's native (instant)
  // jump to the element once it's mounted — consistent with every other
  // page-to-page click on the site now that global smooth-scroll is gone.
  function handleClick(e, link) {
    onLinkClick?.(e);
    const hashIndex = link.href.indexOf("#");
    if (hashIndex === -1) return;
    const path = link.href.slice(0, hashIndex) || "/";
    const hash = link.href.slice(hashIndex + 1);
    if (pathname !== path) return;
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  return NAV_LINKS.map((link) =>
    link.external ? (
      <a
        key={link.label}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        onClick={onLinkClick}
      >
        {link.label}
      </a>
    ) : (
      <Link
        key={link.label}
        href={link.href}
        className={linkClassName}
        onClick={(e) => handleClick(e, link)}
      >
        {link.label}
      </Link>
    )
  );
}

// Case-study pages (see SpotifyCaseStudy.tsx) draw their own logo at the
// top of their sidebar instead — a second logo directly under this header's
// would be redundant, and the whole point of that page's request was a
// taskbar-free look matching Amy's old Framer reference. Sharing
// CASE_STUDY_PROJECT_IDS with lib/projects.ts (already used by
// app/projects/[id]/page.tsx for the same "does this id have a real case
// study" check) means adding a future case study automatically hides the
// taskbar there too, with nothing to remember to update in two places.
function isCaseStudyRoute(pathname) {
  return CASE_STUDY_PROJECT_IDS.some((id) => pathname === `/projects/${id}`);
}

export default function Taskbar() {
  const pathname = usePathname();
  const hideOnThisRoute = isCaseStudyRoute(pathname);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef(null);

  // Jar's hero section sizes itself to "the rest of the viewport below this
  // header" — it needs this header's real rendered height, which differs
  // between the desktop nav row and the mobile row, and grows further when
  // the mobile menu opens. Measuring it here and exposing it as a CSS custom
  // property on the root element means any component can read the true
  // value without prop drilling, and it self-corrects if this markup ever
  // changes, instead of drifting out of sync with a hardcoded rem guess.
  //
  // Depends on `hideOnThisRoute` (not just [] like before) — the header
  // isn't unmounted on a case-study route, just rendered as null (see the
  // early return below), so headerRef.current goes from a real node to null
  // and back as you navigate to/from one. A plain mount-only effect would
  // only ever see whichever state was true on Taskbar's very first mount
  // and never re-measure after that; re-running whenever this flips
  // reattaches the ResizeObserver to the real node once it exists again.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setHeightVar = () => {
      document.documentElement.style.setProperty("--taskbar-height", `${header.getBoundingClientRect().height}px`);
    };
    setHeightVar();

    // Also re-measures on every subsequent change to this header's own box —
    // a breakpoint switch (desktop row <-> mobile row), the mobile menu
    // opening/closing, or a font swap reflowing the nav text — not just the
    // one-time initial measurement above.
    const resizeObserver = new ResizeObserver(setHeightVar);
    resizeObserver.observe(header);
    return () => resizeObserver.disconnect();
  }, [hideOnThisRoute]);

  // Slides the header up out of view on scroll-down, back down on scroll-up
  // — rAF-throttled so it only reads scrollY once per frame. Pinned visible
  // whenever the mobile menu is open (so it can't slide away mid-interaction)
  // and whenever the page is scrolled within one header-height of the top
  // (so it never hides before the user has scrolled meaningfully). A small
  // MIN_DELTA ignores sub-pixel/trackpad jitter that would otherwise flicker
  // the direction back and forth.
  useEffect(() => {
    const MIN_DELTA = 4;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const delta = y - lastY;

      if (open || y <= headerHeight) {
        setHidden(false);
      } else if (delta > MIN_DELTA) {
        setHidden(true);
      } else if (delta < -MIN_DELTA) {
        setHidden(false);
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // After all hooks, not before — conditionally skipping hook calls above
  // this point would break React's rules of hooks (the same hooks must run
  // in the same order on every render). Rendering null here (rather than
  // Taskbar's parent conditionally omitting it) is what lets the
  // height-measuring effect above still react correctly to this route ever
  // changing, since the component stays mounted throughout.
  if (hideOnThisRoute) return null;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-transform duration-300 ease-in-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="hidden w-full grid-cols-3 items-center px-8 py-3 md:grid">
        <Logo linkClassName="flex w-fit items-center justify-self-start self-start" />

        <nav className="flex items-center justify-center gap-16 whitespace-nowrap font-instrument text-[30px] font-medium text-gray-800">
          <NavLinks linkClassName="text-gray-800 transition-colors hover:text-[#2460A4]" />
        </nav>

        <div />
      </div>

      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Logo linkClassName="flex items-center" onClick={() => setOpen(false)} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-gray-800"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-4 py-4 font-instrument text-[28px] font-medium text-gray-800 md:hidden">
          <NavLinks linkClassName="text-gray-800" onLinkClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
