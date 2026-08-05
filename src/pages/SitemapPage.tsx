import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/sitemap");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Globe, BookOpen, Wrench, BarChart2, Home, FileText, Shield, Megaphone } from "lucide-react";

const sitemapData = [
  {
    category: "الصفحات الرئيسية",
    icon: Home,
    color: "#CC0000",
    pages: [
      { title: "الصفحة الرئيسية", url: "/", desc: "الصفحة الرئيسية لدبي فانز" },
      { title: "خدماتنا", url: "/services", desc: "جميع خدمات التسويق الرقمي" },
      { title: "أعمالنا", url: "/#portfolio", desc: "دراسات الحالة ومحفظة الأعمال" },
      { title: "الأسعار", url: "/store#pricing", desc: "باقات وخطط الأسعار" },
      { title: "من نحن", url: "/about", desc: "رؤيتنا وفريقنا ورحلتنا" },
      { title: "مشاريعنا", url: "/projects", desc: "منظومة مشاريعنا الرقمية" },
      { title: "اتصل بنا", url: "/#contact", desc: "التواصل مع فريقنا" },
    ],
  },
  {
    category: "صفحات خدمة متخصصة",
    icon: Megaphone,
    color: "#CC0000",
    pages: [
      { title: "إعلانات فيسبوك وإنستغرام دبي", url: "/services/meta-ads-dubai", desc: "Meta Ads — Facebook & Instagram UAE" },
      { title: "إعلانات جوجل الإمارات", url: "/services/google-ads-uae", desc: "Google Ads UAE — Search & Display" },
      { title: "تحسين محركات البحث دبي", url: "/services/seo-dubai", desc: "SEO احترافي — ظهور جوجل مضمون" },
      { title: "إدارة السوشيال ميديا الإمارات", url: "/services/social-media-management", desc: "إنستغرام، فيسبوك، تيك توك، سناب" },
      { title: "تصميم مواقع دبي", url: "/services/website-design-dubai", desc: "مواقع سريعة ومتوافقة مع SEO" },
      { title: "إعلانات تيك توك الإمارات", url: "/services/tiktok-ads-uae", desc: "TikTok Ads UAE — جيل Z والمليانيال" },
      { title: "إعلانات سناب شات دبي", url: "/services/snapchat-ads-dubai", desc: "Snapchat Ads — أعلى نسبة اختراق في الإمارات" },
      { title: "إعلانات لينكدإن الإمارات", url: "/services/linkedin-ads-uae", desc: "LinkedIn Ads B2B — صانعو القرار والمحترفون" },
      { title: "إدارة الحملات الإعلانية المدفوعة", url: "/services/paid-ads", desc: "Meta وGoogle وTikTok وSnapchat — ROI قابل للقياس" },
      { title: "تصميم المواقع والمتاجر الإلكترونية", url: "/services/web-design", desc: "مواقع احترافية مُسلَّمة في 14 يوم عمل" },
      { title: "تحسين محركات البحث SEO الإمارات", url: "/services/seo", desc: "SEO شامل — زيارات عضوية مستدامة" },
      { title: "تصميم الجرافيك والهوية البصرية", url: "/services/graphic-design", desc: "شعارات وهويات بصرية وتصاميم تسويقية" },
      { title: "التصوير التجاري الاحترافي", url: "/services/photography", desc: "تصوير منتجات وكوربوريت وسوشيال ميديا" },
      { title: "إدارة Google My Business الإمارات", url: "/services/google-my-business", desc: "Local SEO وخرائط جوجل — عملاء من محيطك" },
    ],
  },
  {
    category: "المدونة",
    icon: BookOpen,
    color: "#F0B429",
    pages: [
      { title: "جميع المقالات", url: "/blog", desc: "مقالات التسويق الرقمي" },
      { title: "أفضل أدوات التسويق الرقمي 2025", url: "/blog/best-digital-marketing-tools-2025-complete-guide", desc: "دليل شامل لأقوى الأدوات" },
      { title: "كيف تختار وكالة تسويق في الإمارات", url: "/blog/how-to-choose-digital-marketing-agency-uae", desc: "دليل اختيار الوكالة المناسبة" },
      { title: "أفضل منصات الإعلانات المدفوعة 2025", url: "/blog/best-paid-ads-platforms-2025-facebook-vs-google", desc: "فيسبوك أم جوجل؟" },
      { title: "زيادة متابعين إنستغرام 2025", url: "/blog/how-to-increase-instagram-followers-organically-2025", desc: "استراتيجيات نمو حقيقي" },
      { title: "دليل تصميم الهوية البصرية", url: "/blog/brand-identity-design-guide-startups-gcc", desc: "للشركات الناشئة في الخليج" },
      { title: "موقع إلكتروني للمطاعم في دبي", url: "/blog/why-dubai-restaurant-needs-professional-website", desc: "أهمية الموقع للمطاعم" },
      { title: "تيك توك للأعمال", url: "/blog/tiktok-for-business-60-seconds-to-sales", desc: "60 ثانية إلى مبيعات" },
    ],
  },
  {
    category: "الأدوات المجانية",
    icon: Wrench,
    color: "#10B981",
    pages: [
      { title: "جميع الأدوات", url: "/tools", desc: "11 أداة تسويق مجانية" },
      { title: "أدوات السيو", url: "/tools?tab=seo", desc: "مولد كلمات مفتاحية، فاحص سيو، مولد ميتا" },
      { title: "حاسبات التسويق", url: "/tools?tab=calc", desc: "ROI، ROAS، CAC، CLV، معدل التحويل" },
      { title: "أدوات المحتوى", url: "/tools?tab=content", desc: "أفكار محتوى، مقاسات صور، هاشتاجات" },
      { title: "أدوات التواصل", url: "/tools?tab=comm", desc: "رابط واتساب، توقيع البريد الإلكتروني" },
    ],
  },
  {
    category: "تحليل بالذكاء الاصطناعي",
    icon: BarChart2,
    color: "#06B6D4",
    pages: [
      { title: "تحليل مشروعك مجاناً", url: "/analyze", desc: "تحليل موقعك أو حساباتك بالذكاء الاصطناعي" },
    ],
  },
  {
    category: "الصفحات القانونية",
    icon: Shield,
    color: "#9CA3AF",
    pages: [
      { title: "سياسة الخصوصية", url: "/privacy", desc: "كيف نحمي بياناتك الشخصية" },
      { title: "سياسة الحملات الإعلانية", url: "/campaign-policy", desc: "شروط إدارة الحملات والميزانيات" },
      { title: "سياسة الاسترجاع والإلغاء", url: "/refund-policy", desc: "حقوقك وإجراءات الاسترجاع" },
      { title: "خريطة الموقع", url: "/sitemap", desc: "جميع صفحات الموقع" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-white font-sans">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/sitemap"
        noindex={PAGE_META.noindex}
      />
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-14 mb-12">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
                التنقل الكامل
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">خريطة الموقع</h1>
              <p className="text-[#9CA3AF] text-lg">
                جميع صفحات موقع دبي فانز في مكان واحد
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {sitemapData.map((section, si) => (
              <motion.div
                key={si}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E5E7EB]">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${section.color}15`, border: `1px solid ${section.color}30` }}
                  >
                    <section.icon size={18} style={{ color: section.color }} />
                  </div>
                  <h2 className="text-[#111827] font-black text-base">{section.category}</h2>
                </div>

                <ul className="space-y-2">
                  {section.pages.map((page, pi) => (
                    <li key={pi}>
                      <Link
                        href={page.url}
                        className="flex items-start gap-2.5 group p-2 rounded-xl hover:bg-[#E5E7EB]/50 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: section.color }} />
                        <div>
                          <div className="text-[#374151] text-sm font-semibold group-hover:text-[#CC0000] transition-colors">
                            {page.title}
                          </div>
                          <div className="text-[#9CA3AF] text-xs mt-0.5">{page.desc}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
