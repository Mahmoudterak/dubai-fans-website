import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WebsiteOrderOffer } from "@/components/WebsiteOrderOffer";
import {
  Building2, Scale, Stethoscope, Calculator, Briefcase,
  SprayCan, Shirt, Gem, Footprints, MonitorSmartphone, Store,
  ArrowLeft, Sparkles, ShoppingBag, Globe, X, ZoomIn,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────── */
interface Template {
  key: string;
  title: string;
  sub: string;
  desc: string;
  icon: typeof Building2;
  color: string;
  features: string[];
}

const businessTemplates: Template[] = [
  {
    key: "real-estate",
    title: "شركة عقارات",
    sub: "Real Estate",
    desc: "عرض العقارات مع صور عالية الجودة، فلترة حسب المنطقة والسعر، ونماذج تواصل فورية للمهتمين.",
    icon: Building2, color: "#D4A017",
    features: ["قوائم عقارات مع فلاتر", "خرائط تفاعلية", "نموذج طلب معاينة"],
  },
  {
    key: "lawyer",
    title: "مكتب محاماة",
    sub: "Law Firm",
    desc: "موقع رسمي يعكس الثقة والاحترافية: مجالات الممارسة، فريق المحامين، وحجز استشارة قانونية.",
    icon: Scale, color: "#8B6F47",
    features: ["صفحات مجالات الممارسة", "ملفات الفريق", "حجز استشارة"],
  },
  {
    key: "doctor",
    title: "عيادة / دكتور",
    sub: "Medical Clinic",
    desc: "حجز مواعيد إلكتروني، عرض الخدمات الطبية والتخصصات، وقسم لآراء المرضى وتقييماتهم.",
    icon: Stethoscope, color: "#0D9488",
    features: ["حجز مواعيد أونلاين", "صفحات التخصصات", "آراء المرضى"],
  },
  {
    key: "accountant",
    title: "مكتب محاسبة",
    sub: "Accounting Firm",
    desc: "عرض الخدمات المحاسبية والضريبية، حاسبات تفاعلية، وطلب عرض سعر لخدمات الشركات.",
    icon: Calculator, color: "#059669",
    features: ["خدمات ضريبة القيمة المضافة", "حاسبات تفاعلية", "طلب عرض سعر"],
  },
  {
    key: "corporate",
    title: "شركات أخرى",
    sub: "Corporate",
    desc: "قالب مرن لأي نشاط تجاري: صفحة رئيسية قوية، خدمات، أعمال سابقة، ونموذج تواصل متكامل.",
    icon: Briefcase, color: "#CC0000",
    features: ["تصميم مرن لأي نشاط", "صفحات خدمات وأعمال", "متعدد اللغات"],
  },
];

const storeTemplates: Template[] = [
  {
    key: "perfume",
    title: "متجر عطور",
    sub: "Perfumes",
    desc: "تصميم فاخر يليق بالعطور: صور منتجات كبيرة، باقات وهدايا، ودفع إلكتروني آمن.",
    icon: SprayCan, color: "#B8860B",
    features: ["تصميم فاخر", "باقات وهدايا", "دفع إلكتروني آمن"],
  },
  {
    key: "fashion",
    title: "متجر ملابس",
    sub: "Fashion",
    desc: "عرض المقاسات والألوان لكل قطعة، صفحات تشكيلات موسمية، وسلة شراء سريعة.",
    icon: Shirt, color: "#A78BFA",
    features: ["مقاسات وألوان", "تشكيلات موسمية", "سلة شراء سريعة"],
  },
  {
    key: "accessories",
    title: "متجر إكسسوارات",
    sub: "Accessories",
    desc: "تصميم أنيق للمجوهرات والساعات والإكسسوارات مع تكبير الصور وعرض التفاصيل الدقيقة.",
    icon: Gem, color: "#EC4899",
    features: ["تكبير صور المنتج", "قوائم أمنيات", "عروض وخصومات"],
  },
  {
    key: "shoes",
    title: "متجر أحذية",
    sub: "Footwear",
    desc: "عرض ديناميكي للأحذية بزوايا متعددة، دليل المقاسات، وفلترة حسب النوع والماركة.",
    icon: Footprints, color: "#F97316",
    features: ["عرض بزوايا متعددة", "دليل المقاسات", "فلترة حسب الماركة"],
  },
  {
    key: "digital",
    title: "متجر منتجات رقمية",
    sub: "Digital Products",
    desc: "بيع الكتب الإلكترونية والكورسات والتصاميم مع تسليم فوري تلقائي بعد الدفع.",
    icon: MonitorSmartphone, color: "#8B5CF6",
    features: ["تسليم فوري تلقائي", "حماية الملفات", "اشتراكات ودفعات"],
  },
  {
    key: "multi",
    title: "متجر متعدد الأقسام",
    sub: "Multi-Category",
    desc: "متجر شامل بأقسام متعددة: إلكترونيات، أزياء، منزل وأكثر — مع بحث ذكي وإدارة مخزون.",
    icon: Store, color: "#0EA5E9",
    features: ["أقسام غير محدودة", "بحث ذكي", "إدارة مخزون متكاملة"],
  },
];

/* ─── Card ──────────────────────────────────────────────── */
function TemplateCard({ t, index, onPreview }: { t: Template; index: number; onPreview: (t: Template) => void }) {
  const Icon = t.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Preview image — click to enlarge */}
      <button
        type="button"
        onClick={() => onPreview(t)}
        aria-label={`معاينة تصميم ${t.title}`}
        className="relative overflow-hidden aspect-[16/10] bg-[#F3F4F6] block w-full cursor-zoom-in text-right"
      >
        <img
          src={`/templates/${t.key}.jpg`}
          alt={`نموذج تصميم موقع ${t.title}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: t.color }}
        >
          <Icon size={18} className="text-white" />
        </div>
        {/* zoom hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-white/90 text-[#111827] text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            <ZoomIn size={14} />
            اضغط للمعاينة
          </span>
        </div>
      </button>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-black text-[#111827]">{t.title}</h3>
          <span className="text-xs font-semibold text-[#9CA3AF]" dir="ltr">{t.sub}</span>
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{t.desc}</p>

        <ul className="space-y-1.5 mb-6">
          {t.features.map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-[#4B5563]">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.color }} />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={`/contact?subject=${encodeURIComponent(`أريد تصميم ${t.title}`)}`}
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-l from-[#CC0000] to-[#FF4444] hover:shadow-[0_0_20px_rgba(204,0,0,0.35)] transition-all duration-300"
        >
          اطلب هذا التصميم
          <ArrowLeft size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function WebsiteTemplatesPage() {
  const meta = getRouteMeta("/website-templates");
  const [preview, setPreview] = useState<Template | null>(null);

  /* Close lightbox with Escape + lock scroll while open */
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" dir="rtl">
      <SEOHead title={meta?.title} description={meta?.description} canonical="/website-templates" />
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 bg-[#06060F] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] bg-[#CC0000]/15" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-[#1E1B4B]/40" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-8">
              <Sparkles size={14} className="text-[#D97706]" />
              نماذج جاهزة للإلهام — نصمم لك نسختك الخاصة
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              نماذج مواقع
              <span className="bg-gradient-to-l from-[#D97706] to-[#CC0000] bg-clip-text text-transparent"> ومتاجر إلكترونية</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              استعرض نماذج تصاميم لمواقع الشركات والمتاجر الإلكترونية بمختلف المجالات، واختر
              التصميم الأقرب لنشاطك — وفريق دبي فانز يبنيه لك بهويتك الخاصة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1: Business websites ── */}
      <section className="py-20" id="business">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              <Globe size={14} />
              مواقع الشركات
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">
              نماذج لإنشاء موقع لشركتك
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              تصاميم احترافية لمواقع تعريفية تناسب مختلف الأنشطة — عقارات، محاماة، طب، محاسبة وغيرها.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {businessTemplates.map((t, i) => <TemplateCard key={t.key} t={t} index={i} onPreview={setPreview} />)}
          </div>
        </div>
      </section>

      {/* ── Section 2: E-commerce ── */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]" id="ecommerce">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#0EA5E9]/10 text-[#0EA5E9] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              <ShoppingBag size={14} />
              تجارة إلكترونية
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">
              نماذج متاجر إلكترونية
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              متاجر جاهزة للبيع أونلاين مع الدفع الإلكتروني وإدارة المنتجات — لكل تخصص تصميم يناسبه.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {storeTemplates.map((t, i) => <TemplateCard key={t.key} t={t} index={i} onPreview={setPreview} />)}
          </div>
        </div>
      </section>

      {/* ── AI website offer (499 AED) ── */}
      <WebsiteOrderOffer />

      {/* ── CTA ── */}
      <section className="py-20 bg-[#06060F] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CC0000]/10 rounded-full blur-[130px]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            لم تجد التصميم المناسب؟
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            نصمم لك موقعاً أو متجراً من الصفر حسب هويتك ومتطلبات نشاطك — تحدث معنا الآن.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black px-10 py-4 rounded-2xl hover:shadow-[0_0_40px_rgba(204,0,0,0.6)] hover:scale-105 transition-all duration-300"
            >
              اطلب تصميمك الخاص
              <ArrowLeft size={18} />
            </Link>
            <Link
              href="/services/web-design"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              خدمة تصميم المواقع
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Lightbox preview ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreview(null)}
            role="dialog" aria-modal="true" aria-label={`معاينة تصميم ${preview.title}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPreview(null)}
                aria-label="إغلاق المعاينة"
                className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <img loading="lazy" decoding="async"
                src={`/templates/${preview.key}.jpg`}
                alt={`معاينة كبيرة لنموذج تصميم ${preview.title}`}
                className="w-full max-h-[65vh] object-contain bg-[#0D0D1A]"
              />

              <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="text-xl font-black text-[#111827]">{preview.title}</h3>
                    <span className="text-xs font-semibold text-[#9CA3AF]" dir="ltr">{preview.sub}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{preview.desc}</p>
                </div>
                <Link
                  href={`/contact?subject=${encodeURIComponent(`أريد تصميم ${preview.title}`)}`}
                  onClick={() => setPreview(null)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-l from-[#CC0000] to-[#FF4444] hover:shadow-[0_0_20px_rgba(204,0,0,0.35)] transition-all duration-300 shrink-0"
                >
                  اطلب هذا التصميم
                  <ArrowLeft size={15} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
