/**
 * Single source of truth for per-route SEO meta (title / description / ogImage).
 *
 * Imported by BOTH:
 *  - React pages (via SEOHead)          — src/pages/**
 *  - the post-build prerender script    — scripts/prerender.mjs
 *
 * Plain .mjs (no TypeScript syntax) so Node can import it directly at
 * build time without transpilation. Type declarations: ./routes-meta.d.mts
 *
 * Follows the same pattern as ./schemas.mjs (JSON-LD source of truth).
 */
import { SEO_BASE, SEO_SITE } from "./schemas.mjs";

const BASE = SEO_BASE;
const SITE = SEO_SITE;

export const DEFAULT_OG_IMAGE = `${BASE}/hero-marketing.webp`;

/**
 * @typedef {Object} RouteMeta
 * @property {string} path
 * @property {string} title
 * @property {string} description
 * @property {string} [ogImage]   absolute URL; defaults to DEFAULT_OG_IMAGE
 * @property {string} [ogType]    defaults to "website"
 * @property {boolean} [noindex]
 */

/** @type {RouteMeta[]} */
export const ROUTES_META = [
  {
    path: "/",
    title: `${SITE} | وكالة التسويق الرقمي الرائدة في الإمارات`,
    description: "دبي فانز – وكالة تسويق رقمي متخصصة في الإمارات. إدارة حملات Meta وGoogle وTikTok، تصميم مواقع احترافية، تحسين محركات البحث SEO، وأدوات تسويق مجانية.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/ai-business-audit",
    title: `AI Business Audit — حلّل نشاطك التجاري مجاناً | ${SITE}`,
    description: "حلّل موقعك الإلكتروني وحسابات التواصل الاجتماعي وحملاتك التسويقية بالذكاء الاصطناعي — تقرير احترافي مجاني يكشف نقاط القوة والضعف مع خطة نمو عملية لزيادة العملاء والمبيعات.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/services",
    title: `خدمات التسويق الرقمي | ${SITE}`,
    description: "إدارة الحملات الإعلانية على Meta وGoogle وTikTok، تصميم المواقع والمتاجر، تحسين السيو، الجرافيك، التصوير الاحترافي، وإدارة السوشيال ميديا في الإمارات.",
    ogImage: `${BASE}/svc-marketing.webp`,
  },
  {
    path: "/website-templates",
    title: `نماذج مواقع ومتاجر إلكترونية | ${SITE}`,
    description: "استعرض نماذج تصاميم مواقع للشركات (عقارات، محاماة، عيادات، محاسبة) ومتاجر إلكترونية (عطور، ملابس، إكسسوارات، أحذية، منتجات رقمية) — ونصمم لك نسختك الخاصة.",
    ogImage: `${BASE}/templates/corporate.jpg`,
  },
  {
    path: "/projects",
    title: `أعمالنا ومشاريعنا | ${SITE}`,
    description: "نماذج أعمال دبي فانز: مواقع إلكترونية، متاجر، وحملات إعلانية بنتائج حقيقية لعملائنا في الإمارات — مراكز طبية، عقارات، مطاعم، ومتاجر إلكترونية.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/about",
    title: `من نحن | ${SITE} — وكالة تسويق رقمي دبي`,
    description: "دبي فانز — وكالة تسويق رقمي في الإمارات بخبرة 3+ سنوات، خدمنا 1200+ عميل، ونفّذنا 500+ حملة إعلانية ناجحة عبر الإمارات والخليج العربي.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/contact",
    title: `اتصل بنا | ${SITE}`,
    description: "تواصل مع دبي فانز للتسويق الرقمي. واتساب: +971 55 198 1564 | info@mtuaefans.sbs | السبت–الخميس 9 ص–11 م. استشارة أولى مجانية بدون التزام.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/blog",
    title: `مدونة التسويق الرقمي | ${SITE}`,
    description: "أحدث مقالات التسويق الرقمي، استراتيجيات السيو، إدارة السوشيال ميديا، والإعلانات المدفوعة في الإمارات والخليج. محتوى مجاني من خبراء دبي فانز.",
    ogImage: `${BASE}/blog-marketing.jpg`,
    ogType: "blog",
  },
  {
    path: "/tools",
    title: `أدوات تسويق رقمي مجانية | ${SITE}`,
    description: "11 أداة تسويق مجانية: مولّد كلمات مفتاحية، حاسبة ROI وROAS، مولّد هاشتاجات إنستغرام وتيك توك، فاحص سيو، مولّد رابط واتساب، ومنشئ توقيع إلكتروني.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/analyze",
    title: `تحليل مجاني بالذكاء الاصطناعي | ${SITE}`,
    description: "حلّل موقعك أو حسابات السوشيال ميديا (إنستغرام، فيسبوك، تيك توك، جوجل) مجاناً. الذكاء الاصطناعي يقدم توصيات مخصصة لزيادة مبيعاتك في الإمارات.",
    ogImage: `${BASE}/audit-banner.webp`,
  },
  {
    path: "/store",
    title: `المتجر وأسعار الباقات | ${SITE}`,
    description: "اشتري خدمات التسويق الرقمي مباشرة واطلع على باقات الأسعار: باقة نمو من 1,500 درهم، إعلانات Meta وGoogle، تصميم المواقع والمتاجر، والاستشارات — بأسعار شفافة.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/ai-business-os",
    title: `AI Business OS | أول منصة ذكاء اصطناعي عربية لإدارة الأعمال | ${SITE}`,
    description: "AI Business OS — أول منصة عربية تعتمد على الذكاء الاصطناعي لمساعدة أصحاب الأنشطة التجارية على تحليل وإدارة وتنمية أعمالهم من مكان واحد. تحليل الموقع، SEO، إنستغرام، فيسبوك، تيك توك، وأكثر.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/terms",
    title: `شروط الاستخدام | ${SITE}`,
    description: "شروط وأحكام استخدام موقع وخدمات دبي فانز للتسويق الرقمي في الإمارات — هوية الشركة، العقود، الملكية الفكرية، والقانون المطبّق.",
    noindex: true,
  },
  {
    path: "/privacy",
    title: `سياسة الخصوصية | ${SITE}`,
    description: "سياسة الخصوصية لموقع دبي فانز. تعرف على كيفية جمع بياناتك واستخدامها وحمايتها وفق معايير الخصوصية المعتمدة في الإمارات.",
    noindex: true,
  },
  {
    path: "/campaign-policy",
    title: `سياسة الحملات الإعلانية | ${SITE}`,
    description: "سياسة إدارة الحملات الإعلانية في دبي فانز: الميزانيات، الصلاحيات، مسؤولية الأداء، وآليات الإبلاغ على Meta وGoogle وTikTok.",
    noindex: true,
  },
  {
    path: "/refund-policy",
    title: `سياسة الاسترجاع | ${SITE}`,
    description: "سياسة الاسترجاع والاسترداد لدى دبي فانز: الحالات المؤهلة للاسترجاع، إجراءات طلب الاسترداد، والالتزامات المتبادلة بين الوكالة والعميل.",
    noindex: true,
  },
  {
    path: "/cookie-policy",
    title: `سياسة ملفات تعريف الارتباط | ${SITE}`,
    description: "تعرّف على كيفية استخدام دبي فانز لملفات تعريف الارتباط وكيف يمكنك إدارتها أو حذفها أو سحب موافقتك في أي وقت.",
    noindex: true,
  },
  {
    path: "/sitemap",
    title: `خريطة الموقع | ${SITE}`,
    description: "جميع صفحات موقع دبي فانز: الخدمات، الأسعار، المدونة، الأدوات المجانية، من نحن، واتصل بنا — كل الروابط في مكان واحد.",
    noindex: true,
  },

  /* ── Service landing pages (keyword-specific) ──────────────────────── */
  {
    path: "/services/meta-ads-dubai",
    title: `إعلانات فيسبوك وإنستغرام دبي | Meta Ads UAE | ${SITE}`,
    description: "إعلانات Meta المحترفة في دبي والإمارات — Facebook وInstagram Ads بنتائج مضمونة. نُدير حملاتك الإعلانية من الإعداد للتحسين المستمر. استشارة مجانية الآن.",
    ogImage: `${BASE}/svc-marketing.webp`,
  },
  {
    path: "/services/google-ads-uae",
    title: `إعلانات جوجل الإمارات | Google Ads UAE | ${SITE}`,
    description: "إعلانات جوجل Google Ads في الإمارات — استهداف العملاء في لحظة البحث. إدارة حملات Search وDisplay وShopping بنتائج مقاسة. استشارة مجانية.",
    ogImage: `${BASE}/svc-analytics.webp`,
  },
  {
    path: "/services/seo-dubai",
    title: `تحسين محركات البحث SEO دبي | ظهور جوجل مضمون | ${SITE}`,
    description: "خدمة SEO احترافية في دبي والإمارات — تحسين ترتيب موقعك في جوجل بكلمات مفتاحية حقيقية وزيارات مستدامة. تحليل مجاني الآن.",
    ogImage: `${BASE}/svc-consulting.webp`,
  },
  {
    path: "/services/social-media-management",
    title: `إدارة السوشيال ميديا الإمارات | Social Media Management UAE | ${SITE}`,
    description: "إدارة السوشيال ميديا الاحترافية في الإمارات — إنستغرام وفيسبوك وتيك توك وسناب. محتوى يومي، تفاعل حقيقي، ونمو مستدام. استشارة مجانية.",
    ogImage: `${BASE}/svc-content.webp`,
  },
  {
    path: "/services/website-design-dubai",
    title: `تصميم مواقع دبي | تطوير مواقع الإمارات | ${SITE}`,
    description: "تصميم وتطوير مواقع إلكترونية احترافية في دبي والإمارات — مواقع سريعة، متوافقة مع SEO، وعالية التحويل. استشارة مجانية الآن.",
    ogImage: `${BASE}/svc-websites.webp`,
  },
  {
    path: "/services/tiktok-ads-uae",
    title: `إعلانات تيك توك الإمارات | TikTok Ads UAE | ${SITE}`,
    description: "إعلانات TikTok Ads احترافية في الإمارات — استهداف جيل Z والمليانيال بمحتوى فيديو جذاب وحملات مدفوعة بنتائج مقاسة. استشارة مجانية الآن.",
    ogImage: `${BASE}/svc-marketing.webp`,
  },
  {
    path: "/services/snapchat-ads-dubai",
    title: `إعلانات سناب شات دبي | Snapchat Ads UAE | ${SITE}`,
    description: "إعلانات Snapchat Ads في دبي والإمارات — الإمارات من أعلى دول العالم في استخدام سناب. استهدف جمهورك بـ Story وSpotlight وAR Lenses. استشارة مجانية.",
    ogImage: `${BASE}/svc-content.webp`,
  },
  {
    path: "/services/linkedin-ads-uae",
    title: `إعلانات لينكدإن الإمارات | LinkedIn Ads UAE B2B | ${SITE}`,
    description: "إعلانات LinkedIn Ads B2B في الإمارات — استهداف صانعي القرار والمديرين والمحترفين بدقة. حملات Sponsored Content وMessage Ads وLead Gen. استشارة مجانية.",
    ogImage: `${BASE}/svc-analytics.webp`,
  },

  /* ── Canonical service pages ────────────────────────────────────────── */
  {
    path: "/services/paid-ads",
    title: `إدارة الحملات الإعلانية المدفوعة الإمارات | Paid Ads UAE | ${SITE}`,
    description: "إدارة حملات إعلانية مدفوعة محترفة في الإمارات — Meta وGoogle وTikTok وSnapchat. استهداف دقيق ونتائج قابلة للقياس. استشارة مجانية الآن.",
    ogImage: `${BASE}/svc-marketing.webp`,
  },
  {
    path: "/services/web-design",
    title: `تصميم المواقع والمتاجر الإلكترونية الإمارات | Web Design UAE | ${SITE}`,
    description: "تصميم مواقع ومتاجر إلكترونية احترافية في الإمارات — سريعة وجذابة ومحسّنة لمحركات البحث. نُسلّم في 14 يوماً. احصل على عرض سعر مجاني.",
    ogImage: `${BASE}/svc-websites.webp`,
  },
  {
    path: "/services/seo",
    title: `تحسين محركات البحث SEO الإمارات | SEO Services UAE | ${SITE}`,
    description: "خدمات تحسين محركات البحث SEO الاحترافية في الإمارات — تصدَّر نتائج جوجل للكلمات الأكثر ربحية في سوقك. تقرير مجاني خلال 24 ساعة.",
    ogImage: `${BASE}/svc-analytics.webp`,
  },
  {
    path: "/services/graphic-design",
    title: `تصميم الجرافيك والهوية البصرية الإمارات | Graphic Design UAE | ${SITE}`,
    description: "تصميم جرافيك وهوية بصرية احترافية في الإمارات — شعارات ومطبوعات وتصاميم سوشيال ميديا وحزم هوية متكاملة. عروض سعر مجانية خلال 24 ساعة.",
    ogImage: `${BASE}/svc-design.webp`,
  },
  {
    path: "/services/photography",
    title: `التصوير التجاري الاحترافي الإمارات | Commercial Photography UAE | ${SITE}`,
    description: "تصوير تجاري احترافي في الإمارات — منتجات وكوربوريت وسوشيال ميديا وفعاليات. صور عالية الجودة تُسلَّم خلال 48 ساعة.",
    ogImage: `${BASE}/svc-content.webp`,
  },
  {
    path: "/services/google-my-business",
    title: `إدارة Google My Business الإمارات | Local SEO UAE | ${SITE}`,
    description: "إدارة Google My Business الاحترافية في الإمارات — تحسين الملف التجاري وزيادة الظهور في البحث المحلي وخرائط جوجل. اجذب عملاء من محيطك الجغرافي.",
    ogImage: `${BASE}/svc-consulting.webp`,
  },

  /* ── Project / case-study pages ─────────────────────────────────────── */
  {
    path: "/projects/clinic-os",
    title: `Clinic OS — نظام ذكي لإدارة العيادات | ${SITE}`,
    description: "Clinic OS نظام متكامل لإدارة العيادات مدعوم بالذكاء الاصطناعي — إدخال صوتي، واتساب، روشتة ذكية، ملف المريض، الحجز، الحسابات، والمخزون.",
    ogImage: `${BASE}/portfolio/clinic-os/dashboard.jpg`,
  },
  {
    path: "/projects/amlak-os",
    title: `AMLAK OS — نظام SaaS لإدارة العقارات والأملاك | ${SITE}`,
    description: "AMLAK OS نظام متكامل لإدارة العقارات والأملاك مبني للعالم العربي — إدارة العقود والمستأجرين والمدفوعات والصيانة والقضايا القانونية من مكان واحد.",
    ogImage: `${BASE}/portfolio/aqarlines-website.webp`,
  },
  {
    path: "/projects/sameday-dental",
    title: `دراسة حالة: زراعة الأسنان في نفس اليوم دبي | ${SITE}`,
    description: "كيف حققنا زيادة 80% في الاستفسارات لأول عيادة زراعة أسنان في نفس اليوم بالشرق الأوسط — تصميم موقع، SEO، وإعلانات رقمية.",
    ogImage: `${BASE}/sameday-dental.webp`,
  },
  {
    path: "/projects/health-factory",
    title: `دراسة حالة: مصنع صحي — ROI 7.6× من Google Ads | ${SITE}`,
    description: "كيف حققنا 100 عميل جديد وعائد استثمار 7.6× لمصنع صحي لبرامج الغذاء الصحي — Google Ads وFacebook Ads وSEO.",
    ogImage: `${BASE}/health-factory-website.webp`,
  },
  {
    path: "/projects/media-coverage",
    title: `التغطية الإعلامية | ${SITE} — حضور عالمي موثّق`,
    description: "دبي فانز في أبرز الصحف العالمية: LA Times، Gulf News، Khaleej Times، New York Times. شريك معتمد من Meta وLinkedIn وPinterest.",
    ogImage: `${BASE}/media-coverage.webp`,
  },

  /* ── Demo booking ───────────────────────────────────────────────────── */
  {
    path: "/book-demo",
    title: `احجز استشارة مجانية | ${SITE}`,
    description: "احجز استشارة مجانية مع خبراء دبي فانز — مواقع، تطبيقات، Clinic OS، AMLAK OS، AI Business OS، وحملات إعلانية. نختار معاً الحل الأنسب لمشروعك.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },

  /* ── Courses & FAQ ──────────────────────────────────────────────────── */
  {
    path: "/courses",
    title: `كورسات التسويق الرقمي | ${SITE} — تدريب احترافي بالذكاء الاصطناعي`,
    description: "أتقن التسويق الرقمي وميديا باينج والتجارة الإلكترونية بالذكاء الاصطناعي. ٣ برامج احترافية مع شهادات ومشاريع حقيقية ودعم ٦ أشهر. سجّل الآن.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
  {
    path: "/faq",
    title: `الأسئلة الشائعة | ${SITE} — التسويق الرقمي في الإمارات`,
    description: "إجابات على أكثر الأسئلة شيوعاً حول خدمات التسويق الرقمي، SEO، إعلانات Google وميتا، تصميم المواقع في دبي والإمارات.",
    ogImage: `${BASE}/hero-marketing.webp`,
  },
];

/**
 * Get the SEO meta for a route path. Throws when no entry exists so that a
 * missing route fails loudly at build/dev time instead of silently shipping
 * stale or empty meta.
 * @param {string} path
 * @returns {RouteMeta}
 */
export function getRouteMeta(path) {
  const meta = ROUTES_META.find((r) => r.path === path);
  if (!meta) throw new Error(`No SEO route meta defined for path: ${path}`);
  return meta;
}
