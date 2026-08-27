import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import type { Partner } from "@/data/types";
import { disclosures } from "@/data/site";

/**
 * Brands the PARTNER manufactures for.
 *
 * This is the one place on the site where these companies appear, and the
 * framing is doing real work:
 *
 *  · The heading names the partner, not Zafieon, as the party in the
 *    relationship.
 *  · The disclaimer sits above the list, not in small print beneath it.
 *  · Names are set typographically rather than reproduced as logos. The only
 *    logo artwork available is photographs of the partners' printed brochures,
 *    and reproducing third-party trademarks from those scans would be both
 *    visibly poor and legally exposed.
 *
 * If a partner supplied no such list, the section does not render at all.
 */
export default function AssociatedBrands({ partner }: { partner: Partner }) {
  const brands = partner.associatedBrands;
  if (!brands?.length) return null;

  return (
    <section className="relative overflow-hidden navy-field py-24 text-white lg:py-32">
      <BrandPattern tone="white" opacity={0.035} scale={250} fade="bottom" />

      <div className="shell relative">
        <Reveal y={14} duration={0.7}>
          <Eyebrow tone="dark">Brands they collaborate with</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-7 max-w-[20ch] text-[length:var(--text-display-2)] leading-[0.95] text-white">
            Companies {partner.shortName} manufactures for
          </h2>
        </Reveal>

        {/* The disclaimer leads. It is the most important sentence here. */}
        <Reveal delay={0.16} y={18}>
          <div className="mt-10 grid lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="border-l-2 border-magenta py-1 pl-6">
                <p className="max-w-[62ch] text-[0.98rem] leading-[1.75] text-white/65">
                  {disclosures.partnerBrands}
                </p>
              </div>
            </div>
            <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0">
              <span className="block font-[family-name:var(--font-display)] text-[clamp(2.5rem,4.5vw,3.6rem)] leading-[0.85] tracking-[-0.025em] text-white">
                {String(brands.length).padStart(2, "0")}
              </span>
              <span className="mt-4 block max-w-[24ch] text-[0.72rem] leading-[1.55] tracking-[0.11em] text-white/45 uppercase">
                Companies listed in {partner.shortName}&apos;s own corporate
                documentation
              </span>
            </div>
          </div>
        </Reveal>

        {/* The register itself */}
        <Stagger
          step={0.025}
          className="mt-16 grid border-t border-white/12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {brands.map((b, i) => (
            <StaggerItem
              key={b.id}
              className="border-b border-white/12 sm:[&:nth-child(2n)]:border-l lg:[&:nth-child(2n)]:border-l-0 lg:[&:not(:nth-child(3n+1))]:border-l"
            >
              <div className="group flex h-full items-baseline gap-5 py-6 transition-colors duration-500 hover:bg-white/[0.035] sm:px-6 lg:px-7">
                <span className="eyebrow shrink-0 text-white/25 transition-colors duration-500 group-hover:text-magenta-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[1.02rem] leading-[1.35] text-white/85">
                    {b.name}
                  </span>
                  {b.note && (
                    <span className="mt-1.5 block text-[0.78rem] text-white/40">
                      {b.note}
                    </span>
                  )}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.12} y={16}>
          <p className="mt-10 max-w-[92ch] text-[0.8rem] leading-relaxed text-white/30">
            Company names are reproduced as printed in {partner.shortName}
            &apos;s corporate documentation and remain the property of their
            respective owners. Their appearance here indicates a stated
            manufacturing relationship with {partner.shortName} only.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
