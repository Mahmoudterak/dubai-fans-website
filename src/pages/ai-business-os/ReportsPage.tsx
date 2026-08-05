import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  FileBarChart, Download, Plus, Trash2, ArrowRight, CheckCircle,
  TrendingUp, AlertTriangle, Star, Clock, Eye,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface SavedReport {
  id: number;
  title: string;
  businessName: string;
  createdAt: string;
  scores: { label: string; score: number; color: string }[];
  summary: string;
  strengths: string[];
  issues: string[];
  recommendations: { title: string; priority: string; description: string }[];
}

const defaultColors = ["#CC0000", "#3B82F6", "#10B981", "#D97706"];

function buildReportFromAudit(): SavedReport | null {
  try {
    const audits = JSON.parse(localStorage.getItem("aib_audits") || "[]");
    if (!audits.length) return null;
    const a = audits[0];
    const sc = a.analysis.scores;
    return {
      id:           a.id,
      title:        `تقرير الأداء الشامل`,
      businessName: a.businessName,
      createdAt:    a.createdAt,
      scores: [
        { label: "Business Score", score: a.analysis.overallScore, color: "#CC0000" },
        { label: "SEO",            score: sc.seo,                  color: "#3B82F6" },
        { label: "Content",        score: sc.content,              color: "#10B981" },
        { label: "Performance",    score: sc.performance,          color: "#D97706" },
      ],
      summary:         a.analysis.summary,
      strengths:       a.analysis.strengths,
      issues:          a.analysis.issues,
      recommendations: a.analysis.recommendations,
    };
  } catch { return null; }
}

/* ─── PDF-print styles (injected on demand) ─────────────── */
const printStyles = `
  @media print {
    body * { visibility: hidden; }
    #report-print, #report-print * { visibility: visible; }
    #report-print { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;

/* ─── ScoreMeter ─────────────────────────────────────────── */
function ScoreMeter({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-[#374151]">{label}</span>
        <span className="font-black text-base" style={{ color }}>{score}%</span>
      </div>
      <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function ReportsPage() {
  const [, navigate] = useLocation();
  const [reports, setReports]       = useState<SavedReport[]>([]);
  const [activeReport, setActiveReport] = useState<SavedReport | null>(null);
  const [previewMode, setPreviewMode]   = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // Try API first, then localStorage fallback
      let apiAudits: any[] = [];
      try {
        const res = await fetch("/api/ai-business-os/audits", {
          headers: { "X-Requested-With": "fetch" },
        });
        const data = await res.json();
        if (data.success) apiAudits = data.audits ?? [];
      } catch { /**/ }

      if (apiAudits.length) {
        const reports: SavedReport[] = apiAudits.map((a: any) => {
          const sc = a.analysis?.scores ?? {};
          return {
            id:           a.id,
            title:        "تقرير الأداء الشامل",
            businessName: a.businessName,
            createdAt:    a.createdAt,
            scores: [
              { label: "Business Score", score: a.analysis?.overallScore ?? 0, color: "#CC0000" },
              { label: "SEO",            score: sc.seo ?? 0,                   color: "#3B82F6" },
              { label: "Content",        score: sc.content ?? 0,               color: "#10B981" },
              { label: "Performance",    score: sc.performance ?? 0,            color: "#D97706" },
            ],
            summary:         a.analysis?.summary ?? "",
            strengths:       a.analysis?.strengths ?? [],
            issues:          a.analysis?.issues ?? [],
            recommendations: a.analysis?.recommendations ?? [],
          };
        });
        setReports(reports);
        setActiveReport(reports[0] ?? null);
        return;
      }

      // Fallback to localStorage
      const saved: SavedReport[] = JSON.parse(localStorage.getItem("aib_reports") || "[]");
      const fromAudit = buildReportFromAudit();
      const merged = fromAudit
        ? [fromAudit, ...saved.filter(r => r.id !== fromAudit.id)]
        : saved;
      setReports(merged);
      if (merged.length > 0) setActiveReport(merged[0]);
    })();
  }, []);

  const deleteReport = (id: number) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem("aib_reports", JSON.stringify(updated));
    if (activeReport?.id === id) setActiveReport(updated[0] ?? null);
  };

  const downloadPDF = () => {
    // Inject print styles
    const style = document.createElement("style");
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    setTimeout(() => {
      window.print();
      document.head.removeChild(style);
    }, 100);
  };

  /* ─── Empty state ─── */
  if (reports.length === 0 || !activeReport) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <SEOHead title="التقارير | AI Business OS" description="إنشاء تقارير PDF احترافية لنشاطك التجاري" canonical="/ai-business-os/reports" />
        <Navbar />
        <main className="pt-28 pb-20 flex items-center justify-center min-h-[80vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#CC0000]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileBarChart size={36} className="text-[#CC0000]" />
            </div>
            <h1 className="text-2xl font-black text-[#111827] mb-3">لا توجد تقارير بعد</h1>
            <p className="text-[#6B7280] text-sm mb-8">ابدأ بتحليل نشاطك التجاري لإنشاء أول تقرير احترافي</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate("/ai-business-os/audit")}
                className="flex items-center gap-2 bg-[#CC0000] text-white font-black px-6 py-3 rounded-xl hover:bg-[#AA0000] transition-colors">
                <Plus size={18} /> ابدأ تحليلاً
              </button>
              <Link href="/ai-business-os"
                className="flex items-center gap-2 border-2 border-[#111827] text-[#111827] font-bold px-6 py-3 rounded-xl hover:bg-[#111827] hover:text-white transition-colors">
                <ArrowRight size={16} /> رجوع
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]" dir="rtl">
      <SEOHead title="التقارير | AI Business OS" description="إنشاء تقارير PDF احترافية لنشاطك التجاري" canonical="/ai-business-os/reports" />
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-2">
                <Link href="/ai-business-os" className="hover:text-[#CC0000] transition-colors flex items-center gap-1">
                  <ArrowRight size={12} /> AI Business OS
                </Link>
                <span>/</span>
                <span>التقارير</span>
              </div>
              <h1 className="text-2xl font-black text-[#111827]">📄 AI Reports</h1>
            </div>
            <button onClick={() => navigate("/ai-business-os/audit")}
              className="flex items-center gap-2 bg-[#CC0000] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#AA0000] transition-colors text-sm">
              <Plus size={16} /> تقرير جديد
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ─── Reports list ─── */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">التقارير المحفوظة</h3>
              {reports.map(r => (
                <motion.div
                  key={r.id}
                  whileHover={{ x: -3 }}
                  onClick={() => setActiveReport(r)}
                  className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                    activeReport?.id === r.id ? "border-[#CC0000] shadow-md" : "border-transparent hover:border-[#CC0000]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#CC0000] to-[#880000] rounded-xl flex items-center justify-center shrink-0">
                      <FileBarChart size={16} className="text-white" />
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteReport(r.id); }}
                      className="text-[#9CA3AF] hover:text-red-500 transition-colors p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="font-bold text-[#111827] text-sm">{r.businessName}</p>
                  <p className="text-[#6B7280] text-xs">{r.title}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[#9CA3AF] text-xs">
                    <Clock size={10} />
                    {new Date(r.createdAt).toLocaleDateString("ar-AE", { day: "numeric", month: "short" })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── Report preview ─── */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setPreviewMode(false)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${!previewMode ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:bg-[#F3F4F6]"}`}>
                  <Eye size={14} /> معاينة
                </button>
                <button onClick={downloadPDF}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-[#CC0000] text-white hover:bg-[#AA0000] transition-colors">
                  <Download size={14} /> تحميل PDF
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReport.id}
                  id="report-print"
                  ref={printRef}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  {/* Report header */}
                  <div className="bg-gradient-to-l from-[#CC0000] to-[#880000] p-8 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-black text-xl">
                            د
                          </div>
                          <div>
                            <p className="font-black text-lg leading-none">دبي فانز</p>
                            <p className="text-white/60 text-xs">AI Business OS</p>
                          </div>
                        </div>
                        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">تقرير الأداء الشامل</p>
                        <h2 className="text-3xl font-black">{activeReport.businessName}</h2>
                        <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(activeReport.createdAt).toLocaleDateString("ar-AE", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-black">{activeReport.scores[0].score}</div>
                        <div className="text-white/70 text-sm">من 100</div>
                        <div className="flex gap-0.5 mt-2 justify-center">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} className={i <= Math.round(activeReport.scores[0].score / 20) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-white/30 fill-white/30"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scores section */}
                  <div className="p-8 border-b border-[#F3F4F6]">
                    <h3 className="font-black text-[#111827] mb-6 flex items-center gap-2">
                      <TrendingUp size={18} className="text-[#CC0000]" /> مؤشرات الأداء
                    </h3>
                    {activeReport.scores.map(s => (
                      <ScoreMeter key={s.label} label={s.label} score={s.score} color={s.color} />
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="px-8 py-5 bg-[#F9FAFB] border-b border-[#F3F4F6]">
                    <p className="text-[#374151] leading-relaxed text-sm">{activeReport.summary}</p>
                  </div>

                  {/* Strengths + Issues */}
                  <div className="grid sm:grid-cols-2 gap-0 divide-x divide-x-reverse divide-[#F3F4F6]">
                    <div className="p-6">
                      <h4 className="font-black text-[#10B981] flex items-center gap-2 mb-4 text-sm">
                        <CheckCircle size={16} /> نقاط القوة
                      </h4>
                      <ul className="space-y-2.5">
                        {activeReport.strengths.slice(0, 4).map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                            <span className="w-4 h-4 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6">
                      <h4 className="font-black text-[#CC0000] flex items-center gap-2 mb-4 text-sm">
                        <AlertTriangle size={16} /> نقاط تحتاج تحسين
                      </h4>
                      <ul className="space-y-2.5">
                        {activeReport.issues.slice(0, 4).map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                            <span className="w-4 h-4 rounded-full bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center text-[10px] shrink-0 mt-0.5">!</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-6 border-t border-[#F3F4F6]">
                    <h4 className="font-black text-[#111827] mb-4 text-sm flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#CC0000]" /> التوصيات الرئيسية
                    </h4>
                    <div className="space-y-3">
                      {activeReport.recommendations.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-start gap-3 bg-[#F9FAFB] rounded-xl p-4">
                          <span className="w-6 h-6 rounded-lg bg-[#CC0000] text-white flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                          <div>
                            <p className="font-bold text-[#111827] text-sm">{r.title}</p>
                            <p className="text-[#6B7280] text-xs mt-0.5 leading-relaxed">{r.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Report footer */}
                  <div className="px-8 py-5 bg-[#111827] flex items-center justify-between">
                    <p className="text-white/40 text-xs">AI Business OS by دبي فانز | mtuaefans.com</p>
                    <p className="text-white/40 text-xs">+971 55 198 1564</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
