/**
 * Dev-only: assert that no server route traces `public/` into its bundle.
 *
 * The Insights store resolves its directory at runtime, so Turbopack cannot
 * statically scope its filesystem calls and falls back to tracing the whole
 * project — which would pull the 11.8 MB manufacturing film into every server
 * function. `outputFileTracingExcludes` in `next.config.ts` prevents that; this
 * checks that it is still working after a build.
 *
 *   npm run build && node tools/trace-check.mjs
 */
import fs from "node:fs";
import path from "node:path";

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".nft.json")) files.push(p);
  }
})(".next/server");

let bad = 0;
for (const f of files) {
  const list = JSON.parse(fs.readFileSync(f, "utf8")).files ?? [];
  const pub = list.filter((x) => x.split(path.sep).join("/").includes("/public/"));
  if (pub.length) {
    bad++;
    console.log(pub.length, f, pub.slice(0, 2));
  }
}
console.log(
  bad
    ? `${bad} of ${files.length} traces still reference public/`
    : `No server trace references public/ across ${files.length} routes — exclusion is effective.`,
);
process.exit(bad ? 1 : 0);
