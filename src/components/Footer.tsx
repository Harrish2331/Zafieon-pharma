import Link from "next/link";
import Logo from "@/components/Logo";
import BrandPattern from "@/components/BrandPattern";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { contact, footerNav, site } from "@/data/site";

const columns = [
  { title: "Company", links: footerNav.company },
  { title: "Portfolio", links: footerNav.portfolio },
  { title: "Standards", links: footerNav.standards },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="navy-field relative overflow-hidden text-white">
      <BrandPattern tone="white" opacity={0.04} scale={200} fade="top" />

      <div className="shell relative pt-24 pb-12 lg:pt-32">
        {/* The tagline, at the scale it deserves. */}
        <div className="border-b border-white/10 pb-16 lg:pb-20">
          <p className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.88] tracking-[-0.03em]">
            Every Dose
            <br />
            <span className="accent">Matters.</span>
          </p>
        </div>

        <div className="grid gap-14 border-b border-white/10 py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo variant="horizontal" tone="dark" width={186} />
            <p className="mt-7 max-w-[38ch] text-[0.9rem] leading-relaxed text-white/55">
              {site.description}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="lg:col-span-2" aria-label={col.title}>
              <Eyebrow tone="dark">{col.title}</Eyebrow>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.9rem] text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <Eyebrow tone="dark">Contact</Eyebrow>
            <ul className="mt-6 space-y-3.5 text-[0.9rem] text-white/60">
              <li>
                {contact.email.pending ? (
                  <span className="text-white/35 italic">
                    Email to be confirmed
                  </span>
                ) : (
                  <a
                    href={`mailto:${contact.email.value}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.email.value}
                  </a>
                )}
              </li>
              <li>
                {contact.phone.pending ? (
                  <span className="text-white/35 italic">
                    Telephone to be confirmed
                  </span>
                ) : (
                  <a
                    href={`tel:${contact.phone.value}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.phone.value}
                  </a>
                )}
              </li>
              {/* Both offices, each line on its own row so the postal
                  formatting survives the footer's narrow column. */}
              {contact.offices.map((o) => (
                <li key={o.id}>
                  <span className="mb-1 block text-[0.68rem] font-semibold tracking-[0.12em] text-white/35 uppercase">
                    {o.short}
                  </span>
                  <address className="text-white/60 not-italic">
                    {o.lines.map((line) => (
                      <span key={line} className="block leading-[1.6]">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-[0.72rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/legal/privacy"
              className="transition-colors hover:text-white/75"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-white/75"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/legal/disclaimer"
              className="transition-colors hover:text-white/75"
            >
              Disclaimer
            </Link>
          </div>
        </div>

        <p className="mt-8 max-w-[80ch] text-[0.7rem] leading-relaxed text-white/25">
          Information relating to prescription medicines on this site is
          intended for registered healthcare professionals and members of the
          pharmaceutical trade. It is provided for reference and is not a
          substitute for professional medical advice, diagnosis or treatment.
        </p>
      </div>
    </footer>
  );
}
