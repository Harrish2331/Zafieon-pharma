import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import ContactForm from "@/components/ContactForm";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { contact, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zafieon Pharma about products, distribution, wholesale supply or manufacturing partnership.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact.
 *
 * Zafieon has not yet confirmed a registered address or telephone number, so
 * those blocks say exactly that rather than showing an invented one. Each is a
 * one-line change in `contact` once the details are supplied.
 */
export default function ContactPage() {
  const details = [
    {
      label: "Email",
      value: contact.email.value,
      pending: contact.email.pending,
      href: `mailto:${contact.email.value}`,
      note: "General and trade enquiries",
    },
    {
      label: "Telephone",
      value: contact.phone.value,
      pending: contact.phone.pending,
      href: contact.phone.value ? `tel:${contact.phone.value}` : undefined,
      note: "To be confirmed",
    },
    {
      label: "Registered address",
      value: contact.address.value,
      pending: contact.address.pending,
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

            <dl className="mt-9 border-t border-line">
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
                          className="text-[1.05rem] text-navy underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
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
            </dl>

            <Reveal delay={0.25} y={16}>
              <div className="mt-10 border-l-2 border-magenta py-1 pl-6">
                <p className="max-w-[36ch] text-[0.88rem] leading-[1.75] text-muted">
                  Zafieon Pharma&apos;s registered address and telephone number
                  will be published here once finalised. In the meantime, email
                  reaches us reliably.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32} y={16}>
              <p className="mt-10 font-[family-name:var(--font-display)] text-[1.6rem] leading-[1.05] tracking-[-0.02em] text-navy uppercase">
                Every Dose <span className="accent">Matters.</span>
              </p>
              <p className="mt-3 text-[0.85rem] text-muted-light">
                {site.concept}
              </p>
            </Reveal>
          </div>

          {/* ── Form ──────────────────────────────────────────────── */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal y={20}>
              <h2 className="text-[length:var(--text-display-2)] text-navy">
                Send an enquiry
              </h2>
              <p className="lede mt-6 max-w-[46ch]">
                Tell us what you need and the right person will come back to
                you.
              </p>
            </Reveal>

            <div className="mt-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
