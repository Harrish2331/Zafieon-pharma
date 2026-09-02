import { isSlot, readSlotFile, shippedImageFor } from "@/lib/insight-store";

/**
 * Serves the current image for one Insights slot.
 *
 * Uploads land outside `public/` — on disk under the filesystem driver, in
 * Vercel Blob under the blob driver — so this is how they reach the browser.
 *
 * ── When this route is used ────────────────────────────────────────────────
 * Always, except for a *public* Blob store, which hands back a CDN URL worth
 * pointing at directly. A private store cannot: its objects need an
 * Authorization header, so the bytes have to be streamed back through a
 * function we control. The manifest decides, and the page follows it.
 *
 * ── Why the version is a path segment, not a query string ──────────────────
 * The URL has to change when the image is replaced, or a CDN and the Next
 * image optimiser will both keep serving the old bytes. The obvious way to do
 * that is `?v=<updatedAt>` — but Next only optimises a local image carrying a
 * query string if `images.localPatterns` declares that exact `search` value,
 * and ours is a timestamp that changes on every upload. A src it cannot match
 * does not degrade gracefully: it throws, and the page 500s.
 *
 * So the version moves into the path. `localPatterns` then matches on pathname
 * alone with an empty `search`, and the URL is still unique per upload.
 *
 * ── Why a missing slot redirects rather than 404s ──────────────────────────
 * A page that was rendered while an override existed can still be held in a
 * CDN or ISR cache for a short window after that override is removed. Its HTML
 * points at a version segment that no longer has anything behind it. Answering
 * 404 there turns into a 400 from the image optimiser and a visibly broken
 * image on the public site.
 *
 * So a slot with nothing stored redirects to the artwork that shipped with the
 * build — the same thing the page would render if it were re-rendered now. The
 * redirect is deliberately not cached, so it stops being followed as soon as
 * the page catches up.
 */
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slot: string; version: string }> },
) {
  const { slot: rawSlot, version } = await params;
  const slot = Number(rawSlot);

  // The version is a cache buster, not a lookup key — but it is still request
  // input, so it is validated rather than passed through unchecked.
  if (!isSlot(slot) || !/^\d{1,16}$/.test(version)) {
    return new Response("Not found", { status: 404 });
  }

  const found = await readSlotFile(slot);
  if (!found) {
    return Response.redirect(new URL(shippedImageFor(slot), req.url), 302);
  }

  const headers: Record<string, string> = {
    "content-type": found.contentType,
    // The URL carries the version, so the bytes behind it never change.
    "cache-control": "public, max-age=31536000, immutable",
    "x-content-type-options": "nosniff",
  };

  // A Blob object comes back as a stream and is passed straight through; a
  // file on disk is already a buffer and can carry a content-length.
  if ("stream" in found) {
    return new Response(found.stream, { headers });
  }
  return new Response(new Uint8Array(found.body), {
    headers: { ...headers, "content-length": String(found.body.byteLength) },
  });
}
