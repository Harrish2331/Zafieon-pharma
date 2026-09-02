import "server-only";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { insights } from "@/data/insights";
import type { Insight } from "@/data/types";
import {
  type BlobAccess,
  blobDel,
  blobGet,
  blobGetTextAnyAccess,
  blobPut,
  knownAccess,
  usingBlob,
} from "@/lib/insight-blob";

/**
 * Persistence for the four Zafieon Insights entries.
 *
 * This is the only mutable state in the application. Everything else on the
 * site is content in `src/data`, compiled into the build.
 *
 * ── Image and text are stored separately, on purpose ───────────────────────
 * Each slot has two independent overrides: an image, and a block of text
 * (title, description, body). Saving one never reads or rewrites the other —
 * different manifest branches, different endpoints, different timestamps. That
 * is the whole point: replacing artwork must not disturb copy someone spent
 * time on, and editing copy must not require re-uploading an image.
 *
 * ── Two drivers, chosen by environment ─────────────────────────────────────
 *
 *   filesystem (default)
 *     Writes to INSIGHT_STORAGE_DIR, default `.data/insights`, which is
 *     OUTSIDE `public/` on purpose — Next does not serve files added to
 *     `public/` after the build. Works on any host with a writable, persistent
 *     disk: a VPS, Docker with a mounted volume, Railway, Render, Fly.
 *
 *   vercel blob
 *     Active when BLOB_READ_WRITE_TOKEN is set. **Everything** goes to Blob
 *     under this driver — images and the manifest alike.
 *
 * That last sentence is load-bearing, and getting it wrong broke production.
 * The manifest used to be written to disk regardless of driver, on the
 * reasoning that a few kilobytes of JSON did not need a storage backend of its
 * own. On Vercel the filesystem is read-only, so every text save died on
 * `ENOENT: mkdir '/var/task/.data'` while image uploads appeared to work. A
 * serverless deployment has no writable disk at all; there is no "small
 * enough" exception to that.
 *
 * ── Why a manifest ─────────────────────────────────────────────────────────
 * Both drivers keep the same JSON shape, so the rendering side never needs to
 * know which is in use: it asks for a slot and gets a URL, or nothing, in
 * which case what shipped with the build stands. The image record carries
 * `updatedAt`, which goes into the URL path as a cache buster so a replaced
 * image is never served stale. It is a path segment rather than a query string
 * because `next/image` will not optimise a local src whose `search` is not
 * declared verbatim in `images.localPatterns` — see the route handler.
 *
 * ── A note on output tracing ───────────────────────────────────────────────
 * The storage directory is chosen at runtime, so Turbopack cannot statically
 * scope the filesystem calls below and warns that it will trace the whole
 * project into the server bundle — which would drag all of `public/`, the
 * manufacturing film included, into the deployed function. That is handled
 * once in `next.config.ts` with `outputFileTracingExcludes`.
 *
 * The paths here are built from an environment variable and from a basename
 * this module generates. Request input never reaches them, and `basename()` is
 * applied on the way back out of the manifest as a second guard.
 */

export type Slot = 1 | 2 | 3 | 4;
export const SLOTS: Slot[] = [1, 2, 3, 4];

export type SlotRecord = {
  /**
   * What the page should point at. A public Blob store gives a CDN URL that
   * can go straight into `next/image`; a private store and the filesystem both
   * resolve to /api/insight-image/[slot]/[version], which streams the bytes.
   */
  url: string;
  contentType: string;
  bytes: number;
  updatedAt: number;
  /** Filesystem driver: the file on disk backing this slot. */
  file?: string;
  /** Blob driver: the object key, and the access level it was written with. */
  pathname?: string;
  access?: BlobAccess;
};

/**
 * A text override. Every field is optional and an absent field means "use what
 * shipped with the build" — so an editor can change only the description and
 * leave the title alone, and a later release that rewrites the shipped title
 * will still reach the site.
 */
export type TextRecord = {
  title?: string;
  standfirst?: string;
  body?: string[];
  updatedAt: number;
};

type Manifest = {
  v: 2;
  images: Partial<Record<`${Slot}`, SlotRecord>>;
  text: Partial<Record<`${Slot}`, TextRecord>>;
};

/** The v1 shape: slot keys at the top level, image records only. */
type LegacyManifest = Partial<Record<`${Slot}`, SlotRecord>>;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ACCEPTED = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
] as const;

/** Generous, but bounded: this is a standfirst, not a manuscript. */
export const MAX_TITLE = 140;
export const MAX_STANDFIRST = 400;
export const MAX_BODY_PARAGRAPH = 2000;
export const MAX_BODY_PARAGRAPHS = 12;

const EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export const isSlot = (v: unknown): v is Slot =>
  typeof v === "number" && SLOTS.includes(v as Slot);

export const driver = (): "blob" | "filesystem" =>
  usingBlob() ? "blob" : "filesystem";

/* ── Manifest ────────────────────────────────────────────────────────────── */

const dir = () =>
  path.resolve(process.env.INSIGHT_STORAGE_DIR ?? ".data/insights");
const manifestPath = () => path.join(dir(), "manifest.json");
const BLOB_MANIFEST = "zafieon-insights/manifest.json";

const empty = (): Manifest => ({ v: 2, images: {}, text: {} });

/**
 * A very short read-through cache. One page render asks for images, records
 * and text; without this that is three round trips to Blob for the same
 * object.
 *
 * It is deliberately NOT used by the dashboard or by any write. The cache is
 * per-instance, and on a serverless host the request that reloads the
 * dashboard after a save can land on a different instance from the one that
 * did the writing — which would serve a manifest up to CACHE_MS old and show
 * the operator the image they just replaced. Freshness is worth a round trip
 * on the one surface where someone is watching for the change.
 */
let cached: { at: number; manifest: Manifest } | null = null;
const CACHE_MS = 2000;

function parseManifest(raw: unknown): Manifest {
  if (!raw || typeof raw !== "object") return empty();
  const m = raw as Partial<Manifest> & LegacyManifest;
  if (m.v === 2 && m.images && m.text) {
    return { v: 2, images: m.images, text: m.text };
  }
  // Migrate v1 in place: slot keys held image records directly. Text is new,
  // so it starts empty and nothing is lost.
  const images: Manifest["images"] = {};
  for (const slot of SLOTS) {
    const rec = m[`${slot}`];
    if (rec && typeof rec === "object" && "url" in rec) images[`${slot}`] = rec;
  }
  return { v: 2, images, text: {} };
}

async function readManifest(fresh = false): Promise<Manifest> {
  if (!fresh && cached && Date.now() - cached.at < CACHE_MS) {
    return cached.manifest;
  }

  let manifest: Manifest;
  if (usingBlob()) {
    const text = await blobGetTextAnyAccess(BLOB_MANIFEST);
    manifest = text ? parseManifest(safeJson(text)) : empty();
  } else {
    try {
      manifest = parseManifest(
        safeJson(await readFile(manifestPath(), "utf8")),
      );
    } catch {
      // No manifest yet is the normal first-run state, not an error.
      manifest = empty();
    }
  }
  cached = { at: Date.now(), manifest };
  return manifest;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function writeManifest(m: Manifest): Promise<void> {
  const json = JSON.stringify(m, null, 2);
  if (usingBlob()) {
    await blobPut(BLOB_MANIFEST, json, "application/json");
  } else {
    await mkdir(dir(), { recursive: true });
    await writeFile(manifestPath(), json, "utf8");
  }
  cached = { at: Date.now(), manifest: m };
}

/* ── Public API — images ─────────────────────────────────────────────────── */

const fallbackFor = (slot: Slot) =>
  insights.find((i) => i.slot === slot)?.image ??
  "/images/insights/insight-01.webp";

/** The artwork that ships with the build for a given slot. */
export const shippedImageFor = (slot: Slot) => fallbackFor(slot);

/**
 * The image URL for one slot: the stored override if there is one, otherwise
 * the artwork that shipped with the build.
 */
export async function imageForSlot(slot: Slot): Promise<string> {
  const m = await readManifest();
  return m.images[`${slot}`]?.url ?? fallbackFor(slot);
}

/** Every slot's current URL, in one read of the manifest. */
export async function allSlotImages(): Promise<Record<Slot, string>> {
  const m = await readManifest();
  const out = {} as Record<Slot, string>;
  for (const slot of SLOTS) {
    out[slot] = m.images[`${slot}`]?.url ?? fallbackFor(slot);
  }
  return out;
}

/** Image records, for the dashboard's "replaced on …" line. Always fresh. */
export async function slotRecords(): Promise<Partial<Record<Slot, SlotRecord>>> {
  const m = await readManifest(true);
  const out: Partial<Record<Slot, SlotRecord>> = {};
  for (const slot of SLOTS) {
    const rec = m.images[`${slot}`];
    if (rec) out[slot] = rec;
  }
  return out;
}

/**
 * The bytes behind a slot, for /api/insight-image/[slot]/[version].
 *
 * Returns a stream for a private Blob object and a buffer for a file on disk,
 * so the caller can hand either straight to a Response without loading a
 * whole image into memory when it does not have to.
 */
export async function readSlotFile(slot: Slot): Promise<
  | { body: Buffer; contentType: string }
  | { stream: ReadableStream; contentType: string }
  | null
> {
  const rec = (await readManifest()).images[`${slot}`];
  if (!rec) return null;

  if (rec.pathname) {
    try {
      return await blobGet(rec.pathname, rec.access ?? "private");
    } catch {
      return null;
    }
  }

  if (!rec.file) return null;
  try {
    const abs = path.join(dir(), path.basename(rec.file));
    return { body: await readFile(abs), contentType: rec.contentType };
  } catch {
    return null;
  }
}

/** Replace one slot's image. Leaves that slot's text untouched. */
export async function saveSlot(
  slot: Slot,
  body: Buffer,
  contentType: string,
): Promise<SlotRecord> {
  if (!ACCEPTED.includes(contentType as (typeof ACCEPTED)[number])) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }
  if (body.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("Image is larger than 8 MB.");
  }

  const updatedAt = Date.now();
  const m = await readManifest(true);
  const previous = m.images[`${slot}`];
  let record: SlotRecord;

  if (usingBlob()) {
    // The key carries the version, so a replacement never collides with a
    // cached copy of the one before it.
    const pathname = `zafieon-insights/slot-${slot}-${updatedAt}.${EXT[contentType]}`;
    const res = await blobPut(pathname, body, contentType);
    record = {
      // A public store hands back a CDN URL worth using directly. A private
      // one does not, so the page points at our own route instead.
      url:
        res.access === "public"
          ? res.url
          : `/api/insight-image/${slot}/${updatedAt}`,
      contentType,
      bytes: body.byteLength,
      updatedAt,
      pathname: res.pathname,
      access: res.access,
    };
    // Deleting the object this one supersedes is housekeeping: it has no
    // bearing on whether the save succeeded, and awaiting it adds a whole
    // round trip to the time the operator spends watching a spinner. It is
    // already failure-tolerant, so let it finish on its own.
    if (previous?.pathname && previous.pathname !== res.pathname) {
      void blobDel(previous.pathname);
    }
  } else {
    const file = `slot-${slot}-${updatedAt}.${EXT[contentType]}`;
    await mkdir(dir(), { recursive: true });
    await writeFile(path.join(dir(), file), new Uint8Array(body));
    record = {
      // The version segment is what makes this URL change on every upload.
      url: `/api/insight-image/${slot}/${updatedAt}`,
      contentType,
      bytes: body.byteLength,
      updatedAt,
      file,
    };
    // Drop the file this one replaces, so the directory does not grow without
    // bound across a year of edits.
    if (previous?.file && previous.file !== file) {
      await rm(path.join(dir(), path.basename(previous.file)), {
        force: true,
      }).catch(() => {});
    }
  }

  m.images[`${slot}`] = record;
  await writeManifest(m);
  return record;
}

/** Drop a slot's image override. Leaves that slot's text untouched. */
export async function resetSlot(slot: Slot): Promise<void> {
  const m = await readManifest(true);
  const rec = m.images[`${slot}`];
  if (rec?.pathname) {
    void blobDel(rec.pathname);
  } else if (rec?.file) {
    await rm(path.join(dir(), path.basename(rec.file)), { force: true }).catch(
      () => {},
    );
  }
  delete m.images[`${slot}`];
  await writeManifest(m);
}

/* ── Public API — text ───────────────────────────────────────────────────── */

/** Text overrides, for the dashboard's editor fields. Always fresh. */
export async function slotText(): Promise<Partial<Record<Slot, TextRecord>>> {
  const m = await readManifest(true);
  const out: Partial<Record<Slot, TextRecord>> = {};
  for (const slot of SLOTS) {
    const rec = m.text[`${slot}`];
    if (rec) out[slot] = rec;
  }
  return out;
}

/**
 * Save one slot's text. Fields are independent: pass only what changed, and
 * pass an empty string to clear a field back to what shipped with the build.
 *
 * Never touches `m.images`, which is what keeps a description edit from
 * disturbing the artwork.
 */
export async function saveText(
  slot: Slot,
  fields: { title?: string; standfirst?: string; body?: string[] },
): Promise<TextRecord> {
  const m = await readManifest(true);
  const current = m.text[`${slot}`] ?? { updatedAt: 0 };
  const next: TextRecord = { ...current, updatedAt: Date.now() };

  const clean = (s: string, max: number, label: string) => {
    const v = s.replace(/\r\n/g, "\n").trim();
    if (v.length > max) {
      throw new Error(`${label} is ${v.length} characters. The limit is ${max}.`);
    }
    return v;
  };

  if (fields.title !== undefined) {
    const v = clean(fields.title, MAX_TITLE, "Title");
    if (v) next.title = v;
    else delete next.title;
  }
  if (fields.standfirst !== undefined) {
    const v = clean(fields.standfirst, MAX_STANDFIRST, "Description");
    if (v) next.standfirst = v;
    else delete next.standfirst;
  }
  if (fields.body !== undefined) {
    const paras = fields.body
      .map((p) => clean(p, MAX_BODY_PARAGRAPH, "A body paragraph"))
      .filter(Boolean);
    if (paras.length > MAX_BODY_PARAGRAPHS) {
      throw new Error(
        `That is ${paras.length} paragraphs. The limit is ${MAX_BODY_PARAGRAPHS}.`,
      );
    }
    if (paras.length) next.body = paras;
    else delete next.body;
  }

  // Nothing overridden any more — drop the record rather than keeping an
  // empty one, so "Restore original" and "cleared every field" agree.
  if (!next.title && !next.standfirst && !next.body) {
    delete m.text[`${slot}`];
    await writeManifest(m);
    return next;
  }

  m.text[`${slot}`] = next;
  await writeManifest(m);
  return next;
}

/** Drop a slot's text override. Leaves that slot's image untouched. */
export async function resetText(slot: Slot): Promise<void> {
  const m = await readManifest(true);
  delete m.text[`${slot}`];
  await writeManifest(m);
}

/* ── Public API — resolved content ───────────────────────────────────────── */

/**
 * The Insights as the public site should render them: what shipped with the
 * build, with any stored image and text overrides applied on top.
 *
 * One manifest read for all four, so a page never fans out into eight.
 */
export async function resolvedInsights(): Promise<Insight[]> {
  const m = await readManifest();
  return insights.map((i) => {
    const img = m.images[`${i.slot}`];
    const txt = m.text[`${i.slot}`];
    return {
      ...i,
      image: img?.url ?? i.image,
      // An overridden image has no LQIP: the blur that shipped belongs to a
      // different picture, and showing it would flash the wrong colours.
      blurDataURL: img ? undefined : i.blurDataURL,
      imageAlt: img ? (txt?.title ?? i.title) : i.imageAlt,
      title: txt?.title ?? i.title,
      standfirst: txt?.standfirst ?? i.standfirst,
      body: txt?.body ?? i.body,
    };
  });
}

/** One resolved insight by slug, or undefined. */
export async function resolvedInsight(
  slug: string,
): Promise<Insight | undefined> {
  return (await resolvedInsights()).find((i) => i.slug === slug);
}

/** Which access level the Blob store turned out to have, once known. */
export const blobAccess = () => knownAccess();
