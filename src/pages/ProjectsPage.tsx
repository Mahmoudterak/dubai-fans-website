import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/projects");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExternalLink, Building2, Users, FileText, CreditCard, Scale, Wrench, Bell, ShieldCheck, Instagram, Facebook, Youtube, Music2, Camera, Globe, ShoppingBag, Megaphone, Cpu, ArrowLeft, TrendingUp, MessageSquare } from "lucide-react";

/* ─────────────────────────────────────────────── */
/*  Data                                           */
/* ─────────────────────────────────────────────── */

/* ─────────────────────────────────────────────── */
/*  Client portfolio data                          */
/* ─────────────────────────────────────────────── */
type PortfolioCategory = "all" | "website" | "store" | "campaign" | "system";

const clientProjects: {
  id: string;
  category: PortfolioCategory;
  categoryLabel: string;
  categoryColor: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tech: string[];
  badge: string;
  stats?: { label: string; value: string }[];
}[] = [
  {
    id: "aka-uae",
    category: "website",
    categoryLabel: "موقع إلكتروني",
    categoryColor: "#3B82F6",
    image: "/portfolio/aka-uae-website.webp",
    title: "AKA UAE",
    subtitle: "aka-uae.com",
    description: "شركة متخصصة في المحاسبة والضرائب والاستشارات التجارية، تخدم الشركات الصغيرة والمتوسطة في الإمارات.",
    url: "https://aka-uae.com",
    tech: ["تصميم احترافي", "SEO", "نموذج تواصل"],
    badge: "موقع مؤسسي",
  },
  {
    id: "aqarlines",
    category: "website",
    categoryLabel: "موقع إلكتروني",
    categoryColor: "#3B82F6",
    image: "/portfolio/aqarlines-website.webp",
    title: "عقار لاين",
    subtitle: "aqarlines.com",
    description: "بوابة عقارية متكاملة لبيع وشراء وتأجير وإدارة العقارات داخل إمارة عجمان.",
    url: "https://aqarlines.com",
    tech: ["منصة عقارية", "قوائم ديناميكية", "RTL عربي"],
    badge: "بوابة عقارية",
  },
  {
    id: "mtcoach",
    category: "website",
    categoryLabel: "موقع إلكتروني",
    categoryColor: "#3B82F6",
    image: "/portfolio/mtcoach-website.webp",
    title: "محمود طارق كوتش",
    subtitle: "mtcoach.blog",
    description: "المالك والمؤسس لشركة دبي فانز، استشاري نفسي ولايف كوتش معتمد دولياً. موقع شخصي احترافي مع نظام حجز جلسات.",
    url: "https://mtcoach.blog",
    tech: ["موقع شخصي", "مدونة", "حجز جلسات"],
    badge: "موقع شخصي",
  },
  {
    id: "alnashmi",
    category: "store",
    categoryLabel: "متجر إلكتروني",
    categoryColor: "#D97706",
    image: "/portfolio/alnashmi-perfumes-store.webp",
    title: "النعشمي للعطور",
    subtitle: "alnashmiperfumes.com",
    description: "متجر عطور فاخر متكامل مع نظام سلة تسوق وبوابة دفع آمنة، مصمم بأسلوب راقٍ يعكس هوية العطور الشرقية.",
    url: "https://www.alnashmiperfumes.com",
    tech: ["متجر إلكتروني", "بوابة دفع", "إدارة مخزون"],
    badge: "تجارة إلكترونية",
  },
  {
    id: "mtuaefans-server",
    category: "store",
    categoryLabel: "متجر إلكتروني",
    categoryColor: "#D97706",
    image: "/blog/best-posting-times-2026.webp",
    title: "سيرفر دبي فانز",
    subtitle: "mtuaefans.com",
    description: "منصة خدمات زيادة المتابعين والتفاعل على وسائل التواصل الاجتماعي — الأسرع والأسهل في الإمارات.",
    url: "https://mtuaefans.com",
    tech: ["متجر خدمات", "دفع آمن", "5 منصات"],
    badge: "منصة خدمات",
  },
  {
    id: "campaign-medical",
    category: "campaign",
    categoryLabel: "حملات إعلانية",
    categoryColor: "#10B981",
    image: "/portfolio/campaign-medical-results.webp",
    title: "مراكز طبية — دبي",
    subtitle: "Google Ads · Meta Ads",
    description: "حملات إعلانية متكاملة لعيادات ومراكز طبية في دبي — انخفضت تكلفة الاكتساب من 85 إلى 22 درهم وارتفعت المواعيد بنسبة 340%.",
    url: "/#contact",
    tech: ["Google Ads", "Meta Ads", "CPL: 22 درهم", "ROAS 6.2x"],
    badge: "قطاع طبي",
    stats: [
      { label: "زيادة المواعيد", value: "+340%" },
      { label: "تكلفة العميل", value: "22 درهم" },
      { label: "CTR", value: "8.4%" },
    ],
  },
  {
    id: "campaign-realestate",
    category: "campaign",
    categoryLabel: "حملات إعلانية",
    categoryColor: "#10B981",
    image: "/portfolio/campaign-realestate-results.webp",
    title: "شركة عقارات — الإمارات",
    subtitle: "Google Ads · Meta Ads · TikTok",
    description: "520 عميل محتمل مؤهل خلال 90 يوماً لشركة عقارات إماراتية — بتكلفة 38 درهم للعميل وعائد 8.4 أضعاف على الإنفاق.",
    url: "/#contact",
    tech: ["Google Ads", "Meta Ads", "520 عميل محتمل", "ROAS 8.4x"],
    badge: "قطاع عقاري",
    stats: [
      { label: "عملاء محتملون", value: "520" },
      { label: "تكلفة العميل", value: "38 درهم" },
      { label: "الانطباعات", value: "2.1M" },
    ],
  },
  {
    id: "campaign-restaurant",
    category: "campaign",
    categoryLabel: "حملات إعلانية",
    categoryColor: "#10B981",
    image: "/portfolio/campaign-restaurant-results.webp",
    title: "سلسلة مطاعم — دبي",
    subtitle: "TikTok · Instagram · Meta Ads",
    description: "2.3 مليون مشاهدة وفيديوهات فيروسية لسلسلة مطاعم إماراتية — 890 حجز مطعم من الإعلانات بتكلفة 12 درهم للحجز.",
    url: "/#contact",
    tech: ["TikTok Ads", "Instagram", "890 حجز", "2.3M مشاهدة"],
    badge: "قطاع F&B",
    stats: [
      { label: "مشاهدات الفيديو", value: "2.3M" },
      { label: "حجوزات من الإعلانات", value: "890" },
      { label: "متابعون جدد", value: "+15K" },
    ],
  },
  {
    id: "campaign-ecommerce",
    category: "campaign",
    categoryLabel: "حملات إعلانية",
    categoryColor: "#10B981",
    image: "/portfolio/campaign-ecommerce-results.webp",
    title: "متجر عطور وأزياء — UAE",
    subtitle: "Meta Ads · Google Shopping",
    description: "285,000 درهم مبيعات مولّدة من حملات إعلانية لمتجر إلكتروني — بعائد 9.1 أضعاف على كل درهم أُنفق.",
    url: "/#contact",
    tech: ["Meta Ads", "Google Shopping", "3,200 طلب", "ROAS 9.1x"],
    badge: "تجارة إلكترونية",
    stats: [
      { label: "إجمالي المبيعات", value: "285K درهم" },
      { label: "عدد الطلبات", value: "3,200" },
      { label: "ROAS", value: "9.1x" },
    ],
  },
  {
    id: "campaign-education",
    category: "campaign",
    categoryLabel: "حملات إعلانية",
    categoryColor: "#10B981",
    image: "/portfolio/campaign-education-results.webp",
    title: "مركز تدريبي — دبي",
    subtitle: "Google Search Ads",
    description: "680 استفسار تسجيل لمركز تدريبي دبي — بمعدل تحويل 94% من صفحة الهبوط وتكلفة 45 درهم للتسجيل.",
    url: "/#contact",
    tech: ["Google Search", "680 استفسار", "CPL: 45 درهم", "Quality Score 9"],
    badge: "قطاع تعليمي",
    stats: [
      { label: "استفسارات التسجيل", value: "680" },
      { label: "معدل التحويل", value: "94%" },
      { label: "تكلفة التسجيل", value: "45 درهم" },
    ],
  },
  {
    id: "clinic-os",
    category: "system",
    categoryLabel: "أنظمة برمجية",
    categoryColor: "#6366F1",
    image: "/portfolio/clinic-os/dashboard.jpg",
    title: "Clinic OS",
    subtitle: "نظام ذكي لإدارة العيادات",
    description: "نظام SaaS متكامل لإدارة العيادات بالذكاء الاصطناعي — إدخال صوتي، واتساب، روشتة ذكية، ملف المريض، الحجز، الحسابات، والمخزون في منصة واحدة.",
    url: "/projects/clinic-os",
    tech: ["AI", "إدخال صوتي", "واتساب", "SaaS"],
    badge: "نظام طبي",
    stats: [
      { label: "مريض مُدار", value: "247+" },
      { label: "موعد يومياً", value: "18" },
      { label: "رقمي بالكامل", value: "100%" },
    ],
  },
  {
    id: "amlak-os",
    category: "system",
    categoryLabel: "أنظمة برمجية",
    categoryColor: "#2563EB",
    image: "/portfolio/amlak-os-hero.webp",
    title: "AMLAK OS",
    subtitle: "amlakly.app",
    description: "نظام SaaS متكامل لإدارة العقارات والأملاك — العقود والمستأجرين والمدفوعات والصيانة والقضايا القانونية في منصة واحدة مبنية للعالم العربي.",
    url: "/projects/amlak-os",
    tech: ["SaaS", "إدارة عقارات", "عربي RTL", "متعدد المستخدمين"],
    badge: "نظام عقاري",
    stats: [
      { label: "وحدة مُدارة", value: "50K+" },
      { label: "شركة عقارية", value: "500+" },
      { label: "وقت التشغيل", value: "99.9%" },
    ],
  },
];

const CATEGORIES: { key: PortfolioCategory; label: string; icon: typeof Globe }[] = [
  { key: "all",      label: "الكل",                icon: Globe },
  { key: "website",  label: "مواقع إلكترونية",      icon: Globe },
  { key: "store",    label: "متاجر إلكترونية",       icon: ShoppingBag },
  { key: "campaign", label: "حملات إعلانية",         icon: Megaphone },
  { key: "system",   label: "أنظمة برمجية",          icon: Cpu },
];

/* ─────────────────────────────────────────────── */

const amlakFeatures = [
  { icon: Building2,   ar: "إدارة العقارات والوحدات",  en: "Property & Unit Management",  desc: "تتبّع كل عقار، وحدة، طابق، ومساحة. ارفع الوثائق وحدد الحالات وأدر المحافظ." },
  { icon: Users,       ar: "الملّاك والمستأجرون",       en: "Owners & Renters",              desc: "ملفات شاملة للملاك والمستأجرين مع بيانات الاتصال والوثائق والتاريخ كاملاً." },
  { icon: FileText,    ar: "العقود والتجديدات",         en: "Contracts & Renewals",          desc: "أنشئ وأدر وجدّد العقود رقمياً مع تنبيهات تلقائية قبل انتهاء الإيجار." },
  { icon: CreditCard,  ar: "المدفوعات والتحصيل",        en: "Payments & Collections",        desc: "سجّل مدفوعات الإيجار، تتبّع المتأخرات، وأدر جداول الشيكات برؤية كاملة." },
  { icon: Scale,       ar: "القضايا القانونية",          en: "Legal Case Tracking",           desc: "سجّل وراقب النزاعات القانونية مع أرقام المحاكم وتعيينات المحامين." },
  { icon: Wrench,      ar: "طلبات الصيانة",             en: "Maintenance Requests",          desc: "تذاكر الصيانة مع مستويات الأولوية وتعيينات المقاولين وتتبع التكاليف." },
  { icon: Bell,        ar: "إشعارات ذكية",              en: "Smart Notifications",           desc: "تنبيهات آلية لانتهاء العقود والمدفوعات المتأخرة والشيكات المرتجعة." },
  { icon: ShieldCheck, ar: "التحكم في الصلاحيات",       en: "Role-Based Access Control",     desc: "صلاحيات دقيقة لكل وحدة — تحكم في من يعرض أو ينشئ أو يعدّل أو يحذف." },
];

const serverPlatforms = [
  { icon: Music2,    label: "تيك توك" },
  { icon: Instagram, label: "انستقرام" },
  { icon: Facebook,  label: "فيسبوك" },
  { icon: Youtube,   label: "يوتيوب" },
  { icon: Camera,    label: "سناب شات" },
];


/* ─────────────────────────────────────────────── */
/*  Animations                                     */
/* ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.07 } },
};

/* ─────────────────────────────────────────────── */
/*  Page                                           */
/* ─────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("all");

  const filtered = activeCategory === "all"
    ? clientProjects
    : clientProjects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/projects"
        keywords="Muse Creative Awards دبي, جوائز تسويق الإمارات, GSK Sensodyne جائزة, Aqua de Fonte, Gulf Paints جائزة, أعمال دبي فانز, بورتفوليو تسويق رقمي"
        ogImage={PAGE_META.ogImage}
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000]/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F0B429]/5 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-5"
          >
            نماذج أعمالنا
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[#111827] mb-5 leading-tight"
          >
            أعمالنا ومشاريعنا<br />
            <span className="text-[#CC0000]">نتائج حقيقية لعملاء حقيقيين</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            من المواقع الإلكترونية والمتاجر إلى الأنظمة البرمجية والحملات الإعلانية — نبني حلولاً رقمية متكاملة لأصحاب الأعمال في الإمارات والخليج.
          </motion.p>
        </div>
      </section>

      {/* ── CLIENT PORTFOLIO ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-2">
              نماذج من <span className="text-[#CC0000]">أعمال عملائنا</span>
            </h2>
            <p className="text-[#6B7280] text-base">مواقع إلكترونية، متاجر، وحملات إعلانية أنجزناها لعملائنا</p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-[#CC0000] text-white shadow-md shadow-[#CC0000]/30"
                    : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#CC0000]/20 transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img loading="lazy" decoding="async"
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: project.categoryColor }}
                  >
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-lg font-black text-[#111827] mb-0.5">{project.title}</h3>
                    <p className="text-[#CC0000] text-xs font-semibold">{project.subtitle}</p>
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-4">{project.description}</p>

                  {/* Stats row — campaigns only */}
                  {project.stats && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      {project.stats.map(s => (
                        <div key={s.label} className="text-center">
                          <div className="text-[#15803D] font-black text-sm leading-tight">{s.value}</div>
                          <div className="text-[#6B7280] text-[10px] leading-tight mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map(t => (
                      <span key={t} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2.5 py-1 rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={project.url}
                    target={project.url.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white rounded-xl font-bold text-sm transition-all duration-200"
                  >
                    <ExternalLink size={14} />
                    {project.category === "campaign" ? "ابدأ حملتك" : "زيارة المشروع"}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA to contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center p-10 bg-gradient-to-l from-[#7C0000] to-[#CC0000] rounded-3xl text-white"
          >
            <h3 className="text-2xl font-black mb-2">هل تريد مشروعاً مثل هذه؟</h3>
            <p className="text-white/75 mb-6 text-base">أخبرنا عن فكرتك وسنبني لك الحل الرقمي المناسب</p>
            <a
              href="https://wa.me/971551981564"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#CC0000] font-black px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg text-base"
            >
              ابدأ مشروعك الآن
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="py-20 bg-[#FAFAFA]" id="case-studies">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              📊 دراسات الحالة التفصيلية
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[#111827] mb-3">
              نتائج موثّقة <span className="text-[#CC0000]">بالأرقام الحقيقية</span>
            </h2>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto">
              تقارير تفصيلية عن رحلة العميل، التحديات، الاستراتيجية، والنتائج المحققة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* SameDay Dental */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden hover:shadow-2xl hover:border-[#CC0000]/30 transition-all duration-300 group flex flex-col"
            >
              {/* Cover image */}
              <div className="relative h-52 overflow-hidden bg-[#0A0A0A]">
                <img
                  src="/sameday-dental.webp"
                  alt="SameDay Dental دراسة حالة"
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 right-4 bg-[#CC0000] text-white text-xs font-black px-3 py-1.5 rounded-full">
                  دراسة حالة
                </span>
                {/* Logo */}
                <div className="absolute bottom-4 right-4 bg-white rounded-xl p-2 shadow-lg">
                  <img loading="lazy" decoding="async"
                    src="/sameday-dental-logo.jpg"
                    alt="SameDay Dental logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-xl font-black text-[#111827] mb-1 leading-tight">
                  SameDay Dental
                </h3>
                <p className="text-[#CC0000] text-sm font-semibold mb-3">
                  أول عيادة زراعة أسنان في نفس اليوم بالشرق الأوسط
                </p>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">
                  كيف حوّلنا موقعاً بلا زوار إلى مصدر رئيسي للمرضى — من خلال إعادة بناء الموقع وحملة SEO وإعلانات Google Ads مستهدفة.
                </p>

                {/* Key stat */}
                <div className="flex items-center gap-4 p-4 bg-[#FEF2F2] rounded-2xl border border-[#FECACA] mb-5">
                  <div className="w-12 h-12 bg-[#CC0000] rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#CC0000] leading-none">+80%</div>
                    <div className="text-[#6B7280] text-xs mt-0.5">زيادة في الاستفسارات خلال أول 3 أشهر</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["تصميم موقع", "SEO", "Google Ads", "قطاع طبي"].map(t => (
                    <span key={t} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>
                  ))}
                </div>

                <Link
                  to="/projects/sameday-dental"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#CC0000] text-white rounded-xl font-bold text-sm hover:bg-[#AA0000] transition-colors duration-200 group/btn"
                >
                  اقرأ دراسة الحالة
                  <ArrowLeft size={15} className="group-hover/btn:-translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>

            {/* Health Factory */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden hover:shadow-2xl hover:border-[#F59E0B]/30 transition-all duration-300 group flex flex-col"
            >
              {/* Cover image */}
              <div className="relative h-52 overflow-hidden bg-[#0A0A0A]">
                <img
                  src="/health-factory-website.webp"
                  alt="Health Factory دراسة حالة"
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 right-4 bg-[#F59E0B] text-white text-xs font-black px-3 py-1.5 rounded-full">
                  دراسة حالة
                </span>
                {/* Logo */}
                <div className="absolute bottom-4 right-4 bg-white rounded-xl p-2 shadow-lg">
                  <img loading="lazy" decoding="async"
                    src="/health-factory-logo.jpg"
                    alt="Health Factory logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-xl font-black text-[#111827] mb-1 leading-tight">
                  Health Factory
                </h3>
                <p className="text-[#F59E0B] text-sm font-semibold mb-3">
                  مصنع منتجات صحية — الإمارات
                </p>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-1">
                  كيف حققنا عائداً 7.6× على الاستثمار لمصنع منتجات صحية في الإمارات — باستخدام Google Ads واستهداف دقيق وصفحات هبوط محسّنة.
                </p>

                {/* Key stat */}
                <div className="flex items-center gap-4 p-4 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] mb-5">
                  <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#D97706] leading-none">7.6×</div>
                    <div className="text-[#6B7280] text-xs mt-0.5">عائد على الاستثمار (ROI) من حملات Google Ads</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["Google Ads", "صفحات هبوط", "تحليل بيانات", "قطاع صحي"].map(t => (
                    <span key={t} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>
                  ))}
                </div>

                <Link
                  to="/projects/health-factory"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#F59E0B] text-white rounded-xl font-bold text-sm hover:bg-[#D97706] transition-colors duration-200 group/btn"
                >
                  اقرأ دراسة الحالة
                  <ArrowLeft size={15} className="group-hover/btn:-translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              معرض الأعمال
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[#111827] mb-3">
              لقطات من <span className="text-[#CC0000]">أعمالنا الإبداعية</span>
            </h2>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto">
              تصميم العلامات التجارية، التغليف، الحملات الإعلانية، والتسويق الرقمي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { src: "/portfolio-timeline.webp",     label: "مسيرتنا من 2004 إلى 2024",                     tag: "تاريخنا",           color: "#6366F1" },
              { src: "/portfolio-gulf-paints.webp",  label: "أصباغ الخليج — Muse Gold Winner 2022",         tag: "جوائز",             color: "#F0B429" },
              { src: "/portfolio-saha.webp",         label: "صحة — تصميم تغليف المنتجات",                   tag: "تصميم تغليف",       color: "#10B981" },
              { src: "/portfolio-sundent.webp",      label: "Sundent & HairMax — حملة الصيدليات",            tag: "حملات تسويقية",     color: "#CC0000" },
              { src: "/portfolio-social-media.webp", label: "إدارة وسائل التواصل الاجتماعي",                tag: "سوشيال ميديا",      color: "#8B5CF6" },
              { src: "/portfolio-work6.webp",        label: "The Watch House — حملات موسمية",               tag: "إعلانات موسمية",    color: "#F59E0B" },
              { src: "/portfolio-work7.webp",        label: "GJEPC / IJEX — معرض المجوهرات في دبي",         tag: "تسويق فعاليات",     color: "#D97706" },
              { src: "/portfolio-work8.webp",        label: "GSK Sensodyne — مواد AR التفاعلية",            tag: "واقع معزز",         color: "#06B6D4" },
              { src: "/portfolio-work9.webp",        label: "آراء العملاء — Client Testimonials",           tag: "تجربة العملاء",     color: "#EC4899" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#CC0000]/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 bg-[#F8F8F8]">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span
                    className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.tag}
                  </span>
                </div>
                {/* Label */}
                <div className="px-5 py-4">
                  <p className="text-[#111827] font-bold text-sm leading-snug text-right">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* INTERNATIONAL AWARDS                       */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-white" id="awards">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#F0B429]/10 text-[#B8860B] text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-[#F0B429]/30">
              🏆 جوائز دولية
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[#111827] mb-3">
              أعمالنا الفائزة بـ<span className="text-[#F0B429]"> Muse Creative Awards</span>
            </h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto">
              تكريم دولي لأعمال إبداعية نفّذناها لعملاء في الإمارات — تصميم الهوية البصرية، التجارب التفاعلية، وحملات العلامات التجارية
            </p>
          </motion.div>

          <div className="space-y-8 max-w-4xl mx-auto">

            {/* GSK Sensodyne — Silver */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#CC0000]/20 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 shrink-0 bg-[#8B0000]">
                  <img
                    src="/award-gsk-sensodyne.webp"
                    alt="Muse Creative Awards 2023 Silver – GSK Sensodyne Interactive Touchless Display"
                    className="w-full h-full object-cover min-h-[220px]"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#F0B429]/15 text-[#B8860B] text-xs font-black border border-[#F0B429]/30">
                      Muse Creative Awards 2023
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#9CA3AF]/15 text-[#6B7280] text-xs font-bold">
                      🥈 Silver Winner
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-bold">
                      Experiential / Interactive
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-tight">
                    حامل تفاعلي بدون لمس — GSK Sensodyne & Parodontax
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                    صمّمنا وصنّعنا وركّبنا جناح عرض GSK Sensodyne وParodontax الحائز على جوائز دولية في مؤتمر الإمارات الدولي لطب الأسنان ومعرض طب الأسنان العربي (AEEDC) في مركز دبي التجاري العالمي. ابتكرنا استراتيجية تفاعلية خالية من التلامس للزوار، مما أتاح تجربة غامرة وعززت تذكّر العلامة التجارية بين أكثر من 65,000 زائر من 160 دولة.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "الحدث", value: "AEEDC 2023" },
                      { label: "المكان", value: "مركز دبي التجاري العالمي" },
                      { label: "الصناعة", value: "الرعاية الصحية" },
                      { label: "نوع العمل", value: "تجربة تفاعلية" },
                      { label: "العميل", value: "GSK — Sensodyne" },
                      { label: "الجائزة", value: "Silver — Muse 2023" },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                        <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase mb-0.5">{label}</p>
                        <p className="text-[#111827] font-bold text-xs">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Aqua de Fonte — Gold */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#F0B429]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 shrink-0 bg-[#B8860B]">
                  <img
                    src="/award-aqua-de-fonte.webp"
                    alt="Muse Creative Awards 2023 Gold – Aqua de Fonte Brand Strategy UAE"
                    className="w-full h-full object-cover min-h-[220px]"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#F0B429]/15 text-[#B8860B] text-xs font-black border border-[#F0B429]/30">
                      Muse Creative Awards 2023
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F0B429]/25 text-[#B8860B] text-xs font-bold">
                      🥇 Gold Winner
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#065F46] text-xs font-bold">
                      Brand Strategy
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-tight">
                    استراتيجية العلامة التجارية — Aqua de Fonte
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                    ابتكرنا هوية علامة تجارية مميزة لأكوا دي فونتي مع إطلاق حملة "تذوق الحياة في كل قطرة". واجهنا سوق المياه المعبّأة في الإمارات — أحد أكبر الأسواق عالمياً بأكثر من 25 علامة تجارية منافسة — ونجحنا في ترسيخ مكانة أكوا دي فونتي كعلامة عصرية وشبابية وحيوية، مما أوجد ميزة تنافسية واضحة في سوق شديدة التشبع، وحقق الفوز بالذهبية في Muse Creative Awards.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "السوق", value: "الإمارات العربية المتحدة" },
                      { label: "القطاع", value: "المياه المعبّأة" },
                      { label: "نوع العمل", value: "استراتيجية العلامة التجارية" },
                      { label: "الحملة", value: "تذوق الحياة في كل قطرة" },
                      { label: "المنافسون", value: "+25 علامة تجارية" },
                      { label: "الجائزة", value: "Gold — Muse 2023" },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#FFFBEB] rounded-xl p-3 border border-[#F0B429]/20">
                        <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase mb-0.5">{label}</p>
                        <p className="text-[#111827] font-bold text-xs">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gulf Paints — Gold 2022 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#F0B429]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 shrink-0 bg-[#1E3A5F] flex items-center justify-center p-6 min-h-[200px]">
                  <img
                    src="/portfolio-gulf-paints.webp"
                    alt="Gulf Paints Muse Creative Awards Gold 2022"
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#F0B429]/15 text-[#B8860B] text-xs font-black border border-[#F0B429]/30">
                      Muse Creative Awards 2022
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F0B429]/25 text-[#B8860B] text-xs font-bold">
                      🥇 Gold Winner
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#1D4ED8] text-xs font-bold">
                      Marketing Campaign
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-tight">
                    حملة العلامة التجارية — Gulf Paints
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                    فازت الحملة الإبداعية التي نفّذناها لأصباغ الخليج بجائزة Muse Creative Awards الذهبية لعام 2022، في فئة الحملات التسويقية. الحملة التي دمجت الهوية البصرية مع رسائل تسويقية مؤثرة أسهمت في تعزيز حضور العلامة التجارية في سوق الإمارات والمنطقة.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "العميل", value: "Gulf Paints" },
                      { label: "الفئة", value: "حملات تسويقية" },
                      { label: "السنة", value: "2022" },
                      { label: "الجائزة", value: "Gold — Muse 2022" },
                      { label: "القطاع", value: "الدهانات والديكور" },
                      { label: "السوق", value: "الإمارات والخليج" },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#FFFBEB] rounded-xl p-3 border border-[#F0B429]/20">
                        <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase mb-0.5">{label}</p>
                        <p className="text-[#111827] font-bold text-xs">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="container mx-auto px-6 py-4">
        <div className="border-t border-[#E5E7EB]" />
        <p className="text-center text-[#9CA3AF] text-sm mt-4 font-semibold">منظومتنا الرقمية الداخلية</p>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* PROJECT 1 — AMLAK OS                       */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Header card */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="flex flex-col md:flex-row items-center gap-8 mb-14 bg-gradient-to-l from-[#0F172A] to-[#1E293B] rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden relative"
          >
            {/* bg accent */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#3B82F6]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#CC0000]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Logo / icon */}
            <div className="relative z-10 flex-shrink-0 w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 size={44} className="text-white" />
            </div>

            <div className="relative z-10 flex-1 text-center md:text-right">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-2">
                <h2 className="text-3xl md:text-4xl font-black">AMLAK OS</h2>
                <span className="bg-[#3B82F6]/20 text-[#93C5FD] text-xs font-bold px-3 py-1 rounded-full border border-[#3B82F6]/30">نظام SaaS</span>
              </div>
              <p className="text-white/70 text-base mb-1">نظام متكامل لإدارة العقارات والأملاك — مبني للعالم العربي</p>
              <p className="text-white/50 text-sm">Real Estate & Property Management System</p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <a
                href="https://amlakly.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#3B82F6]/30"
              >
                <ExternalLink size={16} />
                زيارة الموقع
              </a>
            </div>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {amlakFeatures.map(({ icon: Icon, ar, en, desc }) => (
              <motion.div
                key={ar}
                variants={fadeUp}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md hover:border-[#3B82F6]/30 transition-all duration-200 group"
              >
                <div className="w-11 h-11 bg-[#EFF6FF] group-hover:bg-[#3B82F6] rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                  <Icon size={20} className="text-[#3B82F6] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-bold text-[#111827] text-sm mb-0.5">{ar}</h3>
                <p className="text-[#9CA3AF] text-xs mb-2">{en}</p>
                <p className="text-[#6B7280] text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* PROJECT 2 — سيرفر دبي فانز               */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-6">
          {/* Header card */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="flex flex-col md:flex-row items-center gap-8 mb-14 bg-gradient-to-l from-[#7C0000] to-[#CC0000] rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Logo */}
            <div className="relative z-10 flex-shrink-0 w-24 h-24 md:w-28 md:h-28 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
              <span className="text-4xl font-black">D</span>
            </div>

            <div className="relative z-10 flex-1 text-center md:text-right">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-2">
                <h2 className="text-3xl md:text-4xl font-black">سيرفر دبي فانز</h2>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">متجر إلكتروني</span>
              </div>
              <p className="text-white/80 text-base mb-1">متجر المتابعين الأعلى في الإمارات</p>
              <p className="text-white/60 text-sm">أسرع وأسهل موقع لزيادة المتابعين والتفاعل</p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <a
                href="https://mtuaefans.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#CC0000] font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:bg-white/90"
              >
                <ExternalLink size={16} />
                زيارة المتجر
              </a>
            </div>
          </motion.div>

          {/* Description + platforms */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-7"
            >
              <h3 className="text-xl font-bold text-[#111827] mb-4">عن المنصة</h3>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                أهلاً بك في عالم الشهرة. لدينا مجموعة واسعة من خدمات زيادة المتابعين والتفاعل بشكل بسيط وسريع.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                متجرنا يُعتبر الأسهل والأسرع في خدمات زيادة المتابعين والتفاعل على منصات التواصل الاجتماعي في الإمارات والعالم العربي.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[#111827] font-semibold text-sm">الموقع نشط ويعمل</span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-7"
            >
              <h3 className="text-xl font-bold text-[#111827] mb-5">المنصات المدعومة</h3>
              <div className="grid grid-cols-1 gap-3">
                {serverPlatforms.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA]">
                    <div className="w-9 h-9 bg-[#CC0000] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="font-semibold text-[#111827] text-sm">{label}</span>
                    <span className="mr-auto text-[#CC0000] text-xs font-bold">متاح</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* كلمة الشريك المؤسس                        */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <img loading="lazy" decoding="async"
              src="/founder-message.webp"
              alt="كلمة الشريك المؤسس محمود طارق — mtuaefans Digital Marketing"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA footer banner ── */}
      <section className="py-16 bg-[#111827]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              مشاريع ضخمة تحت سقف واحد
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              هل لديك مشروع أو فكرة؟ تواصل معنا وسنبني معك الحل المناسب.
            </p>
            <a
              href="https://wa.me/971551981564"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-[#CC0000]/30"
            >
              تواصل معنا عبر واتساب
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
