import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Calendar, Clock, User, Mail, Phone, Building2, Layers, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const BASE = "https://mtuaefans.com";

const projectTypes = [
  "موقع إلكتروني", "متجر إلكتروني", "تطبيق جوال", "Clinic OS",
  "AMLAK OS", "AI Business OS", "حملات إعلانية", "SEO & تسويق",
  "هوية بصرية", "استشارة تسويقية", "أخرى",
];

const timeSlots = ["9:00 ص", "10:00 ص", "11:00 ص", "12:00 م", "2:00 م", "3:00 م", "4:00 م", "5:00 م", "7:00 م", "8:00 م", "9:00 م"];

const inputCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-white border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#CC0000]/50 focus:ring-2 focus:ring-[#CC0000]/10";

export default function BookDemoPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    projectType: "", date: "", time: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name = "الاسم مطلوب";
    if (!form.email.includes("@")) e.email = "بريد إلكتروني غير صحيح";
    if (!form.phone.trim())       e.phone = "رقم الهاتف مطلوب";
    if (!form.projectType)        e.projectType = "اختر نوع المشروع";
    if (!form.date)               e.date = "اختر تاريخاً";
    if (!form.time)               e.time = "اختر وقتاً";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // WhatsApp fallback send
    const msg = `📅 *طلب حجز استشارة*\n\n👤 الاسم: ${form.name}\n📧 البريد: ${form.email}\n📞 الهاتف: ${form.phone}\n🏢 الشركة: ${form.company || "—"}\n🎯 المشروع: ${form.projectType}\n📅 التاريخ: ${form.date}\n⏰ الوقت: ${form.time}`;
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
    // Open WhatsApp after short delay so user sees success screen
    setTimeout(() => {
      window.open(`https://wa.me/971551981564?text=${encodeURIComponent(msg)}`, "_blank");
    }, 1800);
  }

  return (
    <>
      <SEOHead
        title="احجز استشارة مجانية | دبي فانز"
        description="احجز استشارة مجانية مع خبراء دبي فانز للتسويق الرقمي — مواقع، تطبيقات، Clinic OS، AMLAK OS، AI Business OS، وحملات إعلانية."
        canonical={`${BASE}/book-demo`}
        ogImage={`${BASE}/hero-marketing.webp`}
      />
      <Navbar />

      <main
        className="min-h-screen pt-28 pb-20 px-4"
        style={{ background: "linear-gradient(180deg, #F3F4F6 0%, #FAFAFA 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
            dir="rtl"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#CC0000]/10 border border-[#CC0000]/25 text-[#CC0000] text-sm font-bold mb-5">
              <Sparkles size={13} />
              مجاني وبدون التزام
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-3">
              احجز استشارتك المجانية
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed">
              أخبرنا عن مشروعك وسيتواصل معك أحد متخصصينا في الموعد المحدد.
            </p>
          </motion.div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-10 text-center"
                dir="rtl"
              >
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-[#111827] mb-3">تم الحجز بنجاح! 🎉</h2>
                <p className="text-[#6B7280] leading-relaxed mb-6">
                  شكراً <strong className="text-[#111827]">{form.name}</strong>! تلقّينا طلبك وسيتواصل معك فريقنا عبر واتساب للتأكيد.
                </p>
                <div className="bg-[#F3F4F6] rounded-2xl p-5 text-sm text-[#374151] space-y-2 text-right mb-8">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">التاريخ:</span><strong>{form.date}</strong></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">الوقت:</span><strong>{form.time}</strong></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">المشروع:</span><strong>{form.projectType}</strong></div>
                </div>
                <a
                  href="https://wa.me/971551981564"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition-colors"
                >
                  <FaWhatsapp size={18} />
                  تابع عبر واتساب
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                dir="rtl"
                className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-7 sm:p-10 space-y-6"
              >
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <User size={14} className="text-[#CC0000]" /> الاسم الكامل <span className="text-[#CC0000]">*</span>
                    </label>
                    <input type="text" placeholder="محمد الأحمد" value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} />
                    {errors.name && <p className="text-[#CC0000] text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <Mail size={14} className="text-[#CC0000]" /> البريد الإلكتروني <span className="text-[#CC0000]">*</span>
                    </label>
                    <input type="email" placeholder="name@company.com" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} />
                    {errors.email && <p className="text-[#CC0000] text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone + Company */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <Phone size={14} className="text-[#CC0000]" /> رقم الهاتف / واتساب <span className="text-[#CC0000]">*</span>
                    </label>
                    <input type="tel" placeholder="+971 55 198 1564" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} />
                    {errors.phone && <p className="text-[#CC0000] text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <Building2 size={14} className="text-[#D97706]" /> اسم الشركة / المشروع
                    </label>
                    <input type="text" placeholder="شركتك أو مشروعك" value={form.company} onChange={e => set("company", e.target.value)} className={inputCls} />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-3">
                    <Layers size={14} className="text-[#7C3AED]" /> نوع المشروع <span className="text-[#CC0000]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("projectType", t)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                          form.projectType === t
                            ? "bg-[#CC0000] text-white border-[#CC0000]"
                            : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#CC0000]/40 hover:text-[#CC0000]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.projectType && <p className="text-[#CC0000] text-xs mt-1">{errors.projectType}</p>}
                </div>

                {/* Date + Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <Calendar size={14} className="text-[#CC0000]" /> التاريخ المفضّل <span className="text-[#CC0000]">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => set("date", e.target.value)}
                      className={inputCls}
                    />
                    {errors.date && <p className="text-[#CC0000] text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#374151] mb-2">
                      <Clock size={14} className="text-[#CC0000]" /> الوقت المفضّل <span className="text-[#CC0000]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => set("time", t)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                            form.time === t
                              ? "bg-[#CC0000] text-white border-[#CC0000]"
                              : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#CC0000]/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.time && <p className="text-[#CC0000] text-xs mt-1">{errors.time}</p>}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #CC0000, #B91C1C)" }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar size={18} />
                      احجز موعد الاستشارة
                      <ArrowLeft size={16} className="rotate-180" />
                    </>
                  )}
                </button>

                <p className="text-center text-[#9CA3AF] text-xs">
                  بعد الإرسال ستُحوَّل إلى واتساب لتأكيد الموعد مباشرةً مع فريقنا.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
