import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  ACCEPTED,
  MAX_UPLOAD_BYTES,
  isSlot,
  resetSlot,
  saveSlot,
} from "@/lib/insight-store";

/**
 * Replace or reset one Zafieon Insights image.
 *
 * Every request is authenticated here, in the handler, rather than relying on
 * a proxy matcher. Next's own guidance is that proxy/middleware is for
 * optimistic checks, not authorization — so the check that actually matters
 * sits next to the write.
 *
 * On success the public surfaces that render the image are revalidated, so the
 * change is live without a rebuild and without waiting out the ISR window.
 */
export const dynamic = "force-dynamic";

const unauthorised = () =>
  Response.json({ ok: false, error: "Not signed in." }, { status: 401 });

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return unauthorised();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json(
      { ok: false, error: "Expected a multipart form." },
      { status: 400 },
    );
  }

  const slot = Number(form.get("slot"));
  if (!isSlot(slot)) {
    return Response.json({ ok: false, error: "Unknown slot." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { ok: false, error: "Choose an image to upload." },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { ok: false, error: "That image is larger than 8 MB." },
      { status: 413 },
    );
  }
  if (!ACCEPTED.includes(file.type as (typeof ACCEPTED)[number])) {
    return Response.json(
      { ok: false, error: "Use a WebP, JPEG, PNG or AVIF image." },
      { status: 415 },
    );
  }

  try {
    const record = await saveSlot(
      slot,
      Buffer.from(await file.arrayBuffer()),
      file.type,
    );
    revalidatePath("/insights");
    revalidatePath("/insights/[slug]", "page");
    revalidatePath("/");
    return Response.json({ ok: true, record });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) return unauthorised();

  const slot = Number(new URL(req.url).searchParams.get("slot"));
  if (!isSlot(slot)) {
    return Response.json({ ok: false, error: "Unknown slot." }, { status: 400 });
  }

  await resetSlot(slot);
  revalidatePath("/insights");
  revalidatePath("/insights/[slug]", "page");
  revalidatePath("/");
  return Response.json({ ok: true });
}
