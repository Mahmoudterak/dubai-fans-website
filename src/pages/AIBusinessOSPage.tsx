import { useState, useRef } from "react";
import { softwareApplicationSchema, aiBusinessOsFaqSchema } from "@/seo/schemas.mjs";
import { Input }   from "@workspace/dubai-fans-ds/components/ui/input";
import { Label }   from "@workspace/dubai-fans-ds/components/ui/label";
import { Button }  from "@workspace/dubai-fans-ds/components/ui/button";
import { Spinner } from "@workspace/dubai-fans-ds/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/dubai-fans-ds/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BarChart2, Bot, TrendingUp, Globe, Instagram, Facebook,
  Music2, MapPin, Target, FileText, CalendarDays, Megaphone,
  DollarSign, FileDown, ChevronDown, CheckCircle, Zap, Shield,
  Clock, Award, ArrowRight, Play, Star, LayoutDashboard,
  Sparkles, FileBarChart, Brain, BarChart3,
} from "lucide-react";

/* ─── animations ─────────────────────────────────────────── */
import { getRouteMeta } from "@/seo/routes-meta.mjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

/* ─── Section 2: what-to-do cards ───────────────────────── */
const whatCards = [
  { icon: BarChart2,    title: "تحليل نشاطي",              desc: "تحليل شامل لنشاطك التجاري من الألف إلى الياء",    route: "/ai-business-os/audit" },
  { icon: Bot,          title: "مستشار الأعمال الذكي",    desc: "إجابات فورية لكل أسئلتك التسويقية والتجارية",   route: "/ai-business-os/consultant" },
  { icon: TrendingUp,   title: "تحليل المنافسين",          desc: "اكتشف نقاط قوة وضعف منافسيك بدقة عالية",        route: "/ai-business-os/audit" },
  { icon: Globe,        title: "تحليل الموقع الإلكتروني", desc: "سرعة، SEO، تجربة مستخدم — كل شيء في تقرير واحد", route: "/ai-business-os/audit" },
  { icon: Instagram,    title: "تحليل Instagram",          desc: "أداء حسابك، نسب التفاعل، أفضل المنشورات",        route: "/ai-business-os/audit" },
  { icon: Facebook,     title: "تحليل Facebook",           desc: "معدلات الوصول، التفاعل، فاعلية الإعلانات",       route: "/ai-business-os/audit" },
  { icon: Music2,       title: "تحليل TikTok",             desc: "اكتشف الترندات وحسّن أداء فيديوهاتك",            route: "/ai-business-os/audit" },
  { icon: MapPin,       title: "تحليل Google Business",   desc: "ظهورك المحلي وتقييمات العملاء وفرص التحسين",    route: "/ai-business-os/audit" },
  { icon: Target,       title: "إنشاء خطة تسويق",         desc: "خطة تسويقية كاملة مخصصة لنشاطك",                route: "/ai-business-os/planner" },
  { icon: FileText,     title: "إنشاء محتوى",              desc: "محتوى احترافي بالذكاء الاصطناعي لكل منصة",       route: "/ai-business-os/consultant" },
  { icon: CalendarDays, title: "خطة محتوى",                desc: "جدول نشر منظم لأشهر قادمة",                      route: "/ai-business-os/planner" },
  { icon: Megaphone,    title: "إنشاء حملة إعلانية",      desc: "حملات Meta وGoogle جاهزة للإطلاق",                route: "/ai-business-os/planner" },
  { icon: DollarSign,   title: "حساب الأرباح",             desc: "ROI، الهامش، نقطة التعادل — محسوبة بدقة",        route: "/ai-business-os/consultant" },
  { icon: FileDown,     title: "إنشاء تقرير PDF",          desc: "تقارير احترافية تحمل شعار شركتك",                route: "/ai-business-os/reports" },
  { icon: Sparkles,     title: "أدوات مجانية",             desc: "14 أداة تسويقية: هاشتاجات، ROI، واتساب، كلمات مفتاحية وأكثر", route: "/ai-business-os/tools" },
];

/* ─── Section 3: how it works ───────────────────────────── */
const howSteps = [
  { num: 1, title: "اختر ما تريد تحليله",           desc: "حدد النشاط أو القناة أو الهدف الذي تريد البدء به" },
  { num: 2, title: "يراجع الذكاء الاصطناعي نشاطك",  desc: "يجمع البيانات من مصادر متعددة ويحللها في ثوانٍ" },
  { num: 3, title: "يبني تقريرًا احترافيًا",         desc: "تقرير مفصّل بالأرقام والرسوم البيانية" },
  { num: 4, title: "يقترح خطة تطوير",               desc: "توصيات مخصصة وقابلة للتنفيذ فورًا" },
  { num: 5, title: "ينفذ التوصيات باستخدام AI",      desc: "ينشئ المحتوى والحملات والتقارير تلقائيًا" },
  { num: 6, title: "يتابع النتائج باستمرار",         desc: "مراقبة دورية لمؤشرات الأداء ورفع تقارير تلقائية" },
];

/* ─── Section 4: modules ────────────────────────────────── */
const modules = [
  {
    icon: BarChart3,
    title: "AI Business Audit",
    badge: "الأكثر شمولاً",
    badgeColor: "#CC0000",
    desc: "يقوم بتحليل نشاطك بالكامل من جميع الزوايا الرقمية.",
    features: ["Website", "SEO", "Instagram", "Facebook", "TikTok", "Google Business", "Brand", "Content", "Performance"],
    cta: "ابدأ التحليل",
    route: "/ai-business-os/audit",
  },
  {
    icon: LayoutDashboard,
    title: "AI Business Dashboard",
    badge: "لوحة التحكم",
    badgeColor: "#3B82F6",
    desc: "لوحة تحكم تعرض صحة نشاطك التجاري بالكامل لحظةً بلحظة.",
    features: ["Business Score", "Marketing Score", "SEO", "Sales", "Growth", "Conversion", "Website", "Social Media"],
    cta: "فتح لوحة التحكم",
    route: "/ai-business-os/dashboard",
  },
  {
    icon: Brain,
    title: "AI Consultant",
    badge: "مستشارك الذكي",
    badgeColor: "#8B5CF6",
    desc: "مستشار أعمال يعمل بالذكاء الاصطناعي — يجيب عن أي سؤال يتعلق بالتسويق أو النمو أو المبيعات.",
    features: ["تسويق", "مبيعات", "نمو", "تحليل", "استراتيجية", "منافسين"],
    cta: "اسأل الآن",
    route: "/ai-business-os/consultant",
  },
  {
    icon: Target,
    title: "AI Marketing Planner",
    badge: "خطط بذكاء",
    badgeColor: "#10B981",
    desc: "يبني خطة تسويق كاملة ومخصصة لنشاطك لأي فترة زمنية.",
    features: ["خطة 30 يوم", "خطة 90 يوم", "خطة سنوية", "محتوى", "ميزانية", "KPIs"],
    cta: "أنشئ خطتك",
    route: "/ai-business-os/planner",
  },
  {
    icon: FileBarChart,
    title: "AI Reports",
    badge: "تقارير PDF",
    badgeColor: "#D97706",
    desc: "إنشاء تقارير احترافية PDF تحمل شعار شركتك وجاهزة للعرض.",
    features: ["PDF احترافي", "شعار شركتك", "رسوم بيانية", "توصيات", "KPIs", "مقارنة"],
    cta: "إنشاء تقرير",
    route: "/ai-business-os/reports",
  },
  {
    icon: Sparkles,
    title: "أدوات مجانية",
    badge: "مجاناً 100%",
    badgeColor: "#6366F1",
    desc: "14 أداة تسويقية مجانية: فحص مجاني، مولد هاشتاجات، حاسبة ROI، رابط واتساب، وأكثر.",
    features: ["فحص مجاني", "هاشتاجات", "ROI", "كلمات مفتاحية", "واتساب", "محتوى"],
    cta: "جرّب الأدوات",
    route: "/ai-business-os/tools",
  },
];

/* ─── Section 5: why stats ──────────────────────────────── */
const whyStats = [
  { icon: Clock,        value: "80%+",  label: "وفر من وقت التحليل",           color: "#CC0000" },
  { icon: DollarSign,   value: "60%",   label: "تقليل تكلفة التسويق",           color: "#10B981" },
  { icon: Zap,          value: "3×",    label: "سرعة في اتخاذ القرار",          color: "#3B82F6" },
  { icon: Shield,       value: "24/7",  label: "مراقبة نشاطك باستمرار",         color: "#8B5CF6" },
  { icon: Award,        value: "100%",  label: "خطة تطوير جاهزة ومخصصة",       color: "#D97706" },
];

/* ─── Section 6: dashboard mock data ───────────────────── */
const areaData = [
  { name: "يناير", نمو: 40, مبيعات: 24, تسويق: 55 },
  { name: "فبراير", نمو: 55, مبيعات: 39, تسويق: 62 },
  { name: "مارس", نمو: 65, مبيعات: 48, تسويق: 70 },
  { name: "أبريل", نمو: 72, مبيعات: 56, تسويق: 75 },
  { name: "مايو", نمو: 81, مبيعات: 63, تسويق: 82 },
  { name: "يونيو", نمو: 91, مبيعات: 78, تسويق: 90 },
];
const barData = [
  { name: "Instagram", قيمة: 87 },
  { name: "Facebook",  قيمة: 72 },
  { name: "TikTok",    قيمة: 65 },
  { name: "Google",    قيمة: 91 },
  { name: "Website",   قيمة: 78 },
];
const radialData = [
  { name: "Business",  value: 92, fill: "#CC0000" },
  { name: "Marketing", value: 84, fill: "#D97706" },
  { name: "SEO",       value: 87, fill: "#3B82F6" },
  { name: "Growth",    value: 91, fill: "#10B981" },
];
const dashTabs = ["Business Health", "Marketing", "SEO", "Sales", "Growth", "Tasks", "Reports", "Recommendations"];

/* ─── Section 7: report scores ─────────────────────────── */
const reportScores = [
  { label: "Business Score", score: 92, color: "#CC0000" },
  { label: "SEO",             score: 87, color: "#3B82F6" },
  { label: "Content",         score: 81, color: "#10B981" },
  { label: "Growth",          score: 91, color: "#D97706" },
];

/* ─── Section 8: FAQ ────────────────────────────────────── */
const faqs = [
  {
    q: "ما هو AI Business OS؟",
    a: "AI Business OS هو منصة عربية متكاملة تستخدم الذكاء الاصطناعي لتحليل نشاطك التجاري من جميع الجوانب الرقمية — السوشيال ميديا، الموقع، SEO، والأداء العام — وتقديم تقارير وخطط تطوير مخصصة.",
  },
  {
    q: "هل يحتاج استخدامه خبرة تقنية؟",
    a: "لا على الإطلاق. المنصة مصممة لتكون بسيطة وسهلة الاستخدام لأي صاحب نشاط تجاري حتى بدون خبرة تقنية. فقط أدخل معلومات نشاطك واحصل على تقريرك فورًا.",
  },
  {
    q: "هل يعمل مع جميع أنواع الأنشطة التجارية؟",
    a: "نعم، يعمل مع الأنشطة التجارية في جميع القطاعات — المطاعم، العيادات، المتاجر، الخدمات، العقارات، التعليم، وغيرها. الذكاء الاصطناعي يخصص التحليل لطبيعة نشاطك.",
  },
  {
    q: "هل التقارير قابلة للتحميل؟",
    a: "نعم، يمكنك تحميل تقاريرك بصيغة PDF احترافية تحمل شعار شركتك، وجاهزة للعرض على العملاء أو الشركاء.",
  },
  {
    q: "هل يوجد اشتراك مجاني؟",
    a: "نعم، يمكنك البدء مجانًا وتحليل نشاطك الأول دون أي تكلفة. للحصول على تقارير متقدمة وخطط تسويق شاملة، يوجد خيارات اشتراك بأسعار مناسبة.",
  },
];

/* ══════════════════════════════════════════════════════════ */

export default function AIBusinessOSPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Early Access form state ── */
  const [leadForm, setLeadForm] = useState({ name: "", email: "", businessType: "", city: "" });
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [leadError, setLeadError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (leadStatus === "loading" || leadStatus === "done") return;
    setLeadStatus("loading");
    setLeadError("");
    try {
      const res = await fetch("/api/ai-business-os/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body:    JSON.stringify(leadForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "خطأ غير معروف");
      setLeadStatus("done");
    } catch (err: any) {
      setLeadError(err.message ?? "حدث خطأ — يرجى المحاولة مجدداً");
      setLeadStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/ai-business-os"
        keywords="AI Business OS, ذكاء اصطناعي أعمال, تحليل نشاط تجاري, منصة إدارة أعمال ذكية, تسويق رقمي بالذكاء الاصطناعي, دبي فانز"
        ogImage={PAGE_META.ogImage}
        jsonLd={[softwareApplicationSchema, aiBusinessOsFaqSchema]}
      />
      <Navbar />
      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#06060F] pt-28 pb-20">
        {/* Animated blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-[#CC0000]/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#1E1B4B]/60 rounded-full blur-[140px]" style={{ animation: "pulse 4s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D97706]/10 rounded-full blur-[120px]" />

        {/* Glassmorphism grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-8"
            >
              <Sparkles size={15} className="text-[#D97706]" />
              أول منصة عربية بالذكاء الاصطناعي
              <Sparkles size={15} className="text-[#D97706]" />
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            >
              🚀{" "}
              <span className="bg-gradient-to-l from-[#D97706] via-[#CC0000] to-[#FF6B6B] bg-clip-text text-transparent">
                AI Business OS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 font-semibold mb-5 leading-relaxed"
            >
              أول منصة عربية تعتمد على الذكاء الاصطناعي لمساعدة أصحاب الأنشطة التجارية
              <br className="hidden md:block" /> على تحليل وإدارة وتنمية أعمالهم من مكان واحد.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-white/50 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              بدلاً من استخدام عشرات الأدوات المختلفة، يمنحك AI Business OS كل ما تحتاج إليه
              لإدارة نشاطك التجاري، وتحليل أدائه، وإنشاء الخطط التسويقية، ومتابعة النمو.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <button
                onClick={() => navigate("/ai-business-os/audit")}
                className="inline-flex items-center gap-2 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(204,0,0,0.5)] transition-all duration-300 text-lg"
              >
                <Zap size={20} />
                ابدأ التحليل مجانًا
              </button>
              <button
                onClick={() => navigate("/ai-business-os/consultant")}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
              >
                <Play size={18} className="text-[#D97706]" />
                جرّب المستشار الذكي
              </button>
            </motion.div>

            {/* Glassmorphism floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
            >
              {[
                { val: "14+", label: "أداة متكاملة" },
                { val: "80%", label: "توفير في الوقت" },
                { val: "5×", label: "نمو أسرع" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-xs text-white/60 mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* ══════════ 2. WHAT TO DO ══════════ */}
      <section className="py-24 bg-[#F3F4F6]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              وحدات المنصة
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4">
              ماذا تريد أن تنجز اليوم؟
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              اختر من بين 14 وحدة مدعومة بالذكاء الاصطناعي
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {whatCards.map(({ icon: Icon, title, desc, route }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => navigate(route)}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#CC0000]/40 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-[#CC0000]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CC0000]/20 transition-colors">
                  <Icon size={22} className="text-[#CC0000]" />
                </div>
                <h3 className="font-black text-[#111827] mb-2 text-lg">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{desc}</p>
                <button className="inline-flex items-center gap-1.5 text-[#CC0000] text-sm font-bold hover:gap-2.5 transition-all">
                  ابدأ الآن <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ══════════ 3. HOW IT WORKS ══════════ */}
      <section className="py-24 bg-[#111827] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1E1B4B]/30 rounded-full blur-[100px]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block bg-white/10 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              آلية العمل
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              كيف يعمل النظام؟
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto relative">
            {/* vertical line */}
            <div className="absolute right-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#CC0000] via-[#D97706] to-[#CC0000]/20" />
            <div className="space-y-6">
              {howSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex items-start gap-6 pr-16"
                >
                  {/* step dot */}
                  <div className="absolute right-0 top-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#CC0000] to-[#880000] flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(204,0,0,0.4)] shrink-0">
                    {step.num}
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex-1 hover:border-[#CC0000]/30 transition-colors">
                    <h3 className="text-white font-black text-lg mb-1">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ══════════ 4. MODULES ══════════ */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              المنصة الكاملة
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827]">
              الوحدات الرئيسية
            </h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {modules.map(({ icon: Icon, title, badge, badgeColor, desc, features, cta, route }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`bg-white rounded-3xl p-7 border border-[#E5E7EB] hover:shadow-2xl hover:border-[#CC0000]/20 transition-all duration-400 group relative overflow-hidden ${i === 0 ? "md:col-span-2 xl:col-span-1" : ""}`}
              >
                {/* gradient bg on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CC0000]/0 via-transparent to-[#CC0000]/0 group-hover:from-[#CC0000]/[0.03] transition-all duration-500 rounded-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: `${badgeColor}20` }}
                    >
                      <Icon size={26} style={{ color: badgeColor }} />
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ background: badgeColor }}
                    >
                      {badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#111827] mb-2">{title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{desc}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {features.map((f) => (
                      <span key={f} className="bg-[#F3F4F6] text-[#374151] text-xs font-semibold px-3 py-1 rounded-full border border-[#E5E7EB]">
                        {f}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(route)}
                    className="w-full py-3 rounded-xl font-black text-white text-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${badgeColor}, ${badgeColor}CC)` }}
                  >
                    {cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ══════════ 5. WHY STATS ══════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#CC0000]/5 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#D97706]/10 text-[#D97706] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              المزايا
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827]">
              لماذا AI Business OS؟
            </h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          >
            {whyStats.map(({ icon: Icon, value, label, color }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={24} style={{ color }} />
                </div>
                <div className="text-3xl font-black mb-2" style={{ color }}>{value}</div>
                <p className="text-[#6B7280] text-sm font-semibold leading-snug">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* benefits list */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10"
          >
            {[
              "اكتشف المشاكل قبل خسارة العملاء",
              "احصل على خطة تطوير جاهزة على الفور",
              "اعتمد على البيانات في اتخاذ كل قرار",
              "تقارير احترافية تحمل هوية شركتك",
              "تحليل المنافسين بدقة لا مثيل لها",
              "مستشار أعمال ذكي متاح 24 ساعة",
            ].map((b) => (
              <motion.div
                key={b}
                variants={fadeUp}
                className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-5 py-3.5"
              >
                <CheckCircle size={18} className="text-[#10B981] shrink-0" />
                <span className="text-[#374151] text-sm font-semibold">{b}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ══════════ 6. DASHBOARD ══════════ */}
      <section className="py-24 bg-[#06060F] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CC0000]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1E1B4B]/20 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <span className="inline-block bg-white/10 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              معاينة حية
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              لوحة تحكم تفاعلية
            </h2>
            <p className="text-white/50">صورة حقيقية عن ما ستراه يومياً</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl"
          >
            {/* Tab bar */}
            <div className="flex overflow-x-auto gap-1 p-2 mb-2 scrollbar-hide">
              {dashTabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    activeTab === i
                      ? "bg-[#CC0000] text-white shadow-lg"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dashboard content */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Score cards */}
              <div className="lg:col-span-1 grid grid-cols-2 gap-3">
                {[
                  { label: "Business Score", val: 92, color: "#CC0000" },
                  { label: "Marketing",      val: 84, color: "#D97706" },
                  { label: "SEO Score",      val: 87, color: "#3B82F6" },
                  { label: "Growth Rate",    val: 91, color: "#10B981" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black mb-1" style={{ color }}>{val}%</div>
                    <div className="text-white/50 text-xs">{label}</div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Area Chart */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-white/70 text-sm font-bold mb-3">النمو الشهري</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="gNmw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CC0000" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#CC0000" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gMbyt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="نمو"    stroke="#CC0000" fill="url(#gNmw)" strokeWidth={2} />
                    <Area type="monotone" dataKey="مبيعات" stroke="#D97706" fill="url(#gMbyt)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-white/70 text-sm font-bold mb-3">أداء المنصات</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} width={60} />
                    <Tooltip
                      contentStyle={{ background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                    />
                    <Bar dataKey="قيمة" fill="#CC0000" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radial + tasks */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-sm font-bold mb-2">الصحة العامة</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <RadialBarChart innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "rgba(255,255,255,0.05)" }} />
                      <Legend iconSize={10} wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                  <p className="text-white/70 text-sm font-bold">التوصيات</p>
                  {[
                    { text: "تحسين سرعة الموقع", done: true },
                    { text: "نشر 3 ريلز هذا الأسبوع", done: true },
                    { text: "تحديث Google Business Profile", done: false },
                    { text: "تشغيل حملة إعادة الاستهداف", done: false },
                  ].map(({ text, done }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#10B981]" : "bg-white/10 border border-white/20"}`}>
                        {done && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${done ? "text-white/40 line-through" : "text-white/70"}`}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ══════════ 7. REPORT PREVIEW ══════════ */}
      <section className="py-24 bg-[#F3F4F6]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#D97706]/10 text-[#D97706] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              تقارير PDF
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827]">
              نماذج من التقارير
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
              {/* Report header */}
              <div className="bg-gradient-to-l from-[#CC0000] to-[#880000] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">AI Business OS</p>
                    <h3 className="text-2xl font-black mt-0.5">تقرير الأداء الشامل</h3>
                    <p className="text-white/60 text-xs mt-1">يوليو 2026 — دبي فانز</p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                    <FileBarChart size={30} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="p-6 space-y-5">
                {reportScores.map(({ label, score, color }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#374151] font-bold text-sm">{label}</span>
                      <span className="font-black text-lg" style={{ color }}>{score}%</span>
                    </div>
                    <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}AA, ${color})` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Star rating */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < 4 ? "text-[#D97706] fill-[#D97706]" : "text-[#E5E7EB] fill-[#E5E7EB]"} />
                    ))}
                  </div>
                  <span className="text-[#6B7280] text-sm">تقييم عام ممتاز</span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <a
                  href="https://wa.me/971551981564?text=أريد تحميل نموذج التقرير"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#111827] text-white font-black rounded-xl hover:bg-[#CC0000] transition-colors duration-300"
                >
                  <FileDown size={18} />
                  تحميل نموذج التقرير
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ══════════ 8. FAQ ══════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827]">
              كل ما تريد معرفته
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-right px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F3F4F6] transition-colors"
                >
                  <span className="font-black text-[#111827] text-base">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#CC0000] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-[#6B7280] text-sm leading-relaxed border-t border-[#E5E7EB] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ══════════ 8.5 EARLY ACCESS FORM ══════════ */}
      <section
        className="dark py-28 relative overflow-hidden bg-[#06060F]"
        id="early-access"
      >
        {/* atmospheric blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] bg-[#CC0000]/10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-[#CC0000]/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: 0.03,
          }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-2xl">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 backdrop-blur-md border text-sm font-bold px-5 py-2 rounded-full mb-6 bg-[#CC0000]/10 border-[#CC0000]/30"
            >
              <Sparkles size={14} className="text-[#FF4444]" />
              <span className="text-white">وصول مبكر — Early Access</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
              احجز مكانك في
              <span className="text-[#FF4444]"> AI Business OS</span>
            </h2>
            <p className="text-base leading-relaxed text-white/60">
              سجّل بياناتك وسنتواصل معك فور إطلاق الوصول الكامل — مع أولوية للمسجلين المبكرين.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Card — fixed dark styling so text stays readable regardless of theme */}
            <div className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl bg-[#0D0D1A]/80 border border-white/10">
              {leadStatus === "done" ? (
                /* ── Thank you state ── */
                (<motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#CC0000]/15">
                    <CheckCircle size={40} className="text-[#FF4444]" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white">تم التسجيل بنجاح! 🎉</h3>
                  <p className="text-base leading-relaxed mb-6 text-white/60">
                    شكراً لاهتمامك بـ AI Business OS. سنتواصل معك قريباً على البريد الإلكتروني.
                  </p>
                  <button
                    onClick={() => navigate("/ai-business-os/audit")}
                    className="inline-flex items-center gap-2 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black px-8 py-3.5 rounded-xl hover:shadow-[0_0_30px_rgba(204,0,0,0.5)] transition-all duration-300"
                  >
                    <Zap size={18} />
                    جرّب الأدوات المجانية الآن
                  </button>
                </motion.div>)
              ) : (
                /* ── Form ── */
                (<form ref={formRef} onSubmit={submitLead} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-name" className="text-white/90">
                        الاسم الكامل <span className="text-[#CC0000]">*</span>
                      </Label>
                      <Input
                        id="lead-name"
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="محمد العلي"
                        className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-primary"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-email" className="text-white/90">
                        البريد الإلكتروني <span className="text-[#CC0000]">*</span>
                      </Label>
                      <Input
                        id="lead-email"
                        type="email"
                        required
                        dir="ltr"
                        value={leadForm.email}
                        onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="name@company.com"
                        className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Business type */}
                    <div className="space-y-1.5">
                      <Label className="text-white/90">
                        نوع النشاط التجاري <span className="text-[#CC0000]">*</span>
                      </Label>
                      <Select
                        value={leadForm.businessType}
                        onValueChange={v => setLeadForm(f => ({ ...f, businessType: v }))}
                        required
                      >
                        <SelectTrigger className="h-11 bg-white/5 border-white/15 text-white data-[placeholder]:text-white/30 focus:ring-primary">
                          <SelectValue placeholder="اختر نوع النشاط" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "مطعم أو كافيه",
                            "عيادة أو مركز صحي",
                            "متجر إلكتروني",
                            "عقارات",
                            "تعليم وتدريب",
                            "خدمات احترافية",
                            "تجارة تجزئة",
                            "سياحة وسفر",
                            "تقنية ومعلوماتية",
                            "أخرى",
                          ].map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-city" className="text-white/90">المدينة</Label>
                      <Input
                        id="lead-city"
                        type="text"
                        value={leadForm.city}
                        onChange={e => setLeadForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="دبي"
                        className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  {/* Error */}
                  {leadStatus === "error" && (
                    <p className="text-red-400 text-sm font-semibold text-center">{leadError}</p>
                  )}
                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={leadStatus === "loading"}
                    className="w-full py-6 text-base font-black"
                  >
                    {leadStatus === "loading" ? (
                      <><Spinner className="size-5" /> جاري الإرسال...</>
                    ) : (
                      <><Zap size={18} /> احجز مكانك مجانًا</>
                    )}
                  </Button>
                  <p className="text-white/30 text-xs text-center">
                    بالتسجيل توافق على تلقّي تحديثات حول المنصة — يمكنك إلغاء الاشتراك في أي وقت.
                  </p>
                </form>)
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-[#FF4444]" /> مجاني تماماً</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-[#FF4444]" /> بدون التزام</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-[#FF4444]" /> أولوية للمسجلين المبكرين</span>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ══════════ 9. CTA ══════════ */}
      <section className="py-28 bg-[#06060F] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CC0000]/20 via-transparent to-[#1E1B4B]/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CC0000]/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-8">
              <Zap size={14} className="text-[#D97706]" />
              ابدأ الآن مجانًا
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              ابدأ تحليل نشاطك
              <br />
              <span className="bg-gradient-to-l from-[#D97706] to-[#CC0000] bg-clip-text text-transparent">
                التجاري الآن.
              </span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              دع الذكاء الاصطناعي يكتشف نقاط القوة والضعف ويقترح خطة نمو مخصصة لنشاطك.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/971551981564?text=أريد بدء التحليل مجانًا في AI Business OS"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black px-10 py-5 rounded-2xl hover:shadow-[0_0_40px_rgba(204,0,0,0.6)] hover:scale-105 transition-all duration-300 text-lg"
              >
                <FaWhatsapp size={22} />
                ابدأ مجانًا
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
              >
                تواصل معنا
              </a>
            </div>

            {/* trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/40 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#10B981]" /> بدون بطاقة ائتمان</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#10B981]" /> إلغاء في أي وقت</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#10B981]" /> دعم عربي كامل</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
const PAGE_META = getRouteMeta("/ai-business-os");
