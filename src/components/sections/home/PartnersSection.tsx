import Image from "next/image";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import PartnerCard from "@/components/PartnerCard";
import Counter from "@/components/motion/Counter";
import { PrimaryButton } from "@/components/ui/Button";
import { home } from "@/data/site";
import { partners, totalExportMarkets } from "@/data/partners";

/**
 * 06 — The partnerships.
 *
 * Partner identities, regions, capabilities and the certification count appear
 * here because they are what makes the network credible.
 *
 * The brands each partner manufactures for do NOT appear here. That
 * relationship belongs to the partner, and surfacing it next to Zafieon's name
 * on the homepage would imply a connection that does not exist. It lives on
 * /manufacturing/[partner] behind an explicit disclaimer.
 */
export default function PartnersSection() {
  const facilityCount = partners.reduce(
    (n, p) => n + (p.facilities?.length ?? 0),
    0,
  );
  const certified = partners.filter((p) => p.certifications?.length).length;

  const stats = [
    { value: partners.length, label: "Manufacturing partners" },
    { value: facilityCount, label: "Documented facilities" },
    { value: certified, label: "Partners with stated certifications" },
    { value: totalExportMarkets, label: "Export markets reached by partners" },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 text-white lg:py-36">
      {/* Network map as ground, not as a claim.
          It sits behind a single flat scrim rather than the section's radial
          navy field plus the brand pattern — three overlapping textures was
          what made this background read as blotchy. The map alone is the
          texture now, held dark enough that white type keeps full contrast.

          It is atmosphere, not a statement about where Zafieon manufactures:
          the register below states plainly that every partner is in India. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/manufacturing-network.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
        <span className="absolute inset-0 bg-navy-950/78" />
        {/* Feathered edges so the band resolves into the sections above and
            below instead of stopping at a hard line. */}
        <span className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
      </div>

      <div className="shell relative">
        <SectionHeader
          eyebrow={home.partners.eyebrow}
          lines={home.partners.headline}
          tone="dark"
          size="display-2"
        />

        <div className="mt-10 grid lg:grid-cols-12">
          <Reveal delay={0.16} className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.0625rem] leading-[1.75] text-white/60">
              {home.partners.body}
            </p>
            <div className="mt-9">
              <PrimaryButton href={home.partners.cta.href} tone="magenta">
                {home.partners.cta.label}
              </PrimaryButton>
            </div>
          </Reveal>
        </div>

        {/* ── Register ────────────────────────────────────────────── */}
        <Stagger
          step={0.07}
          className="mt-16 grid grid-cols-2 gap-y-10 border-y border-white/12 py-11 lg:mt-24 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="px-1 lg:px-2">
                <Counter
                  value={s.value}
                  className="block font-[family-name:var(--font-display)] text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.85] tracking-[-0.02em] text-white tabular-nums"
                />
                <span className="mt-4 block max-w-[20ch] text-[0.72rem] leading-[1.55] tracking-[0.11em] text-white/45 uppercase">
                  {s.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ── Directory ───────────────────────────────────────────── */}
        <div className="mt-16 lg:mt-20">
          <Reveal y={16}>
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="text-[length:var(--text-display-3)] text-white">
                The network
              </h3>
              <span className="text-[0.72rem] tracking-[0.14em] text-white/40 uppercase">
                All partners manufacture in India
              </span>
            </div>
          </Reveal>

          <Stagger
            step={0.07}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {partners.map((p, i) => (
              <StaggerItem key={p.id} className="h-full">
                <PartnerCard partner={p} index={i} tone="dark" />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} y={16}>
            <p className="mt-8 max-w-[92ch] text-[0.8rem] leading-relaxed text-white/35">
              Capabilities, certifications and export markets shown are those of
              the individual manufacturing partner named, as stated in that
              partner&apos;s own documentation. They are not certifications or
              markets held by Zafieon Pharma.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
