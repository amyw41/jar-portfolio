import { Instrument_Serif, Instrument_Sans, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Taskbar from "@/components/Taskbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToWork from "@/components/ScrollToWork";

const singsong = localFont({
  src: "../public/fonts/singsong/Singsong.otf",
  variable: "--font-singsong",
  // "optional" instead of "swap" — Singsong drives the footer's infinite
  // marquee (Footer.js), whose looping animation measures its own width in
  // percentages (-50% translateX). If the font finishes loading *after*
  // that width was first measured, "swap" would substitute it in and
  // reflow the text to new (usually wider) metrics mid-animation — a
  // sudden jump right as it happens, which is what read as "glitching".
  // "optional" gives the font a short window (~100ms) to load before first
  // paint and, if it's not ready by then, keeps the fallback for the rest
  // of that page view instead of swapping in later — no more surprise
  // reflow once the marquee's already animating.
  display: "optional",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const publicSans = Public_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata = {
  title: "Amy Wang's Jar",
  description: "A little corner of the internet.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${singsong.variable} ${instrumentSerif.variable} ${instrumentSans.variable} ${publicSans.variable} h-full overflow-x-clip antialiased`}
      suppressHydrationWarning
    >
      {/* overflow-x-clip here (and on html above) — the actual fix for
          the site-wide horizontal scrollbar: SpotifyCaseStudy.tsx's
          full-bleed sidebar row (and any future full-bleed row like it)
          uses `w-screen` to reach the true viewport edge past its own
          ancestor's max-width, but `100vw` includes the vertical
          scrollbar's own width — a few px wider than the page's actual
          visible content box on any page tall enough to have one. Clipping
          horizontal overflow globally, once, here, is more robust than
          fighting that vw/scrollbar mismatch per full-bleed element (and
          catches it if it recurs) — Amy explicitly doesn't want horizontal
          scroll anywhere on the site, not just a pixel-perfect fix for this
          one page.

          `clip`, specifically NOT `hidden` — this was `overflow-x-hidden`
          originally, which silently broke every `position: sticky` element
          on the entire site (the case-study sidebar included): any overflow
          value other than `visible` on an ancestor turns it into a new
          scrolling container, and sticky computes its offset against the
          *nearest* one of those — so sticky descendants were "sticking" to
          html/body's own box instead of the real viewport, which (since
          html/body aren't independently scrollable) meant they didn't
          visibly stick at all. `clip` still clips the same overflow
          (fixing the horizontal-scrollbar bug this was added for) but is
          explicitly excluded from that scroll-container promotion, so it
          doesn't interfere with sticky anywhere else on the site. */}
      <body className="flex min-h-full flex-col overflow-x-clip font-body">
        <ScrollToTop />
        <ScrollToWork />
        <Taskbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
