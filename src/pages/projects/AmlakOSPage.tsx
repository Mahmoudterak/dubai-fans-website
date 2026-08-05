import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  Building2, Users, FileText, CreditCard, Scale, Wrench,
  Bell, ShieldCheck, ExternalLink, ArrowLeft, CheckCircle,
  Globe, Layers,
} from "lucide-react";

const BASE = "https://mtuaefans.com";

const features = [
  {
    icon: Building2,
    title: "إدارة العقارات والوحدات",
    en: "Property & Unit Management",
    desc: "تتبّع كل عقار، وحدة، طابق، ومساحة. ارفع الوثائق وحدد الحالات وأدر المحافظ بسهولة تامة.",
    color: "#2563EB",
  },
  {
    icon: Users,
    title: "الملّاك والمستأجرون",
    en: "Owners & Renters",
    desc: "ملفات شاملة للملاك والمستأجرين مع بيانات الاتصال والوثائق والتاريخ كاملاً في مكان واحد.",
    color: "#0891B2",
  },
  {
    icon: FileText,
    title: "العقود والتجديدات",
    en: "Contracts & Renewals",
    desc: "أنشئ وأدر وجدّد العقود رقمياً مع تنبيهات تلقائية قبل انتهاء الإيجار بما يكفي للتحضير.",
    color: "#7C3AED",
  },
  {
    icon: CreditCard,
    title: "المدفوعات والتحصيل",
    en: "Payments & Collections",
    desc: "سجّل مدفوعات الإيجار، تتبّع المتأخرات، وأدر جداول الشيكات برؤية مالية كاملة وفورية.",
    color: "#059669",
  },
  {
    icon: Scale,
    title: "القضايا القانونية",
    en: "Legal Case Tracking",
    desc: "سجّل وراقب النزاعات القانونية مع أرقام المحاكم وتعيينات المحامين وتواريخ الجلسات.",
    color: "#DC2626",
  },
  {
    icon: Wrench,
    title: "طلبات الصيانة",
    en: "Maintenance Requests",
    desc: "تذاكر صيانة مُنظَّمة مع مستويات الأولوية وتعيينات المقاولين وتتبع التكاليف تفصيلياً.",
    color: "#D97706",
  },
  {
    icon: Bell,
    title: "إشعارات ذكية",
    en: "Smart Notifications",
    desc: "تنبيهات آلية لانتهاء العقود والمدفوعات المتأخرة والشيكات المرتجعة — لا شيء يفوتك.",
    color: "#2563EB",
  },
  {
    icon: ShieldCheck,
    title: "التحكم في الصلاحيات",
    en: "Role-Based Access Control",
    desc: "صلاحيات دقيقة لكل وحدة — تحكم في من يعرض أو ينشئ أو يعدّل أو يحذف بمرونة كاملة.",
    color: "#0891B2",
  },
];

const highlights = [
  { value: "50K+", label: "وحدة مُدارة" },
  { value: "500+", label: "شركة عقارية" },
  { value: "99.9%", label: "وقت التشغيل" },
  { value: "24/7", label: "دعم فني" },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

export default function AmlakOSPage() {
  return (
    <>
      <SEOHead
        title="AMLAK OS — نظام SaaS لإدارة العقارات والأملاك | دبي فانز"
        description="AMLAK OS نظام متكامل لإدارة العقارات والأملاك مبني للعالم العربي — إدارة العقود والمستأجرين والمدفوعات والصيانة والقضايا القانونية من مكان واحد."
        keywords="AMLAK OS, نظام إدارة عقارات, برنامج عقارات, SaaS عقاري, amlakly"
        canonical={`${BASE}/projects/amlak-os`}
        ogImage={`${BASE}/portfolio/aqarlines-website.webp`}
        ogType="article"
      />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        dir="rtl"
        className="relative pt-28 pb-20 px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)" }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-400/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Back */}
          <motion.div initial="hidden" animate="show" custom={0} variants={fade} className="mb-8 text-right">
            <Link href="/projects">
              <span className="inline-flex items-center gap-2 text-blue-300 text-sm hover:text-white transition-colors">
                <ArrowLeft size={15} className="rotate-180" />
                العودة إلى أعمالنا
              </span>
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div initial="hidden" animate="show" custom={0.05} variants={fade} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Layers size={13} />
              نظام SaaS — مبني للعالم العربي
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial="hidden" animate="show" custom={0.1} variants={fade}
            className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight"
          >
            AMLAK OS
          </motion.h1>
          <motion.p
            initial="hidden" animate="show" custom={0.15} variants={fade}
            className="text-blue-300 text-lg font-semibold mb-4"
          >
            Real Estate &amp; Property Management System
          </motion.p>
          <motion.p
            initial="hidden" animate="show" custom={0.2} variants={fade}
            className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto mb-10"
          >
            نظام متكامل لإدارة العقارات والأملاك — يجمع العقود والمستأجرين والمدفوعات والصيانة والقضايا القانونية في منصة واحدة، بالعربية والإنجليزية.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden" animate="show" custom={0.25} variants={fade}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="https://amlakly.app/register"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              ابدأ تجربتك المجانية
            </a>
            <a
              href="https://amlakly.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              تسجيل الدخول
            </a>
            <a
              href="https://amlakly.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Globe size={14} />
              زيارة الموقع
              <ExternalLink size={12} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section dir="rtl" className="py-12 bg-[#0F172A] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.07}
              variants={fade}
            >
              <p className="text-3xl font-black text-blue-400">{h.value}</p>
              <p className="text-sm text-slate-400 mt-1">{h.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section dir="rtl" className="py-20 px-4 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
            variants={fade}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-500/25 mb-4">
              مميزات النظام
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              نظام إدارة العقارات
            </h2>
            <p className="text-slate-400 text-base">
              كل ما تحتاجه لإدارة محفظتك العقارية في منصة واحدة متكاملة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
                custom={i * 0.06} variants={fade}
                className="rounded-2xl p-5 border border-white/8 hover:border-blue-500/40 transition-all duration-300 group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-black text-sm mb-0.5">{f.title}</h3>
                <p className="text-slate-500 text-[11px] mb-2 font-medium">{f.en}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AMLAK OS ─────────────────────────────────────────────── */}
      <section dir="rtl" className="py-16 px-4 bg-[#0A1122]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade}
            className="rounded-2xl p-8 sm:p-12 border border-blue-500/20"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(8,145,178,0.08) 100%)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
              لماذا AMLAK OS؟
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "مبني خصيصاً للسوق العربي مع دعم كامل للغة العربية RTL",
                "متعدد المستخدمين مع صلاحيات دقيقة لكل فرد في الفريق",
                "تنبيهات تلقائية لا تترك شيئاً يفوتك أو يتأخر",
                "سحابي 100% — لا تثبيت، لا خوادم، ابدأ فوراً",
                "يعمل على الجوال والتابلت والحاسوب بتجربة سلسة",
                "أمان عالي المستوى لبيانات عملائك وعقاراتك",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.06} variants={fade}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────────────────── */}
      <section
        dir="rtl"
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)" }}
      >
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            ابدأ إدارة عقاراتك باحترافية
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            لا بطاقة ائتمانية مطلوبة — سجّل شركتك وابدأ فوراً
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://amlakly.app/register"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-blue-900/50 hover:-translate-y-0.5"
            >
              ابدأ تجربتك المجانية
            </a>
            <a
              href="https://amlakly.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all"
            >
              تسجيل الدخول
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
