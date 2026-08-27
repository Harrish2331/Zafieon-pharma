import Image from "next/image";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import QualityLifecycle from "@/components/QualityLifecycle";
import { SecondaryButton } from "@/components/ui/Button";
import { home, quality } from "@/data/site";

/**
 * 05 — The standard.
 *
 * Four pillars as a measured register, then the lifecycle rail. No badge wall:
 * Zafieon holds no corporate certifications in the supplied material, and the
 * partners' certifications are attributed on the Quality page rather than
 * borrowed here.
 */
export default function QualitySection() {
  return (
    <section className="relative overflow-hidden bg-paper-100 py-24 lg:py-36">
      <div className="shell relative">
        <SectionHeader
          eyebrow={home.quality.eyebrow}
          lines={home.quality.headline}
          size="display-2"
        />

        {/* Image and copy sit side by side: the photograph carries the left
            of the row, the existing sentences and CTA the right. Vertically
            centred so neither reads as floating against the other. */}
        <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-6" y={28} duration={1}>
            <figure className="relative aspect-4/3 overflow-hidden bg-paper-200">
              <Image
                src="/images/quality-every-dose.webp"
                alt="A technician in a cleanroom checking filled vials on a production line against a tablet"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQAwCdASoUAA0APt1apkyopSOiMAgBEBuJYwCsABSYBQU7KGzngAAA/t8o51HdASc4LRBlt7IpSoWXhOfXswsVYYOccy2sHqbLBhUJ4oVTtOU1jgiw/VIXAH0e09XBhU3DsIdrR0WzXi8vlske7XxoH8NE9PtQ7fWORF/vbeIJlqAA"
                className="object-cover object-center"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-navy/10"
              />
            </figure>
          </Reveal>

          <Reveal delay={0.16} className="lg:col-span-5 lg:col-start-8">
            <p className="lede">{home.quality.body}</p>
            <div className="mt-8">
              <SecondaryButton href="/quality">
                Our Quality Framework
              </SecondaryButton>
            </div>
          </Reveal>
        </div>

        {/* ── Pillars ─────────────────────────────────────────────── */}
        <Stagger
          step={0.08}
          className="mt-16 grid border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {quality.pillars.map((p, i) => (
            <StaggerItem
              key={p.id}
              className="border-line pt-8 pb-9 sm:[&:nth-child(2n)]:border-l lg:border-l lg:first:border-l-0"
            >
              <div className="lg:px-8 lg:first:pl-0 sm:[&:nth-child(2n)]:pl-8">
                <span className="eyebrow text-magenta-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-[1.15rem] leading-[1.15] text-navy">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-[34ch] text-[0.9rem] leading-[1.7] text-muted">
                  {p.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ── Lifecycle ───────────────────────────────────────────── */}
        <div className="mt-20 border-t border-line pt-16 lg:mt-28 lg:pt-20">
          <Reveal y={18}>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-5">
              <h3 className="text-[length:var(--text-display-3)] text-navy">
                From development to distribution
              </h3>
              <span className="text-[0.78rem] tracking-[0.14em] text-muted-light uppercase">
                Product lifecycle
              </span>
            </div>
          </Reveal>
          <QualityLifecycle />
        </div>
      </div>
    </section>
  );
}
