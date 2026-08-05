import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  Globe, Instagram, Facebook, Music2, MapPin, BarChart3,
  ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, TrendingUp,
  Zap, Clock, ChevronDown, ChevronUp, LayoutDashboard,
} from "lucide-react";

const API = "/api";

/* ─── Types ─────────────────────────────────────────────── */
interface AuditScore {
  seo: number;
  content: number;
  performance: number;
  socialPresence: number;
  branding: number;
  engagement: number;
}
interface Recommendation {
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
  impact: string;
  timeframe: string;
}
interface AuditResult {
  overallScore: number;
  grade: string;
  scores: AuditScore;
  strengths: string[];
  issues: string[];
  recommendations: Recommendation[];
  quickWins: string[];
  summary: string;
  industryBenchmark?: number;
}

/* ─── Analysis types ──────────────────────────────────────── */
const analysisTypes = [
  { id: "website",        icon: Globe,     label: "الموقع الإلكتروني",     color: "#3B82F6" },
  { id: "instagram",      icon: Instagram,  label: "Instagram",             color: "#E1306C" },
  { id: "facebook",       icon: Facebook,   label: "Facebook",              color: "#1877F2" },
  { id: "tiktok",         icon: Music2,     label: "TikTok",                color: "#010101" },
  { id: "google_business",icon: MapPin,     label: "Google Business",       color: "#34A853" },
  { id: "business",       icon: BarChart3,  label: "النشاط كاملاً",        color: "#CC0000" },
];

const scoreLabels: Record<keyof AuditScore, string> = {
  seo:           "SEO",
  content:       "المحتوى",
  performance:   "الأداء",
  socialPresence:"التواجد الرقمي",
  branding:      "الهوية",
  engagement:    "التفاعل",
};

const priorityConfig = {
  high:   { label: "أولوية عالية",   bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200"    },
  medium: { label: "أولوية متوسطة",  bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  low:    { label: "أولوية منخفضة",  bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
};

/* ─── Loading messages ───────────────────────────────────── */
const loadingMessages = [
  "جارٍ جمع بيانات نشاطك التجاري…",
  "يحلل الذكاء الاصطناعي الأداء الرقمي…",
  "يراجع استراتيجية المحتوى…",
  "يقيّم مؤشرات SEO…",
  "يقارن بمعايير الصناعة…",
  "يُعدّ التوصيات المخصصة…",
  "يبني تقريرك الاحترافي…",
];

/* ─── CircleScore component ──────────────────────────────── */
function CircleScore({ score, label, color = "#CC0000" }: { score: number; label: string; color?: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 52 52" className="w-14 h-14 -rotate-90">
          <circle cx="26" cy="26" r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" />
          <motion.circle
            cx="26" cy="26" r={r} fill="none" strokeWidth="4"
            stroke={color} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#111827]">
          {score}
        </span>
      </div>
      <span className="text-xs text-[#6B7280] font-medium text-center">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function AuditPage() {
  const [, navigate] = useLocation();
  const [step, setStep]               = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [url, setUrl]                 = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loadingMsg, setLoadingMsg]    = useState(0);
  const [result, setResult]           = useState<AuditResult | null>(null);
  const [error, setError]             = useState("");
  const [expanded, setExpanded]       = useState<number | null>(null);

  /* ── On mount: sync DB → localStorage ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/ai-business-os/audits`, { headers: { "X-Requested-With": "fetch" } });
        const data = await res.json();
        if (data.success && data.audits?.length) {
          const mapped = data.audits.map((r: any) => ({
            id:           r.id,
            type:         r.type,
            url:          r.url,
            businessName: r.businessName,
            analysis:     r.analysis,
            createdAt:    r.createdAt,
          }));
          localStorage.setItem("aib_audits", JSON.stringify(mapped.slice(0, 10)));
        }
      } catch { /* silent — localStorage remains as fallback */ }
    })();
  }, []);

  /* start analysis */
  const runAudit = async () => {
    setStep(3);
    setError("");
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(msgIdx);
    }, 1800);

    try {
      const res = await fetch(`${API}/ai-business-os/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({ type: selectedType, url, businessName }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (!data.success) throw new Error(data.error);
      // save to localStorage (use DB id returned by API)
      const saved = JSON.parse(localStorage.getItem("aib_audits") || "[]");
      saved.unshift({
        id:           data.id ?? Date.now(),
        type:         selectedType,
        url,
        businessName,
        analysis:     data.analysis,
        createdAt:    new Date().toISOString(),
      });
      localStorage.setItem("aib_audits", JSON.stringify(saved.slice(0, 10)));
      setResult(data.analysis);
      setStep(4);
    } catch (e: unknown) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
      setStep(2);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "#10B981" : s >= 60 ? "#D97706" : "#CC0000";

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title="تحليل نشاطك التجاري | AI Business OS"
        description="أداة تحليل ذكية تفحص موقعك وحساباتك ونشاطك التجاري بالكامل وتقدم تقريراً احترافياً خلال دقائق."
        canonical="/ai-business-os/audit"
      />
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* ─── Header ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10">
            <Link href="/ai-business-os" className="inline-flex items-center gap-2 text-[#CC0000] text-sm font-bold mb-4 hover:gap-3 transition-all">
              <ArrowRight size={14} /> AI Business OS
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-2">🔍 AI Business Audit</h1>
            <p className="text-[#6B7280]">تحليل شامل يكشف نقاط القوة والضعف وفرص النمو</p>
          </motion.div>

          {/* ─── Stepper ─── */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step > s ? "bg-[#10B981] text-white" : step === s ? "bg-[#CC0000] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                {s < 4 && <div className={`w-10 h-1 rounded-full ${step > s ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ─── Step 1: Choose type ─── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-xl font-black text-[#111827] mb-6 text-center">ما الذي تريد تحليله؟</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {analysisTypes.map(({ id, icon: Icon, label, color }) => (
                    <motion.button
                      key={id}
                      whileHover={{ y: -4 }}
                      onClick={() => { setSelectedType(id); setStep(2); }}
                      className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[#CC0000]/50 hover:shadow-lg transition-all group"
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${color}18` }}>
                        <Icon size={26} style={{ color }} />
                      </div>
                      <span className="font-bold text-[#111827] text-sm text-center">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── Step 2: Enter info ─── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const t = analysisTypes.find(t => t.id === selectedType);
                      if (!t) return null;
                      const Icon = t.icon;
                      return (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${t.color}18` }}>
                          <Icon size={22} style={{ color: t.color }} />
                        </div>
                      );
                    })()}
                    <h2 className="text-xl font-black text-[#111827]">أدخل معلومات نشاطك</h2>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-2 text-red-700 text-sm">
                      <AlertTriangle size={16} />
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-2">اسم نشاطك التجاري</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        placeholder="مثال: كافيه الرياض، عيادة الدكتور أحمد…"
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#CC0000] transition-colors"
                      />
                    </div>

                    {selectedType !== "business" && (
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2">
                          {selectedType === "website" ? "رابط الموقع" :
                           selectedType === "google_business" ? "اسم النشاط على خرائط جوجل" :
                           `معرّف حساب ${analysisTypes.find(t => t.id === selectedType)?.label}`}
                        </label>
                        <input
                          type="text"
                          value={url}
                          onChange={e => setUrl(e.target.value)}
                          placeholder={
                            selectedType === "website" ? "https://yourwebsite.com" :
                            selectedType === "google_business" ? "اسم النشاط كما يظهر على جوجل" :
                            "@username"
                          }
                          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#CC0000] transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] rounded-xl text-[#6B7280] font-bold hover:bg-[#F3F4F6] transition-colors"
                    >
                      <ArrowLeft size={16} /> رجوع
                    </button>
                    <button
                      onClick={runAudit}
                      disabled={!businessName.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#CC0000] text-white font-black py-3 rounded-xl hover:bg-[#AA0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Zap size={18} /> ابدأ التحليل الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3: Loading ─── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#06060F] rounded-3xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000]/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-[60px]" />

                <div className="relative z-10">
                  {/* AI brain animation */}
                  <div className="w-24 h-24 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-[#CC0000]/20 rounded-full animate-ping" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#CC0000] to-[#880000] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(204,0,0,0.5)]">
                      <BarChart3 size={36} className="text-white" />
                    </div>
                  </div>

                  {/* Progress circles */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-[#CC0000]"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingMsg}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="text-white font-bold text-lg mb-2"
                    >
                      {loadingMessages[loadingMsg]}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-white/40 text-sm">هذا قد يستغرق 10-20 ثانية</p>

                  {/* Fake progress bar */}
                  <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                    <motion.div
                      className="h-full bg-gradient-to-l from-[#CC0000] to-[#D97706] rounded-full"
                      animate={{ width: ["5%", "95%"] }}
                      transition={{ duration: 18, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 4: Results ─── */}
            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Overall score */}
                <div className="bg-gradient-to-br from-[#111827] to-[#1E1B4B] rounded-3xl p-8 mb-6 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000]/10 rounded-full blur-[80px]" />
                  <div className="relative z-10">
                    <p className="text-white/60 mb-2 text-sm">التقييم العام لنشاطك</p>
                    <div className="text-7xl font-black mb-1" style={{ color: scoreColor(result.overallScore) }}>
                      {result.overallScore}
                    </div>
                    <div className="text-2xl font-black text-white/80 mb-4">/ 100 — {result.grade}</div>
                    {result.industryBenchmark && (
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
                        <TrendingUp size={14} /> متوسط الصناعة: {result.industryBenchmark}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-scores */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 mb-6">
                  <h3 className="font-black text-[#111827] mb-6">تفصيل الدرجات</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {(Object.keys(result.scores) as (keyof AuditScore)[]).map(key => (
                      <CircleScore
                        key={key}
                        score={result.scores[key]}
                        label={scoreLabels[key]}
                        color={scoreColor(result.scores[key])}
                      />
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 mb-6">
                  <p className="text-[#374151] leading-relaxed">{result.summary}</p>
                </div>

                {/* Strengths + Issues */}
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                    <h4 className="font-black text-[#10B981] flex items-center gap-2 mb-4">
                      <CheckCircle size={18} /> نقاط القوة
                    </h4>
                    <ul className="space-y-2.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
                          <span className="w-5 h-5 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                    <h4 className="font-black text-[#CC0000] flex items-center gap-2 mb-4">
                      <AlertTriangle size={18} /> نقاط تحتاج تحسين
                    </h4>
                    <ul className="space-y-2.5">
                      {result.issues.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
                          <span className="w-5 h-5 rounded-full bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center text-xs shrink-0 mt-0.5">!</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick wins */}
                {result.quickWins?.length > 0 && (
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 mb-6">
                    <h4 className="font-black text-[#15803D] flex items-center gap-2 mb-4">
                      <Zap size={16} /> إجراءات سريعة (Quick Wins)
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {result.quickWins.map((w, i) => (
                        <div key={i} className="bg-white border border-[#BBF7D0] rounded-xl p-3 text-sm text-[#374151]">{w}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-8">
                  <h4 className="font-black text-[#111827] mb-5 flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#CC0000]" /> التوصيات التفصيلية
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((r, i) => {
                      const cfg = priorityConfig[r.priority] || priorityConfig.medium;
                      return (
                        <div key={i} className={`border rounded-xl overflow-hidden ${cfg.border}`}>
                          <button
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className={`w-full text-right p-4 flex items-center justify-between gap-3 ${cfg.bg}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                {cfg.label}
                              </span>
                              <span className="font-bold text-[#111827] text-sm">{r.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6B7280] text-xs shrink-0">
                              <Clock size={12} /> {r.timeframe}
                              {expanded === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </button>
                          <AnimatePresence>
                            {expanded === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                              >
                                <div className="p-4 space-y-2 border-t border-[#E5E7EB]">
                                  <p className="text-sm text-[#374151] leading-relaxed">{r.description}</p>
                                  <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
                                    <TrendingUp size={12} /> التأثير المتوقع: {r.impact}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => { setStep(1); setResult(null); setUrl(""); setBusinessName(""); }}
                    className="py-3 border border-[#E5E7EB] rounded-xl font-bold text-[#374151] hover:bg-[#F3F4F6] transition-colors text-sm"
                  >
                    تحليل جديد
                  </button>
                  <button
                    onClick={() => navigate("/ai-business-os/planner")}
                    className="py-3 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#1F2937] transition-colors text-sm"
                  >
                    إنشاء خطة تسويق
                  </button>
                  <button
                    onClick={() => navigate("/ai-business-os/dashboard")}
                    className="py-3 bg-[#CC0000] text-white rounded-xl font-bold hover:bg-[#AA0000] transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={16} /> عرض Dashboard
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
