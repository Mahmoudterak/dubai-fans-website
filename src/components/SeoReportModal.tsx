import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Loader2, CheckCircle, AlertTriangle, XCircle,
  Globe, ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Types ─────────────────────────────────────────────────────────── */
interface AuditCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
  impact: "high" | "medium" | "low";
}
interface AuditResult {
  score: number;
  checks: AuditCheck[];
  quickWins: string[];
}

/* ── Helpers ────────────────────────────────────────────────────────── */
const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "Lebanon",
  "Other",
];

const PHONE_CODES: Record<string, string> = {
  "United Arab Emirates": "+971",
  "Saudi Arabia": "+966",
  "Kuwait": "+965",
  "Qatar": "+974",
  "Bahrain": "+973",
  "Oman": "+968",
  "Egypt": "+20",
  "Jordan": "+962",
  "Lebanon": "+961",
  "Other": "+",
};

function scoreColor(score: number) {
  if (score >= 75) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function StatusIcon({ status }: { status: AuditCheck["status"] }) {
  if (status === "pass")    return <CheckCircle  className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />;
  return                           <XCircle       className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />;
}

/* ── Modal ──────────────────────────────────────────────────────────── */
interface SeoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "loading" | "result";

export function SeoReportModal({ isOpen, onClose }: SeoReportModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<AuditResult | null>(null);

  const [form, setForm] = useState({
    websiteUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    country: "United Arab Emirates",
    phoneLocal: "",
  });

  const phoneCode = PHONE_CODES[form.country] ?? "+971";
  const fullPhone = `${phoneCode}${form.phoneLocal}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setStep("form");
    setResult(null);
    setForm({
      websiteUrl: "", firstName: "", lastName: "",
      email: "", country: "United Arab Emirates", phoneLocal: "",
    });
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.websiteUrl || !form.firstName || !form.lastName || !form.email || !form.phoneLocal) {
      toast({ description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    setStep("loading");
    try {
      // Determine base URL (works in dev & production)
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await apiFetch(`${base}/api/seo-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: form.websiteUrl,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: fullPhone,
          country: form.country,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "حدث خطأ");
      }

      const audit = await res.json() as AuditResult;
      setResult(audit);
      setStep("result");
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مجدداً",
        variant: "destructive",
      });
      setStep("form");
    }
  };

  /* Circle arc for score */
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = result ? circ - (result.score / 100) * circ : circ;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#1E1B4B] to-[#111827] rounded-t-3xl p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#CC0000]/30 rounded-full blur-[60px]" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#CC0000]/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-[#F0B429]" />
                      </div>
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">مجانيّ 100%</span>
                    </div>
                    <h2 className="text-xl font-black leading-snug">
                      أفضل أداة لتدقيق وتقارير<br />
                      <span className="text-[#F0B429]">تحسين محركات البحث</span>
                    </h2>
                    <p className="text-white/60 text-sm mt-1">احصل على تقرير SEO مفصّل لموقعك مجاناً</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="shrink-0 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* ── FORM ────────────────────────────────────────── */}
                {step === "form" && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Website URL */}
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-1.5">
                        عنوان URL لموقع الويب <span className="text-[#CC0000]">*</span>
                      </label>
                      <input
                        name="websiteUrl"
                        type="url"
                        dir="ltr"
                        required
                        placeholder="https://example.com"
                        value={form.websiteUrl}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all"
                      />
                    </div>

                    {/* First + Last name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-1.5">
                          الاسم الأول <span className="text-[#CC0000]">*</span>
                        </label>
                        <input
                          name="firstName"
                          required
                          placeholder="محمد"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-1.5">
                          اسم العائلة <span className="text-[#CC0000]">*</span>
                        </label>
                        <input
                          name="lastName"
                          required
                          placeholder="الأحمد"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-1.5">
                        بريد إلكتروني <span className="text-[#CC0000]">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        dir="ltr"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-1.5">الدولة</label>
                      <div className="relative">
                        <select
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all cursor-pointer pr-10"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-[#374151] mb-1.5">
                        رقم الهاتف <span className="text-[#CC0000]">*</span>
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <div className="shrink-0 flex items-center px-4 rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] text-sm font-bold text-[#374151] min-w-[72px] justify-center">
                          {phoneCode}
                        </div>
                        <input
                          name="phoneLocal"
                          type="tel"
                          required
                          placeholder="55 123 4567"
                          value={form.phoneLocal}
                          onChange={handleChange}
                          className="flex-1 rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#CC0000] to-[#B00000] text-white font-black text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                    >
                      <Globe className="w-5 h-5" />
                      احصل على تقرير SEO المجاني
                    </button>

                    <p className="text-center text-xs text-[#9CA3AF]">
                      بإرسال النموذج توافق على تلقّي تقريرك عبر البريد الإلكتروني
                    </p>
                  </form>
                )}

                {/* ── LOADING ─────────────────────────────────────── */}
                {step === "loading" && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-[#E5E7EB] rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#CC0000] rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-[#CC0000]" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-[#111827] mb-2">
                      جاري تدقيق موقعك…
                    </h3>
                    <p className="text-[#9CA3AF] text-sm">
                      نقوم بفحص أكثر من 7 معايير SEO — قد يستغرق ذلك دقيقة
                    </p>
                  </div>
                )}

                {/* ── RESULT ──────────────────────────────────────── */}
                {step === "result" && result && (
                  <div className="space-y-6">
                    {/* Score circle */}
                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                          <motion.circle
                            cx="60" cy="60" r={radius} fill="none"
                            stroke={scoreColor(result.score)} strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circ}
                            initial={{ strokeDashoffset: circ }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-[#111827]">{result.score}</span>
                          <span className="text-xs text-[#9CA3AF] font-bold">/100</span>
                        </div>
                      </div>
                      <p className="font-bold mt-2" style={{ color: scoreColor(result.score) }}>
                        {result.score >= 75 ? "حالة ممتازة 🎉" : result.score >= 50 ? "يحتاج تحسين ⚠️" : "حالة حرجة ❌"}
                      </p>
                    </div>

                    {/* Quick wins */}
                    {result.quickWins.length > 0 && (
                      <div className="bg-[#CC0000] rounded-2xl p-5 text-white">
                        <h3 className="font-black text-base mb-3 flex items-center gap-2">
                          <span className="text-[#F0B429]">✦</span> إجراءات سريعة
                        </h3>
                        <ul className="space-y-2">
                          {result.quickWins.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-medium">
                              <CheckCircle className="w-4 h-4 text-[#F0B429] shrink-0 mt-0.5" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Checks */}
                    <div className="space-y-2">
                      <h3 className="font-black text-[#111827] mb-2">تفاصيل الفحص</h3>
                      {result.checks.map((check, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
                          <StatusIcon status={check.status} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="font-bold text-sm text-[#111827]">{check.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                                check.impact === "high" ? "bg-red-100 text-red-700" :
                                check.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {check.impact === "high" ? "تأثير عالٍ" : check.impact === "medium" ? "متوسط" : "منخفض"}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B7280]">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="bg-[#F3F4F6] rounded-2xl p-5 text-center border border-[#E5E7EB]">
                      <p className="font-black text-[#111827] mb-1">جاهز لتحسين ترتيبك في جوجل؟</p>
                      <p className="text-[#6B7280] text-sm mb-4">تواصل مع خبرائنا لمناقشة التقرير وخطة التحسين</p>
                      <a
                        href="https://wa.me/971551981564"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1EBE57] transition-all shadow-md"
                      >
                        تواصل معنا الآن
                      </a>
                    </div>

                    <button
                      onClick={reset}
                      className="w-full py-3 rounded-xl border-2 border-[#E5E7EB] text-[#6B7280] font-bold text-sm hover:border-[#CC0000]/40 hover:text-[#CC0000] transition-colors"
                    >
                      فحص موقع آخر
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
