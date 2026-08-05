import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  TrendingUp, Code2, Bot, Smartphone, Palette, Cloud,
  ArrowLeft, Rocket, CheckCircle2,
  Building2, Scale, Stethoscope, Calculator, Briefcase,
  SprayCan, Shirt, Gem, Store as StoreIcon, MonitorSmartphone,
  Globe, ExternalLink,
} from "lucide-react";

/* ── Categories ──────────────────────────────────────────────────────── */
const categories = [
  { id: "marketing",  label: "التسويق الرقمي",     icon: TrendingUp, color: "#CC0000" },
  { id: "software",   label: "تطوير البرمجيات",    icon: Code2,      color: "#7C3AED" },
  { id: "ai",         label: "الذكاء الاصطناعي",  icon: Bot,        color: "#0EA5E9" },
  { id: "mobile",     label: "تطبيقات الجوال",     icon: Smartphone, color: "#10B981" },
  { id: "branding",   label: "الهوية والتصميم",    icon: Palette,    color: "#EC4899" },
  { id: "hosting",    label: "الاستضافة والسحابة", icon: Cloud,      color: "#6366F1" },
];

/* ── Services per category ───────────────────────────────────────────── */
interface ServiceItem {
  title: string;
  desc: string;
  features: string[];
  href: string;
  cta: string;
}

const servicesMap: Record<string, ServiceItem[]> = {
  marketing: [
    {
      title: "إدارة الحملات المدفوعة",
      desc: "حملات Meta وGoogle وTikTok وSnapchat — استهداف دقيق وتحسين يومي لرفع جودة العملاء المحتملين.",
      features: ["Meta Ads", "Google Ads", "TikTok & Snapchat", "تقارير أسبوعية"],
      href: "/services/paid-ads",
      cta: "اطلب إدارة حملاتك",
    },
    {
      title: "إدارة السوشيال ميديا",
      desc: "إدارة شاملة للحسابات — محتوى، ريلز، قصص، جدولة، ومتابعة التفاعل على جميع المنصات.",
      features: ["إنستغرام & تيك توك", "كتابة محتوى عربي", "ريلز & استوريز", "تقرير شهري"],
      href: "/services/social-media-management",
      cta: "أدر حساباتك معنا",
    },
    {
      title: "تحسين محركات البحث SEO",
      desc: "ظهور مستدام في Google — بحث كلمات مفتاحية، بناء روابط، تحسين تقني، ومحتوى SEO عربي.",
      features: ["بحث كلمات مفتاحية", "SEO تقني وداخلي", "بناء روابط خلفية", "تقارير ترتيب"],
      href: "/services/seo",
      cta: "احسّن ترتيبك الآن",
    },
    {
      title: "كتابة المحتوى التسويقي",
      desc: "محتوى عربي احترافي — مقالات SEO، نصوص إعلانية، وصف منتجات، وكتابة نصوص فيديو.",
      features: ["مقالات SEO", "نصوص إعلانية", "وصف منتجات", "نصوص فيديو"],
      href: "/service-inquiry/content-management",
      cta: "اطلب كتابة محتوى",
    },
    {
      title: "تحليلات البيانات والتقارير",
      desc: "تقارير أداء تنفيذية — قراءة مصادر العملاء، تحليل الحملات، وتوصيات قابلة للتنفيذ.",
      features: ["تحليل الحملات", "كشف نقاط الهدر", "تقارير ROAS", "توصيات فورية"],
      href: "/service-inquiry/analytics",
      cta: "احصل على تقريرك",
    },
    {
      title: "الاستشارات التسويقية",
      desc: "مراجعة وضعك التسويقي، تحديد نقاط الضعف، وخطة نمو عملية تحسّن حملاتك وترفع المبيعات.",
      features: ["مراجعة شاملة", "خطة نمو 90 يوم", "أولويات واضحة", "متابعة مستمرة"],
      href: "/service-inquiry/consulting",
      cta: "احجز استشارتك",
    },
  ],
  software: [
    {
      title: "مواقع الشركات والأعمال",
      desc: "موقع احترافي يعكس هويتك ويحوّل الزوار إلى عملاء — سريع، متجاوب، وسهل الإدارة.",
      features: ["تصميم احترافي", "SEO جاهز", "لوحة تحكم", "SSL مجاني"],
      href: "/services/web-design",
      cta: "اطلب موقعك",
    },
    {
      title: "صفحات الهبوط",
      desc: "صفحة هبوط تحويلية لحملاتك الإعلانية — مُصمَّمة لرفع نسبة التحويل وتقليل تكلفة العميل.",
      features: ["A/B Testing جاهز", "تحميل فائق السرعة", "تكامل مع CRM", "نموذج تواصل ذكي"],
      href: "/service-inquiry/websites",
      cta: "اطلب صفحة هبوط",
    },
    {
      title: "المتاجر الإلكترونية",
      desc: "متجر إلكتروني متكامل بدفع آمن، إدارة مخزون، وشحن — جاهز للبيع من اليوم الأول.",
      features: ["بوابة دفع آمنة", "إدارة المخزون", "تتبع الطلبات", "تكامل شحن"],
      href: "/service-inquiry/ecommerce",
      cta: "ابدأ متجرك",
    },
    {
      title: "أنظمة ERP وCRM",
      desc: "حلول برمجية مخصصة لإدارة العمليات والعملاء — أتمتة كاملة تختصر الوقت وترفع الكفاءة.",
      features: ["إدارة المبيعات", "تتبع الموظفين", "لوحات تقارير", "تكامل API"],
      href: "/service-inquiry/erp",
      cta: "اطلب نظامك",
    },
    {
      title: "البرمجة المخصصة",
      desc: "منصات وأنظمة ويب مخصصة بالكامل — API، لوحات تحكم، وحلول تقنية لأي متطلب تجاري.",
      features: ["Full-stack", "REST API", "لوحات إدارة", "دعم تقني مستمر"],
      href: "/service-inquiry/custom",
      cta: "ناقش مشروعك",
    },
  ],
  ai: [
    {
      title: "مساعدون ذكاء اصطناعي",
      desc: "مساعدون ذكيون مدرّبون على بيانات شركتك — يجيبون العملاء ويؤتمتون الاستفسارات 24/7.",
      features: ["24/7 بلا توقف", "مدرّب على منتجاتك", "متعدد اللغات", "تكامل WhatsApp"],
      href: "/ai-business-os",
      cta: "اكتشف AI Business OS",
    },
    {
      title: "شات بوت للأعمال",
      desc: "شات بوت يرد فورياً على استفسارات العملاء، يجدول المواعيد، ويحوّل الزوار إلى عملاء.",
      features: ["ردود فورية", "جدولة مواعيد", "تقارير محادثات", "تكامل CRM"],
      href: "/ai-business-os",
      cta: "اطلب شات بوتك",
    },
    {
      title: "أتمتة العمليات التجارية",
      desc: "أتمتة المهام المتكررة — من استقبال الطلبات إلى إرسال التقارير — بدون تدخل يدوي.",
      features: ["Workflow ذكي", "تكامل مع أدواتك", "إشعارات تلقائية", "توفير 10+ ساعات أسبوعياً"],
      href: "/ai-business-os",
      cta: "أتمت عملياتك",
    },
    {
      title: "محتوى ذكاء اصطناعي",
      desc: "توليد محتوى تسويقي، إعلانات، ومقالات SEO بالذكاء الاصطناعي — بجودة عالية وسرعة فائقة.",
      features: ["محتوى عربي", "إعلانات جاهزة", "مقالات SEO", "صور AI"],
      href: "/ai-business-os/tools",
      cta: "جرّب الأدوات مجاناً",
    },
  ],
  mobile: [
    {
      title: "تطبيقات iOS وAndroid",
      desc: "تطبيق موبايل احترافي لعملك — سريع، جميل، ومنشور على App Store وGoogle Play.",
      features: ["iOS & Android", "UI/UX احترافي", "إشعارات Push", "دفع داخل التطبيق"],
      href: "/service-inquiry/mobile",
      cta: "ابدأ تطبيقك",
    },
    {
      title: "Flutter & React Native",
      desc: "تطبيق واحد يعمل على iOS وAndroid بتقنيات حديثة — سرعة تطوير وأداء موبايل حقيقي.",
      features: ["كود واحد لمنصتين", "أداء محلي", "تحديثات OTA", "تكامل كامل مع API"],
      href: "/service-inquiry/mobile",
      cta: "اطلب عرض سعر",
    },
    {
      title: "Progressive Web Apps",
      desc: "تطبيق ويب يعمل كتطبيق موبايل — يُثبَّت على الهاتف، يعمل بدون إنترنت، وسريع للغاية.",
      features: ["بدون App Store", "يعمل أوفلاين", "سرعة فائقة", "تكلفة أقل"],
      href: "/service-inquiry/pwa",
      cta: "استكشف الخيار",
    },
  ],
  branding: [
    {
      title: "الهوية البصرية المتكاملة",
      desc: "هوية تجارية احترافية من الصفر — شعار، ألوان، خطوط، وقواعد استخدام موحدة لكل المواد.",
      features: ["شعار + ألوان + خطوط", "Brand Guidelines", "ملفات AI & PDF", "كل الأحجام"],
      href: "/services/graphic-design",
      cta: "صمّم هويتك",
    },
    {
      title: "تصميم الجرافيك",
      desc: "منشورات سوشيال ميديا، بروشورات، كتالوجات، وبنرات إعلانية احترافية تعكس قيمة علامتك.",
      features: ["منشورات سوشيال", "بروشورات & كتالوج", "بنرات إعلانية", "تصميم للطباعة"],
      href: "/services/graphic-design",
      cta: "اطلب تصاميمك",
    },
    {
      title: "موشن جرافيك وفيديو",
      desc: "فيديوهات وموشن جرافيك احترافية لإعلاناتك وحساباتك — تجذب الانتباه وترفع التفاعل.",
      features: ["موشن جرافيك 2D", "ريلز & ستوريز", "Explainer Videos", "إنتاج إعلاني"],
      href: "/service-inquiry/video",
      cta: "اطلب فيديوك",
    },
    {
      title: "التصوير الاحترافي",
      desc: "جلسات تصوير للمنتجات، الشركات، والفعاليات — إنتاج بصري عالي الجودة يرفع ثقة العملاء.",
      features: ["تصوير منتجات", "تصوير شركات", "تصوير فعاليات", "تعديل احترافي"],
      href: "/services/photography",
      cta: "احجز جلسة تصوير",
    },
  ],
  hosting: [
    {
      title: "استضافة المواقع",
      desc: "استضافة سريعة وآمنة على سيرفرات عالية الأداء — SSL مجاني، نسخ احتياطية يومية، وأبتايم 99.9%.",
      features: ["SSL مجاني", "نسخ احتياطية", "99.9% Uptime", "دعم تقني"],
      href: "/service-inquiry/hosting",
      cta: "استفسر عن الاستضافة",
    },
    {
      title: "بريد الأعمال الاحترافي",
      desc: "بريد بدومينك الخاص (info@شركتك.com) — مظهر احترافي، تخزين كافٍ، وأمان عالي.",
      features: ["بريد بدومينك", "Anti-spam", "تخزين كافٍ", "دعم جميع الأجهزة"],
      href: "/service-inquiry/email",
      cta: "احصل على بريدك",
    },
    {
      title: "الصيانة والدعم التقني",
      desc: "صيانة شهرية شاملة لموقعك — تحديثات، إصلاح أخطاء، تحسين سرعة، وتقارير أداء.",
      features: ["تحديثات شهرية", "إصلاح الأخطاء", "تحسين السرعة", "تقرير أداء"],
      href: "/service-inquiry/maintenance",
      cta: "اشترك في الصيانة",
    },
    {
      title: "تسجيل الدومين",
      desc: "احجز دومينك المميز — .com، .ae، أو أي امتداد — مع إدارة DNS كاملة وتجديد تلقائي.",
      features: [".com & .ae", "DNS متقدم", "تجديد تلقائي", "حماية WHOIS"],
      href: "/service-inquiry/domain",
      cta: "ابحث عن دومينك",
    },
  ],
};

/* ── Website Templates mini showcase ─────────────────────────────── */
const templateShowcase = [
  { icon: Building2, label: "شركة عقارات",   color: "#D4A017" },
  { icon: Scale,     label: "مكتب محاماة",   color: "#8B6F47" },
  { icon: Stethoscope, label: "عيادة طبية",  color: "#0D9488" },
  { icon: SprayCan,  label: "متجر عطور",     color: "#B8860B" },
  { icon: Shirt,     label: "متجر ملابس",    color: "#7C3AED" },
  { icon: Gem,       label: "متجر مجوهرات",  color: "#EC4899" },
  { icon: Calculator,label: "مكتب محاسبة",   color: "#059669" },
  { icon: StoreIcon, label: "مطعم / كافيه",  color: "#F59E0B" },
  { icon: MonitorSmartphone, label: "تقنية وبرمجيات", color: "#6366F1" },
  { icon: Briefcase, label: "شركات أخرى",   color: "#CC0000" },
];

/* ── Framer variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.42, delay: i * 0.06 } }),
};

export function Services() {
  const [active, setActive] = useState("marketing");
  const cat = categories.find((c) => c.id === active)!;
  const items = servicesMap[active] ?? [];

  return (
    <section id="services" className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-60 pointer-events-none" style={{ background: `${cat.color}12` }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F0B429]/6 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
            خدماتنا الاحترافية
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
            حلول متكاملة من <span className="gradient-text">فكرة إلى نتيجة</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg leading-relaxed">
            تسويق رقمي، برمجيات، ذكاء اصطناعي، تطبيقات، هوية بصرية، واستضافة — كل ما يحتاجه نشاطك في مكان واحد.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-250"
              style={
                active === c.id
                  ? { background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}40`, boxShadow: `0 0 20px ${c.color}18` }
                  : { background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }
              }
            >
              <c.icon size={15} />
              {c.label}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {items.map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="group glass-card rounded-2xl p-6 flex flex-col hover:border-opacity-60 transition-all duration-300"
                style={{ "--hover-color": cat.color } as React.CSSProperties}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${cat.color}18`; (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}40`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
              >
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                    <cat.icon size={17} style={{ color: cat.color }} />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${cat.color}10`, color: cat.color }}>
                    {cat.label}
                  </span>
                </div>

                <h3 className="text-[#111827] font-bold text-lg mb-2 transition-colors duration-200" style={{}}>
                  {s.title}
                </h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 flex-grow">
                  {s.desc}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <CheckCircle2 size={13} style={{ color: cat.color }} className="shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={s.href}
                  className="flex items-center gap-2 text-sm font-bold transition-colors mt-auto w-fit group/cta"
                  style={{ color: cat.color }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {s.cta}
                  <ArrowLeft size={14} className="group-hover/cta:-translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}

            {/* Website templates mini panel — shown inside software tab */}
            {active === "software" && (
              <motion.div
                custom={items.length}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="glass-card rounded-2xl p-6 flex flex-col md:col-span-2 lg:col-span-3 mt-1"
              >
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#7C3AED18", border: "1px solid #7C3AED30" }}>
                      <Globe size={17} style={{ color: "#7C3AED" }} />
                    </div>
                    <div>
                      <h3 className="text-[#111827] font-bold text-base">نماذج المواقع الجاهزة</h3>
                      <p className="text-[#9CA3AF] text-xs">موقعك جاهز خلال أيام — اختر قطاعك وانطلق</p>
                    </div>
                  </div>
                  <Link
                    href="/website-templates"
                    className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                    style={{ background: "#7C3AED18", color: "#7C3AED", border: "1px solid #7C3AED30" }}
                  >
                    عرض الكل
                    <ExternalLink size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {templateShowcase.map((t) => (
                    <Link
                      key={t.label}
                      href="/website-templates"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 group/t"
                      style={{ background: `${t.color}0d`, border: `1px solid ${t.color}22` }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover/t:scale-110 duration-200" style={{ background: `${t.color}18` }}>
                        <t.icon size={18} style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-semibold text-[#374151]">{t.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/book-demo"
            className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-bold text-base transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-[0_0_32px_rgba(124,58,237,0.4)]"
            style={{ background: "linear-gradient(135deg,#7C3AED,#6366F1)" }}
          >
            <Rocket size={18} />
            احجز استشارة مجانية
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-[#E5E7EB] text-[#374151] hover:border-[#CC0000]/40 hover:text-[#CC0000] hover:bg-[#CC0000]/5 transition-all duration-300"
          >
            استكشف كل الخدمات
            <ArrowLeft size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
