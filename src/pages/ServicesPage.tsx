import { motion } from "framer-motion";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, BarChart2, Monitor, Megaphone, PenTool, TrendingUp, Lightbulb, ExternalLink } from "lucide-react";
import { WhyUs } from "@/components/WhyUs";
import { GoalsSection } from "@/components/GoalsSection";

/** Canonical service pages */
const canonicalServices = [
  {
    slug: "paid-ads",
    title: "إدارة الإعلانات المدفوعة",
    subtitle: "Paid Ads Management",
    color: "#CC0000",
    bg: "#CC000015",
  },
  {
    slug: "seo",
    title: "تحسين محركات البحث SEO",
    subtitle: "SEO Services UAE",
    color: "#10B981",
    bg: "#10B98115",
  },
  {
    slug: "web-design",
    title: "تصميم وتطوير المواقع",
    subtitle: "Web Design & Development",
    color: "#6366F1",
    bg: "#6366F115",
  },
  {
    slug: "graphic-design",
    title: "تصميم الجرافيك والهوية البصرية",
    subtitle: "Graphic Design UAE",
    color: "#F59E0B",
    bg: "#F59E0B15",
  },
  {
    slug: "photography",
    title: "التصوير الاحترافي",
    subtitle: "Professional Photography",
    color: "#8B5CF6",
    bg: "#8B5CF615",
  },
  {
    slug: "google-my-business",
    title: "إدارة جوجل ماي بيزنس",
    subtitle: "Google My Business UAE",
    color: "#4285F4",
    bg: "#4285F415",
  },
];

/** Keyword-specific service landing pages */
const specializedServices = [
  {
    slug: "meta-ads-dubai",
    title: "إعلانات فيسبوك وإنستغرام دبي",
    subtitle: "Meta Ads UAE",
    color: "#1877F2",
    bg: "#1877F215",
  },
  {
    slug: "google-ads-uae",
    title: "إعلانات جوجل الإمارات",
    subtitle: "Google Ads UAE",
    color: "#EA4335",
    bg: "#EA433515",
  },
  {
    slug: "seo-dubai",
    title: "تحسين محركات البحث دبي",
    subtitle: "SEO Dubai",
    color: "#10B981",
    bg: "#10B98115",
  },
  {
    slug: "social-media-management",
    title: "إدارة السوشيال ميديا",
    subtitle: "Social Media UAE",
    color: "#F0B429",
    bg: "#F0B42915",
  },
  {
    slug: "website-design-dubai",
    title: "تصميم مواقع دبي",
    subtitle: "Web Design Dubai",
    color: "#8B5CF6",
    bg: "#8B5CF615",
  },
  {
    slug: "tiktok-ads-uae",
    title: "إعلانات تيك توك الإمارات",
    subtitle: "TikTok Ads UAE",
    color: "#010101",
    bg: "#01010112",
  },
  {
    slug: "snapchat-ads-dubai",
    title: "إعلانات سناب شات دبي",
    subtitle: "Snapchat Ads Dubai",
    color: "#E6BE00",
    bg: "#FFFC0015",
  },
  {
    slug: "linkedin-ads-uae",
    title: "إعلانات لينكدإن B2B",
    subtitle: "LinkedIn Ads UAE",
    color: "#0A66C2",
    bg: "#0A66C215",
  },
];

/**
 * Maps each general service to its closest specialized/canonical service page.
 * Services without a matching dedicated page fall back to their inquiry page.
 */
const serviceCanonicalUrls: Record<string, string> = {
  "content-management": "https://mtuaefans.com/services/social-media-management",
  "design-video":       "https://mtuaefans.com/services/graphic-design",
  "websites":           "https://mtuaefans.com/services/web-design",
  "digital-marketing":  "https://mtuaefans.com/services/paid-ads",
  // "analytics" and "consulting" have no dedicated pages → inquiry fallback
};

const serviceImages: Record<string, string> = {
  "content-management": "/svc-content.webp",
  "analytics":          "/svc-analytics.webp",
  "design-video":       "/svc-design.webp",
  "websites":           "/svc-websites.webp",
  "digital-marketing":  "/svc-marketing.webp",
  "consulting":         "/svc-consulting.webp",
};

const services = [
  {
    id: "content-management",
    icon: PenTool,
    color: "#CC0000",
    badge: "إدارة المحتوى",
    title: "إدارة المحتوى الرقمي",
    subtitle: "حوّل المحتوى إلى عملاء",
    description:
      "نحوّل حساباتك إلى منصات تواصل فعّالة من خلال محتوى منظم، رسائل تسويقية واضحة، وجدولة احترافية تعزز ثقة الجمهور وتزيد فرص التفاعل والطلبات.",
    features: ["جدولة محتوى احترافي شهرياً", "كتابة رسائل تسويقية مقنعة", "إدارة التعليقات والردود", "تحليل أداء المنشورات", "استراتيجية محتوى مخصصة"],
    cta: "حوّل المحتوى إلى عملاء",
  },
  {
    id: "analytics",
    icon: BarChart2,
    color: "#F0B429",
    badge: "تحليلات",
    title: "تحليلات البيانات والتقارير",
    subtitle: "اكتشف أين تضيع ميزانية التسويق",
    description:
      "نساعدك على فهم أرقامك بوضوح من خلال تقارير أداء، قراءة مصادر العملاء، تحليل الحملات، واستخراج قرارات عملية لتحسين العائد من التسويق.",
    features: ["تقارير أداء شهرية مفصّلة", "تحليل مصادر العملاء المحتملين", "قراءة بيانات الإعلانات", "مؤشرات KPI واضحة", "توصيات قرارات عملية"],
    cta: "اكتشف أين تضيع ميزانية التسويق",
  },
  {
    id: "design-video",
    icon: Monitor,
    color: "#CC0000",
    badge: "تصميم وإنتاج",
    title: "تصميم الجرافيك وإنتاج الفيديو",
    subtitle: "ارفع قيمة ظهورك",
    description:
      "نصمم محتوى بصرياً وفيديوهات احترافية تعكس قيمة علامتك التجارية، وتجعل ظهورك أكثر قوة وجاذبية على السوشيال ميديا والإعلانات.",
    features: ["تصميم هوية بصرية متكاملة", "إنتاج فيديوهات Reels احترافية", "موشن جرافيك وإنفوغرافيك", "تصاميم إعلانية جاذبة", "صور منتجات احترافية"],
    cta: "ارفع قيمة ظهورك",
  },
  {
    id: "websites",
    icon: Monitor,
    color: "#F0B429",
    badge: "مواقع إلكترونية",
    title: "تطوير وتصميم المواقع الإلكترونية",
    subtitle: "حوّل موقعك إلى عملاء",
    description:
      "نبني مواقع إلكترونية وصفحات هبوط سريعة ومقنعة، مصممة لتحويل الزوار إلى عملاء من خلال تجربة مستخدم واضحة وربط ذكي مع قنوات التواصل والتتبع.",
    features: ["مواقع سريعة وآمنة (SSL)", "صفحات هبوط عالية التحويل", "ربط مع Meta Pixel وجوجل", "تحسين SEO من البداية", "لوحة تحكم سهلة"],
    cta: "حوّل موقعك إلى عملاء",
  },
  {
    id: "digital-marketing",
    icon: TrendingUp,
    color: "#CC0000",
    badge: "تسويق رقمي",
    title: "التسويق الرقمي الشامل",
    subtitle: "ابدأ منظومة النمو",
    description:
      "نصمم منظومة تسويق متكاملة تجمع بين الإعلانات، المحتوى، SEO، صفحات الهبوط، التتبع، والتحسين المستمر لتحقيق نمو حقيقي لا مجرد ظهور.",
    features: ["إعلانات Meta + Google متكاملة", "SEO وتحسين محركات البحث", "إدارة كاملة لقمع المبيعات", "تتبع التحويلات بدقة", "تحسين مستمر للأداء"],
    cta: "ابدأ منظومة النمو",
  },
  {
    id: "consulting",
    icon: Lightbulb,
    color: "#F0B429",
    badge: "استشارات",
    title: "الاستشارات التسويقية",
    subtitle: "احجز قرار نمو أفضل",
    description:
      "نراجع وضعك التسويقي، نحدد نقاط الضعف، ونقترح لك قرارات نمو عملية تساعدك على تحسين الحملات، رفع جودة العملاء، وزيادة فرص البيع.",
    features: ["مراجعة استراتيجية شاملة", "تحديد نقاط الضعف التسويقية", "خطة عمل مخصصة", "جلسة استشارية مجانية", "متابعة ما بعد الاستشارة"],
    cta: "احجز قرار نمو أفضل",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-white">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/services"
        keywords="خدمات تسويق رقمي دبي, إدارة حملات إعلانية, تصميم مواقع الإمارات, SEO, جرافيك ديزاين دبي, استشارات تسويقية"
        ogImage={PAGE_META.ogImage}
        jsonLd={{
          "@type": "ItemList",
          "name": "خدمات دبي فانز للتسويق الرقمي",
          "description": "خدمات التسويق الرقمي المتكاملة في الإمارات العربية المتحدة",
          "url": "https://mtuaefans.com/services",
          "numberOfItems": services.length,
          "itemListElement": services.map((s, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "Service",
              "name": s.title,
              "description": s.description,
              "url": serviceCanonicalUrls[s.id] ?? `https://mtuaefans.com/service-inquiry/${s.id}`,
              "image": `https://mtuaefans.com${serviceImages[s.id] ?? "/hero-marketing.webp"}`,
              "serviceType": s.badge,
              "provider": {
                "@type": "Organization",
                "name": "دبي فانز",
                "url": "https://mtuaefans.com",
                "telephone": "+971551981564"
              },
              "areaServed": {
                "@type": "Country",
                "name": "الإمارات العربية المتحدة"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "url": serviceCanonicalUrls[s.id] ?? `https://mtuaefans.com/service-inquiry/${s.id}`
              }
            }
          }))
        }}
      />
      <Navbar />

      {/* Hero */}
      <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000]/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F0B429]/4 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-5">
              خدماتنا المتميزة
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#111827] mb-5 leading-tight">
              خدماتنا <span className="gradient-text">الاحترافية</span>
            </h1>
            <p className="text-[#9CA3AF] text-lg leading-relaxed">
              نحول رؤيتك إلى واقع ملموس من خلال استراتيجيات تسويقية وتقنية متكاملة.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Us */}
      <WhyUs />

      {/* Services list */}
      <div className="container mx-auto px-6 py-20 space-y-12">
        {services.map((s, i) => {
          const Icon = s.icon;
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`grid md:grid-cols-2 gap-10 items-center ${!isEven ? "md:flex-row-reverse" : ""}`}
            >
              {/* Visual */}
              <div className={`${!isEven ? "md:order-2" : ""}`}>
                <div className="rounded-2xl overflow-hidden aspect-video relative shadow-lg border border-[#E5E7EB]">
                  <img
                    src={serviceImages[s.id]}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-xl"
                    style={{ backgroundColor: s.color }}
                  >
                    <Icon size={22} color="white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${!isEven ? "md:order-1" : ""}`}>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ backgroundColor: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}
                >
                  {s.badge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">{s.title}</h2>
                <p className="text-[#9CA3AF] leading-relaxed mb-6">{s.description}</p>

                <ul className="space-y-2 mb-8">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={`/service-inquiry/${s.id}`}>
                  <button
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ backgroundColor: s.color, boxShadow: `0 4px 20px ${s.color}30` }}
                  >
                    {s.cta}
                    <ArrowLeft size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Canonical service pages ───────────────────────────────────── */}
      <div className="bg-white border-t border-[#E5E7EB] py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
              خدماتنا الرئيسية
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
              اكتشف كل خدمة بالتفصيل
            </h2>
            <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
              صفحات شاملة لكل خدمة تحتوي على الأسعار، الأسئلة الشائعة، والنتائج المتوقعة
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {canonicalServices.map((svc, i) => (
              <motion.div
                key={svc.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={`/services/${svc.slug}`}>
                  <div
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{ background: svc.bg }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: svc.color }}
                    >
                      <ExternalLink size={18} color="white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-[#111827] text-sm leading-snug group-hover:text-[#CC0000] transition-colors truncate">
                        {svc.title}
                      </div>
                      <div className="text-[#9CA3AF] text-xs mt-0.5">{svc.subtitle}</div>
                    </div>
                    <ArrowLeft size={15} className="text-[#D1D5DB] group-hover:text-[#CC0000] transition-colors shrink-0 me-auto" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Specialized landing pages ─────────────────────────────────── */}
      <div className="bg-[#F3F4F6] border-t border-[#E5E7EB] py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
              صفحات تفصيلية
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
              تعمّق في الخدمة التي تحتاجها
            </h2>
            <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
              صفحات مخصصة لكل خدمة تحتوي على تفاصيل الأسعار، الأسئلة الشائعة، والنتائج المتوقعة
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specializedServices.map((svc, i) => (
              <motion.div
                key={svc.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={`/services/${svc.slug}`}>
                  <div
                    className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{ ["--hover-shadow" as string]: `0 8px 24px ${svc.color}25` }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: svc.bg, border: `1px solid ${svc.color}30` }}
                    >
                      <ExternalLink size={18} style={{ color: svc.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-[#111827] text-sm leading-snug group-hover:text-[#CC0000] transition-colors truncate">
                        {svc.title}
                      </div>
                      <div className="text-[#9CA3AF] text-xs mt-0.5">{svc.subtitle}</div>
                    </div>
                    <ArrowLeft size={15} className="text-[#D1D5DB] group-hover:text-[#CC0000] transition-colors shrink-0 me-auto" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <GoalsSection />
      <Footer />
    </div>
  );
}

const PAGE_META = getRouteMeta("/services");
