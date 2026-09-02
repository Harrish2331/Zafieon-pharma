"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
        router.replace("/admin/login");
        router.refresh();
      }}
      className="border border-line px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-muted uppercase transition-colors duration-400 hover:border-navy/40 hover:text-navy disabled:opacity-40"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
