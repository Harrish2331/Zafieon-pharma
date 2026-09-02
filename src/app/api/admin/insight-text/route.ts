import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin-auth";
import { isSlot, resetText, saveText } from "@/lib/insight-store";

/**
 * Edit or reset one Zafieon Insights entry's text.
 *
 * Deliberately a separate endpoint from the image. Saving a description never
 * sends an image, and saving an image never sends a description — so neither
 * can overwrite the other, and a failed upload cannot take a paragraph of copy
 * down with it.
 *
 * Every request is authenticated here, in the handler, rather than relying on
 * a proxy matcher. Next's own guidance is that proxy/middleware is for
 * optimistic checks, not authorization.
 */
export const dynamic = "force-dynamic";

const unauthorised = () =>
  Response.json({ ok: false, error: "Not signed in." }, { status: 401 });

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return unauthorised();

  let payload: {
    slot?: unknown;
    title?: unknown;
    standfirst?: unknown;
    body?: unknown;
  };
  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const slot = Number(payload.slot);
  if (!isSlot(slot)) {
    return Response.json({ ok: false, error: "Unknown slot." }, { status: 400 });
  }

  // Only fields actually present are touched. An absent field is left alone;
  // an empty string clears that one field back to what shipped.
  const fields: { title?: string; standfirst?: string; body?: string[] } = {};
  if (typeof payload.title === "string") fields.title = payload.title;
  if (typeof payload.standfirst === "string") {
    fields.standfirst = payload.standfirst;
  }
  if (typeof payload.body === "string") {
    // Blank lines separate paragraphs, which is how the textarea presents it.
    fields.body = payload.body.split(/\n\s*\n/);
  } else if (Array.isArray(payload.body)) {
    fields.body = payload.body.filter((p): p is string => typeof p === "string");
  }

  if (!Object.keys(fields).length) {
    return Response.json(
      { ok: false, error: "Nothing to save." },
      { status: 400 },
    );
  }

  try {
    const record = await saveText(slot, fields);
    revalidatePath("/insights");
    revalidatePath("/insights/[slug]", "page");
    revalidatePath("/");
    return Response.json({ ok: true, record });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "Save failed." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) return unauthorised();

  const slot = Number(new URL(req.url).searchParams.get("slot"));
  if (!isSlot(slot)) {
    return Response.json({ ok: false, error: "Unknown slot." }, { status: 400 });
  }

  await resetText(slot);
  revalidatePath("/insights");
  revalidatePath("/insights/[slug]", "page");
  revalidatePath("/");
  return Response.json({ ok: true });
}
