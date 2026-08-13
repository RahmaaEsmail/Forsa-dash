/**
 * Renders a document PDF straight from the source components — no dev server,
 * no login, no seeded database. Use it to iterate on layout and to check how a
 * document copes with edge cases (many line items, very long terms, Arabic
 * names) before wiring it to real data.
 *
 *   node scripts/preview-pdf.mjs                     # quotation, default fixture
 *   node scripts/preview-pdf.mjs --fixture=huge      # stress fixture
 *   node scripts/preview-pdf.mjs --proforma --out=pi.pdf
 *
 * Fixtures live in scripts/fixtures/. Output defaults to .preview/<name>.pdf.
 */
import esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const fixtureName = args.fixture || "default";
const outFile = path.resolve(
  root,
  args.out || `.preview/quotation-${fixtureName}.pdf`,
);

/**
 * esbuild does not know about Vite's import suffixes or the `@` alias, so we
 * teach it the two we actually use.
 */
const viteShims = {
  name: "vite-shims",
  setup(build) {
    build.onResolve({ filter: /\?url$/ }, (a) => ({
      path: path.resolve(a.resolveDir, a.path.replace(/\?url$/, "")),
      namespace: "asset-url",
    }));
    build.onLoad({ filter: /.*/, namespace: "asset-url" }, (a) => ({
      contents: `export default ${JSON.stringify(a.path)};`,
      loader: "js",
    }));
    build.onResolve({ filter: /^@\// }, (a) =>
      // Re-enter resolution so esbuild still infers the .js/.jsx extension.
      build.resolve(`./${a.path.slice(2)}`, {
        kind: a.kind,
        resolveDir: path.join(root, "src"),
      }),
    );
  },
};

const entry = path.join(root, "scripts/.preview-entry.jsx");
const bundle = path.join(root, ".preview/.bundle.mjs");
fs.mkdirSync(path.dirname(bundle), { recursive: true });

fs.writeFileSync(
  entry,
  `import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { QuotationPDF } from "../src/pages/Quotations/QuotationPDF.jsx";
import fixture from "./fixtures/${fixtureName}.js";

export default async function run() {
  return renderToBuffer(
    <QuotationPDF
      quotation={fixture.quotation}
      settings={fixture.settings}
      isProforma={${args.proforma ? "true" : "false"}}
    />
  );
}
`,
);

try {
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    outfile: bundle,
    format: "esm",
    platform: "node",
    target: "node20",
    jsx: "automatic",
    // Let Node resolve dependencies itself; bundling react-pdf's CJS deps into
    // an ESM file breaks their internal `require` calls.
    packages: "external",
    plugins: [viteShims],
    logLevel: "warning",
  });

  const mod = await import(`${pathToFileURL(bundle).href}?t=${Date.now()}`);
  const buffer = await mod.default();
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buffer);
  console.log(
    `${path.relative(root, outFile)} — ${(buffer.length / 1024).toFixed(1)} KB`,
  );
} finally {
  fs.rmSync(entry, { force: true });
}
