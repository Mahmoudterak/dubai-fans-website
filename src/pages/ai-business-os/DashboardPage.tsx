import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BarChart3, Bot, Target, TrendingUp, CheckCircle, AlertTriangle,
  ArrowRight, Plus, RefreshCw, Clock,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface AuditEntry {
  id: number;
  type: string;
  url: string;
  businessName: string;
  createdAt: string;
  analysis: {
    overallScore: number;
    grade: string;
    scores: {
      seo: number; content: number; performance: number;
      socialPresence: number; branding: number; engagement: number;
    };
    strengths: string[];
    issues: string[];
    recommendations: { title: string; priority: string; description: string }[];
    summary: string;
    quickWins?: string[];
  };
}

const tabs = [
  "Business Health", "Marketing", "SEO",
  "Sales", "Growth", "Tasks", "Reports", "Recommendations",
];

const areaData = [
  { name: "يناير", نمو: 40, مبيعات: 24, تسويق: 55 },
  { name: "فبراير", نمو: 55, مبيعات: 39, تسويق: 62 },
  { name: "مارس", نمو: 65, مبيعات: 48, تسويق: 70 },
  { name: "أبريل", نمو: 72, مبيعات: 56, تسويق: 75 },
  { name: "مايو", نمو: 81, مبيعات: 63, تسويق: 82 },
  { name: "يونيو", نمو: 91, مبيعات: 78, تسويق: 90 },
];
const platformData = [
  { name: "Instagram", قيمة: 87 },
  { name: "Facebook",  قيمة: 72 },
  { name: "TikTok",    قيمة: 65 },
  { name: "Google",    قيمة: 91 },
  { name: "Website",   قيمة: 78 },
];

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
      <div className="text-3xl font-black mb-1" style={{ color }}>{score}%</div>
      <div className="text-white/50 text-xs">{label}</div>
      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [audits, setAudits]       = useState<AuditEntry[]>([]);
  const [latest, setLatest]       = useState<AuditEntry | null>(null);

  useEffect(() => {
    // Load from API (DB), fall back to localStorage
    (async () => {
      try {
        const res = await fetch("/api/ai-business-os/audits", {
          headers: { "X-Requested-With": "fetch" },
        });
        const data = await res.json();
        if (data.success && data.audits?.length) {
          const mapped: AuditEntry[] = data.audits.map((r: any) => ({
            id:           r.id,
            type:         r.type,
            url:          r.url,
            businessName: r.businessName,
            createdAt:    r.createdAt,
            analysis:     r.analysis,
          }));
          setAudits(mapped);
          setLatest(mapped[0]);
          localStorage.setItem("aib_audits", JSON.stringify(mapped.slice(0, 10)));
          return;
        }
      } catch { /* fall through */ }
      try {
        const saved: AuditEntry[] = JSON.parse(localStorage.getItem("aib_audits") || "[]");
        setAudits(saved);
        setLatest(saved[0] ?? null);
      } catch { /**/ }
    })();
  }, []);

  /* ─── Empty state ─── */
  if (!latest) {
    return (
      <div className="min-h-screen bg-[#06060F]" dir="rtl">
        <SEOHead title="لوحة التحكم | AI Business OS" description="لوحة تحكم ذكية لمراقبة صحة نشاطك التجاري" canonical="/ai-business-os/dashboard" />
        <Navbar />
        <main className="pt-28 pb-20 flex items-center justify-center min-h-[80vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#CC0000]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={36} className="text-[#CC0000]" />
            </div>
            <h1 className="text-2xl font-black text-white mb-3">لوحة التحكم فارغة</h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              لا توجد بيانات بعد. قم بتشغيل تحليلك الأول وستظهر نتائجه هنا تلقائياً.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/ai-business-os/audit")}
                className="flex items-center gap-2 bg-[#CC0000] text-white font-black px-6 py-3 rounded-xl hover:bg-[#AA0000] transition-colors"
              >
                <Plus size={18} /> ابدأ تحليلك الأول
              </button>
              <Link href="/ai-business-os"
                className="flex items-center gap-2 border border-white/20 text-white/70 font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <ArrowRight size={16} /> رجوع
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const sc = latest.analysis.scores;
  const scoreCards = [
    { label: "Business Score", score: latest.analysis.overallScore, color: "#CC0000" },
    { label: "SEO",            score: sc.seo,           color: "#3B82F6" },
    { label: "Content",        score: sc.content,       color: "#10B981" },
    { label: "Performance",    score: sc.performance,   color: "#D97706" },
    { label: "Branding",       score: sc.branding,      color: "#8B5CF6" },
    { label: "Engagement",     score: sc.engagement,    color: "#EC4899" },
  ];
  const radialData = scoreCards.slice(0, 4).map(c => ({ name: c.label, value: c.score, fill: c.color }));

  const tabContent: Record<number, React.ReactNode> = {
    // Business Health
    0: (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 grid grid-cols-2 gap-3">
          {scoreCards.map(c => <ScoreCard key={c.label} {...c} />)}
        </div>
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/70 text-sm font-bold mb-3">النمو الشهري</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CC0000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#CC0000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="نمو" stroke="#CC0000" fill="url(#gN)" strokeWidth={2} />
              <Area type="monotone" dataKey="مبيعات" stroke="#D97706" fill="none" strokeWidth={2} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    // Marketing
    1: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/70 text-sm font-bold mb-3">أداء المنصات</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={platformData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} width={65} />
              <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="قيمة" fill="#CC0000" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/70 text-sm font-bold mb-3">توزيع القنوات</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "rgba(255,255,255,0.05)" }} />
              <Legend iconSize={10} wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    // SEO
    2: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "SEO Score", score: sc.seo, color: "#3B82F6" },
            { label: "Performance", score: sc.performance, color: "#10B981" },
            { label: "Content", score: sc.content, color: "#D97706" },
            { label: "Branding", score: sc.branding, color: "#8B5CF6" },
          ].map(c => <ScoreCard key={c.label} {...c} />)}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/70 font-bold mb-4">تحليل SEO</p>
          <p className="text-white/60 text-sm leading-relaxed">{latest.analysis.summary}</p>
        </div>
      </div>
    ),
    // Recommendations
    7: (
      <div className="space-y-3">
        {latest.analysis.recommendations.map((r, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                r.priority === "high" ? "bg-red-900/40 text-red-400" :
                r.priority === "medium" ? "bg-yellow-900/40 text-yellow-400" :
                "bg-green-900/40 text-green-400"
              }`}>
                {r.priority === "high" ? "أولوية عالية" : r.priority === "medium" ? "متوسطة" : "منخفضة"}
              </span>
              <span className="text-white font-bold text-sm">{r.title}</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    ),
    // Tasks
    5: (
      <div className="space-y-3">
        {[
          ...(latest.analysis.quickWins || []).map(t => ({ text: t, done: false, type: "quick" })),
          ...(latest.analysis.recommendations.slice(0, 4).map(r => ({ text: r.title, done: false, type: "rec" }))),
        ].map(({ text, done, type }, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#10B981]" : "border border-white/20"}`}>
              {done && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className="text-white/70 text-sm flex-1">{text}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${type === "quick" ? "bg-[#CC0000]/20 text-[#CC0000]" : "bg-white/10 text-white/40"}`}>
              {type === "quick" ? "سريع" : "توصية"}
            </span>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#06060F]" dir="rtl">
      <SEOHead title="لوحة التحكم | AI Business OS" description="لوحة تحكم ذكية لمراقبة صحة نشاطك التجاري" canonical="/ai-business-os/dashboard" />
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <Link href="/ai-business-os" className="hover:text-white transition-colors flex items-center gap-1">
                  <ArrowRight size={12} /> AI Business OS
                </Link>
                <span>/</span>
                <span>Dashboard</span>
              </div>
              <h1 className="text-2xl font-black text-white">
                {latest.businessName} — لوحة التحكم
              </h1>
              <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5">
                <Clock size={11} />
                آخر تحليل: {new Date(latest.createdAt).toLocaleDateString("ar-AE", { day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/ai-business-os/audit")}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={14} /> تحديث التحليل
              </button>
              <button
                onClick={() => navigate("/ai-business-os/consultant")}
                className="flex items-center gap-2 bg-[#CC0000] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#AA0000] transition-colors"
              >
                <Bot size={14} /> اسأل المستشار
              </button>
            </div>
          </div>

          {/* Summary banner */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#880000] flex items-center justify-center shrink-0 font-black text-white text-xl shadow-[0_0_20px_rgba(204,0,0,0.3)]">
              {latest.analysis.overallScore}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">{latest.analysis.summary}</p>
            </div>
            <div className="flex gap-3 text-xs text-white/50 shrink-0">
              <span className="flex items-center gap-1 text-[#10B981]">
                <CheckCircle size={12} /> {latest.analysis.strengths.length} نقاط قوة
              </span>
              <span className="flex items-center gap-1 text-[#CC0000]">
                <AlertTriangle size={12} /> {latest.analysis.issues.length} تحتاج تحسين
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-1 mb-5 pb-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeTab === i ? "bg-[#CC0000] text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tabContent[activeTab] ?? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...latest.analysis.strengths, ...latest.analysis.quickWins ?? []].slice(0, 6).map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Target size={16} className="text-[#CC0000] shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Previous audits */}
          {audits.length > 1 && (
            <div className="mt-8">
              <h3 className="text-white/50 text-xs font-bold uppercase mb-3">تحليلات سابقة</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {audits.slice(1, 4).map(a => (
                  <button
                    key={a.id}
                    onClick={() => setLatest(a)}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-right hover:border-[#CC0000]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black" style={{ color: a.analysis.overallScore >= 80 ? "#10B981" : a.analysis.overallScore >= 60 ? "#D97706" : "#CC0000" }}>
                        {a.analysis.overallScore}
                      </span>
                      <span className="text-white/30 text-xs">
                        {new Date(a.createdAt).toLocaleDateString("ar-AE")}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm font-bold truncate">{a.businessName}</p>
                    <p className="text-white/30 text-xs">{a.type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
