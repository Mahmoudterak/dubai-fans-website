import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { Pricing } from "@/components/Pricing";
import { FaWhatsapp } from "react-icons/fa";
import { Search, ShoppingCart, TrendingUp, Globe, Eye, Megaphone, Star } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "growth", label: "باقات النمو والتسويق" },
  { id: "websites", label: "برمجة وتطوير المواقع" },
  { id: "ads", label: "أرصدة إعلانات" },
  { id: "content", label: "الهوية البصرية والإنتاجي" },
  { id: "ecommerce", label: "التجارة الإلكترونية" },
];

const catImages: Record<string, string> = {
  growth:    "/cat-growth.webp",
  ads:       "/cat-ads.webp",
  websites:  "/svc-websites.webp",
  content:   "/cat-content.webp",
  ecommerce: "/cat-ecommerce.webp",
};

const products = [
  {
    id: 1,
    cat: "growth",
    badge: "LAUNCH PLAN",
    badgeColor: "#CC0000",
    name: "خطة الإنطلاق | Launch Plan",
    price: 1050,
    oldPrice: 1750,
    monthly: true,
    features: [
      "إدارة حسابين على السوشيال الاجتماعي (فيسبوك أو إنستغرام)",
      "12 منشوراً احترافياً شهرياً",
      "2 تصاميم Motion Graphics بسيطة",
      "كتابة المحتوى التسويقي",
      "إدارة الحملات الإعلانية الأساسية على Meta",
      "تصميم الهوية البصرية الأساسية",
    ],
    popular: false,
  },
  {
    id: 2,
    cat: "growth",
    badge: "HARVEST PLAN",
    badgeColor: "#CC0000",
    name: "إثبيت النجاح | Harvest Plan",
    price: 2100,
    oldPrice: 3300,
    monthly: true,
    features: [
      "قيمة قابلة للاستيعاب على VАТ",
      "إدارة المتاجر الإلكترونية ومنصات الاستثمار",
      "دعم دوري بمدة شهرين",
      "زيادة وتتبع نمو المبيعات",
      "تقارير وتحليلات شهرية",
      "إدارة الردود والتعليقات",
    ],
    popular: true,
  },
  {
    id: 3,
    cat: "growth",
    badge: "BUSINESS PLAN",
    badgeColor: "#AA0000",
    name: "شريك نجاحك الدائم | Business Plan",
    price: 4200,
    oldPrice: 6200,
    monthly: true,
    features: [
      "شامل كل ما في خطة الإنطلاق والحصاد",
      "VАТ شامل",
      "إدارة التواصل الاجتماعي المتقدم",
      "Business Bio كامل",
      "إستراتيجية متكاملة لإدارة العملاء",
      "Growth Plan SEO",
      "استشارة 4 ساعات خطة تسويقية مجانية",
      "دعم 24 ساعة × 7 أيام",
      "Dynamic Business Website",
      "+Smart Commerce Store + Market Leader SEO",
      "Marketing Automation AI Content Creation",
      "دعم واتساب 2 مع Tornado Customer Care",
    ],
    popular: false,
  },
  {
    id: 4,
    cat: "growth",
    badge: "PRO PLAN",
    badgeColor: "#B00000",
    name: "أفكر لتكسب | Pro Plan",
    price: 8400,
    oldPrice: 11200,
    monthly: true,
    features: [
      "إدارة 9 منصات تواصل (إنستغرام + تيك توك + يوتيوب + فيسبوك + بينتريست + سناب + Pinterest + TikShorts + X)",
      "16 فيديو Reels / Tikتوك + 4 أخرى",
      "3 تصاميم Reels/Tikتوك",
      "منهجية خاصة للتحسين التسويقي",
      "Meta Ads + TikTok Ads + Google Ads",
      "Google Business Profile",
      "SEO كامل 8-نقاط + Dynamic Business Website",
      "40 Landing Pages تحسين مواقع",
      "Marketing Automation AI Content Creation",
      "دعم واتساب 2 مع Customer Care - Meta",
    ],
    popular: false,
  },
  {
    id: 5,
    cat: "growth",
    badge: "MARKET STORM",
    badgeColor: "#CC0000",
    name: "إعصار السوق | Market Storm",
    price: 16800,
    oldPrice: 21200,
    monthly: true,
    features: [
      "إعصار السوق في كل المنصات",
      "إدارة تواصل اجتماعي متكامل ومنصات تعليمية",
      "28 محتوى + 20 يوم × 40 فيديو (Flicker)",
      "إدارة 5 صفحات + 100+ مقاطع",
      "Meta Ads + TikTok Ads + Google Ads × إدارة متكاملة Meta",
      "Google Business Profile كاملة",
      "Growth Plan SEO",
      "استشارة مجانية 4 ساعات",
      "Marketing Automation + Smart Store",
      "دعم واتساب 2 مع Customer Care - Meta",
    ],
    popular: false,
  },
  {
    id: 6,
    cat: "growth",
    badge: "PASSION FOR SALES",
    badgeColor: "#8B0000",
    name: "شغف البيع | Passion for Sales",
    price: 33600,
    oldPrice: 45000,
    monthly: true,
    features: [
      "كامل الخدمات + دعم لا محدود",
      "إدارة الفريق التشغيلي والإداري",
      "إشراف كامل على الاتصال التجاري",
      "Business Coaching أسبوعي",
      "متابعة 6 مواقع جغرافية إعلانية",
      "استشارات طارئة 24/7 مع دعم كامل",
      "Brand Ambassador × مجانية تسويقية",
      "محتوى UGC بدوام 6 أشهر",
      "مع التدريب والإشراف وتطوير الفريق",
    ],
    popular: false,
  },
  {
    id: 7,
    cat: "ads",
    badge: "",
    badgeColor: "#CC0000",
    name: "100 درهم رصيد ميتا",
    price: 100,
    oldPrice: 110,
    monthly: false,
    features: [
      "اشحن حسابك الإعلاني بأقل أسعار السوق",
      "احصل على رصيد إعلانات Meta بقيمة AED 100",
      "واستفد من هدية إضافية بقيمة AED 2 مجاناً حصرياً للعملاء الكرام",
      "تفعيل فوري للرصيد",
      "قيمة إضافية بدون أي تكلفة",
      "مناسب للحملات الصغيرة والمتوسطة",
    ],
    popular: false,
  },
  {
    id: 8,
    cat: "ads",
    badge: "",
    badgeColor: "#CC0000",
    name: "500 درهم رصيد ميتا",
    price: 500,
    oldPrice: 550,
    monthly: false,
    features: [
      "احصل على رصيد Meta 500 AED",
      "+ 10 AED هدية مجانية",
      "فعّل رصيدك فوراً دون تأخير",
      "قيمة إضافية بدون أي تكلفة",
      "مناسب لحملات الإعلان المتوسطة",
    ],
    popular: false,
  },
  {
    id: 9,
    cat: "ads",
    badge: "",
    badgeColor: "#CC0000",
    name: "500 درهم رصيد جوجل",
    price: 500,
    oldPrice: 550,
    monthly: false,
    features: [
      "احصل على رصيد Google 500 AED",
      "+ 10 AED هدية",
      "فعّل رصيدك فوراً",
      "مناسب لحملات Google Ads",
    ],
    popular: false,
  },
  {
    id: 10,
    cat: "ads",
    badge: "",
    badgeColor: "#CC0000",
    name: "1000 درهم رصيد جوجل",
    price: 1000,
    oldPrice: 1100,
    monthly: false,
    features: [
      "احصل على رصيد Google 1000 AED",
      "+ 35% خصم",
      "فعّل رصيدك فوراً",
      "مناسب لحملات Google Ads الاحترافية",
    ],
    popular: false,
  },
  {
    id: 11,
    cat: "ads",
    badge: "",
    badgeColor: "#CC0000",
    name: "5000 درهم رصيد جوجل",
    price: 5000,
    oldPrice: 5500,
    monthly: false,
    features: [
      "احصل على رصيد Google 5000 AED",
      "+ 210 AED هدية إضافية",
      "فعّل رصيدك فوراً",
      "ضمان استرداد في حال عدم فعّل الرصيد",
      "قيمة إضافية بدون أي تكلفة",
      "مناسب للشركات والحملات الكبرى",
    ],
    popular: false,
  },
  {
    id: 12,
    cat: "websites",
    badge: "",
    badgeColor: "#CC0000",
    name: "Website Starter",
    price: 786,
    oldPrice: 1260,
    monthly: false,
    features: [
      "VAT شامل AED 786",
      "بدلاً من AED 1,260",
      "تصميم احترافي حتى 5 صفحات",
      "استضافة مجانية لمدة سنة",
      "دومين مجاني لمدة سنة",
      "SSL مجاني",
    ],
    popular: false,
  },
  {
    id: 13,
    cat: "websites",
    badge: "",
    badgeColor: "#CC0000",
    name: "Website Business",
    price: 1260,
    oldPrice: 1785,
    monthly: false,
    features: [
      "Website Business",
      "VAT شامل AED 1,260",
      "تصميم احترافي كامل",
      "استضافة مجانية لمدة سنة",
      "دومين مجاني",
      "50% خصم عند التجديد",
    ],
    popular: false,
  },
  {
    id: 14,
    cat: "ecommerce",
    badge: "",
    badgeColor: "#CC0000",
    name: "E-Commerce Business",
    price: 3150,
    oldPrice: 5250,
    monthly: false,
    features: [
      "مناسب لمتاجر التجارة الإلكترونية وشركات الأزياء والإلكترونيات والأثاث",
      "تصميم متجر إلكتروني احترافي متوافق مع جميع الأجهزة",
      "استضافة احترافية + دومين مجاني لمدة سنة",
      "شهادة حماية SSL بأعلى معايير الأمان",
      "إضافة حتى 20 منتج مع تنظيم التصنيفات",
    ],
    popular: false,
  },
  {
    id: 15,
    cat: "ecommerce",
    badge: "",
    badgeColor: "#B00000",
    name: "Marketplace Ultimate",
    price: 18900,
    oldPrice: 21200,
    monthly: false,
    features: [
      "خدمات استثمارية واستشارية لشركات التسويق",
      "المواصلات الإلكترونية والأزياء والإلكترونيات والأثاث",
      "خدمة Marketplace متكاملة",
      "Multi-Vendor - طلبي - بحري + غيرهم",
      "خدمة Marketplace كاملة",
      "نظام Digital Wallet كامل مع التوسع",
      "Stripe Integration كاملة",
      "بواسطة Stripe Digital Wallet",
    ],
    popular: false,
  },
  {
    id: 16,
    cat: "content",
    badge: "",
    badgeColor: "#CC0000",
    name: "CGI 8 ثانية",
    price: 799,
    oldPrice: 1200,
    monthly: false,
    features: [
      "إنتاج فيديو CGI احترافي بتقنية الذكاء الاصطناعي",
      "مدة الفيديو 8 ثوان",
      "تصميم للإعلانات على Instagram Reels",
      "SnapChat وكذلك TikTok",
      "مناسب للمنتجات ولعرض الخدمات الاحترافية",
      "جودة عالية بسرعة التسليم",
    ],
    popular: false,
  },
  {
    id: 17,
    cat: "content",
    badge: "",
    badgeColor: "#CC0000",
    name: "8 فيديوهات لا يزيد عن 59 ثانية",
    price: 2399,
    oldPrice: 3600,
    monthly: false,
    features: [
      "8 فيديوهات لا يزيد عن 59 ثانية",
      "تعليق صوتي إحترافي",
      "هندسة الصوت",
      "مونتاج",
      "X لا تشمل CGI",
      "X لا تشمل تصوير المنتجات أو تعديل الصور",
    ],
    popular: false,
  },
  {
    id: 18,
    cat: "content",
    badge: "",
    badgeColor: "#CC0000",
    name: "16 فيديو لا يزيد عن 59 ثانية",
    price: 3999,
    oldPrice: 5500,
    monthly: false,
    features: [
      "16 فيديوهات لا يزيد عن 59 ثانية",
      "تعليق صوتي إحترافي",
      "هندسة الصوت",
      "مونتاج",
      "X لا تشمل CGI",
    ],
    popular: false,
  },
];

function ProductCard({ p }: { p: typeof products[0] }) {
  const waMsg = encodeURIComponent(`مرحباً، أريد الاستفسار عن ${p.name}`);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card rounded-2xl overflow-hidden flex flex-col relative ${p.popular ? "border-[#CC0000]/50 shadow-[0_0_30px_rgba(204,0,0,0.15)]" : ""}`}
    >
      {p.popular && (
        <div className="absolute top-0 right-0 bg-[#CC0000] text-white text-[10px] font-black px-3 py-1.5 rounded-bl-xl">
          الأكثر طلباً
        </div>
      )}
      {/* Product image */}
      <div className="h-36 overflow-hidden relative">
        <img
          src={catImages[p.cat] ?? "/hero-marketing.webp"}
          alt={p.name}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070F] via-[#07070F]/40 to-transparent" />
        {p.badge && (
          <span className="absolute top-2 right-2 text-[9px] font-black tracking-widest text-white bg-[#CC0000] px-2 py-1 rounded-lg uppercase">
            {p.badge}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 flex flex-col flex-grow pt-3">
        <h3 className="text-base font-black text-[#111827] mb-5 leading-tight">{p.name}</h3>

        <ul className="space-y-2 flex-grow mb-6">
          {p.features.slice(0, 6).map((f, i) => (
            <li key={i} className="flex gap-2 text-xs text-[#9CA3AF]">
              <span className="text-[#CC0000] mt-0.5 shrink-0">✓</span>
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
          {p.features.length > 6 && (
            <li className="text-[10px] text-[#9CA3AF]">+{p.features.length - 6} ميزات إضافية</li>
          )}
        </ul>

        <a
          href={`https://wa.me/971551981564?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#CC0000] text-[#111827] font-bold text-sm hover:bg-[#AA0000] hover:shadow-[0_0_20px_rgba(204,0,0,0.3)] transition-all duration-300"
        >
          <FaWhatsapp size={15} />
          اطلب الآن
        </a>
      </div>
    </motion.div>
  );
}

export default function StorePage() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  /* Scroll to #pricing when arriving with the hash (e.g. from the navbar) */
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash === "#pricing") {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    // slight delay so lazy content has rendered
    const t = setTimeout(scrollToHash, 100);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  const filtered = products.filter(
    (p) =>
      (active === "all" || p.cat === active) &&
      (query === "" || p.name.includes(query))
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAFAFA]">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/store"
        keywords="متجر تسويق رقمي, شراء باقات تسويق دبي, أرصدة إعلانات, تطوير مواقع الإمارات"
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Hero */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-16 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-[#CC0000]/6 rounded-full blur-[100px]" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
              متجر دبي فانز
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
              اطلب <span className="gradient-text">خدماتك الرقمية</span> مباشرةً
            </h1>
            <p className="text-[#9CA3AF] text-lg">
              جميع خدماتنا بأسعار شفافة — اختر ما يناسب مشروعك وتواصل معنا عبر واتساب فوراً
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="ابحث عن خدمة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-white placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  active === c.id
                    ? "bg-[#CC0000] text-white shadow-[0_0_20px_rgba(204,0,0,0.25)]"
                    : "bg-[#F3F4F6] border border-[#E5E7EB] text-[#9CA3AF] hover:text-white hover:border-[#CC0000]/40"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-[#9CA3AF] py-20">
                لا توجد نتائج مطابقة
              </div>
            )}
          </motion.div>
        </div>

        {/* Pricing packages — merged from the old /pricing page */}
        <section id="pricing" className="mt-20 scroll-mt-28">
          <Pricing />
        </section>
      </main>
      <TrustBar />
      <Footer />
    </div>
  );
}

const PAGE_META = getRouteMeta("/store");
