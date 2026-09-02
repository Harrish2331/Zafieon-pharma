"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/motion/Reveal";
import { products, usedProductCategories } from "@/data/products";
import { focusAreas } from "@/data/focus";
import type { FocusAreaId, ProductCategory } from "@/data/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type CategoryFilter = "all" | ProductCategory;
type AreaFilter = "all" | FocusAreaId;

/**
 * The catalogue.
 *
 * Two independent axes, both built from the data rather than listed here:
 *
 *   Category        Nutraceuticals · Prescription · Hormones — how the product
 *                   is regulated and what it is made of.
 *   Therapeutic area  Gynaecology · Hormonal Health · Fertility · Women's
 *                   Wellness — what it is for.
 *
 * They are genuinely different questions, which is why both are offered.
 * Adding a product in a new category or a new area extends the relevant chip
 * set with no change here.
 *
 * Every product sits under Gynaecology, so that chip shows the whole range;
 * the narrower areas are what actually reduce the list. Counts beside each
 * chip make that visible before the reader clicks, rather than after.
 *
 * Search appears only once the catalogue is large enough to need it.
 */
export default function ProductExplorer() {
  // The footer deep-links to /products?category=hormone, so the initial filter
  // honours the query string rather than silently ignoring it.
  const searchParams = useSearchParams();
  const initial = (() => {
    const q = searchParams.get("category");
    return usedProductCategories.some((c) => c.id === q)
      ? (q as ProductCategory)
      : "all";
  })();

  const initialArea = (() => {
    const q = searchParams.get("area");
    return focusAreas.some((f) => f.id === q) ? (q as FocusAreaId) : "all";
  })();

  const [cat, setCat] = useState<CategoryFilter>(initial);
  const [area, setArea] = useState<AreaFilter>(initialArea);
  const [query, setQuery] = useState("");

  const showSearch = products.length > 8;

  // Only areas the catalogue actually occupies, in the order Our Focus uses.
  const usedAreas = useMemo(
    () =>
      focusAreas
        .filter((f) => products.some((p) => p.therapeuticAreas.includes(f.id)))
        .map((f) => ({
          id: f.id,
          label: f.label,
          count: products.filter((p) => p.therapeuticAreas.includes(f.id))
            .length,
        })),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && !p.categories.includes(cat)) return false;
      if (area !== "all" && !p.therapeuticAreas.includes(area)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.composition ?? "").toLowerCase().includes(q) ||
        (p.dosageForm ?? "").toLowerCase().includes(q)
      );
    });
  }, [cat, area, query]);

  const chip = (on: boolean) =>
    `border px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-400 ${
      on
        ? "border-navy bg-navy text-white"
        : "border-line text-muted hover:border-navy/40 hover:text-navy"
    }`;

  return (
    <section className="relative bg-paper py-20 lg:py-28">
      <div className="shell">
        {/* ── Controls ────────────────────────────────────────────── */}
        <Reveal y={18}>
          <div className="flex flex-col gap-8 border-b border-line pb-9 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-6">
              <div>
                <span className="eyebrow mb-3.5 block text-muted-light">
                  Category
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCat("all")}
                    className={chip(cat === "all")}
                  >
                    All
                  </button>
                  {usedProductCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCat(c.id)}
                      className={chip(cat === c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="eyebrow mb-3.5 block text-muted-light">
                  Therapeutic area
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setArea("all")}
                    className={chip(area === "all")}
                  >
                    All
                  </button>
                  {usedAreas.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArea(a.id)}
                      className={chip(area === a.id)}
                    >
                      {a.label}
                      <span
                        className={`ml-2 tabular-nums ${
                          area === a.id ? "text-white/55" : "text-muted-light"
                        }`}
                      >
                        {String(a.count).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              {showSearch && (
                <label className="block">
                  <span className="eyebrow mb-3.5 block text-muted-light">
                    Search
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name or composition"
                    className="w-full border border-line bg-paper px-4 py-2.5 text-sm text-navy placeholder:text-muted-light focus:border-navy focus:outline-none sm:w-64"
                  />
                </label>
              )}
              <p
                className="shrink-0 pb-1 text-[0.75rem] tracking-[0.12em] text-muted-light uppercase"
                aria-live="polite"
              >
                {String(visible.length).padStart(2, "0")} of{" "}
                {String(products.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Grid ────────────────────────────────────────────────── */}
        {visible.length > 0 ? (
          <motion.div
            layout
            className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="bg-paper"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-12 border border-line py-24 text-center">
            <p className="text-[1.05rem] text-navy">
              No products match this combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setCat("all");
                setArea("all");
                setQuery("");
              }}
              className="mt-5 text-[0.7rem] font-semibold tracking-[0.16em] text-magenta-600 uppercase underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}

        <Reveal delay={0.1} y={16}>
          <p className="mt-10 max-w-[88ch] text-[0.8rem] leading-relaxed text-muted-light">
            Products marked <strong className="font-semibold text-muted">Rx</strong>{" "}
            are available on prescription only. Information about prescription
            medicines is intended for registered healthcare professionals and
            members of the pharmaceutical trade, and is not a substitute for the
            approved product information or for professional medical advice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
