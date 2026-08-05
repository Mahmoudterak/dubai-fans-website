import { useState, useEffect } from "react";
import { RecaptchaWidget } from "@/components/RecaptchaWidget";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/analyze");
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaGlobe, FaInstagram, FaFacebook, FaTiktok, FaSnapchatGhost, FaGoogle, FaCheck, FaTimes, FaWhatsapp } from "react-icons/fa";
import { useAnalyzeBusiness } from "@workspace/api-client-react";
import { setRecaptchaToken } from "@workspace/api-client-react";
import type { AnalyzeInputPlatformType } from "@workspace/api-client-react";
import { Loader2, ArrowRight, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { executeRecaptchaEnterprise } from "@/lib/recaptcha-enterprise";
import { RateLimitCountdown, useRateLimitCountdown } from "@/components/RateLimitCountdown";

type Step = 'select' | 'input' | 'analyzing' | 'results';

const platforms = [
  { id: 'website', name: 'موقع إلكتروني', icon: FaGlobe, color: 'text-blue-500', hoverBorder: 'hover:border-blue-500' },
  { id: 'instagram', name: 'إنستغرام', icon: FaInstagram, color: 'text-pink-600', hoverBorder: 'hover:border-pink-600' },
  { id: 'facebook', name: 'فيسبوك', icon: FaFacebook, color: 'text-blue-600', hoverBorder: 'hover:border-blue-600' },
  { id: 'tiktok', name: 'تيك توك', icon: FaTiktok, color: 'text-black dark:text-gray-800', hoverBorder: 'hover:border-gray-800' },
  { id: 'snapchat', name: 'سناب شات', icon: FaSnapchatGhost, color: 'text-yellow-500', hoverBorder: 'hover:border-yellow-500' },
  { id: 'google', name: 'جوجل للأعمال', icon: FaGoogle, color: 'text-red-500', hoverBorder: 'hover:border-red-500' },
] as const;

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>('select');
  const [platform, setPlatform] = useState<AnalyzeInputPlatformType | null>(null);
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("جاري فحص المنصة...");
  const [humanVerified, setHumanVerified] = useState(false);

  const analyzeMutation = useAnalyzeBusiness();
  const rateLimit = useRateLimitCountdown();

  useEffect(() => {
    if (step === 'analyzing') {
      const timer1 = setTimeout(() => setLoadingText("تحليل نقاط القوة والضعف..."), 2000);
      const timer2 = setTimeout(() => setLoadingText("إعداد التوصيات..."), 4000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
    setLoadingText("جاري فحص المنصة...");
    return undefined;
  }, [step]);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !url || submitting || !humanVerified || rateLimit.isRateLimited) return;
    setSubmitting(true);
    // Execute reCAPTCHA Enterprise invisibly before the API call
    const token = await executeRecaptchaEnterprise("ANALYZE");
    setRecaptchaToken(token);
    setStep('analyzing');

    analyzeMutation.mutate(
      { data: { url, platformType: platform, businessName } },
      {
        onSuccess: () => {
          setRecaptchaToken(null);
          setSubmitting(false);
          setTimeout(() => { setStep('results'); }, 1000);
        },
        onError: (error) => {
          setRecaptchaToken(null);
          setSubmitting(false);
          if (!rateLimit.handleError(error)) {
            alert("حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.");
          }
          setStep('input');
        }
      }
    );
  };

  const getPlaceholder = (p: AnalyzeInputPlatformType) => {
    switch (p) {
      case 'website': return 'https://www.example.com';
      case 'instagram': return 'https://instagram.com/username';
      case 'facebook': return 'https://facebook.com/page';
      case 'tiktok': return 'https://tiktok.com/@username';
      case 'snapchat': return 'username';
      case 'google': return 'رابط نشاطك على خرائط جوجل';
      default: return 'الرابط';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/20 text-red-400 border-red-900/50';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50';
      case 'low': return 'bg-green-900/20 text-green-400 border-green-900/50';
      default: return 'bg-white text-[#9CA3AF] border-[#E5E7EB]';
    }
  };

  const renderStep = () => {
    if (step === 'select') {
      return (
        <motion.div
          key="select"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4">
              ما الذي تريد <span className="text-[#CC0000]">تحليله؟</span>
            </h2>
            <p className="text-lg text-[#9CA3AF]">
              اختر المنصة التي ترغب في تقييم أدائها وتلقي توصيات مخصصة لتحسينها.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlatform(p.id as AnalyzeInputPlatformType);
                  setStep('input');
                }}
                className={`flex flex-col items-center justify-center gap-4 p-8 glass-card rounded-2xl border-2 border-[#E5E7EB] transition-all duration-300 ${p.hoverBorder} hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group`}
              >
                <p.icon className={`text-5xl ${p.color} transition-transform duration-300 group-hover:scale-110`} />
                <span className="font-bold text-white text-lg">{p.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (step === 'input') {
      const selectedPlatform = platforms.find(p => p.id === platform);
      
      return (
        <motion.div
          key="input"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto"
        >
          <button 
            onClick={() => setStep('select')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#CC0000] font-semibold mb-8 transition-colors"
          >
            <ArrowRight size={20} />
            تغيير المنصة
          </button>
          
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              {selectedPlatform && <selectedPlatform.icon className={`text-4xl ${selectedPlatform.color}`} />}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  تحليل {selectedPlatform?.name}
                </h2>
                <p className="text-[#9CA3AF] mt-1">أدخل تفاصيل حسابك لنبدأ الفحص الشامل</p>
              </div>
            </div>

            <form onSubmit={handleStartAnalysis} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  الرابط (مطلوب)
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={getPlaceholder(platform!)}
                  className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 outline-none transition-all text-left text-gray-800"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  اسم النشاط التجاري (اختياري)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="مثال: مطعم الفريج"
                  className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 outline-none transition-all"
                />
              </div>

              <RecaptchaWidget
                onVerified={() => setHumanVerified(true)}
                onExpired={() => setHumanVerified(false)}
              />

              <RateLimitCountdown secondsLeft={rateLimit.secondsLeft} />

              <button
                type="submit"
                disabled={submitting || !humanVerified || rateLimit.isRateLimited}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#CC0000] to-[#B00000] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 size={20} className="animate-spin" /> جاري التحقق...</> : "ابدأ التحليل الآن"}
              </button>
            </form>
          </div>
        </motion.div>
      );
    }

    if (step === 'analyzing') {
      return (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="max-w-md mx-auto text-center py-20"
        >
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 border-4 border-[#E5E7EB] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#CC0000] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#CC0000]">
              <Loader2 className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          <motion.h3 
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {loadingText}
          </motion.h3>
          <p className="text-[#9CA3AF] mt-3">
            يعمل الذكاء الاصطناعي لدينا على تقييم البيانات...
          </p>
        </motion.div>
      );
    }

    if (step === 'results' && analyzeMutation.data) {
      const { score, summary, strengths, weaknesses, recommendations } = analyzeMutation.data;
      
      const scoreColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
      const radius = 60;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (score / 100) * circumference;

      return (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header Card */}
          <div className="glass-card rounded-2xl p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center gap-10">
            <div className="relative shrink-0">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{score}</span>
                <span className="text-sm font-semibold text-[#9CA3AF]">/ 100</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-black text-[#111827] mb-4">نتيجة التحليل</h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                {summary}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Strengths */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-[#111827] mb-6">
                <TrendingUp className="text-green-500" />
                نقاط القوة
              </h3>
              <ul className="space-y-4">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[#9CA3AF]">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 mt-0.5">
                      <FaCheck size={12} />
                    </div>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-[#111827] mb-6">
                <AlertTriangle className="text-red-500" />
                نقاط تحتاج للتحسين
              </h3>
              <ul className="space-y-4">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-3 text-[#9CA3AF]">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center text-red-400 mt-0.5">
                      <FaTimes size={12} />
                    </div>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-[#111827] mb-8 flex items-center gap-3">
              <Lightbulb className="text-[#F0B429]" size={28} />
              خطة العمل المقترحة
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg">{rec.title}</h4>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                      {rec.priority === 'high' ? 'أولوية قصوى' : rec.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية عادية'}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#1E1B4B] rounded-[2rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000] rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F0B429] rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-[#111827] mb-4">
                جاهز لرفع أداء نشاطك التجاري؟
              </h3>
              <p className="text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
                احجز استشارة مجانية مع خبرائنا لمناقشة هذه التوصيات وكيف يمكننا مساعدتك في تحقيقها.
              </p>
              <a
                href="https://wa.me/971551981564"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-[#111827] font-bold text-lg hover:bg-[#1EBE57] shadow-[0_8px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                <FaWhatsapp size={24} />
                تواصل معنا عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/analyze"
        keywords="تحليل موقع مجاني, فحص سيو بالذكاء الاصطناعي, تحليل انستغرام, تحليل فيسبوك, تقرير SEO مجاني"
      />
      <Navbar />
      <main className="flex-grow pt-28 pb-20 px-6">

        {/* Banner — visible only on the select step */}
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-sm mx-auto mb-12 rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB]"
          >
            <img
              src="/audit-banner.webp"
              alt="خدمة مجانية تحليل أدائك - دبي فانز"
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
