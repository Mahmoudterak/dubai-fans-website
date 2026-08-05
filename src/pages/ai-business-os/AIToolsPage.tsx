import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearch } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import SeoTools from "@/components/tools/SeoTools";
import MarketingCalculators from "@/components/tools/MarketingCalculators";
import ContentTools from "@/components/tools/ContentTools";
import CommunicationTools from "@/components/tools/CommunicationTools";
import AnalyzeTab from "@/components/tools/AnalyzeTab";
import {
  Sparkles, Search, Calculator, PenTool, MessageCircle,
  ArrowRight, Zap, TrendingUp, Hash, Link2, BarChart3,
} from "lucide-react";

/* ─── Tabs ───────────────────────────────────────────────── */
const TABS = [
  {
    id: "analyze",
    label: "فحص مجاني",
    icon: Sparkles,
    desc: "تحليل فوري لموقعك أو حساباتك",
    color: "#CC0000",
  },
  {
    id: "seo",
    label: "أدوات السيو",
    icon: Search,
    desc: "كلمات مفتاحية، فحص SEO، ترتيب جوجل",
    color: "#3B82F6",
  },
  {
    id: "marketing",
    label: "حاسبات التسويق",
    icon: Calculator,
    desc: "ROI، ROAS، تكلفة الاكتساب",
    color: "#10B981",
  },
  {
    id: "content",
    label: "أدوات المحتوى",
    icon: PenTool,
    desc: "هاشتاجات، أفكار محتوى، كاليندر",
    color: "#8B5CF6",
  },
  {
    id: "communication",
    label: "أدوات التواصل",
    icon: MessageCircle,
    desc: "واتساب، بيو إنستغرام، رسائل",
    color: "#D97706",
  },
];

/* ─── Quick-access cards shown above tabs ────────────────── */
const quickTools = [
  { icon: Search,      label: "مولد كلمات مفتاحية",  tab: "seo",           color: "#3B82F6" },
  { icon: Hash,        label: "مولد هاشتاجات",        tab: "content",       color: "#8B5CF6" },
  { icon: Calculator,  label: "حاسبة ROI",             tab: "marketing",     color: "#10B981" },
  { icon: Link2,       label: "رابط واتساب",           tab: "communication", color: "#D97706" },
  { icon: TrendingUp,  label: "فاحص سيو سريع",         tab: "seo",           color: "#CC0000" },
  { icon: BarChart3,   label: "تحليل ذكي شامل",        tab: "analyze",       color: "#CC0000" },
];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("analyze");

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title="أدوات مجانية | AI Business OS"
        description="14 أداة تسويقية مجانية مدعومة بالذكاء الاصطناعي: فحص مجاني، مولد كلمات مفتاحية، حاسبات ROI، هاشتاجات، رابط واتساب، وأكثر."
        canonical="/ai-business-os/tools"
        keywords="أدوات تسويق مجانية, مولد كلمات مفتاحية, حاسبة ROI, مولد هاشتاجات, فاحص سيو, AI Business OS"
      />
      <Navbar />

      {/* ── Dark branded header ── */}
      <div className="bg-[#06060F] pt-24 pb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CC0000]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[80px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
            <Link href="/ai-business-os" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowRight size={12} /> AI Business OS
            </Link>
            <span>/</span>
            <span className="text-white/70">أدوات مجانية</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#CC0000]/20 border border-[#CC0000]/30 rounded-full px-4 py-1.5 text-[#CC0000] text-xs font-bold mb-4">
                <Zap size={12} /> مجاناً 100% — مدعومة بـ AI Business OS
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                🛠️ أدوات <span className="text-[#CC0000]">مجانية</span>
              </h1>
              <p className="text-white/50 text-lg max-w-xl">
                14 أداة تسويقية ذكية في مكان واحد — من فحص الأداء إلى توليد المحتوى وحساب العوائد.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 shrink-0">
              {[
                { val: "14+", label: "أداة" },
                { val: "100%", label: "مجاني" },
                { val: "فوري", label: "النتيجة" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[72px]">
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick-access chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {quickTools.map(({ icon: Icon, label, tab, color }) => (
              <button
                key={label}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              >
                <Icon size={12} style={{ color }} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs bar ── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto gap-0 scrollbar-hide">
            {TABS.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeTab === id
                    ? "text-[#111827]"
                    : "text-[#9CA3AF] hover:text-[#374151]"
                }`}
              >
                <Icon size={16} style={{ color: activeTab === id ? color : undefined }} />
                {label}
                {activeTab === id && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active tab description ── */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="container mx-auto px-6 py-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-[#6B7280]"
            >
              {TABS.find(t => t.id === activeTab)?.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Tab content ── */}
      <main className="pb-24 pt-8">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "analyze"       && <AnalyzeTab />}
                {activeTab === "seo"           && <SeoTools />}
                {activeTab === "marketing"     && <MarketingCalculators />}
                {activeTab === "content"       && <ContentTools />}
                {activeTab === "communication" && <CommunicationTools />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── AI Business OS upsell ── */}
      <div className="bg-[#06060F] py-14">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/40 text-sm mb-3">هل تريد تحليلاً أعمق وخطة تسويق كاملة؟</p>
          <h2 className="text-2xl font-black text-white mb-6">
            جرّب <span className="text-[#CC0000]">AI Business Audit</span> الكامل مجاناً
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/ai-business-os/audit"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white font-black px-8 py-3.5 rounded-xl hover:bg-[#AA0000] transition-colors"
            >
              <Zap size={18} /> ابدأ التحليل الشامل
            </Link>
            <Link
              href="/ai-business-os"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              استكشف AI Business OS
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
