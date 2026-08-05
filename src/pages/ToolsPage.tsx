import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { toolsFaqSchema } from "@/seo/schemas.mjs";
// reCAPTCHA Enterprise is now invisible — no tab-level gate needed.
import { getRouteMeta } from "@/seo/routes-meta.mjs";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calculator, PenTool, MessageCircle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import SeoTools from "@/components/tools/SeoTools";
import MarketingCalculators from "@/components/tools/MarketingCalculators";
import ContentTools from "@/components/tools/ContentTools";
import CommunicationTools from "@/components/tools/CommunicationTools";
import AnalyzeTab from "@/components/tools/AnalyzeTab";

const TABS = [
  { id: "analyze",       label: "فحص مجاني", icon: Sparkles },
  { id: "seo",          label: "أدوات السيو", icon: Search },
  { id: "marketing",    label: "حاسبات التسويق", icon: Calculator },
  { id: "content",      label: "أدوات المحتوى", icon: PenTool },
  { id: "communication",label: "أدوات التواصل", icon: MessageCircle },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("analyze");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAFAFA]">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/tools"
        keywords="أدوات تسويق رقمي مجانية, مولد كلمات مفتاحية, حاسبة ROI, مولد هاشتاجات, فاحص سيو مجاني, مولد رابط واتساب"
        jsonLd={toolsFaqSchema}
      />
      <Navbar />
      
      <main className="flex-grow pt-28 pb-24">
        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-14 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#CC0000]/8 rounded-full blur-[80px]" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
                مجاناً 100%
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
                أدوات <span className="gradient-text">مجانية</span> لتطوير تسويقك
              </h1>
              <p className="text-[#9CA3AF] text-lg">
                مجموعة من الأدوات الذكية والحاسبات التسويقية لمساعدتك في التخطيط، التحليل، وتحسين أداء حملاتك.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Banner image */}
        <div className="container mx-auto px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB]"
          >
            <img
              src="/tools-banner.webp"
              alt="أدوات مجانية لتطوير تسويقك - دبي فانز"
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#CC0000] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      : "bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-white hover:border-[#CC0000]/40"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#F0B429]" : ""}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* reCAPTCHA Enterprise is invisible — tabs load directly */}
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

      <Footer />
    </div>
  );
}

const PAGE_META = getRouteMeta("/tools");
