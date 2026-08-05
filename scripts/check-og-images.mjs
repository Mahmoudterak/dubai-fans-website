#!/usr/bin/env node
/**
 * Pre-publish OG image checker.
 *
 * Reads every ogImage URL declared in ROUTES_META (and the DEFAULT_OG_IMAGE
 * fallback) and confirms that the corresponding file exists inside public/.
 *
 * Run manually:  pnpm check:og-images
 * Or in CI before the build step so failures are caught early.
 *
 * Exit 0  — all images found.
 * Exit 1  — one or more images are missing; each is listed clearly.
 */
import { access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Import the single source of truth directly (plain .mjs, no transpilation needed).
import { ROUTES_META, DEFAULT_OG_IMAGE } from "../src/seo/routes-meta.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dir, "../public");
const BASE   = "https://mtuaefans.com";

/** Strip the domain prefix from an absolute OG image URL to get a relative path. */
function urlToRelPath(url) {
  if (!url || !url.startsWith(BASE)) {
    return null; // external or malformed — skip
  }
  return url.slice(BASE.length); // e.g. "/hero-marketing.webp"
}

async function fileExists(absPath) {
  try {
    await access(absPath);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  // Collect every unique ogImage path referenced across all routes.
  // A route without an explicit ogImage falls back to DEFAULT_OG_IMAGE.
  const seen = new Map(); // relPath → [routePath, ...]

  for (const route of ROUTES_META) {
    const imgUrl   = route.ogImage ?? DEFAULT_OG_IMAGE;
    const relPath  = urlToRelPath(imgUrl);
    if (!relPath) continue;

    if (!seen.has(relPath)) seen.set(relPath, []);
    seen.get(relPath).push(route.path);
  }

  // Also check the default image itself (referenced by routes without explicit ogImage).
  const defaultRel = urlToRelPath(DEFAULT_OG_IMAGE);
  if (defaultRel && !seen.has(defaultRel)) {
    seen.set(defaultRel, ["(default fallback)"]);
  }

  const missing = [];

  for (const [relPath, routes] of seen) {
    const absPath = join(PUBLIC, relPath);
    const exists  = await fileExists(absPath);
    if (!exists) {
      missing.push({ relPath, routes });
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n❌  check:og-images — ${missing.length} missing OG image${missing.length > 1 ? "s" : ""}:\n`
    );
    for (const { relPath, routes } of missing) {
      console.error(`   • public${relPath}`);
      console.error(`     referenced by: ${routes.join(", ")}`);
    }
    console.error(
      "\n   Add the missing images to public/ (or update the path in routes-meta.mjs) before publishing.\n"
    );
    process.exit(1);
  }

  console.log(
    `✅  check:og-images — all ${seen.size} OG image${seen.size !== 1 ? "s" : ""} found in public/.`
  );
})();
