"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/webp,image/jpeg,image/png,image/avif";

const kb = (n: number) =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(n / 1024)} KB`;

/**
 * One Insights image slot: what is live now, what is about to replace it, and
 * the two actions.
 *
 * The preview is a local object URL, so the operator sees the exact file they
 * picked before anything is written. Nothing uploads until Save, and Discard
 * puts the slot back without touching the server.
 *
 * A plain `<img>` is used rather than `next/image`: the sources here are a
 * `blob:` URL and a runtime-uploaded file, neither of which the image
 * optimiser can or should process.
 */
export default function SlotEditor({
  slot,
  title,
  currentUrl,
  replaced,
  bytes,
}: {
  slot: number;
  title: string;
  currentUrl: string;
  replaced: number | null;
  bytes: number | null;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState<false | "save" | "reset">(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // The object URL is created and revoked in the event handler that changes
  // the selection, not in an effect reacting to it. A ref carries the live URL
  // across renders so the previous one is always released — including on
  // unmount — without a render pass in between.
  const objectUrl = useRef<string | null>(null);

  function pick(f: File | null) {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = f ? URL.createObjectURL(f) : null;
    setPreview(objectUrl.current);
    setFile(f);
  }

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  function choose(f: File | null) {
    setError(null);
    setDone(null);
    if (!f) return pick(null);
    if (f.size > MAX_BYTES) {
      pick(null);
      return setError(`That image is ${kb(f.size)}. The limit is 8 MB.`);
    }
    if (!ACCEPT.split(",").includes(f.type)) {
      pick(null);
      return setError("Use a WebP, JPEG, PNG or AVIF image.");
    }
    pick(f);
  }

  function discard() {
    pick(null);
    setError(null);
    setDone(null);
    if (input.current) input.current.value = "";
  }

  async function save() {
    if (!file) return;
    setBusy("save");
    setError(null);
    try {
      const body = new FormData();
      body.set("slot", String(slot));
      body.set("image", file);
      const res = await fetch("/api/admin/insight-image", {
        method: "POST",
        body,
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Upload failed.");
      discard();
      setDone("Saved. The website is showing this image now.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy("reset");
    setError(null);
    try {
      const res = await fetch(`/api/admin/insight-image?slot=${slot}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Could not restore.");
      discard();
      setDone("Restored the original image.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore.");
    } finally {
      setBusy(false);
    }
  }

  const shown = preview ?? currentUrl;

  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-6 py-5">
        <h2 className="text-[0.72rem] font-semibold tracking-[0.16em] text-navy uppercase">
          {String(slot).padStart(2, "0")} — Insight
        </h2>
        <span className="text-[0.72rem] text-muted-light">
          {replaced
            ? `Replaced ${new Date(replaced).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}${bytes ? ` · ${kb(bytes)}` : ""}`
            : "Original image"}
        </span>
      </div>

      <p className="px-6 pt-5 text-[0.88rem] leading-[1.55] text-muted">
        {title}
      </p>

      <div className="relative mt-5 aspect-16/9 overflow-hidden border-y border-line bg-paper-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shown}
          alt={
            preview
              ? "Preview of the replacement image"
              : "The image currently live in this slot"
          }
          className="h-full w-full object-cover object-center"
        />
        {preview && (
          <span className="absolute top-3 left-3 bg-magenta px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.16em] text-white uppercase">
            Not saved yet
          </span>
        )}
      </div>

      <div className="flex flex-col px-6 py-6">
        <label className="block">
          <span className="sr-only">Choose a replacement for slot {slot}</span>
          <input
            ref={input}
            type="file"
            accept={ACCEPT}
            onChange={(e) => choose(e.target.files?.[0] ?? null)}
            className="block w-full text-[0.82rem] text-muted file:mr-4 file:cursor-pointer file:border file:border-line file:bg-paper-100 file:px-4 file:py-2.5 file:text-[0.68rem] file:font-semibold file:tracking-[0.14em] file:text-navy file:uppercase hover:file:border-navy/40"
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

        <div className="flex flex-wrap gap-3 pt-6">
          <button
            type="button"
            onClick={save}
            disabled={!file || busy !== false}
            className="bg-navy px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-white uppercase transition-colors duration-400 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === "save" ? "Saving…" : "Replace image"}
          </button>

          {file ? (
            <button
              type="button"
              onClick={discard}
              disabled={busy !== false}
              className="border border-line px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-navy uppercase transition-colors duration-400 hover:border-navy/40 disabled:opacity-40"
            >
              Discard
            </button>
          ) : replaced ? (
            <button
              type="button"
              onClick={reset}
              disabled={busy !== false}
              className="border border-line px-6 py-3 text-[0.66rem] font-semibold tracking-[0.16em] text-muted uppercase transition-colors duration-400 hover:border-navy/40 hover:text-navy disabled:opacity-40"
            >
              {busy === "reset" ? "Restoring…" : "Restore original"}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
