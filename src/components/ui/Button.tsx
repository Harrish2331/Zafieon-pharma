"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ---------------------------------------------------------------------------
   Arrow — a drawn glyph rather than an icon font, so it inherits colour and
   animates on the same curve as everything else.
   ------------------------------------------------------------------------- */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 12"
      fill="none"
      aria-hidden="true"
      className={`h-[9px] w-[15px] shrink-0 ${className}`}
    >
      <path
        d="M0 6h18M13 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

type Common = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden " +
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em] " +
  "px-8 py-[1.15rem] transition-colors duration-500 disabled:opacity-40 disabled:pointer-events-none";

/* ---------------------------------------------------------------------------
   PRIMARY — solid navy. The magenta wipe on hover is the one place the accent
   is allowed to fill a whole surface.
   ------------------------------------------------------------------------- */
export function PrimaryButton({
  children,
  href,
  onClick,
  className = "",
  arrow = true,
  type = "button",
  disabled,
  tone = "navy",
}: Common & { tone?: "navy" | "magenta" | "white" }) {
  const tones = {
    navy: "bg-navy text-white",
    magenta: "bg-magenta text-white",
    white: "bg-white text-navy",
  };
  const wipes = {
    navy: "bg-magenta",
    magenta: "bg-navy",
    white: "bg-navy",
  };
  const hoverText = {
    navy: "group-hover/btn:text-white",
    magenta: "group-hover/btn:text-white",
    white: "group-hover/btn:text-white",
  };

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100 ${wipes[tone]}`}
      />
      <span
        className={`relative z-10 transition-colors duration-300 ${hoverText[tone]}`}
      >
        {children}
      </span>
      {arrow && (
        <Arrow
          className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1 ${hoverText[tone]}`}
        />
      )}
    </>
  );

  const cls = `${base} ${tones[tone]} ${className}`;

  if (href)
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   SECONDARY — hairline outline. Fills navy (or white on dark) on hover.
   ------------------------------------------------------------------------- */
export function SecondaryButton({
  children,
  href,
  onClick,
  className = "",
  arrow = true,
  type = "button",
  disabled,
  tone = "light",
}: Common & { tone?: "light" | "dark" }) {
  const tones =
    tone === "light"
      ? "border border-line-strong text-navy"
      : "border border-white/25 text-white";
  const wipe = tone === "light" ? "bg-navy" : "bg-white";
  const hoverText =
    tone === "light"
      ? "group-hover/btn:text-white"
      : "group-hover/btn:text-navy";

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100 ${wipe}`}
      />
      <span className={`relative z-10 transition-colors duration-300 ${hoverText}`}>
        {children}
      </span>
      {arrow && (
        <Arrow
          className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1 ${hoverText}`}
        />
      )}
    </>
  );

  const cls = `${base} ${tones} ${className}`;

  if (href)
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   TEXT LINK — the workhorse. Magenta rule wipes left-to-right under the label.
   ------------------------------------------------------------------------- */
export function TextLink({
  children,
  href,
  className = "",
  tone = "light",
}: {
  children: ReactNode;
  href: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href={href}
      className={`group/link inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${
        tone === "light" ? "text-navy" : "text-white"
      } ${className}`}
    >
      <span className="relative py-1">
        {children}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-magenta transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:origin-left group-hover/link:scale-x-100"
        />
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-px w-full ${
            tone === "light" ? "bg-line-strong" : "bg-white/25"
          }`}
        />
      </span>
      <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1" />
    </Link>
  );
}

/* ---------------------------------------------------------------------------
   MAGNETIC — reserved for the single most important CTA on a view. The pull is
   deliberately subtle (max ~7px) so it reads as precision, not novelty.
   ------------------------------------------------------------------------- */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.22,
  tone = "navy",
}: Common & { strength?: number; tone?: "navy" | "magenta" | "white" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 170, damping: 16, mass: 0.4 }}
      className="inline-block"
    >
      <PrimaryButton href={href} onClick={onClick} tone={tone} className={className}>
        {children}
      </PrimaryButton>
    </motion.span>
  );
}

export { Arrow };
