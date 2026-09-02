import "server-only";
import { del, get, put } from "@vercel/blob";

/**
 * The Vercel Blob side of the Insights store.
 *
 * ── Why this exists as its own module ──────────────────────────────────────
 * The first implementation hand-rolled the Blob REST API to avoid a
 * dependency. That was a bad trade and it broke in production twice:
 *
 *   · `put` was sent without an explicit access level, which the API read as
 *     public. Against a store created with private access it failed with
 *     "Cannot use public access on a private store" — every image upload,
 *     rejected.
 *   · The manifest was still written to the filesystem even when the blob
 *     driver was active, so saving text on Vercel died on
 *     `ENOENT: mkdir '/var/task/.data'`. A serverless function's filesystem is
 *     read-only; there was never a directory to create.
 *
 * The official SDK handles the protocol. What is left here is the one thing it
 * cannot know: which access level this deployment's store was created with.
 *
 * ── Detecting the store's access level ─────────────────────────────────────
 * `access` is required on every `put`, and passing the wrong one is a hard
 * error in both directions. Rather than add another environment variable for
 * the operator to get wrong, the first write tries `private` — the default for
 * stores created today — and if the store rejects it as a mismatch, flips and
 * retries once. The answer is then remembered for the life of the process.
 *
 * ── How a private blob reaches the browser ─────────────────────────────────
 * A public blob has a CDN URL that can go straight into `next/image`. A private
 * one does not: it has to be streamed back through a route we control. So the
 * manifest stores the `pathname` always and the public `url` only when there is
 * one, and `/api/insight-image/[slot]/[version]` serves whatever the manifest
 * does not give a direct URL for. One code path covers a private store, a
 * public store and the local filesystem.
 */

export type BlobAccess = "public" | "private";

/** Set once the store has answered for itself. */
let detected: BlobAccess | null = null;

export const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN;
export const usingBlob = () => Boolean(blobToken());

/** The access level this store was created with, as far as we have learned. */
export const knownAccess = () => detected;

/** True when the error is the store telling us we picked the wrong access. */
function isAccessMismatch(e: unknown): boolean {
  const m = e instanceof Error ? e.message : String(e);
  return /access on a (private|public) store|configured with (private|public) access/i.test(
    m,
  );
}

/**
 * Upload, working out the store's access level on the first attempt if we do
 * not already know it.
 */
export async function blobPut(
  pathname: string,
  body: Buffer | string,
  contentType: string,
): Promise<{ url: string; pathname: string; access: BlobAccess }> {
  const order: BlobAccess[] = detected
    ? [detected]
    : ["private", "public"];

  let lastError: unknown;
  for (const access of order) {
    try {
      const res = await put(pathname, body, {
        access,
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
        token: blobToken(),
      });
      detected = access;
      return { url: res.url, pathname: res.pathname, access };
    } catch (e) {
      lastError = e;
      // Only a mismatch is worth retrying — anything else is a real failure.
      if (!isAccessMismatch(e)) throw e;
    }
  }
  throw lastError;
}

/** Read a blob back as a stream, for serving a private object. */
export async function blobGet(
  pathname: string,
  access: BlobAccess,
): Promise<{ stream: ReadableStream; contentType: string } | null> {
  const res = await get(pathname, { access, token: blobToken() });
  if (!res || res.statusCode !== 200) return null;
  return {
    stream: res.stream as ReadableStream,
    contentType: res.blob.contentType ?? "application/octet-stream",
  };
}

/** Read a small blob as text — used for the manifest. */
export async function blobGetText(
  pathname: string,
  access: BlobAccess,
): Promise<string | null> {
  try {
    const res = await get(pathname, { access, token: blobToken() });
    if (!res || res.statusCode !== 200) return null;
    return await new Response(res.stream as ReadableStream).text();
  } catch {
    // A missing manifest is the normal first-run state, not an error.
    return null;
  }
}

/**
 * Read the manifest without knowing the store's access level yet: try the one
 * we know, else both. Returns the text and records which access answered.
 */
export async function blobGetTextAnyAccess(
  pathname: string,
): Promise<string | null> {
  const order: BlobAccess[] = detected ? [detected] : ["private", "public"];
  for (const access of order) {
    const text = await blobGetText(pathname, access);
    if (text !== null) {
      detected = access;
      return text;
    }
  }
  return null;
}

export async function blobDel(pathname: string): Promise<void> {
  try {
    await del(pathname, { token: blobToken() });
  } catch {
    // Deleting a blob that is already gone is not a failure worth surfacing.
  }
}
