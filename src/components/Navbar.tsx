"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/Logo";
import { PrimaryButton } from "@/components/ui/Button";
import BrandPattern from "@/components/BrandPattern";
import { primaryNav } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The bar reads the tone of whatever hero it is sitting over, via a
 * `data-hero-tone` attribute on the page's first section. That keeps every page
 * a server component while still letting the navigation invert itself over a
 * navy hero. Past the fold it resolves to solid navy on every route.
 */
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export default function Navbar() {
  const [heroTone, setHeroTone] = useState<"light" | "dark">("light");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Scroll position is external state, so subscribe to it rather than
  // mirroring it into component state through an effect.
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 28,
    () => false, // server snapshot: always "at the top"
  );

  useEffect(() => {
    // The hero's tone is only knowable from the DOM once the route's first
    // section has rendered, which keeps every page a server component. This is
    // the documented exception to set-state-in-effect: reading initial state
    // out of an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroTone(
      (document.querySelector<HTMLElement>("[data-hero-tone]")?.dataset
        .heroTone as "light" | "dark" | undefined) ?? "light",
    );
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDark = scrolled || heroTone === "dark" || open;
  const tone = onDark ? "dark" : "light";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,box-shadow,backdrop-filter] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled && !open
            ? "bg-navy/97 shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-[76px] items-center justify-between gap-8 lg:h-[92px]"
        >
          <Logo
            variant="horizontal"
            tone={tone}
            width={168}
            priority
            className="relative z-10"
          />

          <ul className="hidden items-center gap-9 lg:flex xl:gap-11">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block py-2 text-[0.72rem] font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                      onDark
                        ? "text-white/75 hover:text-white"
                        : "text-navy/70 hover:text-navy"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px bg-magenta transition-all duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <PrimaryButton
              href="/contact"
              tone={onDark ? "magenta" : "navy"}
              className="!px-7 !py-[0.95rem]"
              arrow={false}
            >
              Get in Touch
            </PrimaryButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <span
              className={`block h-px w-6 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                onDark ? "bg-white" : "bg-navy"
              } ${open ? "translate-y-[4px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-6 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                onDark ? "bg-white" : "bg-navy"
              } ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="fixed inset-0 z-[90] bg-navy lg:hidden"
          >
            <BrandPattern tone="white" opacity={0.045} scale={190} fade="top" />
            <div className="shell relative flex h-full flex-col justify-between pt-[100px] pb-12">
              <ul className="flex flex-col">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.18 + i * 0.055,
                      ease: EASE,
                    }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5 font-[family-name:var(--font-display)] text-[clamp(1.9rem,9vw,2.75rem)] leading-none tracking-[-0.02em] text-white"
                    >
                      <span className="font-[family-name:var(--font-sans)] text-[0.65rem] font-medium tracking-[0.2em] text-magenta-400">
                        0{i + 1}
                      </span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                className="space-y-6"
              >
                <PrimaryButton
                  href="/contact"
                  onClick={() => setOpen(false)}
                  tone="magenta"
                  className="w-full"
                >
                  Get in Touch
                </PrimaryButton>
                <p className="font-[family-name:var(--font-display)] text-lg leading-none text-white/45">
                  Every Dose <span className="accent">Matters.</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
