"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/motion/Reveal";
import { products, productClassLabel } from "@/data/products";
import { focusAreas } from "@/data/focus";
import type { FocusAreaId, ProductClass } from "@/data/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type ClassFilter = "all" | ProductClass;
type AreaFilter = "all" | FocusAreaId;

/**
 * The catalogue.
 *
 * Filtering is derived entirely from the product data — the therapeutic-area
 * chips are built from whichever areas the current products actually occupy,
 * so adding a seventh product in a new area extends the filter set with no
 * change here. Search appears only once the catalogue is large enough to need
 * it, which keeps a short catalogue from looking like an empty database.
 */
export default function ProductExplorer() {
  // The footer deep-links to /products?class=prescription, so the initial
  // filter honours the query string rather than silently ignoring it.
  const searchParams = useSearchParams();
  const initialClass = (() => {
    const q = searchParams.get("class");
    return q === "prescription" || q === "nutraceutical" ? q : "all";
  })();

  const [cls, setCls] = useState<ClassFilter>(initialClass);
  const [area, setArea] = useState<AreaFilter>("all");
  const [query, setQuery] = useState("");

  const showSearch = products.length > 8;

  const usedAreas = useMemo(
    () =>
      focusAreas.filter((f) =>
        products.some((p) => p.therapeuticAreas.includes(f.id)),
      ),
    [],
  );

  const classes = useMemo(
    () =>
      (["prescription", "nutraceutical"] as ProductClass[]).filter((c) =>
        products.some((p) => p.productClass === c),
      ),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cls !== "all" && p.productClass !== cls) return false;
      if (area !== "all" && !p.therapeuticAreas.includes(area)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.composition ?? "").toLowerCase().includes(q) ||
        p.dosageForm.toLowerCase().includes(q)
      );
    });
  }, [cls, area, query]);

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
                    onClick={() => setCls("all")}
                    className={chip(cls === "all")}
                  >
                    All
                  </button>
                  {classes.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCls(c)}
                      className={chip(cls === c)}
                    >
                      {productClassLabel[c]}
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
                  {usedAreas.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setArea(f.id)}
                      className={chip(area === f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-end gap-6">
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
                setCls("all");
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
