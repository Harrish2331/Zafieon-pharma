import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ProductExplorer from "@/components/ProductExplorer";
import { products, usedProductCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Zafieon Pharma's gynaecology and women's health portfolio, across nutraceutical, prescription and hormone ranges — each product manufactured by a qualified partner.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        lines={["Gynaecology and", "women's health."]}
        body={`A gynaecology and women's health portfolio of ${products.length} products across ${usedProductCategories
          .map((c) => c.label.toLowerCase())
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")} ranges, each manufactured by a qualified partner and supplied through reliable wholesale distribution.`}
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
