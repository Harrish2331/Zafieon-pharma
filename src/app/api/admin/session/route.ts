import { isConfigured, login, logout } from "@/lib/admin-auth";

/**
 * Admin session: POST to sign in, DELETE to sign out.
 *
 * The response body never distinguishes "no such password" from "wrong
 * password" from "not configured" beyond what the operator needs, and it never
 * echoes anything derived from the submitted value.
 */
export const dynamic = "force-dynamic";

/** Best available caller identity for throttling. */
function callerKey(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function POST(req: Request) {
  const cfg = isConfigured();
  if (!cfg.ok) {
    return Response.json(
      { ok: false, error: "The dashboard is not configured on this deployment." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!password) {
    return Response.json(
      { ok: false, error: "Enter the password." },
      { status: 400 },
    );
  }

  const result = await login(password, callerKey(req));
  if (!result.ok) {
    return Response.json(
      {
        ok: false,
        error: result.retryIn
          ? `Too many attempts. Try again in ${Math.ceil(result.retryIn / 60)} minutes.`
          : "That password was not accepted.",
      },
      { status: result.retryIn ? 429 : 401 },
    );
  }

  return Response.json({ ok: true });
}

export async function DELETE() {
  await logout();
  return Response.json({ ok: true });
}
