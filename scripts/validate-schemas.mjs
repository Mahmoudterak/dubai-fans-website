#!/usr/bin/env node
/**
 * Post-prerender Schema (JSON-LD) validation gate.
 *
 * Walks every prerendered dist page and verifies:
 *  1. Every <script type="application/ld+json"> block parses via JSON.parse.
 *  2. Key pages contain the expected Schema.org @type:
 *       - /ai-business-os  → SoftwareApplication
 *       - /contact         → ContactPage
 *       - /services/<slug> → Service (for every slug in serviceSchemas)
 *       - /blog/<id>       → BlogPosting (every prerendered blog page)
 *  3. Every parsed block declares @context and a non-empty @type.
 *
 * Any failure exits with code 1 and a clear message, stopping the build.
 *
 * Run: node scripts/validate-schemas.mjs   (after scripts/prerender.mjs)
 */
import { readFile, readdir } from "fs/promises";
import { join, dirname, relative, sep } from "path";
import { fileURLToPath } from "url";
import { serviceSchemas } from "../src/seo/schemas.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const DIST  = join(__dir, "../dist");

/* Pages that MUST contain a specific @type. */
const REQUIRED_TYPES = {
  "/ai-business-os": "SoftwareApplication",
  "/contact":        "ContactPage",
  ...Object.fromEntries(
    Object.keys(serviceSchemas).map((slug) => [`/services/${slug}`, "Service"])
  ),
};

/** Recursively find all index.html files under dist. */
async function findPages(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets") continue;
      out.push(...(await findPages(full)));
    } else if (entry.name === "index.html") {
      out.push(full);
    }
  }
  return out;
}

/** Extract raw JSON-LD block contents from an HTML string. */
function extractJsonLdBlocks(html) {
  const rx = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = rx.exec(html)) !== null) blocks.push(m[1]);
  return blocks;
}

/** Collect every @type found anywhere in a parsed JSON-LD value. */
function collectTypes(node, acc = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => collectTypes(n, acc));
  else if (node && typeof node === "object") {
    const t = node["@type"];
    if (typeof t === "string") acc.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && acc.add(x));
    for (const v of Object.values(node)) collectTypes(v, acc);
  }
  return acc;
}

(async () => {
  let pages;
  try {
    pages = await findPages(DIST);
  } catch {
    console.error("❌  dist not found — run the build first.");
    process.exit(1);
  }

  const errors = [];
  let checkedBlocks = 0;

  for (const file of pages) {
    const rel   = relative(DIST, file);
    const route = "/" + rel.split(sep).slice(0, -1).join("/"); // "" → "/"
    const html  = await readFile(file, "utf-8");
    const blocks = extractJsonLdBlocks(html);

    const pageTypes = new Set();
    blocks.forEach((raw, i) => {
      checkedBlocks++;
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        errors.push(`${route}: JSON-LD block #${i + 1} failed to parse — ${err.message}`);
        return;
      }
      const types = collectTypes(parsed);
      if (types.size === 0) {
        errors.push(`${route}: JSON-LD block #${i + 1} has no @type`);
      }
      const hasContext = Array.isArray(parsed)
        ? parsed.every((p) => p && p["@context"])
        : Boolean(parsed && parsed["@context"]);
      if (!hasContext) {
        errors.push(`${route}: JSON-LD block #${i + 1} is missing @context`);
      }
      types.forEach((t) => pageTypes.add(t));
    });

    // Route-specific required types
    const required = REQUIRED_TYPES[route];
    if (required && !pageTypes.has(required)) {
      errors.push(
        `${route}: expected @type "${required}" but found ${
          pageTypes.size ? [...pageTypes].join(", ") : "no JSON-LD at all"
        }`
      );
    }

    // Every prerendered blog article must carry BlogPosting
    if (/^\/blog\/[^/]+$/.test(route) && !pageTypes.has("BlogPosting")) {
      errors.push(`${route}: expected @type "BlogPosting" but found ${
        pageTypes.size ? [...pageTypes].join(", ") : "no JSON-LD at all"
      }`);
    }
  }

  // Ensure required pages actually exist in dist
  const seenRoutes = new Set(
    pages.map((f) => "/" + relative(DIST, f).split(sep).slice(0, -1).join("/"))
  );
  for (const route of Object.keys(REQUIRED_TYPES)) {
    if (!seenRoutes.has(route)) {
      errors.push(`${route}: prerendered page missing from dist`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌  Schema validation failed (${errors.length} issue${errors.length > 1 ? "s" : ""}):\n`);
    errors.forEach((e) => console.error(`   • ${e}`));
    console.error("\n   Build stopped — fix the JSON-LD above before publishing.\n");
    process.exit(1);
  }

  console.log(
    `✅  Schema validation passed — ${pages.length} pages, ${checkedBlocks} JSON-LD blocks parsed, ` +
    `${Object.keys(REQUIRED_TYPES).length} required-type pages verified.`
  );
})();
