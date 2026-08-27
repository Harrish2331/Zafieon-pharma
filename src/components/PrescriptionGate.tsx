"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import BrandPattern from "@/components/BrandPattern";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { disclosures } from "@/data/site";

const KEY = "zaf-hcp-ack";
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Prescription-product gate.
 *
 * Femi-Dros 20/30 and MISO-PRO are Schedule H prescription medicines. Under the
 * Drugs and Magic Remedies (Objectionable Advertisements) Act 1954 and the
 * Drugs & Cosmetics Rules, promoting prescription medicines to the general
 * public is restricted. Product pages for these items therefore sit behind an
 * acknowledgement that the visitor is a healthcare professional or trade
 * visitor, and the copy on them is factual rather than promotional.
 *
 * The acknowledgement is held for the session only — it is a disclosure, not a
 * login, so it should not persist silently across visits.
 *
 * Content behind the gate is not rendered at all until acknowledged, so it
 * cannot be read by simply dismissing an overlay.
 */
export default function PrescriptionGate({
  productName,
  children,
}: {
  productName: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"checking" | "gated" | "open">("checking");
  const router = useRouter();
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";
    // sessionStorage is external state and unreadable during SSR. Resolving it
    // in an effect is what keeps the gate from flashing its content first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(ok ? "open" : "gated");
  }, []);

  useEffect(() => {
    if (state !== "gated") return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/products");
    };
    window.addEventListener("keydown", onKey);
    // Move focus into the dialog so keyboard users are not left behind it.
    const t = window.setTimeout(
      () => confirmRef.current?.querySelector("button")?.focus(),
      120,
    );
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [state, router]);

  const accept = () => {
    sessionStorage.setItem(KEY, "1");
    setState("open");
  };

  // Nothing is painted until we know the answer — no flash of gated content.
  if (state === "checking") {
    return (
      <div className="min-h-[60vh] bg-navy" aria-busy="true">
        <span className="sr-only">Checking access…</span>
      </div>
    );
  }

  if (state === "open") return <>{children}</>;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rx-gate-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto navy-field px-5 py-24"
      >
        <BrandPattern tone="white" opacity={0.045} scale={230} fade="radial" />

        <motion.div
          ref={confirmRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="relative w-full max-w-[46rem] border border-white/15 bg-navy-900/70 p-8 backdrop-blur-sm sm:p-12"
        >
          <span
            aria-hidden="true"
            className="absolute -top-px -left-px h-6 w-6 border-t border-l border-magenta"
          />
          <span
            aria-hidden="true"
            className="absolute -right-px -bottom-px h-6 w-6 border-r border-b border-magenta"
          />

          <span className="eyebrow inline-flex items-center gap-3 text-magenta-400">
            <span aria-hidden="true" className="h-px w-7 bg-magenta" />
            Prescription product
          </span>

          <h1
            id="rx-gate-title"
            className="mt-7 text-[clamp(1.65rem,4vw,2.6rem)] leading-[1.02] text-white"
          >
            {productName}
          </h1>

          <p className="mt-7 text-[0.98rem] leading-[1.75] text-white/65">
            {disclosures.prescriptionGate.body}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton onClick={accept} tone="magenta">
              {disclosures.prescriptionGate.confirm}
            </PrimaryButton>
            <SecondaryButton href="/products" tone="dark">
              {disclosures.prescriptionGate.decline}
            </SecondaryButton>
          </div>

          <p className="mt-9 border-t border-white/12 pt-6 text-[0.78rem] leading-relaxed text-white/35">
            This acknowledgement applies for this browsing session only. Nothing
            on this page is a substitute for the approved product information or
            for professional medical advice.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
