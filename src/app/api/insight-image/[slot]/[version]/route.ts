import { isSlot, readSlotFile, shippedImageFor } from "@/lib/insight-store";

/**
 * Serves the current image for one Insights slot, filesystem driver only.
 *
 * Uploads land outside `public/`, so this is how they reach the browser.
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
 * points at a version segment that no longer has a file behind it. Answering
 * 404 there turns into a 400 from the image optimiser and a visibly broken
 * image on the public site.
 *
 * So a slot with nothing stored redirects to the artwork that shipped with the
 * build — the same thing the page would render if it were re-rendered now. The
 * redirect is deliberately not cached, so it stops being followed as soon as
 * the page catches up.
 *
 * Under the blob driver this route is never linked: the manifest holds an
 * absolute CDN URL instead.
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

  const file = await readSlotFile(slot);
  if (!file) {
    return Response.redirect(new URL(shippedImageFor(slot), req.url), 302);
  }

  return new Response(new Uint8Array(file.body), {
    headers: {
      "content-type": file.contentType,
      "content-length": String(file.body.byteLength),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
