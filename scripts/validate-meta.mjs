#!/usr/bin/env node
/**
 * Post-prerender Meta-tag validation gate (sibling of validate-schemas.mjs).
 *
 * Walks every prerendered dist page and verifies:
 *  1. <title> exists and is non-empty.
 *  2. Titles are unique across all pages (duplicate titles hurt SEO).
 *  3. <meta name="description"> exists with non-empty content.
 *  4. <link rel="canonical"> exists and matches the page's own route
 *     (https://mtuaefans.com + route path).
 *  5. og:image and twitter:image exist, point to our own domain, and the
 *     referenced image file actually exists in dist — so share links
 *     on WhatsApp/Facebook/Twitter never render without an image.
 *
 * Any failure exits with code 1 and a clear message naming the page and
 * the problem, stopping the build.
 *
 * Run: node scripts/validate-meta.mjs   (after scripts/prerender.mjs)
 */
import { readFile, readdir, stat } from "fs/promises";
import { join, dirname, relative, sep } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const DIST  = join(__dir, "../dist");
const BASE  = "https://mtuaefans.com";

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

/** Decode the few HTML entities that can appear in injected meta values. */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function extractMetaDescription(html) {
  // attribute order can vary: name before or after content
  let m = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  if (!m) m = html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

/** Extract all og:image / twitter:image content values (property or name attr, any order). */
function extractSocialImages(html) {
  const found = []; // { tag: "og:image" | "twitter:image", url }
  for (const tag of ["og:image", "twitter:image"]) {
    const rx1 = new RegExp(`<meta[^>]+(?:property|name)="${tag}"[^>]+content="([^"]*)"`, "gi");
    const rx2 = new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${tag}"`, "gi");
    let m;
    while ((m = rx1.exec(html)) !== null) found.push({ tag, url: decodeEntities(m[1]).trim() });
    while ((m = rx2.exec(html)) !== null) found.push({ tag, url: decodeEntities(m[1]).trim() });
  }
  return found;
}

function extractCanonical(html) {
  let m = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
  if (!m) m = html.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i);
  return m ? m[1].trim() : null;
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
  const titleToRoutes = new Map(); // title → [routes]
  const imageExistsCache = new Map(); // pathname → boolean

  async function imageFileExists(pathname) {
    if (imageExistsCache.has(pathname)) return imageExistsCache.get(pathname);
    let ok = false;
    try {
      ok = (await stat(join(DIST, ...pathname.split("/").filter(Boolean)))).isFile();
    } catch {}
    imageExistsCache.set(pathname, ok);
    return ok;
  }

  for (const file of pages) {
    const rel   = relative(DIST, file);
    const parts = rel.split(sep).slice(0, -1);
    const route = "/" + parts.join("/"); // "" → "/"
    const html  = await readFile(file, "utf-8");

    // Redirect stubs (meta-refresh + noindex) are not content pages —
    // they intentionally carry the destination's canonical and no meta.
    if (/http-equiv="refresh"/i.test(html) && /name="robots"[^>]+noindex/i.test(html)) {
      continue;
    }

    // 1–2. Title
    const title = extractTitle(html);
    if (title === null) {
      errors.push(`${route}: missing <title> tag`);
    } else if (title === "") {
      errors.push(`${route}: <title> is empty`);
    } else {
      const list = titleToRoutes.get(title) ?? [];
      list.push(route);
      titleToRoutes.set(title, list);
    }

    // 3. Meta description
    const desc = extractMetaDescription(html);
    if (desc === null) {
      errors.push(`${route}: missing <meta name="description">`);
    } else if (desc === "") {
      errors.push(`${route}: meta description is empty`);
    }

    // 4. Canonical must match the page's own route
    const canonical = extractCanonical(html);
    const expected  = route === "/" ? `${BASE}/` : `${BASE}${route}`;
    if (canonical === null) {
      errors.push(`${route}: missing <link rel="canonical">`);
    } else if (canonical !== expected && canonical !== expected.replace(/\/$/, "")) {
      // accept BASE with or without trailing slash for the root page
      errors.push(
        `${route}: canonical mismatch — expected "${expected}" but found "${canonical}"`
      );
    }
    // 5. og:image / twitter:image must exist and point to a real file
    const socialImages = extractSocialImages(html);
    for (const tag of ["og:image", "twitter:image"]) {
      if (!socialImages.some((s) => s.tag === tag)) {
        errors.push(`${route}: missing <meta ${tag.startsWith("og") ? "property" : "name"}="${tag}">`);
      }
    }
    for (const { tag, url } of socialImages) {
      if (url === "") {
        errors.push(`${route}: ${tag} is empty`);
        continue;
      }
      let parsed;
      try {
        parsed = new URL(url, BASE);
      } catch {
        errors.push(`${route}: ${tag} is not a valid URL: "${url}"`);
        continue;
      }
      if (parsed.origin !== BASE) {
        // External image — can't verify locally; require our own domain
        errors.push(`${route}: ${tag} points outside ${BASE}: "${url}"`);
        continue;
      }
      const pathname = decodeURIComponent(parsed.pathname);
      if (!(await imageFileExists(pathname))) {
        errors.push(`${route}: ${tag} file not found in dist: "${pathname}" (from "${url}")`);
      }
    }
  }

  // 2. Duplicate titles across pages
  for (const [title, routes] of titleToRoutes) {
    if (routes.length > 1) {
      errors.push(
        `duplicate <title> "${title}" used by ${routes.length} pages: ${routes.join(", ")}`
      );
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌  Meta validation failed (${errors.length} issue${errors.length > 1 ? "s" : ""}):\n`);
    errors.forEach((e) => console.error(`   • ${e}`));
    console.error("\n   Build stopped — fix the titles/descriptions/canonicals/social images above before publishing.\n");
    process.exit(1);
  }

  console.log(
    `✅  Meta validation passed — ${pages.length} pages: unique non-empty titles, ` +
    `descriptions present, canonicals match routes, og/twitter images resolve to real files.`
  );
})();
