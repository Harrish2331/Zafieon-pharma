import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ProductExplorer from "@/components/ProductExplorer";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Zafieon Pharma's portfolio spans prescription and nutraceutical products across gynecology, reproductive health, fertility and women's wellness.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        lines={["Solutions designed", "for healthcare needs."]}
        body={`A focused portfolio of ${products.length} products spanning prescription and nutraceutical ranges, each manufactured by a qualified partner and supplied through reliable wholesale distribution.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
        ]}
      />
      {/* useSearchParams needs a boundary on a statically rendered route. */}
      <Suspense fallback={<div className="min-h-[60vh] bg-paper" />}>
        <ProductExplorer />
      </Suspense>
    </>
  );
}
