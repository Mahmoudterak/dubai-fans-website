#!/usr/bin/env node
/**
 * Post-build prerender:
 *  - Replaces the static title, description, canonical, OG, robots, twitter tags
 *    in the built index.html with route-specific values.
 *  - Writes dist/{route}/index.html so crawlers receive fully-formed
 *    SEO meta in the initial response without executing JavaScript.
 *  - Fetches all blog posts from the DB and generates dist/blog/{id}/index.html
 *    with complete article content injected inside <div id="root"> so AI crawlers
 *    (GPTBot, ClaudeBot, PerplexityBot) and social bots can read the article body.
 *    React replaces #root on load — zero UX impact for real users.
 *
 * Run: node scripts/prerender.mjs  (after `pnpm build`)
 * Called automatically by `pnpm build:full`
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname }              from "path";
import { fileURLToPath }             from "url";
import { execSync }                   from "child_process";
import {
  contactPageSchema,
  softwareApplicationSchema,
  aiBusinessOsFaqSchema,
  toolsFaqSchema,
  serviceSchemas,
  buildBlogPostSchemas,
} from "../src/seo/schemas.mjs";
import { ROUTES_META } from "../src/seo/routes-meta.mjs";

const __dir  = dirname(fileURLToPath(import.meta.url));
const DIST   = join(__dir, "../dist");
const BASE   = "https://mtuaefans.com";
const SITE   = "دبي فانز";

/* ── Central route SEO manifest ─────────────────────────────────────────────
 * Titles/descriptions/OG images come from the shared module
 * src/seo/routes-meta.mjs (also imported by the React pages via SEOHead),
 * so page components and prerendered HTML can never drift apart.
 * Only the JSON-LD attachment is decided here. */
const ROUTE_JSONLD = {
  "/contact": contactPageSchema,
  "/tools": toolsFaqSchema,
  "/ai-business-os": [softwareApplicationSchema, aiBusinessOsFaqSchema],
};

const ROUTES = ROUTES_META.map((meta) => {
  const svcSlug = meta.path.startsWith("/services/")
    ? meta.path.slice("/services/".length)
    : null;
  const jsonLd = svcSlug ? serviceSchemas[svcSlug] : ROUTE_JSONLD[meta.path];
  return jsonLd ? { ...meta, jsonLd } : meta;
});

/* ── Replacement helpers ─────────────────────────────────────────────────── */

/** Escape special chars for use inside a regex */
function escRx(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replace value of a specific meta / link tag attribute */
function replaceMeta(html, selector, newValue) {
  // e.g. <title>…</title>
  if (selector === "title") {
    return html.replace(/<title>[^<]*<\/title>/, `<title>${newValue}</title>`);
  }
  // <meta name="description" content="…">
  // <meta property="og:title" content="…">
  // <link rel="canonical" href="…">
  const attrRx = /(?:name|property|rel)="([^"]+)"/;
  const m = selector.match(attrRx);
  if (!m) return html;
  const [, attrVal] = m;
  // Build regex that matches the tag regardless of attribute order
  const isLink = selector.startsWith("link");
  if (isLink) {
    return html.replace(
      new RegExp(`<link[^>]+rel="${escRx(attrVal)}"[^>]*>`, "g"),
      `<link rel="${attrVal}" href="${newValue}" />`
    );
  }
  // meta tag — replace content="…"
  const tagRx = new RegExp(
    `(<meta[^>]+(?:name|property)="${escRx(attrVal)}"[^>]+content=)"[^"]*"`,
    "g"
  );
  const tagRx2 = new RegExp(
    `(<meta[^>]+content="[^"]*"[^>]+(?:name|property)="${escRx(attrVal)}")`,
    "g"
  );
  let replaced = html.replace(tagRx, `$1"${newValue}"`);
  if (replaced === html) {
    // attribute order is reversed
    replaced = html.replace(tagRx2, (m2) =>
      m2.replace(/content="[^"]*"/, `content="${newValue}"`)
    );
  }
  return replaced;
}

function injectRoute(html, route) {
  const fullTitle = route.title;
  const canonical = `${BASE}${route.path}`;
  const ogImage   = route.ogImage ?? `${BASE}/hero-marketing.webp`;
  const robots    = route.noindex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  let out = html;

  // title
  out = replaceMeta(out, "title", fullTitle);

  // description
  out = replaceMeta(out, 'meta name="description"', route.description);
  out = replaceMeta(out, 'meta property="og:description"', route.description);
  out = replaceMeta(out, 'meta name="twitter:description"', route.description);

  // canonical — replace existing or inject before </head>
  if (/<link[^>]+rel="canonical"/.test(out)) {
    out = replaceMeta(out, 'link rel="canonical"', canonical);
  } else {
    out = out.replace(
      "</head>",
      `  <link rel="canonical" href="${canonical}" />\n  </head>`
    );
  }

  // robots
  out = replaceMeta(out, 'meta name="robots"', robots);
  out = replaceMeta(out, 'meta name="googlebot"', robots);

  // OG
  out = replaceMeta(out, 'meta property="og:title"', fullTitle);
  out = replaceMeta(out, 'meta property="og:url"', canonical);
  out = replaceMeta(out, 'meta property="og:image"', ogImage);
  out = replaceMeta(out, 'meta property="og:type"', route.ogType ?? "website");

  // Twitter
  out = replaceMeta(out, 'meta name="twitter:title"', fullTitle);
  out = replaceMeta(out, 'meta name="twitter:image"', ogImage);

  // Extra JSON-LD
  if (route.jsonLd) {
    const items = Array.isArray(route.jsonLd) ? route.jsonLd : [route.jsonLd];
    const scripts = items
      .map((item) => {
        const ld = JSON.stringify({ "@context": "https://schema.org", ...item }, null, 2);
        return `  <script type="application/ld+json">${ld}</script>`;
      })
      .join("\n");
    out = out.replace("</head>", `${scripts}\n  </head>`);
  }

  // Stamp for debugging
  out = out.replace(
    "<html",
    `<!-- prerendered:${route.path} -->\n<html`
  );

  // Regression guard: a route must never ship more than one FAQPage block
  // (e.g. a global FAQ left in index.html + a route-level one).
  const faqCount = (out.match(/"@type":\s*"FAQPage"/g) ?? []).length;
  if (faqCount > 1) {
    throw new Error(
      `Prerender schema check failed: ${route.path} contains ${faqCount} FAQPage JSON-LD blocks (expected at most 1).`
    );
  }

  return out;
}

/* ── Blog-post body helpers ──────────────────────────────────────────────── */

/** Minimal HTML escaping for text values injected into attribute/text contexts */
function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert plain-text blog content (as stored in the DB) to semantic HTML.
 * Handles: `---` section dividers → <hr>, `\n- ` bullet lists, numbered lists,
 * heading-like lines ending in `:`, and regular `\n\n` paragraphs.
 */
function renderTextContent(raw) {
  if (!raw) return "";

  // If content already contains HTML tags, return as-is (minimal sanitisation)
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;

  const blocks = raw.split(/\n\n+/);
  const parts  = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Section divider
    if (trimmed === "---") {
      parts.push("<hr />");
      continue;
    }

    const lines = trimmed.split("\n");

    // Bullet list block (starts with `- ` or `• `)
    const isBulletList = lines.every(l => /^[-•]\s/.test(l.trim()) || l.trim() === "");
    if (isBulletList) {
      const items = lines
        .filter(l => /^[-•]\s/.test(l.trim()))
        .map(l => `<li>${escHtml(l.replace(/^[-•]\s/, "").trim())}</li>`)
        .join("\n");
      parts.push(`<ul>${items}</ul>`);
      continue;
    }

    // Mixed block: first line may be a heading, rest may be a list
    const listLines = lines.filter(l => /^[-•]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()));
    if (listLines.length > 0 && listLines.length === lines.length - 1) {
      const heading = lines[0].trim();
      const items   = listLines
        .map(l => `<li>${escHtml(l.replace(/^(\d+\.|[-•])\s/, "").trim())}</li>`)
        .join("\n");
      parts.push(
        `<p><strong>${escHtml(heading)}</strong></p>\n<ul>${items}</ul>`
      );
      continue;
    }

    // Single-line "heading" pattern: short line ending with `:` or containing `—`
    if (lines.length === 1 && (trimmed.endsWith(":") || /\s—\s/.test(trimmed))) {
      parts.push(`<h3>${escHtml(trimmed)}</h3>`);
      continue;
    }

    // Regular paragraph(s)
    parts.push(`<p>${escHtml(trimmed).replace(/\n/g, "<br />")}</p>`);
  }

  return parts.join("\n");
}

/**
 * Inject fully-rendered article HTML into `<div id="root">`.
 * React's createRoot().render() replaces this on JS load — zero UX impact.
 * Crawlers (GPTBot, ClaudeBot, PerplexityBot, social bots) read it directly.
 */
/**
 * Build the static "مقالات قد تهمك" (related articles) section.
 * Picks up to 3 posts from the same category (excluding the current one),
 * back-filling with the most recent posts from other categories if needed.
 */
function buildRelatedArticlesHtml(post, allPosts) {
  const others = (allPosts ?? []).filter(p => p.id !== post.id);
  const sameCategory = others.filter(p => p.category === post.category);
  const fill = others.filter(p => p.category !== post.category);
  const related = [...sameCategory, ...fill].slice(0, 3);
  if (related.length === 0) return "";

  const cards = related.map(p => `
        <a href="/blog/${escHtml(p.id)}" style="display:block;background:#fff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit">
          ${p.image ? `<img src="${BASE}${escHtml(p.image)}" alt="${escHtml(p.title)}" style="width:100%;height:150px;object-fit:cover" loading="lazy" />` : ""}
          <div style="padding:16px">
            <span style="background:rgba(204,0,0,0.08);color:#CC0000;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700">${escHtml(p.category)}</span>
            <h3 style="font-size:1rem;font-weight:800;color:#111827;line-height:1.5;margin:10px 0 6px">${escHtml(p.title)}</h3>
            <p style="font-size:0.85rem;color:#6B7280;line-height:1.6;margin:0">${escHtml((p.excerpt ?? "").substring(0, 110))}…</p>
          </div>
        </a>`).join("\n");

  return `
      <!-- Related articles — internal links visible to crawlers -->
      <section style="margin-top:48px;border-top:1px solid #E5E7EB;padding-top:32px">
        <h2 style="font-size:1.35rem;font-weight:900;color:#111827;margin:0 0 20px">مقالات قد تهمك</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px">
${cards}
        </div>
      </section>`;
}

function injectBlogBody(html, post, allPosts) {
  const imageHtml = post.image
    ? `<img
        src="${BASE}${escHtml(post.image)}"
        alt="${escHtml(post.title)}"
        style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;margin-bottom:24px"
        loading="eager"
      />`
    : "";

  const contentHtml = renderTextContent(post.content);

  // Minimal styled shell so the page looks reasonable if JS is slow
  const articleHtml = `
<div style="min-height:100vh;background:#FAFAFA;direction:rtl;font-family:Cairo,Tajawal,sans-serif;color:#374151">
  <div style="max-width:800px;margin:0 auto;padding:80px 24px 60px">
    <a href="/blog" style="color:#CC0000;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-bottom:32px">
      &#x2190; العودة للمقالات
    </a>
    <article>
      ${imageHtml}
      <div style="margin-bottom:12px">
        <span style="background:#CC0000;color:#fff;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700">${escHtml(post.category)}</span>
        <span style="color:#9CA3AF;font-size:13px;margin-right:10px">${escHtml(post.date)}</span>
        <span style="color:#9CA3AF;font-size:13px">· ${escHtml(post.read_time)}</span>
      </div>
      <h1 style="font-size:clamp(1.5rem,4vw,2.25rem);font-weight:900;color:#111827;line-height:1.3;margin:0 0 16px">${escHtml(post.title)}</h1>
      <p style="font-size:1.1rem;color:#6B7280;line-height:1.75;margin:0 0 32px;border-right:4px solid #CC0000;padding-right:16px">${escHtml(post.excerpt)}</p>
      <div style="line-height:1.85;font-size:1.05rem">
        ${contentHtml}
      </div>

      <!-- WhatsApp CTA — visible to bots and crawlers -->
      <div style="margin:40px 0;border-radius:16px;background:linear-gradient(to left,rgba(37,211,102,0.1),rgba(18,140,126,0.1));border:1px solid rgba(37,211,102,0.3);padding:32px;text-align:center">
        <p style="font-size:1.1rem;font-weight:700;color:#111827;margin:0 0 8px">هل لديك سؤال أو تريد استشارة مجانية؟</p>
        <p style="color:#6B7280;margin:0 0 24px">تواصل مع خبراء دبي فانز مباشرةً على واتساب — نردّ خلال دقائق</p>
        <a href="https://wa.me/971551981564?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D9%82%D8%B1%D8%A3%D8%AA%20%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA%D9%83%D9%85%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
           target="_blank"
           rel="noopener noreferrer"
           style="display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#fff;font-weight:700;font-size:1rem;padding:14px 32px;border-radius:999px;text-decoration:none;box-shadow:0 4px 15px rgba(37,211,102,0.35)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          تواصل معنا على واتساب
        </a>
      </div>
${buildRelatedArticlesHtml(post, allPosts)}
    </article>
  </div>
</div>`.trim();

  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${articleHtml}</div>`
  );
}

/** Fetch all blog posts from the DB using psql (available in the build env) */
function fetchBlogPostsFromDB() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠  DATABASE_URL not set — skipping blog post prerender.");
    return [];
  }
  try {
    // Single-line SQL — psql -c doesn't handle embedded newlines well
    const sql = "SELECT json_agg(json_build_object('id',id,'title',title,'excerpt',excerpt,'category',category,'image',image,'date',date,'date_iso',date_iso,'read_time',read_time,'content',content) ORDER BY date_iso DESC) FROM blog_posts";
    const raw = execSync(
      `psql "${process.env.DATABASE_URL}" -t -A -c "${sql.replace(/"/g, '\\"')}"`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    return JSON.parse(raw) ?? [];
  } catch (err) {
    // Never fail the whole build over a transient DB issue — static pages
    // are already generated; just warn and skip the blog section.
    // Sanitize: execSync errors embed the full command incl. DATABASE_URL.
    const msg = String(err.message || err).replace(process.env.DATABASE_URL, "<DATABASE_URL>");
    console.warn("⚠  Could not fetch blog posts from DB — skipping blog prerender (static pages are unaffected):", msg);
    return [];
  }
}

/* ── Main ────────────────────────────────────────────────────────────────── */
(async () => {
  let template;
  try {
    template = await readFile(join(DIST, "index.html"), "utf-8");
  } catch {
    console.error("❌  dist/index.html not found — run `pnpm build` first.");
    process.exit(1);
  }

  // ── Static routes ────────────────────────────────────────────────────────
  console.log(`🔧  Prerendering ${ROUTES.length} static routes …\n`);

  for (const route of ROUTES) {
    const html = injectRoute(template, route);
    const dir  = route.path === "/"
      ? DIST
      : join(DIST, ...route.path.slice(1).split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html, "utf-8");
    const canonLen = route.description.length;
    const flag = canonLen < 120 ? "⚠  SHORT" : canonLen > 160 ? "⚠  LONG " : "  ✅ ";
    console.log(`${flag}  [${canonLen}c]  ${route.path}`);
  }

  // ── Dynamic blog posts ───────────────────────────────────────────────────
  // Any failure here must NOT fail the build: static routes are already
  // written above, and previously prerendered blog pages (if any) remain
  // in dist untouched.
  try {
  const posts = fetchBlogPostsFromDB();

  if (posts.length > 0) {
    console.log(`\n📝  Prerendering ${posts.length} blog posts …\n`);

    for (const post of posts) {
      try {
      const excerpt = (post.excerpt ?? "").substring(0, 160);

      const blogRoute = {
        path:        `/blog/${post.id}`,
        title:       `${post.title} | ${SITE}`,
        description: excerpt,
        ogImage:     post.image ? `${BASE}${post.image}` : `${BASE}/hero-marketing.webp`,
        ogType:      "article",
        jsonLd: buildBlogPostSchemas({
          id:       post.id,
          title:    post.title,
          excerpt,
          image:    post.image,
          dateISO:  post.date_iso,
          category: post.category,
          content:  post.content,
        }),
      };

      // Head meta tags
      let html = injectRoute(template, blogRoute);
      // Body content (for AI / social crawlers)
      html     = injectBlogBody(html, post, posts);

      const dir = join(DIST, "blog", post.id);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, "index.html"), html, "utf-8");

      const descLen = excerpt.length;
      const flag    = descLen < 80 ? "⚠  SHORT" : "  ✅ ";
      console.log(`${flag}  /blog/${post.id}`);
      } catch (err) {
        console.warn(`⚠  Skipped prerender of /blog/${post?.id ?? "?"}:`, err.message);
      }
    }
  }
  } catch (err) {
    console.warn("⚠  Blog prerender failed — continuing build with static pages only:", err.message);
  }

  console.log("\n✨  Prerender complete.");
})();
