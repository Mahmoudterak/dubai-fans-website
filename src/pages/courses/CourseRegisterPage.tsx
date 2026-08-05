import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { courses } from "@/data/courses";

const API_ENDPOINT = "/api/course-register";

type PaymentMethod = "online" | "bank" | "paypal" | "western-union";

interface FormData {
  fullName: string;
  phone: string;
  jobTitle: string;
  email: string;
  city: string;
  paymentMethod: PaymentMethod | "";
  howDidYouHear: string;
  questions: string;
}

const INITIAL: FormData = {
  fullName: "", phone: "", jobTitle: "", email: "",
  city: "", paymentMethod: "", howDidYouHear: "", questions: "",
};

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "online",        label: "دفع أون لاين" },
  { value: "bank",          label: "تحويل بنكي" },
  { value: "paypal",        label: "تحويل باي بال" },
  { value: "western-union", label: "تحويل ويسترن يونيون" },
];

export default function CourseRegisterPage() {
  const params = useParams<{ slug: string }>();
  const course = courses.find(c => c.slug === params.slug);

  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-2xl font-black mb-4">الكورس غير موجود</h1>
        <Link href="/courses" className="text-[#CC0000] font-bold">← العودة للكورسات</Link>
      </div>
    </div>
  );

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await apiFetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: course.name, courseSlug: course.slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "فشل الإرسال");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مجدداً");
      setStatus("error");
    }
  };

  /* ── Thank You screen ── */
  if (status === "success") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto px-6 text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-[#E5E7EB]">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${course.color}15` }}>
                <CheckCircle size={40} style={{ color: course.color }} />
              </div>
              <h1 className="text-2xl font-black text-[#111827] mb-3">
                شكراً لتواصلك معنا 👋
              </h1>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                تم استلام بياناتك بنجاح، وسيتم التواصل معك في أقرب وقت.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-8">
                نقدّر اهتمامك بـ <span className="font-bold text-[#111827]">{course.name}</span>،
                ونتطلع للتواصل معك قريباً.
              </p>
              <div className="bg-[#F3F4F6] rounded-2xl p-4 mb-6 text-sm text-[#374151]">
                <p className="font-bold mb-1">📧 سيصلك تأكيد على بريدك الإلكتروني</p>
                <p className="text-[#6B7280]">أو تواصل معنا مباشرة على:</p>
                <p className="font-bold text-[#111827] mt-1">info@mtuaefans.sbs</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/971551981564" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:opacity-90 transition-all">
                  تواصل عبر واتساب
                </a>
                <Link href="/courses"
                  className="py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-bold hover:bg-[#F3F4F6] transition-all block">
                  استعراض باقي الكورسات
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 transition-all";
  const focusStyle = `focus:ring-[${course.color}]/30 focus:border-[${course.color}]`;

  return (
    <>
      <SEOHead
        title={`التسجيل في ${course.name} | أكاديمية دبي فانز`}
        description={`سجّل الآن في ${course.name} — ${course.description}`}
        canonical={`https://mtuaefans.com/courses/${course.slug}/register`}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16" dir="rtl">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#CC0000]">الرئيسية</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <Link href="/courses" className="hover:text-[#CC0000]">الكورسات</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <Link href={`/courses/${course.slug}`} className="hover:text-[#CC0000]">{course.name}</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <span className="text-[#374151] font-semibold">التسجيل</span>
          </nav>
        </div>

        <div className="container mx-auto px-6 max-w-2xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-black mb-4"
              style={{ backgroundColor: course.color }}>
              {course.category} · {course.duration}
            </div>
            <h1 className="text-3xl font-black text-[#111827] mb-2">Course Sign-up</h1>
            <p className="text-[#CC0000] font-bold text-lg mb-1">{course.name}</p>
            <p className="text-[#6B7280] text-sm">يرجى إكمال البيانات التالية</p>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  Full Name <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={set("fullName")}
                  className={`${inputCls} ${focusStyle}`}
                  style={{ ["--tw-ring-color" as string]: `${course.color}50` }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  Phone Number <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={set("phone")}
                  className={`${inputCls} ${focusStyle}`}
                  dir="ltr"
                />
              </div>

              {/* Job title */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  Job title <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Job title"
                  value={form.jobTitle}
                  onChange={set("jobTitle")}
                  className={`${inputCls} ${focusStyle}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  E-mail <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={form.email}
                  onChange={set("email")}
                  className={`${inputCls} ${focusStyle}`}
                  dir="ltr"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  Your City <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your City"
                  value={form.city}
                  onChange={set("city")}
                  className={`${inputCls} ${focusStyle}`}
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-3">
                  طريقة الدفع المفضلة
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${
                        form.paymentMethod === opt.value
                          ? "text-white"
                          : "border-[#E5E7EB] text-[#374151] bg-[#FAFAFA] hover:border-[#D1D5DB]"
                      }`}
                      style={form.paymentMethod === opt.value
                        ? { borderColor: course.color, backgroundColor: course.color }
                        : {}}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.value}
                        checked={form.paymentMethod === opt.value}
                        onChange={set("paymentMethod")}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        form.paymentMethod === opt.value ? "border-white" : "border-[#D1D5DB]"
                      }`}>
                        {form.paymentMethod === opt.value && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* How did you hear */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  كيف تعرفت علينا؟ <span className="text-[#CC0000]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="كيف تعرفت علينا؟"
                  value={form.howDidYouHear}
                  onChange={set("howDidYouHear")}
                  className={`${inputCls} ${focusStyle}`}
                />
              </div>

              {/* Questions */}
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">
                  أسئلة واستفسارات
                </label>
                <textarea
                  rows={4}
                  placeholder="اكتب أي أسئلة أو استفسارات لديك..."
                  value={form.questions}
                  onChange={set("questions")}
                  className={`${inputCls} ${focusStyle} resize-none`}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl text-white font-black text-base shadow-lg transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: course.color }}>
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> جارٍ الإرسال...</>
                ) : (
                  "تأكيد التسجيل والمتابعة"
                )}
              </button>

            </form>
          </motion.div>

          {/* Reassurance row */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-[#9CA3AF]">
            {["بياناتك محمية ومشفّرة", "سيتم التواصل خلال ٢٤ ساعة", "دعم مجاني على واتساب"].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[#059669]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
