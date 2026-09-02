import type { Metadata, Viewport } from "next";
import { bolyar, poppins } from "@/lib/fonts";
import { site } from "@/data/site";
import MotionProvider from "@/components/motion/MotionProvider";
import Overture from "@/components/Overture";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Zafieon Pharma",
    "pharmaceutical company",
    "women's health",
    "gynaecology",
    "gynecology",
    "hormonal health",
    "nutraceuticals",
    "contract manufacturing",
    "pharmaceutical distribution",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#14274B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bolyar.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Decides the opening before the first frame, and releases the scroll
            lock on a timer. See src/components/Overture.tsx for why this is not
            an effect. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var d=document.documentElement;var q=window.matchMedia&&matchMedia(\"(prefers-reduced-motion: reduce)\").matches;var s=sessionStorage.getItem(\"zaf-overture\")===\"1\";if(q||s){d.dataset.overture=\"off\";return}sessionStorage.setItem(\"zaf-overture\",\"1\");d.dataset.overture=\"on\";setTimeout(function(){d.dataset.overture=\"done\"},1850)}catch(e){document.documentElement.dataset.overture=\"off\"}})()",
          }}
        />
      </head>
      <body className="min-h-screen bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-navy focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>
          {/* The public chrome is absent on /admin: the fixed navbar sat on
              top of the dashboard's own header, overlapping two Zafieon logos
              in the same corner. Navbar and Footer stay server components —
              they are rendered here and passed through as children. */}
          <SiteChrome>
            <Overture />
            <Navbar />
          </SiteChrome>
          <main id="main">{children}</main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </MotionProvider>
      </body>
    </html>
  );
}
