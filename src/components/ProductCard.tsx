import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { productClassLabel } from "@/data/products";
import { Arrow } from "@/components/ui/Button";

/**
 * Product card.
 *
 * Deliberately not a rounded, shadowed box: a hairline frame, a generous
 * image plate, and type that behaves like a catalogue entry. Prescription
 * items are marked here rather than in a tooltip, because that status is the
 * single most important thing about them.
 */
export default function ProductCard({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "wide";
}) {
  const rx = product.productClass === "prescription";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group/card relative flex h-full flex-col bg-paper transition-colors duration-500"
    >
      {/* Image plate */}
      {/* Plate is white, not tinted: most supplied pack shots are
          cut out on near-white, so a white plate makes them sit flush. A few
          (MISO-PRO, Florabet LL) are photographed on a background and keep it —
          they read as product photography rather than as failed cutouts. */}
      <div
        className={`relative overflow-hidden bg-paper ${
          size === "wide" ? "aspect-16/10" : "aspect-4/3"
        }`}
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          loading="lazy"
          placeholder={product.blurDataURL ? "blur" : "empty"}
          blurDataURL={product.blurDataURL}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-contain p-6 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04] sm:p-8"
        />

        {rx && (
          <span className="absolute top-4 left-4 border border-navy/15 bg-paper/85 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.16em] text-navy uppercase backdrop-blur-sm">
            Rx
          </span>
        )}

        {/* Magenta sweep on the plate's base edge */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-magenta transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-x-100"
        />
      </div>

      {/* Detail */}
      <div className="flex flex-1 flex-col border-t border-line p-6 sm:p-7">
        <span className="eyebrow text-magenta-600">
          {productClassLabel[product.productClass]}
        </span>

        <h3 className="mt-4 text-[1.4rem] leading-[1.05] text-navy sm:text-[1.55rem]">
          {product.name}
        </h3>

        {product.composition && (
          <p className="mt-3.5 line-clamp-3 text-[0.875rem] leading-[1.65] text-muted">
            {product.composition}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <span className="text-[0.7rem] tracking-[0.14em] text-muted-light uppercase">
            {product.dosageForm}
          </span>
          <span className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-navy uppercase">
            View
            <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
