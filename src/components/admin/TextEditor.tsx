"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LIMITS = { title: 140, standfirst: 400 };

/**
 * The text side of one Insights slot: title, description, body.
 *
 * Separate component, separate endpoint, separate save. Nothing here sends an
 * image and nothing in `SlotEditor` sends text, which is what makes the two
 * genuinely independent — replacing artwork cannot disturb copy, and editing
 * copy cannot disturb artwork.
 *
 * An empty field means "use what shipped with the build", not "publish
 * nothing". That is stated on the form rather than left to be discovered, and
 * it is why **Restore original text** and clearing every field do the same
 * thing.
 */
export default function TextEditor({
  slot,
  shipped,
  override,
}: {
  slot: number;
  /** What the build ships, shown as the placeholder and the reset target. */
  shipped: { title: string; standfirst: string; body: string[] };
  /** What is currently stored, if anything. */
  override: { title?: string; standfirst?: string; body?: string[] } | null;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(override?.title ?? "");
  const [standfirst, setStandfirst] = useState(override?.standfirst ?? "");
  const [body, setBody] = useState((override?.body ?? []).join("\n\n"));
  const [busy, setBusy] = useState<false | "save" | "reset">(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // A save elsewhere on the page triggers router.refresh(), which re-renders
  // this component with new props. Adopt them rather than holding a stale
  // draft — but only when the stored value actually changed.
  const storedKey = JSON.stringify(override ?? {});
  const [seen, setSeen] = useState(storedKey);
  if (seen !== storedKey) {
    setSeen(storedKey);
    setTitle(override?.title ?? "");
    setStandfirst(override?.standfirst ?? "");
    setBody((override?.body ?? []).join("\n\n"));
  }

  const dirty =
    title !== (override?.title ?? "") ||
    standfirst !== (override?.standfirst ?? "") ||
    body !== (override?.body ?? []).join("\n\n");

  // Warn before losing an unsaved edit — this is the one place on the site
  // where somebody might type a paragraph and navigate away.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setBusy("save");
    setError(null);
    setDone(null);
    try {
      const res = await fetch("/api/admin/insight-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slot, title, standfirst, body }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Save failed.");
      setDone("Saved. The website is showing this text now.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy("reset");
    setError(null);
    setDone(null);
    try {
      const res = await fetch(`/api/admin/insight-text?slot=${slot}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Could not restore.");
      setTitle("");
      setStandfirst("");
      setBody("");
      setDone("Restored the text that ships with the build.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore.");
    } finally {
      setBusy(false);
    }
  }

  const counter = (value: string, max: number) => (
    <span
      className={`text-[0.68rem] tabular-nums ${
        value.length > max ? "text-magenta-600" : "text-muted-light"
      }`}
    >
      {value.length}/{max}
    </span>
  );

  const field =
    "mt-2.5 w-full border border-line bg-paper px-3.5 py-2.5 text-[0.88rem] leading-[1.6] text-navy placeholder:text-muted-light focus:border-navy focus:outline-none";

  return (
    <div className="border-t border-line px-6 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy uppercase">
          Text
        </h3>
        <span className="text-[0.7rem] text-muted-light">
          {override ? "Edited" : "Original text"}
        </span>
      </div>

      <p className="mt-3 text-[0.78rem] leading-[1.6] text-muted-light">
        Leave a field empty to keep the wording that ships with the build. The
        image above is saved separately — changing one never affects the other.
      </p>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between">
          <span className="text-[0.66rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
            Title
          </span>
          {counter(title, LIMITS.title)}
        </span>
        <input
          type="text"
          value={title}
          maxLength={LIMITS.title + 40}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={shipped.title}
          className={field}
        />
      </label>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between">
          <span className="text-[0.66rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
            Description
          </span>
          {counter(standfirst, LIMITS.standfirst)}
        </span>
        <textarea
          value={standfirst}
          rows={3}
          maxLength={LIMITS.standfirst + 100}
          onChange={(e) => setStandfirst(e.target.value)}
          placeholder={shipped.standfirst}
          className={`${field} resize-y`}
        />
      </label>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between">
          <span className="text-[0.66rem] font-semibold tracking-[0.14em] text-muted-light uppercase">
            Article body
          </span>
          <span className="text-[0.68rem] text-muted-light">
            Blank line between paragraphs
          </span>
        </span>
        <textarea
          value={body}
          rows={8}
          onChange={(e) => setBody(e.target.value)}
          placeholder={shipped.body.join("\n\n")}
          className={`${field} resize-y`}
        />
      </label>

      {error && (
        <p role="alert" className="mt-4 text-[0.82rem] leading-[1.6] text-magenta-600">
          {error}
        </p>
      )}
      {done && !error && (
        <p role="status" className="mt-4 text-[0.82rem] leading-[1.6] text-muted">
          {done}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy !== false || !dirty}
          className="bg-navy px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-white uppercase transition-colors duration-400 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy === "save" ? "Saving…" : "Save text"}
        </button>

        {override && (
          <button
            type="button"
            onClick={reset}
            disabled={busy !== false}
            className="border border-line px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-muted uppercase transition-colors duration-400 hover:border-navy/40 hover:text-navy disabled:opacity-40"
          >
            {busy === "reset" ? "Restoring…" : "Restore original text"}
          </button>
        )}

        {dirty && (
          <span className="text-[0.72rem] text-magenta-600">Unsaved changes</span>
        )}
      </div>
    </div>
  );
}
