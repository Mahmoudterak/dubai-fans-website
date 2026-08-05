/**
 * AnalyzeTab — نفس منطق صفحة "فحص مجاني" لكن بدون Navbar/Footer/SEOHead،
 * مُصمَّم للتضمين داخل قسم "أدوات مجانية" كتاب جديدة.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe, FaInstagram, FaFacebook, FaTiktok,
  FaSnapchatGhost, FaGoogle, FaCheck, FaTimes, FaWhatsapp,
} from "react-icons/fa";
import { useAnalyzeBusiness } from "@workspace/api-client-react";
import { setRecaptchaToken } from "@workspace/api-client-react";
import type { AnalyzeInputPlatformType } from "@workspace/api-client-react";
import { Loader2, ArrowRight, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { executeRecaptchaEnterprise } from "@/lib/recaptcha-enterprise";
import { RateLimitCountdown, useRateLimitCountdown } from "@/components/RateLimitCountdown";

type Step = "select" | "input" | "analyzing" | "results";

const platforms = [
  { id: "website",   name: "موقع إلكتروني", icon: FaGlobe,         color: "text-blue-500",   hoverBorder: "hover:border-blue-500" },
  { id: "instagram", name: "إنستغرام",       icon: FaInstagram,     color: "text-pink-600",   hoverBorder: "hover:border-pink-600" },
  { id: "facebook",  name: "فيسبوك",         icon: FaFacebook,      color: "text-blue-600",   hoverBorder: "hover:border-blue-600" },
  { id: "tiktok",    name: "تيك توك",         icon: FaTiktok,        color: "text-black",      hoverBorder: "hover:border-gray-800" },
  { id: "snapchat",  name: "سناب شات",        icon: FaSnapchatGhost, color: "text-yellow-500", hoverBorder: "hover:border-yellow-500" },
  { id: "google",    name: "جوجل للأعمال",    icon: FaGoogle,        color: "text-red-500",    hoverBorder: "hover:border-red-500" },
] as const;

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":   return "bg-red-50 text-red-700 border-red-200";
    case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "low":    return "bg-green-50 text-green-700 border-green-200";
    default:       return "bg-white text-[#9CA3AF] border-[#E5E7EB]";
  }
};

export default function AnalyzeTab() {
  const [step, setStep] = useState<Step>("select");
  const [platform, setPlatform] = useState<AnalyzeInputPlatformType | null>(null);
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("جاري فحص المنصة...");

  const analyzeMutation = useAnalyzeBusiness();
  const rateLimit = useRateLimitCountdown();

  useEffect(() => {
    if (step === "analyzing") {
      const t1 = setTimeout(() => setLoadingText("تحليل نقاط القوة والضعف..."), 2000);
      const t2 = setTimeout(() => setLoadingText("إعداد التوصيات..."), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setLoadingText("جاري فحص المنصة...");
    return undefined;
  }, [step]);

  const getPlaceholder = (p: AnalyzeInputPlatformType) => {
    switch (p) {
      case "website":   return "https://www.example.com";
      case "instagram": return "https://instagram.com/username";
      case "facebook":  return "https://facebook.com/page";
      case "tiktok":    return "https://tiktok.com/@username";
      case "snapchat":  return "username";
      case "google":    return "رابط نشاطك على خرائط جوجل";
      default:          return "الرابط";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !url || submitting || rateLimit.isRateLimited) return;
    setSubmitting(true);
    // Execute reCAPTCHA Enterprise invisibly before the API call
    const token = await executeRecaptchaEnterprise("ANALYZE");
    setRecaptchaToken(token);
    setStep("analyzing");
    analyzeMutation.mutate(
      { data: { url, platformType: platform, businessName } },
      {
        onSuccess: () => {
          setRecaptchaToken(null);
          setSubmitting(false);
          setTimeout(() => setStep("results"), 1000);
        },
        onError: (error) => {
          setRecaptchaToken(null);
          setSubmitting(false);
          if (!rateLimit.handleError(error)) {
            alert("حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.");
          }
          setStep("input");
        },
      }
    );
  };

  /* ── STEP: Select ────────────────────────────────────────────────── */
  if (step === "select") return (
    <AnimatePresence mode="wait">
      <motion.div
        key="select"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="max-w-3xl mx-auto"
      >
        {/* Banner */}
        <div className="max-w-xs mx-auto mb-10 rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB]">
          <img
            src="/audit-banner.webp"
            alt="فحص مجاني بالذكاء الاصطناعي"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
            ما الذي تريد <span className="text-[#CC0000]">تحليله؟</span>
          </h2>
          <p className="text-[#6B7280] text-sm">
            اختر المنصة — الذكاء الاصطناعي يُحلّل ويُقدّم توصيات مخصصة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPlatform(p.id as AnalyzeInputPlatformType); setStep("input"); }}
              className={`flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-[#E5E7EB] transition-all duration-300 ${p.hoverBorder} hover:shadow-lg group`}
            >
              <p.icon className={`text-4xl ${p.color} transition-transform duration-300 group-hover:scale-110`} />
              <span className="font-bold text-[#111827] text-sm">{p.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  /* ── STEP: Input ─────────────────────────────────────────────────── */
  if (step === "input") {
    const sel = platforms.find((p) => p.id === platform);
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="max-w-xl mx-auto"
        >
          <button
            onClick={() => setStep("select")}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#CC0000] font-semibold mb-6 transition-colors"
          >
            <ArrowRight size={18} />
            تغيير المنصة
          </button>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
              {sel && <sel.icon className={`text-4xl ${sel.color}`} />}
              <div>
                <h2 className="text-xl font-black text-[#111827]">تحليل {sel?.name}</h2>
                <p className="text-[#9CA3AF] text-sm mt-0.5">أدخل تفاصيل حسابك لنبدأ الفحص</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">الرابط (مطلوب)</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={getPlaceholder(platform!)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 outline-none transition-all text-left text-[#111827]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">اسم النشاط التجاري (اختياري)</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="مثال: مطعم الفريج"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 outline-none transition-all text-[#111827]"
                />
              </div>

              <RateLimitCountdown secondsLeft={rateLimit.secondsLeft} />

              <button
                type="submit"
                disabled={submitting || rateLimit.isRateLimited}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#CC0000] to-[#B00000] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 size={18} className="animate-spin" /> جاري التحقق...</> : "ابدأ التحليل الآن"}
              </button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── STEP: Analyzing ─────────────────────────────────────────────── */
  if (step === "analyzing") return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm mx-auto text-center py-16"
    >
      <div className="relative w-28 h-28 mx-auto mb-8">
        <div className="absolute inset-0 border-4 border-[#E5E7EB] rounded-full" />
        <div className="absolute inset-0 border-4 border-[#CC0000] rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[#CC0000]">
          <Loader2 className="w-9 h-9 animate-pulse" />
        </div>
      </div>
      <motion.h3
        key={loadingText}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-[#111827]"
      >
        {loadingText}
      </motion.h3>
      <p className="text-[#9CA3AF] text-sm mt-2">يعمل الذكاء الاصطناعي على تقييم البيانات…</p>
    </motion.div>
  );

  /* ── STEP: Results ───────────────────────────────────────────────── */
  if (step === "results" && analyzeMutation.data) {
    const { score, summary, strengths, weaknesses, recommendations } = analyzeMutation.data;
    const scoreColor = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
    const radius = 56;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;

    return (
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Score card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="relative shrink-0">
            <svg className="w-36 h-36 -rotate-90">
              <circle cx="72" cy="72" r={radius} stroke="#F3F4F6" strokeWidth="10" fill="transparent" />
              <circle cx="72" cy="72" r={radius} stroke={scoreColor} strokeWidth="10" fill="transparent"
                strokeDasharray={circ} strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#111827]">{score}</span>
              <span className="text-xs font-semibold text-[#9CA3AF]">/ 100</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#111827] mb-3">نتيجة التحليل</h2>
            <p className="text-[#6B7280] leading-relaxed">{summary}</p>
            <button
              onClick={() => { setStep("select"); setUrl(""); setBusinessName(""); setRecaptchaToken(null); }}
              className="mt-4 text-sm text-[#CC0000] hover:underline font-semibold"
            >
              تحليل حساب آخر ←
            </button>
          </div>
        </div>

        {/* Strengths / Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-[#111827] mb-4">
              <TrendingUp size={18} className="text-green-500" /> نقاط القوة
            </h3>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-[#6B7280] text-sm">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                    <FaCheck size={10} />
                  </div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-[#111827] mb-4">
              <AlertTriangle size={18} className="text-red-500" /> نقاط تحتاج للتحسين
            </h3>
            <ul className="space-y-3">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-[#6B7280] text-sm">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mt-0.5">
                    <FaTimes size={10} />
                  </div>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h3 className="font-black text-[#111827] text-xl mb-4 flex items-center gap-2">
            <Lightbulb size={22} className="text-[#F0B429]" /> خطة العمل المقترحة
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${getPriorityColor(rec.priority)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm leading-snug">{rec.title}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 shrink-0 ms-2">
                    {rec.priority === "high" ? "قصوى" : rec.priority === "medium" ? "متوسطة" : "عادية"}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#1E1B4B] to-[#111827] rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#CC0000] rounded-full blur-[80px] opacity-30" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F0B429] rounded-full blur-[80px] opacity-15" />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">جاهز لرفع أداء نشاطك؟</h3>
            <p className="text-gray-400 text-sm mb-6">احجز استشارة مجانية لمناقشة هذه التوصيات مع خبرائنا</p>
            <a
              href="https://wa.me/971551981564"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1EBE57] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <FaWhatsapp size={18} />
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
