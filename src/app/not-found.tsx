import Link from "next/link";
import BrandPattern from "@/components/BrandPattern";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { primaryNav } from "@/data/site";

export default function NotFound() {
  return (
    <section
      data-hero-tone="dark"
      className="relative flex min-h-screen items-center overflow-hidden navy-field py-32 text-white"
    >
      <BrandPattern tone="white" opacity={0.045} scale={250} fade="radial" />

      <div className="shell relative">
        <span className="eyebrow inline-flex items-center gap-3 text-white/45">
          <span aria-hidden="true" className="h-px w-7 bg-magenta" />
          Error 404
        </span>

        <h1 className="mt-8 text-[length:var(--text-display-1)] leading-[0.92] text-white">
          This page
          <br />
          <span className="accent">doesn&apos;t exist.</span>
        </h1>

        <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-white/60">
          The address you followed may be out of date, or the page may have
          moved. Everything else is where you left it.
        </p>

        <div className="mt-11 flex flex-wrap gap-4">
          <PrimaryButton href="/" tone="magenta">
            Back to Home
          </PrimaryButton>
          <SecondaryButton href="/products" tone="dark">
            Explore Products
          </SecondaryButton>
        </div>

        <nav aria-label="Site sections" className="mt-16 border-t border-white/12 pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-[0.72rem] font-medium tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
