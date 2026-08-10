import { Instrument_Serif, Instrument_Sans, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Taskbar from "@/components/Taskbar";
import Footer from "@/components/Footer";

const singsong = localFont({
  src: "../public/fonts/singsong/Singsong.otf",
  variable: "--font-singsong",
  display: "swap",
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
      className={`${singsong.variable} ${instrumentSerif.variable} ${instrumentSans.variable} ${publicSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-body">
        <Taskbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
