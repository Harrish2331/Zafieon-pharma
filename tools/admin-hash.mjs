/**
 * Generate the two secrets the Admin Dashboard needs.
 *
 *   node tools/admin-hash.mjs "the password you want to use"
 *
 * Prints ADMIN_SESSION_SECRET and ADMIN_PASSWORD_HASH ready to paste into the
 * deployment's environment. The plaintext password is never written anywhere —
 * only the scrypt hash of it, which is what the server compares against.
 *
 * Keep the scrypt parameters here in step with `src/lib/admin-auth.ts`.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error(
    "Usage: node tools/admin-hash.mjs \"<password>\"\n\n" +
      "Choose something long. This is the only credential protecting the dashboard.",
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    `That password is ${password.length} characters. Use at least 12.`,
  );
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 64);

console.log(`
Add these to your deployment's environment:

ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}
ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${key.toString("hex")}

Do not commit them. Changing ADMIN_SESSION_SECRET signs every open session out.
`);
