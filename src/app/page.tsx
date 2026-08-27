import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/home/AboutSection";
import FocusSection from "@/components/sections/home/FocusSection";
import ProductsSection from "@/components/sections/home/ProductsSection";
import QualitySection from "@/components/sections/home/QualitySection";
import PartnersSection from "@/components/sections/home/PartnersSection";
import ClosingSection from "@/components/sections/home/ClosingSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage tells one story, in seven beats:
 *   01 the promise · 02 the organization · 03 the purpose · 04 the solutions
 *   05 the standard · 06 the partnerships · 07 the closing
 *
 * Tonal rhythm alternates deliberately so no two adjacent sections read the
 * same: white → soft → navy → white → soft → navy → white → (navy footer).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FocusSection />
      <ProductsSection />
      <QualitySection />
      <PartnersSection />
      <ClosingSection />
    </>
  );
}
