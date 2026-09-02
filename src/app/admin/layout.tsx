import type { Metadata } from "next";
import Logo from "@/components/Logo";

/**
 * The dashboard shell.
 *
 * Deliberately outside the public chrome: no site navigation, no footer, no
 * overture. It is an operator tool that happens to live on the same domain,
 * and dressing it as a page of the website would only invite confusion about
 * which surface a visitor is on.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper-100">
      <header className="bg-navy">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-5">
          <Logo variant="horizontal" tone="dark" width={150} href="/" />
          <span className="text-[0.68rem] font-semibold tracking-[0.18em] text-white/55 uppercase">
            Admin Dashboard
          </span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
