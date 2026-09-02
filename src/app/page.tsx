import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/home/AboutSection";
import FocusSection from "@/components/sections/home/FocusSection";
import ProductsSection from "@/components/sections/home/ProductsSection";
import QualitySection from "@/components/sections/home/QualitySection";
import PartnersSection from "@/components/sections/home/PartnersSection";
import InsightsSection from "@/components/sections/home/InsightsSection";
import ClosingSection from "@/components/sections/home/ClosingSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage tells one story, in eight beats:
 *   01 the promise · 02 the organization · 03 the purpose · 04 the solutions
 *   05 the standard · 06 the partnerships · 07 the perspective · 08 the closing
 *
 * Tonal rhythm alternates deliberately so no two adjacent sections read the
 * same: white → soft → navy → white → soft → navy → soft → white.
 *
 * Insights reads its four images from the runtime store, so the page carries a
 * revalidate window rather than being frozen at build time. Everything else on
 * it is still static content compiled into the build.
 */
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FocusSection />
      <ProductsSection />
      <QualitySection />
      <PartnersSection />
      <InsightsSection />
      <ClosingSection />
    </>
  );
}
