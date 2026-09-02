"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setPassword("");
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(json.error ?? "Sign in failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="admin-password" className="block">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
          Password
        </span>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "admin-password-error" : undefined}
          className="mt-3 w-full border border-line bg-paper px-4 py-3 text-[0.95rem] text-navy focus:border-navy focus:outline-none"
        />
      </label>

      {error && (
        <p
          id="admin-password-error"
          role="alert"
          className="mt-4 text-[0.85rem] leading-[1.6] text-magenta-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !password}
        className="mt-7 w-full bg-navy px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-white uppercase transition-colors duration-400 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
