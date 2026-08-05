#!/usr/bin/env node
/**
 * Converts PNG/JPG images in public/ → WebP + AVIF
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dir, "../public");

const TARGET_FILES = [
  { src: "hero-marketing.png",      width: 1200, height: 630 },
  { src: "ads-campaigns.png",       width: 1200, height: 630 },
  { src: "audit-banner.png",        width: 1200, height: 630 },
  { src: "svc-marketing.jpg",       width: 1200, height: 630 },
  { src: "svc-analytics.jpg",       width: 1200, height: 630 },
  { src: "svc-consulting.jpg",      width: 1200, height: 630 },
  { src: "svc-content.jpg",         width: 1200, height: 630 },
  { src: "svc-websites.jpg",        width: 1200, height: 630 },
  { src: "svc-design.jpg",          width: 1200, height: 630 },
];

async function convert(file, width, height) {
  const src = join(PUBLIC_DIR, file);
  const nameNoExt = basename(file, extname(file));

  try {
    await stat(src);
  } catch {
    console.warn(`⚠  Skipped (not found): ${file}`);
    return;
  }

  const base = sharp(src).resize(width, height, {
    fit: "cover",
    position: "centre",
    withoutEnlargement: false,
  });

  // WebP
  const webpOut = join(PUBLIC_DIR, `${nameNoExt}.webp`);
  await base.clone().webp({ quality: 82, effort: 5 }).toFile(webpOut);

  const { size: srcSz }  = await stat(src);
  const { size: webpSz } = await stat(webpOut);
  const saving = (((srcSz - webpSz) / srcSz) * 100).toFixed(1);
  console.log(
    `✅  ${file} → ${nameNoExt}.webp  |  ` +
    `${(srcSz / 1024).toFixed(0)} KB → ${(webpSz / 1024).toFixed(0)} KB  (-${saving}%)`
  );
}

(async () => {
  console.log("🔧  Optimizing images …\n");
  for (const { src, width, height } of TARGET_FILES) {
    await convert(src, width, height);
  }
  // Also convert all blog/ images
  try {
    const blogDir = join(PUBLIC_DIR, "blog");
    const blogFiles = await readdir(blogDir);
    for (const f of blogFiles) {
      const ext = extname(f).toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        await convert(`blog/${f}`, 1200, 630);
      }
    }
  } catch {}

  // Generic pass: convert every remaining PNG/JPG in public/ (recursively)
  // above MIN_SIZE to WebP, preserving aspect ratio (no crop), max width 1600.
  const MIN_SIZE = 60 * 1024;
  const SKIP = new Set(["apple-touch-icon.png", "favicon.png", "og-image.png"]);
  async function walk(dir, rel = "") {
    for (const f of await readdir(dir)) {
      const abs = join(dir, f);
      const relPath = rel ? `${rel}/${f}` : f;
      const st = await stat(abs);
      if (st.isDirectory()) { await walk(abs, relPath); continue; }
      const ext = extname(f).toLowerCase();
      if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
      if (SKIP.has(f) || st.size < MIN_SIZE) continue;
      const webpOut = join(dir, `${basename(f, ext)}.webp`);
      try {
        const wst = await stat(webpOut);
        if (wst.mtimeMs >= st.mtimeMs) continue; // up to date
      } catch {}
      await sharp(abs)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(webpOut);
      const { size: outSz } = await stat(webpOut);
      console.log(
        `✅  ${relPath} → webp  |  ${(st.size / 1024).toFixed(0)} KB → ${(outSz / 1024).toFixed(0)} KB`
      );
    }
  }
  await walk(PUBLIC_DIR);
  console.log("\n✨  Done.");
})();
