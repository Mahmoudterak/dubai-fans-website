import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  CheckCircle, ArrowRight, ArrowLeft, Zap, Target, Calendar,
  DollarSign, TrendingUp, Lightbulb, AlertTriangle, Clock, History,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API = "/api";

/* ─── Types ─────────────────────────────────────────────── */
interface Channel { name: string; budgetPercentage: number; strategy: string; frequency: string; kpi: string; color?: string }
interface WeekPlan { week: number; theme: string; tasks: string[]; contentIdeas: string[] }
interface ContentIdea { platform: string; type: string; idea: string; cta: string }
interface KPI { name: string; target: string; current: string }
interface Plan {
  overview: string;
  channels: Channel[];
  weeklyPlan: WeekPlan[];
  kpis: KPI[];
  contentIdeas: ContentIdea[];
  tips: string[];
}

/* ─── Helpers ────────────────────────────────────────────── */
const businessTypes = [
  "مطعم / كافيه", "عيادة طبية", "متجر إلكتروني", "عقارات", "خدمات مهنية",
  "تعليم / كورسات", "صالون / سبا", "فيتنس / رياضة", "سياحة / سفر", "أخرى",
];
const goalOptions = [
  "زيادة المبيعات", "بناء الوعي بالعلامة التجارية", "جذب عملاء جدد",
  "تحسين التفاعل على السوشيال ميديا", "تطوير الموقع الإلكتروني",
  "تحسين SEO", "إطلاق منتج جديد", "زيادة قاعدة المتابعين",
];
const durations = [
  { value: 30,  label: "خطة 30 يوماً",   desc: "للبدء السريع والنتائج الفورية" },
  { value: 90,  label: "خطة 90 يوماً",   desc: "للنمو المستدام والبناء التدريجي" },
  { value: 365, label: "خطة سنوية",       desc: "للاستراتيجية الشاملة وبناء العلامة" },
];
const loadingMsgs = [
  "يحلل طبيعة نشاطك التجاري…",
  "يدرس السوق الإماراتي المستهدف…",
  "يصمم استراتيجية المحتوى…",
  "يوزع الميزانية على القنوات…",
  "يبني الخطة الأسبوعية…",
  "يضيف أفكار المحتوى المبتكرة…",
  "يُنهي خطتك التسويقية الكاملة…",
];

interface SavedPlan {
  id: number;
  businessName: string;
  duration: number;
  plan: Plan;
  createdAt: string;
}

export default function PlannerPage() {
  const [, navigate] = useLocation();
  const [step, setStep]               = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [duration, setDuration]       = useState(30);
  const [budget, setBudget]           = useState("");
  const [audience, setAudience]       = useState("");
  const [loadingIdx, setLoadingIdx]   = useState(0);
  const [plan, setPlan]               = useState<Plan | null>(null);
  const [error, setError]             = useState("");
  const [activeWeek, setActiveWeek]   = useState(0);
  const [activeSection, setActiveSection] = useState<"channels" | "weeks" | "content" | "kpis">("channels");
  const [savedPlans, setSavedPlans]   = useState<SavedPlan[]>(() => {
    try { return JSON.parse(localStorage.getItem("aib_plans") || "[]"); }
    catch { return []; }
  });

  const toggleGoal = (g: string) => setSelectedGoals(prev =>
    prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
  );

  const restorePlan = (saved: SavedPlan) => {
    setBusinessName(saved.businessName);
    setDuration(saved.duration);
    setPlan(saved.plan);
    setStep(5);
    setActiveSection("channels");
    setActiveWeek(0);
  };

  /* ── On mount: load plans from DB → state + localStorage ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/ai-business-os/plans`, { headers: { "X-Requested-With": "fetch" } });
        const data = await res.json();
        if (data.success && data.plans?.length) {
          const mapped: SavedPlan[] = data.plans.map((r: any) => ({
            id:           r.id,
            businessName: r.businessName,
            duration:     r.duration,
            plan:         r.plan,
            createdAt:    r.createdAt,
          }));
          setSavedPlans(mapped.slice(0, 5));
          localStorage.setItem("aib_plans", JSON.stringify(mapped.slice(0, 5)));
        }
      } catch { /* silent */ }
    })();
  }, []);

  const generatePlan = async () => {
    setStep(4);
    setError("");
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % loadingMsgs.length;
      setLoadingIdx(idx);
    }, 1900);

    try {
      const res = await fetch(`${API}/ai-business-os/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          businessName, businessType, goals: selectedGoals,
          duration, budget: Number(budget) || 0, targetAudience: audience,
        }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (!data.success) throw new Error(data.error);

      // save to state + localStorage (use DB id from API response)
      const newEntry: SavedPlan = {
        id:           data.id ?? Date.now(),
        businessName,
        duration,
        plan:         data.plan,
        createdAt:    new Date().toISOString(),
      };
      setSavedPlans(prev => {
        const updated = [newEntry, ...prev.filter(p => p.id !== newEntry.id)].slice(0, 5);
        localStorage.setItem("aib_plans", JSON.stringify(updated));
        return updated;
      });

      setPlan(data.plan);
      setStep(5);
    } catch (e: unknown) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : "فشل إنشاء الخطة");
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title="خطة التسويق الذكية | AI Business OS"
        description="أنشئ خطة تسويق رقمي كاملة ومخصصة لنشاطك التجاري بالذكاء الاصطناعي."
        canonical="/ai-business-os/planner"
      />
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <Link href="/ai-business-os" className="inline-flex items-center gap-2 text-[#CC0000] text-sm font-bold mb-4 hover:gap-3 transition-all">
              <ArrowRight size={14} /> AI Business OS
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-2">📈 AI Marketing Planner</h1>
            <p className="text-[#6B7280]">خطة تسويق كاملة ومخصصة لنشاطك في دقائق</p>
          </motion.div>

          {/* ── Saved Plans History ── */}
          {savedPlans.length > 0 && step !== 4 && step !== 5 && (
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#374151] mb-3">
                <History size={15} className="text-[#CC0000]" /> خططك السابقة
              </h3>
              <div className="grid gap-2">
                {savedPlans.map(sp => (
                  <button key={sp.id} onClick={() => restorePlan(sp)}
                    className="w-full flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 hover:border-[#CC0000]/50 hover:bg-[#CC0000]/5 transition-all text-right group">
                    <div>
                      <p className="font-bold text-[#111827] text-sm group-hover:text-[#CC0000] transition-colors">{sp.businessName}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {durations.find(d => d.value === sp.duration)?.label} ·{" "}
                        {new Date(sp.createdAt).toLocaleDateString("ar-AE")}
                      </p>
                    </div>
                    <ArrowLeft size={15} className="text-[#9CA3AF] group-hover:text-[#CC0000] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] mt-5 mb-6" />
            </div>
          )}

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step > s ? "bg-[#10B981] text-white" : step === s ? "bg-[#CC0000] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ─── Step 1: Business info ─── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm">
                  <h2 className="text-xl font-black text-[#111827] mb-6">معلومات نشاطك التجاري</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-2">اسم النشاط التجاري *</label>
                      <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
                        placeholder="مثال: مطعم البيت، عيادة الدكتور سامي…"
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:border-[#CC0000] transition-colors text-[#111827] placeholder:text-[#9CA3AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-2">نوع النشاط *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {businessTypes.map(t => (
                          <button key={t} onClick={() => setBusinessType(t)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                              businessType === t ? "border-[#CC0000] bg-[#CC0000]/10 text-[#CC0000]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#CC0000]/40"
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-2">الجمهور المستهدف (اختياري)</label>
                      <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                        placeholder="مثال: نساء 25-45، رجال أعمال، طلاب جامعيين…"
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:border-[#CC0000] transition-colors text-[#111827] placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!businessName.trim() || !businessType}
                    className="w-full mt-6 bg-[#CC0000] text-white font-black py-3.5 rounded-xl hover:bg-[#AA0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    التالي <ArrowLeft size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Step 2: Goals ─── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm">
                  <h2 className="text-xl font-black text-[#111827] mb-2">ما هي أهدافك؟</h2>
                  <p className="text-[#6B7280] text-sm mb-6">اختر هدفاً أو أكثر لبناء خطة مخصصة</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {goalOptions.map(g => (
                      <button key={g} onClick={() => toggleGoal(g)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-right transition-all ${
                          selectedGoals.includes(g)
                            ? "border-[#CC0000] bg-[#CC0000]/10 text-[#CC0000]"
                            : "border-[#E5E7EB] text-[#374151] hover:border-[#CC0000]/40"
                        }`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedGoals.includes(g) ? "border-[#CC0000] bg-[#CC0000]" : "border-[#D1D5DB]"
                        }`}>
                          {selectedGoals.includes(g) && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className="text-sm font-semibold">{g}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] rounded-xl text-[#6B7280] font-bold hover:bg-[#F3F4F6] transition-colors">
                      <ArrowRight size={16} /> رجوع
                    </button>
                    <button onClick={() => setStep(3)} disabled={selectedGoals.length === 0}
                      className="flex-1 bg-[#CC0000] text-white font-black py-3 rounded-xl hover:bg-[#AA0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      التالي ({selectedGoals.length} أهداف) <ArrowLeft size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3: Duration + Budget ─── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm">
                  <h2 className="text-xl font-black text-[#111827] mb-6">مدة الخطة والميزانية</h2>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-2 text-red-700 text-sm">
                      <AlertTriangle size={16} />{error}
                    </div>
                  )}
                  <div className="space-y-3 mb-6">
                    {durations.map(d => (
                      <button key={d.value} onClick={() => setDuration(d.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all ${
                          duration === d.value ? "border-[#CC0000] bg-[#CC0000]/5" : "border-[#E5E7EB] hover:border-[#CC0000]/40"
                        }`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          duration === d.value ? "bg-[#CC0000] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}>
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className={`font-black ${duration === d.value ? "text-[#CC0000]" : "text-[#111827]"}`}>{d.label}</p>
                          <p className="text-xs text-[#6B7280]">{d.desc}</p>
                        </div>
                        {duration === d.value && <CheckCircle size={20} className="text-[#CC0000] mr-auto" />}
                      </button>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[#374151] mb-2 flex items-center gap-2">
                      <DollarSign size={14} className="text-[#CC0000]" /> الميزانية التقريبية (بالدرهم الإماراتي) — اختياري
                    </label>
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                      placeholder="مثال: 5000"
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:border-[#CC0000] transition-colors text-[#111827] placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] rounded-xl text-[#6B7280] font-bold hover:bg-[#F3F4F6] transition-colors">
                      <ArrowRight size={16} /> رجوع
                    </button>
                    <button onClick={generatePlan}
                      className="flex-1 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <Zap size={18} /> إنشاء الخطة الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 4: Loading ─── */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#06060F] rounded-3xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000]/20 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-[#CC0000]/20 rounded-full animate-ping" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#CC0000] to-[#880000] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(204,0,0,0.5)]">
                      <Target size={36} className="text-white" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-3 mb-6">
                    {[0,1,2,3,4].map(i => (
                      <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-[#D97706]"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p key={loadingIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="text-white font-bold text-lg mb-2">{loadingMsgs[loadingIdx]}</motion.p>
                  </AnimatePresence>
                  <p className="text-white/40 text-sm">يستغرق 10-25 ثانية لخطة شاملة</p>
                  <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                    <motion.div className="h-full bg-gradient-to-l from-[#D97706] to-[#CC0000] rounded-full"
                      animate={{ width: ["5%", "95%"] }} transition={{ duration: 22, ease: "easeInOut" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 5: Plan results ─── */}
            {step === 5 && plan && (
              <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Header banner */}
                <div className="bg-gradient-to-br from-[#111827] to-[#1E1B4B] rounded-3xl p-6 mb-6 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#CC0000] rounded-xl flex items-center justify-center shrink-0">
                      <Target size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-1">خطة تسويق {durations.find(d => d.value === duration)?.label}</p>
                      <h2 className="text-xl font-black">{businessName}</h2>
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{plan.overview}</p>
                    </div>
                  </div>
                </div>

                {/* Section tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {[
                    { id: "channels" as const, label: "القنوات" },
                    { id: "weeks" as const, label: "الخطة الأسبوعية" },
                    { id: "content" as const, label: "أفكار المحتوى" },
                    { id: "kpis" as const, label: "مؤشرات الأداء" },
                  ].map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                        activeSection === s.id ? "bg-[#CC0000] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#CC0000]/40"
                      }`}>{s.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Channels */}
                  {activeSection === "channels" && (
                    <motion.div key="ch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        {plan.channels.map((ch, i) => (
                          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: ch.color || "#CC0000" }}>
                                  {ch.name.slice(0, 2)}
                                </div>
                                <span className="font-black text-[#111827]">{ch.name}</span>
                              </div>
                              <span className="text-[#CC0000] font-black text-lg">{ch.budgetPercentage}%</span>
                            </div>
                            <p className="text-[#6B7280] text-xs mb-3 leading-relaxed">{ch.strategy}</p>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#374151]"><strong>التكرار:</strong> {ch.frequency}</span>
                            </div>
                            <div className="mt-2 text-xs text-[#10B981]"><strong>KPI:</strong> {ch.kpi}</div>
                          </div>
                        ))}
                      </div>
                      {/* Budget chart */}
                      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                        <p className="font-bold text-[#111827] mb-4">توزيع الميزانية</p>
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart data={plan.channels.map(c => ({ name: c.name, value: c.budgetPercentage }))}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v) => [`${v}%`, "الميزانية"]} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {plan.channels.map((c, i) => (
                                <Cell key={i} fill={c.color || ["#CC0000","#D97706","#3B82F6","#10B981","#8B5CF6"][i % 5]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {/* Weekly plan */}
                  {activeSection === "weeks" && (
                    <motion.div key="wk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        {plan.weeklyPlan.map((w, i) => (
                          <button key={i} onClick={() => setActiveWeek(i)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                              activeWeek === i ? "bg-[#111827] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280]"
                            }`}>الأسبوع {w.week}</button>
                        ))}
                      </div>
                      {plan.weeklyPlan[activeWeek] && (
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                          <h3 className="font-black text-[#111827] mb-1 text-lg">{plan.weeklyPlan[activeWeek].theme}</h3>
                          <p className="text-[#CC0000] text-xs font-bold mb-5">الأسبوع {plan.weeklyPlan[activeWeek].week}</p>
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                              <h4 className="font-bold text-[#374151] text-sm mb-3 flex items-center gap-2">
                                <CheckCircle size={14} className="text-[#10B981]" /> المهام الأسبوعية
                              </h4>
                              <ul className="space-y-2">
                                {plan.weeklyPlan[activeWeek].tasks.map((t, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
                                    <span className="w-5 h-5 rounded-full bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">{i + 1}</span>
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-bold text-[#374151] text-sm mb-3 flex items-center gap-2">
                                <Lightbulb size={14} className="text-[#D97706]" /> أفكار المحتوى
                              </h4>
                              <ul className="space-y-2">
                                {plan.weeklyPlan[activeWeek].contentIdeas.map((c, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
                                    <span className="text-[#D97706] shrink-0">✦</span> {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Content ideas */}
                  {activeSection === "content" && (
                    <motion.div key="ci" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {plan.contentIdeas.map((c, i) => (
                          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#CC0000]/10 text-[#CC0000]">{c.platform}</span>
                              <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{c.type}</span>
                            </div>
                            <p className="text-[#111827] font-bold text-sm mb-2">{c.idea}</p>
                            <p className="text-[#10B981] text-xs font-semibold">📣 {c.cta}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* KPIs */}
                  {activeSection === "kpis" && (
                    <motion.div key="kp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="space-y-3 mb-6">
                        {plan.kpis.map((k, i) => (
                          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#CC0000]/10 flex items-center justify-center shrink-0">
                              <TrendingUp size={18} className="text-[#CC0000]" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-[#111827] text-sm">{k.name}</p>
                              <p className="text-[#6B7280] text-xs">{k.current}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-[#CC0000]">{k.target}</p>
                              <p className="text-xs text-[#9CA3AF]">الهدف</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {plan.tips.length > 0 && (
                        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5">
                          <h4 className="font-black text-[#92400E] flex items-center gap-2 mb-4">
                            <Lightbulb size={16} /> نصائح استراتيجية
                          </h4>
                          <ul className="space-y-2">
                            {plan.tips.map((t, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-[#78350F]">
                                <span className="text-[#D97706] shrink-0">✦</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  <button onClick={() => { setStep(1); setPlan(null); setBusinessName(""); setBusinessType(""); setSelectedGoals([]); }}
                    className="py-3 border border-[#E5E7EB] rounded-xl font-bold text-[#374151] hover:bg-[#F3F4F6] transition-colors text-sm">
                    خطة جديدة
                  </button>
                  <button onClick={() => navigate("/ai-business-os/consultant")}
                    className="py-3 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#1F2937] transition-colors text-sm flex items-center justify-center gap-2">
                    <Clock size={14} /> اسأل المستشار
                  </button>
                  <button onClick={() => navigate("/ai-business-os/reports")}
                    className="py-3 bg-[#CC0000] text-white rounded-xl font-bold hover:bg-[#AA0000] transition-colors text-sm flex items-center justify-center gap-2">
                    إنشاء تقرير PDF
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
