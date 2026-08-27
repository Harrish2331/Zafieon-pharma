import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ProductCard";
import { SecondaryButton } from "@/components/ui/Button";
import { products } from "@/data/products";
import { home } from "@/data/site";

/**
 * 04 — The solutions.
 *
 * Every current product, read from data. Adding another appends a cell;
 * nothing here is per-product.
 */
export default function ProductsSection() {
  return (
    <section className="relative bg-paper py-24 lg:py-36">
      <div className="shell">
        <SectionHeader
          eyebrow={home.products.eyebrow}
          lines={home.products.headline}
          size="display-2"
        />

        <div className="mt-10 grid lg:grid-cols-12">
          <Reveal delay={0.16} className="lg:col-span-5 lg:col-start-8">
            <p className="lede">{home.products.body}</p>
            <div className="mt-8">
              <SecondaryButton href="/products">All Products</SecondaryButton>
            </div>
          </Reveal>
        </div>

        <Stagger
          step={0.07}
          className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {products.map((p) => (
            <StaggerItem key={p.id} className="bg-paper">
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} y={16}>
          <p className="mt-8 max-w-[86ch] text-[0.8rem] leading-relaxed text-muted-light">
            Products marked <strong className="font-semibold text-muted">Rx</strong>{" "}
            are available on prescription only. Information about them is
            intended for registered healthcare professionals and members of the
            pharmaceutical trade.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
