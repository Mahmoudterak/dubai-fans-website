/**
 * Single source of truth for JSON-LD structured data (Schema.org).
 *
 * Imported by BOTH:
 *  - React pages (via SEOHead)          — src/pages/**
 *  - the post-build prerender script    — scripts/prerender.mjs
 *
 * Plain .mjs (no TypeScript syntax) so Node can import it directly at
 * build time without transpilation. Type declarations: ./schemas.d.ts
 */

export const SEO_BASE = "https://mtuaefans.com";
export const SEO_SITE = "دبي فانز";

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SEO_BASE}/#organization`,
  "name": SEO_SITE,
  "url": SEO_BASE,
  "telephone": "+971551981564",
};

const UAE = { "@type": "Country", "name": "الإمارات العربية المتحدة" };

/* ── ContactPage (/contact) ─────────────────────────────────────────────── */
export const contactPageSchema = {
  "@type": "ContactPage",
  "@id": `${SEO_BASE}/contact#webpage`,
  "url": `${SEO_BASE}/contact`,
  "name": `اتصل بنا — ${SEO_SITE}`,
  "description": "صفحة التواصل مع دبي فانز للخدمات الرقمية",
  "mainEntity": {
    "@type": "LocalBusiness",
    "@id": `${SEO_BASE}/#localbusiness`,
    "name": SEO_SITE,
    "telephone": ["+971551981564", "+971568952775"],
    "email": "info@mtuaefans.sbs",
    "url": SEO_BASE,
  },
};

/* ── SoftwareApplication (/ai-business-os) ──────────────────────────────── */
export const softwareApplicationSchema = {
  "@type": "SoftwareApplication",
  "name": "AI Business OS",
  "alternateName": `AI Business OS من ${SEO_SITE}`,
  "description":
    "أول منصة عربية تعتمد على الذكاء الاصطناعي لمساعدة أصحاب الأنشطة التجارية على تحليل وإدارة وتنمية أعمالهم من مكان واحد — تحليل الموقع، SEO، إنستغرام، فيسبوك، تيك توك، خطط تسويق، وتقارير PDF احترافية.",
  "url": `${SEO_BASE}/ai-business-os`,
  "image": `${SEO_BASE}/hero-marketing.webp`,
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Marketing Analytics",
  "operatingSystem": "Web",
  "inLanguage": "ar",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "AED",
    "description": "ابدأ مجاناً — حلّل نشاطك الأول دون أي تكلفة",
    "availability": "https://schema.org/InStock",
  },
  "featureList": [
    "تحليل شامل للنشاط التجاري (AI Business Audit)",
    "لوحة تحكم لصحة النشاط التجاري (AI Business Dashboard)",
    "مستشار أعمال ذكي (AI Consultant)",
    "إنشاء خطط تسويق مخصصة (AI Marketing Planner)",
    "تقارير PDF احترافية (AI Reports)",
    "تحليل الموقع الإلكتروني وSEO",
    "تحليل Instagram وFacebook وTikTok وGoogle Business",
    "14 أداة تسويقية مجانية",
  ],
  "publisher": {
    "@type": "Organization",
    "name": SEO_SITE,
    "url": SEO_BASE,
  },
};

/** FAQPage schema for /ai-business-os — must mirror the on-page `faqs` array. */
export const aiBusinessOsFaqSchema = {
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ما هو AI Business OS؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI Business OS هو منصة عربية متكاملة تستخدم الذكاء الاصطناعي لتحليل نشاطك التجاري من جميع الجوانب الرقمية — السوشيال ميديا، الموقع، SEO، والأداء العام — وتقديم تقارير وخطط تطوير مخصصة.",
      },
    },
    {
      "@type": "Question",
      "name": "هل يحتاج استخدامه خبرة تقنية؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "لا على الإطلاق. المنصة مصممة لتكون بسيطة وسهلة الاستخدام لأي صاحب نشاط تجاري حتى بدون خبرة تقنية. فقط أدخل معلومات نشاطك واحصل على تقريرك فورًا.",
      },
    },
    {
      "@type": "Question",
      "name": "هل يعمل مع جميع أنواع الأنشطة التجارية؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، يعمل مع الأنشطة التجارية في جميع القطاعات — المطاعم، العيادات، المتاجر، الخدمات، العقارات، التعليم، وغيرها. الذكاء الاصطناعي يخصص التحليل لطبيعة نشاطك.",
      },
    },
    {
      "@type": "Question",
      "name": "هل التقارير قابلة للتحميل؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، يمكنك تحميل تقاريرك بصيغة PDF احترافية تحمل شعار شركتك، وجاهزة للعرض على العملاء أو الشركاء.",
      },
    },
    {
      "@type": "Question",
      "name": "هل يوجد اشتراك مجاني؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، يمكنك البدء مجانًا وتحليل نشاطك الأول دون أي تكلفة. للحصول على تقارير متقدمة وخطط تسويق شاملة، يوجد خيارات اشتراك بأسعار مناسبة.",
      },
    },
  ],
};

/** FAQPage schema for /tools — moved out of the global index.html so it only
 *  appears on the tools page. Must mirror the tools the page actually offers. */
export const toolsFaqSchema = {
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "كيف أجد الكلمات المفتاحية المناسبة لموقعي؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "استخدم مُولّد الكلمات المفتاحية المجاني في دبي فانز: أدخل كلمتك الرئيسية، وستحصل فوراً على كلمات مقترحة، أسئلة يبحث عنها الجمهور، وكلمات مفتاحية طويلة الذيل. الأداة مجانية وتعمل بالذكاء الاصطناعي.",
      },
    },
    {
      "@type": "Question",
      "name": "كيف أحسب عائد الاستثمار الإعلاني (ROI/ROAS)؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "استخدم حاسبة ROI/ROAS المجانية في دبي فانز: أدخل ميزانيتك الإعلانية وإجمالي مبيعاتك، وستحصل فوراً على نسبة ROAS وROI والربح الصافي مع تقييم لأداء حملتك.",
      },
    },
    {
      "@type": "Question",
      "name": "كيف أولّد هاشتاجات مناسبة لإنستغرام وتيك توك؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "استخدم مُولّد الهاشتاجات المجاني في دبي فانز: أدخل موضوع منشورك أو مجالك، واختر المنصة (إنستغرام أو تيك توك أو الاثنتان)، وستحصل على هاشتاجات شائعة، تخصصية، وإماراتية جاهزة للنسخ.",
      },
    },
    {
      "@type": "Question",
      "name": "كيف أفحص موقعي من ناحية السيو مجاناً؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "استخدم فاحص السيو السريع في دبي فانز: أدخل رابط موقعك وستحصل على تقرير فوري يشمل درجة الموقع، الفحوصات التقنية، والإجراءات السريعة لتحسين ظهورك في جوجل.",
      },
    },
    {
      "@type": "Question",
      "name": "ما هي خدمات دبي فانز؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "دبي فانز وكالة تسويق رقمي في الإمارات تقدم: إدارة الحملات الإعلانية على فيسبوك وإنستغرام وتيك توك وجوجل، تصميم المواقع الإلكترونية والمتاجر، تحسين محركات البحث (SEO)، الجرافيك والهوية البصرية، التصوير الاحترافي، وتزويد المتابعين.",
      },
    },
  ],
};

/* ── Service landing pages (/services/*) ────────────────────────────────── */

/** Build the canonical Service schema for a service landing page. */
function buildServiceSchema({ slug, name, description, image, serviceType, price }) {
  const url = `${SEO_BASE}/services/${slug}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    "name": name,
    "description": description,
    "url": url,
    "image": `${SEO_BASE}/${image}`,
    "serviceType": serviceType,
    "provider": { ...ORGANIZATION, "areaServed": UAE },
    "areaServed": [
      { "@type": "City", "name": "دبي" },
      { "@type": "City", "name": "أبوظبي" },
      UAE,
    ],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "AED",
      "price": price,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "AED",
        "price": price,
        "unitText": "MONTH",
      },
      "availability": "https://schema.org/InStock",
      "url": url,
    },
  };
}

/** Service schemas keyed by route slug (/services/<slug>). */
export const serviceSchemas = Object.fromEntries(
  [
    {
      slug: "meta-ads-dubai",
      name: "إعلانات فيسبوك وإنستغرام دبي — Meta Ads",
      description: "إدارة احترافية لحملات إعلانات Meta (Facebook وInstagram) للشركات والمتاجر في الإمارات العربية المتحدة.",
      image: "svc-marketing.webp",
      serviceType: "Digital Advertising — Meta Ads",
      price: "800",
    },
    {
      slug: "google-ads-uae",
      name: "إعلانات جوجل في الإمارات — Google Ads UAE",
      description: "إدارة احترافية لحملات Google Ads للشركات والمتاجر في الإمارات العربية المتحدة.",
      image: "svc-analytics.webp",
      serviceType: "Digital Advertising — Google Ads",
      price: "900",
    },
    {
      slug: "seo-dubai",
      name: "تحسين محركات البحث SEO دبي",
      description: "خدمة SEO احترافية للشركات في دبي والإمارات — تحسين ترتيب جوجل وبناء زيارات عضوية مستدامة.",
      image: "svc-consulting.webp",
      serviceType: "Search Engine Optimization",
      price: "1200",
    },
    {
      slug: "social-media-management",
      name: "إدارة السوشيال ميديا في الإمارات",
      description: "خدمة إدارة منصات التواصل الاجتماعي الاحترافية للشركات في الإمارات — إنستغرام وفيسبوك وتيك توك وسناب.",
      image: "svc-content.webp",
      serviceType: "Social Media Management",
      price: "1000",
    },
    {
      slug: "website-design-dubai",
      name: "تصميم مواقع إلكترونية دبي",
      description: "تصميم وتطوير مواقع إلكترونية ومتاجر احترافية للشركات في دبي والإمارات العربية المتحدة.",
      image: "svc-websites.webp",
      serviceType: "Web Design & Development",
      price: "1500",
    },
    {
      slug: "tiktok-ads-uae",
      name: "إعلانات تيك توك الإمارات — TikTok Ads UAE",
      description: "إدارة احترافية لحملات TikTok Ads للشركات في الإمارات العربية المتحدة.",
      image: "svc-marketing.webp",
      serviceType: "Digital Advertising — TikTok Ads",
      price: "900",
    },
    {
      slug: "snapchat-ads-dubai",
      name: "إعلانات سناب شات دبي — Snapchat Ads UAE",
      description: "إدارة احترافية لحملات Snapchat Ads للشركات في دبي والإمارات العربية المتحدة.",
      image: "svc-content.webp",
      serviceType: "Digital Advertising — Snapchat Ads",
      price: "900",
    },
    {
      slug: "linkedin-ads-uae",
      name: "إعلانات لينكدإن الإمارات — LinkedIn Ads UAE B2B",
      description: "إدارة احترافية لحملات LinkedIn Ads B2B للشركات في الإمارات العربية المتحدة.",
      image: "svc-analytics.webp",
      serviceType: "Digital Advertising — LinkedIn Ads B2B",
      price: "1100",
    },
    {
      slug: "paid-ads",
      name: "إدارة الحملات الإعلانية المدفوعة في الإمارات",
      description: "خدمة إدارة حملات Meta وGoogle وTikTok وSnapchat الاحترافية للشركات في الإمارات.",
      image: "svc-marketing.webp",
      serviceType: "Paid Advertising Management",
      price: "1500",
    },
    {
      slug: "web-design",
      name: "تصميم المواقع والمتاجر الإلكترونية في الإمارات",
      description: "خدمة تصميم وتطوير مواقع ومتاجر إلكترونية احترافية للشركات في الإمارات.",
      image: "svc-websites.webp",
      serviceType: "Web Design and Development",
      price: "3500",
    },
    {
      slug: "seo",
      name: "تحسين محركات البحث SEO في الإمارات",
      description: "خدمة SEO الشاملة لرفع ترتيب المواقع في نتائج جوجل في الإمارات العربية المتحدة.",
      image: "svc-analytics.webp",
      serviceType: "Search Engine Optimization",
      price: "2000",
    },
    {
      slug: "graphic-design",
      name: "تصميم الجرافيك والهوية البصرية في الإمارات",
      description: "خدمة تصميم جرافيك شاملة للشركات في الإمارات — شعارات وهويات بصرية وتصاميم تسويقية.",
      image: "svc-design.webp",
      serviceType: "Graphic Design",
      price: "800",
    },
    {
      slug: "photography",
      name: "التصوير التجاري الاحترافي في الإمارات",
      description: "خدمة تصوير تجاري احترافي للشركات في الإمارات — منتجات وكوربوريت وفعاليات وسوشيال ميديا.",
      image: "svc-content.webp",
      serviceType: "Commercial Photography",
      price: "800",
    },
    {
      slug: "google-my-business",
      name: "إدارة Google My Business في الإمارات",
      description: "خدمة إدارة وتحسين ملف Google My Business للشركات في الإمارات لزيادة الظهور في البحث المحلي.",
      image: "svc-consulting.webp",
      serviceType: "Google My Business Management",
      price: "800",
    },
  ].map((s) => [s.slug, buildServiceSchema(s)])
);

/* ── BlogPosting (/blog/:id) ─────────────────────────────────────────────── */

/**
 * Build the canonical BlogPosting schema for a blog article.
 * @param {{ id: string|number, title: string, excerpt: string, image?: string|null, dateISO: string, category: string }} post
 */
export function buildBlogPostingSchema(post) {
  const url = `${SEO_BASE}/blog/${post.id}`;
  return {
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image ? `${SEO_BASE}${post.image}` : `${SEO_BASE}/hero-marketing.webp`,
    "datePublished": post.dateISO,
    "dateModified": post.dateISO,
    "url": url,
    "inLanguage": "ar",
    "articleSection": post.category,
    "keywords": `${post.category}, تسويق رقمي, ${SEO_SITE}`,
    "author": { "@type": "Organization", "name": SEO_SITE, "url": SEO_BASE },
    "publisher": {
      "@type": "Organization",
      "name": SEO_SITE,
      "url": SEO_BASE,
      "logo": {
        "@type": "ImageObject",
        "url": `${SEO_BASE}/favicon.svg`,
        "width": 512,
        "height": 512,
      },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
  };
}

/**
 * Extract Q&A pairs from HTML blog content: <h2>/<h3> headings ending with
 * "؟" followed by a paragraph.
 * @param {string} content
 * @returns {{ question: string, answer: string }[]}
 */
export function extractFaqPairs(content) {
  const faqs = [];
  const regex = /<h[23][^>]*>([^<]*؟)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(content ?? "")) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs.slice(0, 6);
}

/**
 * Build BreadcrumbList schema for a blog article: الرئيسية > المقالات > العنوان
 * @param {{ id: string|number, title: string }} post
 */
export function buildBlogBreadcrumbSchema(post) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SEO_BASE },
      { "@type": "ListItem", "position": 2, "name": "المقالات", "item": `${SEO_BASE}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `${SEO_BASE}/blog/${post.id}` },
    ],
  };
}

/**
 * Full JSON-LD set for a blog article: BlogPosting + BreadcrumbList +
 * conditional FAQPage (when the content contains Q&A headings).
 * @param {{ id: string|number, title: string, excerpt: string, image?: string|null, dateISO: string, category: string, content?: string }} post
 * @returns {Record<string, unknown>[]}
 */
export function buildBlogPostSchemas(post) {
  const schemas = [buildBlogPostingSchema(post), buildBlogBreadcrumbSchema(post)];
  const faqs = extractFaqPairs(post.content ?? "");
  if (faqs.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    });
  }
  return schemas;
}
