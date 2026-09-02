"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides the public site chrome on operator routes.
 *
 * The root layout renders the Overture, the Navbar and the Footer around every
 * page, which is right for the website and wrong for `/admin`: the fixed
 * navbar sat on top of the dashboard's own header, so two Zafieon logos
 * overlapped in the same corner.
 *
 * ── Why a client wrapper rather than two root layouts ──────────────────────
 * Route groups with separate root layouts is the other way to do this, and it
 * would mean moving every page in the app into an `(site)` directory to gain
 * one exclusion. This is smaller and reversible.
 *
 * `children` is passed through, so the Navbar and Footer stay server
 * components — they are rendered on the server and handed to this wrapper as
 * an already-rendered tree. Nothing about them becomes client-side.
 *
 * `usePathname` resolves during server rendering too, so the chrome is absent
 * from the HTML rather than removed after hydration. No flash.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
