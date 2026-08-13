/**
 * Regenerates src/pdf/assets.js — the inlined images used by every generated PDF.
 *
 *   node scripts/build-pdf-assets.mjs
 *
 * Why inline instead of pointing <Image src="/images/..."> at public assets?
 * react-pdf resolves images asynchronously and *swallows* failures with a
 * console warning, so a 404, a cold cache or a slow network silently produces a
 * document with a hole where the logo should be. Data URIs make the output
 * deterministic.
 *
 * The Forsa wordmark additionally needs recolouring: public/images/LOGO.svg
 * uses its embedded bitmap as an alpha mask filled with the brand red, so the
 * bitmap on its own is a near-invisible light grey.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = [0xc9, 0x45, 0x44];

/* ------------------------------------------------------------------ PNG I/O */

const readChunks = (buf) => {
  const out = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    out.push({
      type: buf.toString("ascii", off + 4, off + 8),
      data: buf.subarray(off + 8, off + 8 + len),
    });
    off += 12 + len;
  }
  return out;
};

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

const unfilter = (raw, width, height, bpp) => {
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const ft = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (ft === 1) v += a;
      else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) v += paeth(a, b, c);
      cur[x] = v & 0xff;
    }
  }
  return out;
};

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buf) => {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const encodePNG = (pixels, width, height) => {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

/* -------------------------------------------------------------- the wordmark */

function buildWordmark() {
  const svg = fs.readFileSync(path.join(root, "public/images/LOGO.svg"), "utf8");
  const match = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  if (!match) throw new Error("LOGO.svg no longer embeds a base64 PNG");

  const src = Buffer.from(match[1], "base64");
  const chunks = readChunks(src);
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  if (ihdr[8] !== 8 || ihdr[9] !== 6 || ihdr[12] !== 0)
    throw new Error(`unsupported PNG: depth=${ihdr[8]} colour=${ihdr[9]}`);

  const idat = zlib.inflateSync(
    Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)),
  );
  const px = unfilter(idat, width, height, 4);
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    px[i] = BRAND[0];
    px[i + 1] = BRAND[1];
    px[i + 2] = BRAND[2];
  }
  return { buffer: encodePNG(px, width, height), width, height };
}

/* -------------------------------------------------------------------- output */

const sizeOf = (buf) => ({
  width: buf.readUInt32BE(16),
  height: buf.readUInt32BE(20),
});

const dataUri = (buf) => `data:image/png;base64,${buf.toString("base64")}`;

const emit = (name, buf, { width, height }, doc) => {
  const b64 = buf.toString("base64");
  const lines = b64.match(/.{1,96}/g).map((l) => `  "${l}"`).join(" +\n");
  return `${doc}
export const ${name}_SIZE = { width: ${width}, height: ${height} };

export const ${name} =
  "data:image/png;base64," +
${lines};
`;
};

const wordmark = buildWordmark();

const banner = `// GENERATED FILE — do not edit by hand.
// Run \`node scripts/build-pdf-assets.mjs\` to regenerate.
//
// Images inlined as data URIs so PDF generation never depends on a network
// round-trip. See the script header for the full rationale.
//
// Only the issuing company's own wordmark belongs here. Bank logos are NOT
// bundled: they are per-account data uploaded through Settings > Bank Accounts,
// and a bundled default would stamp one bank's mark onto whichever account an
// admin configures in that slot.
`;

const out = [
  banner,
  emit(
    "LOGO_FORSA",
    wordmark.buffer,
    wordmark,
    "\n/** Forsa wordmark, flattened from LOGO.svg's alpha mask to the brand red. */",
  ),
].join("\n");

const dest = path.join(root, "src/pdf/assets.js");
fs.writeFileSync(dest, out);
console.log(
  `wrote ${path.relative(root, dest)} — wordmark ${wordmark.width}x${wordmark.height} ` +
    `(${wordmark.buffer.length}B)`,
);
void dataUri;
void sizeOf;
