/**
 * Move an MP4's `moov` atom in front of `mdat` — the "faststart" layout.
 *
 *   node tools/faststart.mjs "public/video/in.mp4" "public/video/out.mp4"
 *
 * ── Why this matters ────────────────────────────────────────────────────────
 * `moov` is the index: sample tables, durations, chunk offsets. A browser
 * cannot begin playback until it has read it. When an encoder writes `moov`
 * after `mdat` — which many export presets do by default — the browser has to
 * fetch essentially the whole file before the first frame appears. On a 30 MB
 * hero video that is the difference between playing immediately and looking
 * broken for several seconds on a good connection, or indefinitely on a poor
 * one.
 *
 * ── What the transform does ─────────────────────────────────────────────────
 * The atoms are re-ordered so `moov` precedes `mdat`. That shifts `mdat` later
 * in the file by exactly the size of `moov`, which invalidates every absolute
 * chunk offset in the sample tables — so each `stco` (32-bit) and `co64`
 * (64-bit) entry inside `moov` is rewritten by the same delta.
 *
 * The media payload itself is copied byte for byte. This is a container
 * re-order, not a re-encode: no quality is lost and no dependency is needed.
 */
import fs from "node:fs";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node tools/faststart.mjs "<in.mp4>" "<out.mp4>"');
  process.exit(1);
}

const buf = fs.readFileSync(inPath);

/** Top-level atom list: [{ type, start, size }]. */
function topLevel(b) {
  const out = [];
  let o = 0;
  while (o + 8 <= b.length) {
    const size = b.readUInt32BE(o);
    const type = b.toString("latin1", o + 4, o + 8);
    if (size < 8) break;
    out.push({ type, start: o, size });
    o += size;
  }
  return out;
}

/** Containers whose children are themselves atoms. */
const CONTAINERS = new Set([
  "moov", "trak", "mdia", "minf", "stbl", "edts", "udta", "mvex", "moof",
  "traf", "dinf", "ipro", "sinf", "schi",
]);

/** Every stco/co64 offset within a moov buffer, walked properly rather than
 *  scanned for — a byte scan can match payload data and corrupt the file. */
function findOffsetTables(b, start, end, found = []) {
  let o = start;
  while (o + 8 <= end) {
    const size = b.readUInt32BE(o);
    const type = b.toString("latin1", o + 4, o + 8);
    if (size < 8 || o + size > end) break;
    if (type === "stco" || type === "co64") {
      found.push({ type, start: o, size });
    } else if (CONTAINERS.has(type)) {
      findOffsetTables(b, o + 8, o + size, found);
    }
    o += size;
  }
  return found;
}

const atoms = topLevel(buf);
const moov = atoms.find((a) => a.type === "moov");
const mdat = atoms.find((a) => a.type === "mdat");

if (!moov || !mdat) {
  console.error("Could not find both moov and mdat. Is this an MP4?");
  process.exit(1);
}

if (moov.start < mdat.start) {
  console.log("Already faststart — moov precedes mdat. Copying unchanged.");
  fs.copyFileSync(inPath, outPath);
  process.exit(0);
}

// Rebuild: everything except moov and mdat, then moov, then mdat.
const others = atoms.filter((a) => a !== moov && a !== mdat);
const leading = others.reduce((n, a) => n + a.size, 0);
const newMdatStart = leading + moov.size;
const delta = newMdatStart - mdat.start;

// Rewrite the chunk offsets inside a private copy of moov.
const moovBuf = Buffer.from(
  buf.subarray(moov.start, moov.start + moov.size),
);
const tables = findOffsetTables(moovBuf, 8, moovBuf.length);
let entries = 0;
for (const t of tables) {
  const count = moovBuf.readUInt32BE(t.start + 12);
  const base = t.start + 16;
  for (let i = 0; i < count; i++) {
    if (t.type === "stco") {
      const at = base + i * 4;
      moovBuf.writeUInt32BE(moovBuf.readUInt32BE(at) + delta, at);
    } else {
      const at = base + i * 8;
      moovBuf.writeBigUInt64BE(
        moovBuf.readBigUInt64BE(at) + BigInt(delta),
        at,
      );
    }
  }
  entries += count;
}

const out = Buffer.concat([
  ...others.map((a) => buf.subarray(a.start, a.start + a.size)),
  moovBuf,
  buf.subarray(mdat.start, mdat.start + mdat.size),
]);

if (out.length !== buf.length) {
  console.error(
    `Refusing to write: size changed ${buf.length} → ${out.length}.`,
  );
  process.exit(1);
}

fs.writeFileSync(outPath, out);
console.log(
  `moov moved ahead of mdat · ${tables.length} offset table(s), ` +
    `${entries} chunk offsets rebased by +${delta} · ` +
    `${(out.length / 1024 / 1024).toFixed(1)} MB, byte count unchanged`,
);
