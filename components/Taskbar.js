"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { scrollToWorkSection } from "@/lib/scrollToWork";

const NAV_LINKS = [
  // Scrolls to the "What's inside?" projects section (id="work") on the
  // home page. Global smooth-scroll was deliberately removed (see
  // globals.css) since it fought Next's own scroll-to-top on real page
  // navigations — this link instead gets its own explicit, scoped smooth
  // scroll below, whether already on "/" (handled directly in this file) or
  // arriving from another page (ScrollToWork.js, after landing at the top).
  { label: "Work", href: "/#work" },
  { label: "About", href: "/notes" },
  { label: "Etc", href: "/etc" },
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

// "Work" (href has a "#") is never active — it's a same-page scroll target
// on the homepage, not a real page of its own, so there's nothing for it to
// be "on". Everything else is active on an exact pathname match, or a
// sub-route of it ("Etc" stays highlighted on /etc/nails, not just /etc
// itself).
function isActiveLink(link, pathname) {
  if (link.href.includes("#")) return false;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function NavLinks({ linkClassName, onLinkClick }) {
  const pathname = usePathname();

  // Only the "Work" link (href="/#work") has a hash to worry about. When
  // we're already on the page that hash lives on, intercept the click and
  // scroll smoothly (scrollToWorkSection, shared with ScrollToWork.js so
  // both land in exactly the same spot) instead of letting the browser jump
  // instantly. From any other page, this falls through to Link's normal
  // navigation — but with `scroll={false}` below, so Next doesn't perform
  // its own instant jump straight to the hash; ScrollToWork.js takes over
  // once the home page has landed at the top, sliding down from there
  // instead.
  function handleClick(e, link) {
    onLinkClick?.(e);
    const hashIndex = link.href.indexOf("#");
    if (hashIndex === -1) return;
    const path = link.href.slice(0, hashIndex) || "/";
    const hash = link.href.slice(hashIndex + 1);
    if (pathname !== path) return;
    e.preventDefault();
    if (hash === "work") {
      scrollToWorkSection("smooth");
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  return NAV_LINKS.map((link) => {
    // Both call sites' linkClassName always include the literal
    // "text-gray-800" base color — swap it for the active blue instead of
    // just appending, since two "text-*" utilities on the same element
    // don't reliably cascade in JSX class order (Tailwind's own generated
    // stylesheet order decides which wins, not source order).
    const activeClassName = isActiveLink(link, pathname)
      ? linkClassName.replace(/text-gray-800/, "text-[#2460A4]")
      : linkClassName;

    return link.external ? (
      <a
        key={link.label}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={activeClassName}
        onClick={onLinkClick}
      >
        {link.label}
      </a>
    ) : (
      <Link
        key={link.label}
        href={link.href}
        className={activeClassName}
        onClick={(e) => handleClick(e, link)}
        // Disables Next's own default post-navigation scroll (top-of-page,
        // or straight to a hash target) — only matters for links with a
        // hash, since those are the only ones Next would otherwise try to
        // jump somewhere other than the top on its own.
        scroll={!link.href.includes("#")}
      >
        {link.label}
      </Link>
    );
  });
}

export default function Taskbar() {
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
  // Taskbar is always mounted now (no more per-route hide), so this only
  // ever needs to run once on mount.
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
  }, []);

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

  // --taskbar-height (set above) is a fixed measurement — it doesn't change
  // just because the header's been translated off-screen, since that's a
  // transform, not a layout change. Anything offset by that var alone (like
  // the case-study sidebar's sticky top) stays pinned at the same distance
  // down even once the taskbar's gone, leaving a blank gap where it used to
  // be. This second var tracks visibility instead — 0px while hidden, the
  // real height while visible — so anything using it collapses to fill that
  // gap instead of leaving it.
  useEffect(() => {
    document.documentElement.style.setProperty("--taskbar-offset", hidden ? "0px" : "var(--taskbar-height)");
  }, [hidden]);

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
