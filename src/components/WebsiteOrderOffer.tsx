import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Clock, BadgeCheck, X, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

/**
 * عرض "أنشئ موقعك بالذكاء الاصطناعي" — 499 درهم، التسليم خلال ساعة.
 * Promo section + order modal used on /website-templates.
 */

const BUSINESS_TYPES = [
  "مطعم أو كافيه", "عيادة أو مركز صحي", "شركة عقارات", "مكتب محاماة",
  "صالون أو مركز تجميل", "متجر ملابس", "متجر إلكتروني عام", "شركة مقاولات",
  "خدمات لوجستية", "تعليم وتدريب", "أخرى",
];

type Status = "idle" | "loading" | "done" | "error";

export function WebsiteOrderOffer() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "", businessType: "", email: "", phone: "",
    siteType: "website", details: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
    setStatus("loading");
    setError("");
    try {
      const res = await apiFetch("/api/website-orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "خطأ غير معروف");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ — يرجى المحاولة مجدداً");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/40 focus:border-[#CC0000]";

  return (
    <>
      {/* ── Promo section ── */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FFF7ED]" id="ai-website-offer">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}
            className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#06060F] border border-white/10 shadow-2xl"
          >
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#CC0000]/25 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D97706]/25 rounded-full blur-[100px]" />
            <div className="relative z-10 p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D97706] to-[#F59E0B] text-white text-xs font-black px-4 py-1.5 rounded-full mb-5 shadow-lg">
                <Zap size={14} />
                عرض لفترة محدودة
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                أنشئ موقع شركتك بالذكاء الاصطناعي
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6">
                عبر أدواتنا الخاصة بالذكاء الاصطناعي، نبني لك موقعاً إلكترونياً احترافياً كاملاً —
                <span className="text-white font-bold"> واستلمه خلال ساعة واحدة فقط</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8" dir="rtl">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 min-w-[200px]">
                  <p className="text-white/60 text-sm font-bold mb-1">موقع تعريفي</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl md:text-5xl font-black bg-gradient-to-l from-[#F59E0B] to-[#FF4444] bg-clip-text text-transparent">499</span>
                    <span className="text-white/80 font-bold">درهم</span>
                  </div>
                  <p className="text-white/35 text-sm line-through mt-1">1,500 درهم</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 min-w-[200px]">
                  <p className="text-white/60 text-sm font-bold mb-1">متجر إلكتروني</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl md:text-5xl font-black bg-gradient-to-l from-[#F59E0B] to-[#FF4444] bg-clip-text text-transparent">699</span>
                    <span className="text-white/80 font-bold">درهم</span>
                  </div>
                  <p className="text-white/35 text-sm line-through mt-1">2,500 درهم</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60 mb-8">
                <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-[#F59E0B]" /> التسليم خلال ساعة</span>
                <span className="inline-flex items-center gap-1.5"><Sparkles size={15} className="text-[#F59E0B]" /> تصميم بالذكاء الاصطناعي</span>
                <span className="inline-flex items-center gap-1.5"><BadgeCheck size={15} className="text-[#F59E0B]" /> جاهز للنشر على نطاقك</span>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black px-10 py-4 rounded-2xl hover:shadow-[0_0_40px_rgba(204,0,0,0.6)] hover:scale-105 transition-all duration-300"
              >
                اطلب موقعك الآن
                <ArrowLeft size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Order modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setOpen(false)}
            role="dialog" aria-modal="true" aria-label="طلب إنشاء موقع بالذكاء الاصطناعي"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>

              <div className="p-8">
                {status === "done" ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-2xl font-black text-[#111827] mb-2">تم استلام طلبك ✅</h3>
                    <p className="text-[#6B7280] leading-relaxed">
                      فريقنا بدأ العمل على موقعك بأدوات الذكاء الاصطناعي.
                      سنتواصل معك خلال دقائق على بريدك أو هاتفك لتأكيد التفاصيل — واستلم موقعك خلال ساعة.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-[#111827] mb-1">اطلب موقعك الآن</h3>
                      <p className="text-sm text-[#6B7280]">
                        موقع تعريفي 499 درهم — متجر إلكتروني 699 درهم. التسليم خلال ساعة، عبّئ التفاصيل ونبدأ فوراً.
                      </p>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                      <input required className={inputCls} placeholder="اسم الشركة أو النشاط التجاري *"
                        value={form.businessName} maxLength={100}
                        onChange={(e) => set("businessName", e.target.value)} />
                      <select required className={inputCls} value={form.businessType}
                        onChange={(e) => set("businessType", e.target.value)}>
                        <option value="" disabled>نوع النشاط التجاري *</option>
                        {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => set("siteType", "website")}
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${form.siteType === "website" ? "border-[#CC0000] bg-[#CC0000]/5 text-[#CC0000]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#CC0000]/40"}`}>
                          موقع تعريفي — 499 درهم
                        </button>
                        <button type="button" onClick={() => set("siteType", "store")}
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${form.siteType === "store" ? "border-[#CC0000] bg-[#CC0000]/5 text-[#CC0000]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#CC0000]/40"}`}>
                          متجر إلكتروني — 699 درهم
                        </button>
                      </div>
                      <input required type="email" className={inputCls} placeholder="البريد الإلكتروني *"
                        value={form.email} maxLength={200} dir="ltr"
                        onChange={(e) => set("email", e.target.value)} />
                      <input required type="tel" className={inputCls} placeholder="رقم الهاتف (واتساب) *"
                        value={form.phone} maxLength={30} dir="ltr"
                        onChange={(e) => set("phone", e.target.value)} />
                      <textarea className={inputCls + " min-h-[110px] resize-y"} maxLength={3000}
                        placeholder="صف موقعك: الصفحات المطلوبة، الألوان المفضلة، الخدمات أو المنتجات، أي مواقع تعجبك…"
                        value={form.details}
                        onChange={(e) => set("details", e.target.value)} />
                      {status === "error" && (
                        <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                      )}
                      <button type="submit" disabled={status === "loading"}
                        className="w-full bg-gradient-to-l from-[#CC0000] to-[#FF4444] text-white font-black py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-60">
                        {status === "loading" ? "جارٍ الإرسال…" : `أرسل الطلب — ${form.siteType === "store" ? "699" : "499"} درهم`}
                      </button>
                      <p className="text-xs text-[#9CA3AF] text-center">
                        لا يوجد دفع الآن — سنتواصل معك لتأكيد الطلب وطريقة الدفع قبل البدء.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
