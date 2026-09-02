import "server-only";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin authentication.
 *
 * Deliberately small: one operator, one password, one signed cookie. There is
 * no user table, no registration and no password reset, because the dashboard
 * does exactly one thing — replace four images — and every additional moving
 * part is another thing to get wrong.
 *
 * ── Configuration ──────────────────────────────────────────────────────────
 * Two environment variables are required before the dashboard will accept a
 * login at all:
 *
 *   ADMIN_SESSION_SECRET   32+ random bytes, hex or base64. Signs the cookie.
 *   ADMIN_PASSWORD_HASH    scrypt hash, "scrypt:<saltHex>:<keyHex>".
 *                          Generate with: node tools/admin-hash.mjs
 *
 * `ADMIN_PASSWORD` is accepted as a plaintext fallback for local development
 * only, and `isConfigured()` reports it so the UI can warn. Neither value ever
 * reaches the client: this module is `server-only`, and the login route returns
 * nothing but a boolean.
 *
 * ── Why not a JWT library ──────────────────────────────────────────────────
 * The token carries an expiry and nothing else. An HMAC over "expiry" with a
 * constant-time comparison is the whole requirement, and node:crypto covers it
 * without adding a dependency to a site that otherwise has none for this.
 */

const COOKIE = "zf_admin";
const TTL_SECONDS = 60 * 60 * 8; // Eight hours; a working session, not a month.

function secret(): string | undefined {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : undefined;
}

export type AdminConfig =
  | { ok: true; usingPlaintext: boolean }
  | { ok: false; reason: string };

/** Whether the dashboard is usable, and why not if it is not. */
export function isConfigured(): AdminConfig {
  if (!secret()) {
    return {
      ok: false,
      reason:
        "ADMIN_SESSION_SECRET is not set, or is shorter than 32 characters.",
    };
  }
  if (process.env.ADMIN_PASSWORD_HASH) return { ok: true, usingPlaintext: false };
  if (process.env.ADMIN_PASSWORD) return { ok: true, usingPlaintext: true };
  return {
    ok: false,
    reason: "Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set.",
  };
}

/** Constant-time equality that tolerates differing lengths. */
function sameString(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // Hash both to a fixed width first, so length never leaks through the
  // comparison and timingSafeEqual never throws on a mismatch.
  const ah = createHmac("sha256", "cmp").update(ab).digest();
  const bh = createHmac("sha256", "cmp").update(bb).digest();
  return timingSafeEqual(ah, bh);
}

export function hashPassword(password: string, saltHex?: string): string {
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

function passwordMatches(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (stored) {
    const [scheme, saltHex, keyHex] = stored.split(":");
    if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
    let derived: Buffer;
    try {
      derived = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
    } catch {
      return false;
    }
    const expected = Buffer.from(keyHex, "hex");
    if (expected.length !== derived.length) return false;
    return timingSafeEqual(derived, expected);
  }
  const plain = process.env.ADMIN_PASSWORD;
  return plain ? sameString(password, plain) : false;
}

/* ── Login throttling ────────────────────────────────────────────────────────
   In-process and therefore per-instance: enough to make an online guessing
   attack impractical against a single-operator dashboard, and honest about not
   being a distributed rate limiter. */
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 15 * 60 * 1000;

export function throttleState(key: string): { locked: boolean; retryIn: number } {
  const rec = attempts.get(key);
  if (!rec) return { locked: false, retryIn: 0 };
  if (Date.now() > rec.until) {
    attempts.delete(key);
    return { locked: false, retryIn: 0 };
  }
  return {
    locked: rec.n >= MAX_ATTEMPTS,
    retryIn: Math.max(0, Math.ceil((rec.until - Date.now()) / 1000)),
  };
}

function noteFailure(key: string) {
  const rec = attempts.get(key);
  const now = Date.now();
  if (!rec || now > rec.until) {
    attempts.set(key, { n: 1, until: now + LOCKOUT_MS });
  } else {
    rec.n += 1;
    rec.until = now + LOCKOUT_MS;
  }
}

function clearFailures(key: string) {
  attempts.delete(key);
}

/* ── Session token ───────────────────────────────────────────────────────── */

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function mint(): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const expires = Date.now() + TTL_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload, key)}`;
}

function verify(token: string | undefined): boolean {
  const key = secret();
  if (!key || !token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!sameString(mac, sign(payload, key))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}

/**
 * Attempt a login. Returns whether it succeeded; on success the session cookie
 * is set on the outgoing response.
 *
 * `throttleKey` should identify the caller as well as the deployment can — the
 * proxy-forwarded address where one exists.
 */
export async function login(
  password: string,
  throttleKey: string,
): Promise<{ ok: boolean; retryIn?: number }> {
  const state = throttleState(throttleKey);
  if (state.locked) return { ok: false, retryIn: state.retryIn };

  if (!isConfigured().ok || !passwordMatches(password)) {
    noteFailure(throttleKey);
    return { ok: false };
  }

  clearFailures(throttleKey);
  const jar = await cookies();
  jar.set(COOKIE, mint(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
  return { ok: true };
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Whether the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verify(jar.get(COOKIE)?.value);
}
