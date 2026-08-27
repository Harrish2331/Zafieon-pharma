import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import AnimatedText from "@/components/motion/AnimatedText";
import { Eyebrow } from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ProductCard";
import PrescriptionGate from "@/components/PrescriptionGate";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { getProduct, products, productClassLabel } from "@/data/products";
import { focusAreas } from "@/data/focus";
import { site } from "@/data/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    // Prescription pages are intentionally kept out of the index: promoting
    // Schedule H medicines to the general public is restricted.
    robots:
      product.productClass === "prescription"
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const areas = focusAreas.filter((f) => product.therapeuticAreas.includes(f.id));
  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.therapeuticAreas.some((a) => product.therapeuticAreas.includes(a)),
    )
    .slice(0, 3);

  // Only fields the pack artwork actually carries. Anything absent stays absent.
  const spec: { label: string; value: string }[] = [
    { label: "Category", value: productClassLabel[product.productClass] },
    { label: "Dosage form", value: product.dosageForm },
    ...(product.composition
      ? [{ label: "Composition", value: product.composition }]
      : []),
    ...(product.packaging
      ? [{ label: "Packaging", value: product.packaging }]
      : []),
    ...(areas.length
      ? [
          {
            label: "Therapeutic area",
            value: areas.map((a) => a.label).join(", "),
          },
        ]
      : []),
    ...(product.licence ? [{ label: "Licence", value: product.licence }] : []),
  ];

  const body = (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        data-hero-tone="dark"
        className="relative overflow-hidden navy-field pt-[132px] pb-20 text-white lg:pt-[176px] lg:pb-28"
      >
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="left" />

        <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal y={10} duration={0.6}>
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                  ].map((b, i) => (
                    <li key={b.href} className="flex items-center gap-2">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-white/25">
                          /
                        </span>
                      )}
                      <Link
                        href={b.href}
                        className="text-white/45 transition-colors hover:text-white"
                      >
                        {b.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>

            <Reveal y={12} duration={0.7}>
              <Eyebrow tone="dark">
                {productClassLabel[product.productClass]}
              </Eyebrow>
            </Reveal>

            <AnimatedText
              as="h1"
              delay={0.08}
              lines={[product.name]}
              className="mt-7 text-[length:var(--text-display-1)] leading-[0.94] text-white"
            />

            {product.composition && (
              <Reveal delay={0.22} y={18}>
                <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-white/70">
                  {product.composition}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.3} y={18}>
              <p className="mt-6 max-w-[48ch] text-[0.95rem] leading-[1.75] text-white/50">
                {product.description}
              </p>
            </Reveal>

            {product.packMarkings?.length ? (
              <Reveal delay={0.38} y={16}>
                <ul className="mt-9 flex flex-wrap gap-2.5">
                  {product.packMarkings.map((m) => (
                    <li
                      key={m}
                      className="border border-white/20 px-3.5 py-2 text-[0.66rem] font-semibold tracking-[0.13em] text-white/70 uppercase"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {/* Pack shot */}
          <Reveal delay={0.16} y={26} duration={1} className="lg:col-span-5 lg:col-start-8">
            <figure className="relative isolate">
              <div className="relative aspect-4/3 overflow-hidden bg-paper">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  priority
                  placeholder={product.blurDataURL ? "blur" : "empty"}
                  blurDataURL={product.blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain p-8"
                />
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 -right-4 -bottom-4 h-full w-full border border-magenta/35 lg:-right-6 lg:-bottom-6"
              />
            </figure>
            <figcaption className="mt-6 text-[0.75rem] tracking-[0.1em] text-white/35 uppercase">
              Pack shown for identification. Artwork may vary.
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* ── Specification ─────────────────────────────────────────── */}
      <section className="relative bg-paper py-20 lg:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal y={16}>
                <h2 className="text-[length:var(--text-display-3)] text-navy">
                  Product
                  <br />
                  information
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-8 lg:col-start-5">
              <dl className="border-t border-line">
                {spec.map((row, i) => (
                  <Reveal key={row.label} delay={i * 0.05} y={14} duration={0.7}>
                    <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-3 sm:gap-8">
                      <dt className="text-[0.72rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
                        {row.label}
                      </dt>
                      <dd className="text-[1rem] leading-[1.65] text-navy sm:col-span-2">
                        {row.value}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={0.2} y={16}>
                <p className="mt-9 max-w-[70ch] text-[0.82rem] leading-relaxed text-muted-light">
                  {product.productClass === "prescription"
                    ? "This is a prescription medicine. The information above is taken from the product pack and is provided for identification and reference. It is not a substitute for the approved product information, and it is not a substitute for professional medical advice, diagnosis or treatment."
                    : "The information above is taken from the product pack. Nutraceutical products are not intended to diagnose, treat, cure or prevent any disease."}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="relative bg-paper-100 py-20 lg:py-28">
          <div className="shell">
            <Reveal y={16}>
              <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-[length:var(--text-display-3)] text-navy">
                  Related products
                </h2>
                <Link
                  href="/products"
                  className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy uppercase underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
                >
                  All products
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.07} y={20} className="bg-paper">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Enquiry ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-20 text-white lg:py-28">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />
        <div className="shell relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-[length:var(--text-display-3)] text-white">
              Enquire about {product.name}
            </h2>
            <p className="mt-4 max-w-[48ch] text-[0.95rem] text-white/55">
              For distribution, wholesale or trade enquiries, our team will come
              back to you directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="/contact" tone="magenta">
              Get in Touch
            </PrimaryButton>
            <SecondaryButton href="/manufacturing" tone="dark">
              Our Network
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: productClassLabel[product.productClass],
    brand: { "@type": "Brand", name: site.legalName },
    ...(product.image ? { image: `${site.url}${product.image}` } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {product.productClass === "prescription" ? (
        <PrescriptionGate productName={product.name}>{body}</PrescriptionGate>
      ) : (
        body
      )}
    </>
  );
}
