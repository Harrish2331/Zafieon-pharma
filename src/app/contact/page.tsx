import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/Button";
import { contact, connect, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zafieon Pharma about products, distribution, wholesale supply or manufacturing partnership.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact.
 *
 * There is deliberately no enquiry form. Zafieon uses this site as a company
 * presentation in front of doctors and trade, not as a lead-capture funnel, so
 * the space a form would occupy carries an invitation and the three reasons
 * someone would take it up. Every route out of here lands on the same verified
 * email — there is no second form behind the button.
 *
 * Zafieon has not yet confirmed a registered address or telephone number, so
 * those blocks say exactly that rather than showing an invented one. Each is a
 * one-line change in `contact` once the details are supplied.
 */
export default function ContactPage() {
  const mailto = `mailto:${contact.email.value}`;

  const details = [
    {
      label: "Email",
      value: contact.email.value,
      pending: contact.email.pending,
      href: mailto,
      note: "General and trade enquiries",
    },
    {
      label: "Telephone",
      value: contact.phone.value,
      pending: contact.phone.pending,
      href: contact.phone.value ? `tel:${contact.phone.value}` : undefined,
      note: "To be confirmed",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        lines={["Let's", "connect."]}
        body="Whether you are a distributor, a healthcare professional, a prospective manufacturing partner or simply want to understand what we do — we would like to hear from you."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <section className="relative bg-paper py-24 lg:py-32">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ── Details ───────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <Reveal y={16}>
              <Eyebrow>Reach us</Eyebrow>
            </Reveal>

            <dl className="mt-9 border-t border-line" id="reach-us">
              {details.map((d, i) => (
                <Reveal key={d.label} delay={i * 0.07} y={16}>
                  <div className="border-b border-line py-7">
                    <dt className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
                      {d.label}
                    </dt>
                    <dd className="mt-3">
                      {d.pending ? (
                        <span className="text-[1rem] text-muted-light italic">
                          To be confirmed
                        </span>
                      ) : d.href ? (
                        <a
                          href={d.href}
                          className="text-[1.05rem] break-words text-navy underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <span className="text-[1.05rem] text-navy">
                          {d.value}
                        </span>
                      )}
                      {!d.pending && d.note && (
                        <span className="mt-2 block text-[0.8rem] text-muted-light">
                          {d.note}
                        </span>
                      )}
                    </dd>
                  </div>
                </Reveal>
              ))}

              {/* Both offices. Each line is its own element rather than one
                string with commas, so a narrow column breaks where the postal
                address breaks instead of wherever the text happens to wrap. */}
              {contact.offices.map((o, i) => (
                <Reveal key={o.id} delay={0.18 + i * 0.07} y={16}>
                  <div className="border-b border-line py-7">
                    <dt className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
                      {o.label}
                    </dt>
                    <dd className="mt-3">
                      <address className="text-[0.98rem] leading-[1.7] text-navy not-italic">
                        {o.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.32} y={16}>
              <div className="mt-10 border-l-2 border-magenta py-1 pl-6">
                <p className="max-w-[36ch] text-[0.88rem] leading-[1.75] text-muted">
                  Zafieon Pharma&apos;s telephone number will be published here
                  once finalised. In the meantime, email reaches us reliably.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4} y={16}>
              <p className="mt-10 font-[family-name:var(--font-display)] text-[1.6rem] leading-[1.05] tracking-[-0.02em] text-navy uppercase">
                Every Dose <span className="accent">Matters.</span>
              </p>
              <p className="mt-3 text-[0.85rem] text-muted-light">
                {site.concept}
              </p>
            </Reveal>
          </div>

          {/* ── Let's connect ─────────────────────────────────────── */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal y={20}>
              <h2 className="text-[length:var(--text-display-2)] text-navy">
                {connect.headline.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="lede mt-7 max-w-[48ch]">{connect.body}</p>
            </Reveal>

            <Stagger step={0.08} className="mt-14 border-t border-line">
              {connect.strands.map((s, i) => (
                <StaggerItem key={s.id}>
                  <div className="group flex items-baseline gap-6 border-b border-line py-7 sm:gap-9">
                    <span className="eyebrow shrink-0 text-magenta-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[1.15rem] leading-[1.15] text-navy sm:text-[1.3rem]">
                        {s.label}
                      </h3>
                      <p className="mt-2.5 text-[0.92rem] leading-[1.7] text-muted">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.28} y={18}>
              <div className="mt-12">
                <PrimaryButton href={mailto} tone="magenta">
                  {connect.cta.label}
                </PrimaryButton>
                <p className="mt-5 max-w-[46ch] text-[0.82rem] leading-[1.7] text-muted-light">
                  Writes to{" "}
                  <a
                    href={mailto}
                    className="break-words text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
                  >
                    {contact.email.value}
                  </a>
                  . We read everything that arrives and route it to the right
                  person.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
