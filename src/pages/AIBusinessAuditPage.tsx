/**
 * AI Business Audit — معالج متعدد الخطوات يحلل النشاط التجاري بالذكاء الاصطناعي.
 *
 * المراحل: wizard (6 خطوات) → شاشة تحليل → معاينة النتائج (تشويقية) → التقرير الكامل.
 * ?sample=1 يعرض نموذج تقرير جاهز بدون استهلاك الذكاء الاصطناعي.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Globe, Instagram, Facebook, Music2, Ghost, MapPin, Building2,
  ArrowLeft, ArrowRight, CheckCircle2, Rocket, Search, FileText,
  AlertTriangle, TrendingUp, Lightbulb, CalendarDays, CalendarRange,
  Download, Phone, Bot, Sparkles,
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiFetch } from "@/lib/apiFetch";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

/* ── Types ─────────────────────────────────────────────────── */
type Recommendation = { title: string; priority: string; description: string; impact?: string };
type Report = {
  healthScore: number;
  scores: Record<string, number>;
  summary: string;
  problems: string[];
  opportunities: string[];
  recommendations: Recommendation[];
  plan30: string[];
  plan90: string[];
  growthPotentialPercent: number;
};
type Phase = "wizard" | "loading" | "preview" | "report";

/* ── Wizard data ───────────────────────────────────────────── */
const TARGETS = [
  { id: "website",         label: "الموقع الإلكتروني",       icon: <Globe size={22} /> },
  { id: "instagram",       label: "Instagram",                icon: <Instagram size={22} /> },
  { id: "facebook",        label: "Facebook",                 icon: <Facebook size={22} /> },
  { id: "tiktok",          label: "TikTok",                   icon: <Music2 size={22} /> },
  { id: "snapchat",        label: "Snapchat",                 icon: <Ghost size={22} /> },
  { id: "google_business", label: "Google Business",          icon: <MapPin size={22} /> },
  { id: "full_business",   label: "النشاط التجاري بالكامل",  icon: <Building2 size={22} /> },
];
const BUSINESS_TYPES = [
  "عيادة أسنان", "مركز طبي", "مستشفى", "شركة عقارات", "مطعم", "مقهى",
  "متجر إلكتروني", "شركة خدمات", "شركة مقاولات", "شركة سياحة", "أخرى",
];
const LINK_FIELDS = [
  { key: "website",        label: "Website URL" },
  { key: "instagram",      label: "Instagram URL" },
  { key: "facebook",       label: "Facebook URL" },
  { key: "tiktok",         label: "TikTok URL" },
  { key: "googleBusiness", label: "Google Business URL" },
] as const;
const BUDGETS = ["أقل من 3,000 درهم", "3,000 – 10,000 درهم", "10,000 – 30,000 درهم", "أكثر من 30,000 درهم", "لا توجد ميزانية حالياً"];
const LOADING_STEPS = [
  "تحليل الموقع", "تحليل SEO", "تحليل سرعة الموقع", "تحليل المحتوى", "تحليل الهوية",
  "تحليل وسائل التواصل", "تحليل Google Business", "تحليل المنافسين", "إنشاء التقرير",
];
const SCORE_LABELS: Record<string, string> = {
  marketing: "Marketing Score", seo: "SEO Score", website: "Website Score",
  socialMedia: "Social Media Score", conversion: "Conversion Score", brand: "Brand Score",
};

/* ── Sample report (زر "شاهد نموذج التقرير") ───────────────── */
const SAMPLE_REPORT: Report = {
  healthScore: 78,
  scores: { marketing: 74, seo: 66, website: 81, socialMedia: 79, conversion: 62, brand: 75 },
  summary: "نشاطك التجاري يمتلك أساساً جيداً وحضوراً واضحاً على وسائل التواصل، لكن هناك فجوة كبيرة في تحويل الزوار إلى عملاء فعليين. تحسين السيو وصفحات الهبوط مع حملات إعلانية مستهدفة يمكن أن يرفع عدد العملاء المحتملين بشكل ملموس خلال 90 يوماً.",
  problems: [
    "الموقع لا يظهر في الصفحة الأولى لنتائج البحث عن الخدمات الأساسية",
    "لا توجد صفحات هبوط مخصصة للحملات الإعلانية",
    "سرعة تحميل الموقع على الجوال أبطأ من المنافسين",
    "ملف Google Business غير مكتمل وبدون تقييمات حديثة",
    "المحتوى على إنستغرام غير منتظم وبدون هوية بصرية موحدة",
    "لا يوجد نظام لمتابعة العملاء المحتملين والرد السريع عليهم",
  ],
  opportunities: [
    "استهداف كلمات بحث محلية عالية النية وقليلة المنافسة",
    "تفعيل الإعلانات على تيك توك للوصول لجمهور أوسع بتكلفة أقل",
    "بناء صفحة تقييمات قوية على Google لرفع الثقة والظهور المحلي",
    "إطلاق عروض موسمية مربوطة بصفحات هبوط مخصصة",
  ],
  recommendations: [
    { title: "تحسين السيو المحلي", priority: "high", description: "استكمال ملف Google Business، إضافة الخدمات والصور، وجمع تقييمات أسبوعياً.", impact: "زيادة الظهور المحلي والاتصالات المباشرة" },
    { title: "صفحات هبوط للحملات", priority: "high", description: "إنشاء صفحة هبوط لكل خدمة رئيسية مع نموذج تواصل قصير وواتساب مباشر.", impact: "رفع معدل التحويل من الزيارات إلى استفسارات" },
    { title: "تسريع الموقع على الجوال", priority: "medium", description: "ضغط الصور، تفعيل التخزين المؤقت، وتقليل السكربتات غير الضرورية.", impact: "تحسين تجربة المستخدم وترتيب جوجل" },
    { title: "خطة محتوى شهرية", priority: "medium", description: "12 منشوراً شهرياً بهوية موحدة: قصص نجاح، نصائح، وعروض.", impact: "نمو التفاعل وبناء الثقة" },
    { title: "نظام متابعة العملاء", priority: "low", description: "توحيد استقبال الاستفسارات والرد خلال أقل من ساعة عمل.", impact: "تقليل فقدان العملاء المحتملين" },
  ],
  plan30: [
    "استكمال ملف Google Business وجمع أول 10 تقييمات",
    "إطلاق صفحتي هبوط للخدمتين الأكثر طلباً",
    "تحسين سرعة الموقع على الجوال",
    "جدولة محتوى شهر كامل مسبقاً",
  ],
  plan90: [
    "الوصول للصفحة الأولى في 3 كلمات بحث محلية",
    "حملات إعلانية مستمرة على Meta وGoogle بميزانية محسّنة",
    "مضاعفة عدد الاستفسارات الشهرية",
    "بناء مكتبة قصص نجاح ومراجعات موثقة",
  ],
  growthPotentialPercent: 32,
};

/* ── Small UI helpers ──────────────────────────────────────── */
const inputCls = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm focus:outline-none focus:border-[#CC0000] transition-colors";
const labelCls = "block text-sm font-bold text-[#374151] mb-1.5";

function ScoreRing({ value, size = 120, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const color = value >= 75 ? "#16A34A" : value >= 50 ? "#D97706" : "#CC0000";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={10} fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={10} fill="none"
            strokeLinecap="round" strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (c * value) / 100 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-[#111827]" style={{ fontSize: size / 4 }}>{value}</span>
        </div>
      </div>
      {label && <span className="text-xs font-bold text-[#9CA3AF]">{label}</span>}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

/* ── Page ──────────────────────────────────────────────────── */
export default function AIBusinessAuditPage() {
  const meta = getRouteMeta("/ai-business-audit");
  const isSample = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("sample");

  const [phase, setPhase] = useState<Phase>(isSample ? "preview" : "wizard");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(isSample ? SAMPLE_REPORT : null);

  /* form state */
  const [targets, setTargets] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");
  const [country, setCountry] = useState("الإمارات");
  const [city, setCity] = useState("");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState({ employees: "", branches: "", budget: "", hasWebsite: false, hasCampaigns: false });
  const [contact, setContact] = useState({ name: "", email: "", phone: "", companyName: "" });

  /* loading screen state */
  const [doneSteps, setDoneSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const resultRef = useRef<Report | null>(null);
  const requestDone = useRef(false);

  const totalSteps = 6;

  function canNext(): boolean {
    switch (step) {
      case 0: return targets.length > 0;
      case 1: return businessType !== "";
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return contact.name.trim().length >= 2 && contact.email.includes("@")
        && contact.phone.trim().length >= 7 && contact.companyName.trim().length >= 2;
      default: return false;
    }
  }

  async function startAnalysis() {
    setError("");
    setPhase("loading");
    setDoneSteps(0); setProgress(0);
    requestDone.current = false; resultRef.current = null;

    /* animate the checklist while the real request runs */
    let i = 0;
    const stepTimer = setInterval(() => {
      i = Math.min(i + 1, LOADING_STEPS.length - (requestDone.current ? 0 : 1));
      setDoneSteps(i);
      setProgress(Math.round((i / LOADING_STEPS.length) * 100));
      if (i >= LOADING_STEPS.length) {
        clearInterval(stepTimer);
        setTimeout(() => {
          if (resultRef.current) { setReport(resultRef.current); setPhase("preview"); }
        }, 600);
      }
    }, 1400);

    try {
      const res = await apiFetch("/api/business-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targets, businessType, country, city, links, extra,
          name: contact.name, email: contact.email, phone: contact.phone, companyName: contact.companyName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "فشل التحليل");
      resultRef.current = data.report as Report;
      requestDone.current = true;
    } catch (e: any) {
      clearInterval(stepTimer);
      setPhase("wizard");
      setStep(5);
      setError(e?.message || "فشل التحليل — يرجى المحاولة مجدداً");
    }
  }

  /* ── Loading screen ── */
  if (phase === "loading") {
    return (
      <div dir="rtl" className="min-h-screen bg-[#07070F] flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10" style={{ width: 160, height: 160 }}>
          <svg width={160} height={160} className="-rotate-90">
            <circle cx={80} cy={80} r={70} stroke="rgba(255,255,255,0.08)" strokeWidth={10} fill="none" />
            <circle
              cx={80} cy={80} r={70} stroke="url(#grad)" strokeWidth={10} fill="none" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#CC0000" /><stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{progress}%</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-8">جاري تحليل نشاطك…</h1>
        <div className="space-y-3 text-right w-full max-w-xs">
          {LOADING_STEPS.map((s, idx) => (
            <div key={s} className={`flex items-center gap-3 text-sm font-bold transition-all duration-500 ${idx < doneSteps ? "text-white" : "text-white/25"}`}>
              <CheckCircle2 size={18} className={idx < doneSteps ? "text-[#16A34A]" : "text-white/15"} />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Results preview (تشويقية) ── */
  if (phase === "preview" && report) {
    const cards = [
      { icon: "📊", title: "Business Health Score", value: <><CountUp to={report.healthScore} /><span className="text-lg text-[#9CA3AF]"> /100</span></> },
      { icon: "🔍", title: "عدد المشاكل المكتشفة", value: <><CountUp to={report.problems.length} /> مشكلة</> },
      { icon: "🚀", title: "فرص النمو", value: <>+<CountUp to={report.growthPotentialPercent} suffix="%" /></>, sub: "زيادة محتملة في العملاء المحتملين" },
      { icon: "🤖", title: "توصيات الذكاء الاصطناعي", value: <><CountUp to={report.recommendations.length} /> توصية عملية</> },
    ];
    return (
      <div dir="rtl" className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
        <SEOHead title={meta?.title ?? "AI Business Audit | دبي فانز"} description={meta?.description ?? ""} noindex={!isSample} />
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#16A34A] to-[#65D26E] flex items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.35)]">
              <CheckCircle2 size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-4">🎉 تم الانتهاء من تحليل نشاطك بنجاح</h1>
            <p className="text-[#6B7280] max-w-xl mx-auto mb-10 leading-relaxed">
              قام الذكاء الاصطناعي بتحليل نشاطك التجاري واكتشاف نقاط القوة والفرص ومجالات التحسين، وتم إنشاء تقرير احترافي مخصص لنشاطك.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {cards.map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}
                  className="glass-card rounded-2xl border border-[#E5E7EB] bg-white/70 backdrop-blur p-6 text-center">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-sm font-bold text-[#9CA3AF] mb-1">{c.title}</p>
                  <p className="text-3xl font-black text-[#111827]">{c.value}</p>
                  {"sub" in c && c.sub && <p className="text-xs text-[#9CA3AF] mt-1">{c.sub}</p>}
                </motion.div>
              ))}
            </div>
            <div className="glass-card rounded-2xl border border-[#CC0000]/20 bg-gradient-to-l from-[#CC0000]/5 to-[#D97706]/5 p-6 text-right mb-10">
              <p className="font-black text-[#111827] mb-4">يتضمن التقرير الكامل:</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-[#374151] font-semibold">
                {["تحليل الموقع الإلكتروني", "تحليل SEO", "تحليل الحملات الإعلانية", "تحليل وسائل التواصل الاجتماعي",
                  "تحليل الهوية التجارية", "مقارنة بالمنافسين", "أهم فرص النمو", "خطة تطوير لمدة 90 يومًا"].map((t) => (
                  <span key={t} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#16A34A] shrink-0" />{t}</span>
                ))}
              </div>
            </div>
            <button onClick={() => { setPhase("report"); window.scrollTo(0, 0); }}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#CC0000] text-white rounded-2xl font-black text-lg hover:bg-[#AA0000] shadow-[0_10px_40px_rgba(204,0,0,0.3)] transition-all">
              <FileText size={20} /> عرض التقرير الكامل
            </button>
            <div className="mt-5">
              <Link href="/" className="text-sm font-bold text-[#9CA3AF] hover:text-[#CC0000] transition-colors inline-flex items-center gap-1">
                <ArrowRight size={15} /> العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Full report ── */
  if (phase === "report" && report) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
        <SEOHead title={meta?.title ?? "AI Business Audit | دبي فانز"} description={meta?.description ?? ""} noindex={!isSample} />
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-sm font-bold text-[#CC0000] mb-4">
                <Bot size={15} /> تقرير AI Business Audit
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">تقرير تحليل نشاطك التجاري</h1>
              <p className="text-[#6B7280] max-w-2xl mx-auto leading-relaxed">{report.summary}</p>
            </div>

            {/* Scores */}
            <div className="glass-card rounded-3xl border border-[#E5E7EB] bg-white p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ScoreRing value={report.healthScore} size={150} label="Business Health Score" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
                  {Object.entries(SCORE_LABELS).map(([k, label]) => (
                    typeof report.scores[k] === "number" && <ScoreRing key={k} value={report.scores[k]} size={90} label={label} />
                  ))}
                </div>
              </div>
            </div>

            {/* Problems & opportunities */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="flex items-center gap-2 font-black text-[#111827] mb-4"><AlertTriangle size={18} className="text-[#CC0000]" /> المشاكل المكتشفة</h2>
                <ul className="space-y-2.5 text-sm text-[#374151]">
                  {report.problems.map((p, i) => <li key={i} className="flex gap-2"><span className="text-[#CC0000] font-black shrink-0">{i + 1}.</span>{p}</li>)}
                </ul>
              </div>
              <div className="glass-card rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="flex items-center gap-2 font-black text-[#111827] mb-4"><TrendingUp size={18} className="text-[#16A34A]" /> فرص النمو</h2>
                <ul className="space-y-2.5 text-sm text-[#374151]">
                  {report.opportunities.map((p, i) => <li key={i} className="flex gap-2"><CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />{p}</li>)}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-2xl border border-[#E5E7EB] bg-white p-6 mb-8">
              <h2 className="flex items-center gap-2 font-black text-[#111827] mb-5"><Lightbulb size={18} className="text-[#D97706]" /> التوصيات</h2>
              <div className="space-y-4">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="border border-[#F3F4F6] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1.5 gap-3">
                      <p className="font-black text-[#111827] text-sm">{r.title}</p>
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 ${
                        r.priority === "high" ? "bg-[#CC0000]/10 text-[#CC0000]" :
                        r.priority === "medium" ? "bg-[#D97706]/10 text-[#D97706]" : "bg-[#16A34A]/10 text-[#16A34A]"
                      }`}>{r.priority === "high" ? "أولوية عالية" : r.priority === "medium" ? "أولوية متوسطة" : "أولوية منخفضة"}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{r.description}</p>
                    {r.impact && <p className="text-xs font-bold text-[#16A34A] mt-1.5">الأثر: {r.impact}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="glass-card rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="flex items-center gap-2 font-black text-[#111827] mb-4"><CalendarDays size={18} className="text-[#CC0000]" /> خطة 30 يوم</h2>
                <ul className="space-y-2.5 text-sm text-[#374151]">
                  {report.plan30.map((p, i) => <li key={i} className="flex gap-2"><span className="w-6 h-6 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>{p}</li>)}
                </ul>
              </div>
              <div className="glass-card rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="flex items-center gap-2 font-black text-[#111827] mb-4"><CalendarRange size={18} className="text-[#D97706]" /> خطة 90 يوم</h2>
                <ul className="space-y-2.5 text-sm text-[#374151]">
                  {report.plan90.map((p, i) => <li key={i} className="flex gap-2"><span className="w-6 h-6 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>{p}</li>)}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-3xl bg-[#07070F] border border-[#CC0000]/25 p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">🚀 هل تريد أن ينفذ فريق MTUAEFans هذه الخطة؟</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                  <Download size={18} /> تحميل التقرير PDF
                </button>
                <a href="https://wa.me/971551981564?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9%20%D8%A8%D8%B9%D8%AF%20%D8%AA%D9%82%D8%B1%D9%8A%D8%B1%20AI%20Business%20Audit"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#CC0000] text-white rounded-xl font-black hover:bg-[#AA0000] transition-all">
                  <Phone size={18} /> احجز استشارة مجانية
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Wizard ── */
  const stepTitles = ["ما الذي تريد تحليله؟", "ما نوع نشاطك؟", "أين يقع نشاطك؟", "أدخل روابط نشاطك", "معلومات إضافية", "قبل بدء التحليل"];
  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead title={meta?.title ?? "AI Business Audit | دبي فانز"} description={meta?.description ?? ""} />
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-sm font-bold text-[#CC0000] mb-4">
              <Sparkles size={15} /> AI Business Audit
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[#111827]">اكتشف لماذا لا ينمو نشاطك التجاري</h1>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-[#9CA3AF] mb-2">
              <span>الخطوة {step + 1} من {totalSteps}</span>
              <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-l from-[#CC0000] to-[#D97706] rounded-full"
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-black text-[#111827] mb-6">{stepTitles[step]}</h2>

                {step === 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TARGETS.map((t) => {
                      const active = targets.includes(t.id);
                      return (
                        <button key={t.id} type="button"
                          onClick={() => setTargets((cur) => active ? cur.filter((x) => x !== t.id) : [...cur, t.id])}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                            active ? "border-[#CC0000] bg-[#CC0000]/5 text-[#CC0000]" : "border-[#E5E7EB] text-[#374151] hover:border-[#CC0000]/40"
                          }`}>
                          {t.icon}{t.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BUSINESS_TYPES.map((b) => (
                      <button key={b} type="button" onClick={() => setBusinessType(b)}
                        className={`p-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
                          businessType === b ? "border-[#CC0000] bg-[#CC0000]/5 text-[#CC0000]" : "border-[#E5E7EB] text-[#374151] hover:border-[#CC0000]/40"
                        }`}>{b}</button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div><label className={labelCls}>الدولة</label>
                      <input className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="مثال: الإمارات" /></div>
                    <div><label className={labelCls}>المدينة</label>
                      <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="مثال: دبي" /></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#9CA3AF] font-semibold -mt-3 mb-2">يمكن ترك أي حقل فارغ.</p>
                    {LINK_FIELDS.map((f) => (
                      <div key={f.key}><label className={labelCls}>{f.label}</label>
                        <input className={inputCls} dir="ltr" value={links[f.key] ?? ""} placeholder="https://…"
                          onChange={(e) => setLinks((cur) => ({ ...cur, [f.key]: e.target.value }))} /></div>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls}>عدد الموظفين</label>
                        <input className={inputCls} value={extra.employees} onChange={(e) => setExtra({ ...extra, employees: e.target.value })} placeholder="مثال: 10" /></div>
                      <div><label className={labelCls}>عدد الفروع</label>
                        <input className={inputCls} value={extra.branches} onChange={(e) => setExtra({ ...extra, branches: e.target.value })} placeholder="مثال: 2" /></div>
                    </div>
                    <div><label className={labelCls}>الميزانية التسويقية الشهرية</label>
                      <select className={inputCls} value={extra.budget} onChange={(e) => setExtra({ ...extra, budget: e.target.value })}>
                        <option value="">اختر الميزانية…</option>
                        {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select></div>
                    <div className="grid grid-cols-2 gap-4">
                      {([["hasWebsite", "هل لديك موقع؟"], ["hasCampaigns", "هل لديك حملات إعلانية حالياً؟"]] as const).map(([k, label]) => (
                        <div key={k}>
                          <label className={labelCls}>{label}</label>
                          <div className="flex gap-2">
                            {[["نعم", true], ["لا", false]].map(([txt, val]) => (
                              <button key={String(txt)} type="button" onClick={() => setExtra({ ...extra, [k]: val as boolean })}
                                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                                  extra[k] === val ? "border-[#CC0000] bg-[#CC0000]/5 text-[#CC0000]" : "border-[#E5E7EB] text-[#374151]"
                                }`}>{txt as string}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <div><label className={labelCls}>الاسم</label>
                      <input className={inputCls} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></div>
                    <div><label className={labelCls}>البريد الإلكتروني</label>
                      <input className={inputCls} dir="ltr" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
                    <div><label className={labelCls}>رقم الهاتف</label>
                      <input className={inputCls} dir="ltr" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="05x xxx xxxx" /></div>
                    <div><label className={labelCls}>اسم الشركة</label>
                      <input className={inputCls} value={contact.companyName} onChange={(e) => setContact({ ...contact, companyName: e.target.value })} /></div>
                    {error && <p className="text-sm font-bold text-[#CC0000] flex items-center gap-1.5"><AlertTriangle size={15} /> {error}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-8">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-bold text-[#6B7280] disabled:opacity-40 hover:border-[#CC0000]/40 transition-all">
                <ArrowRight size={16} /> السابق
              </button>
              {step < totalSteps - 1 ? (
                <button type="button" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-[#CC0000] text-white text-sm font-black disabled:opacity-40 hover:bg-[#AA0000] transition-all">
                  التالي <ArrowLeft size={16} />
                </button>
              ) : (
                <button type="button" disabled={!canNext()} onClick={startAnalysis}
                  className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-l from-[#CC0000] to-[#D97706] text-white text-sm font-black disabled:opacity-40 hover:opacity-90 transition-all">
                  <Rocket size={16} /> ابدأ التحليل
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] font-semibold mt-6 flex items-center justify-center gap-1.5">
            <Search size={13} /> التحليل مجاني بالكامل — النتائج تُنشأ بالذكاء الاصطناعي خلال أقل من دقيقة.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
