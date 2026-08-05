import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, CheckCircle, ArrowLeft } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: "#0D1123" }}>
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-700/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#CC0000]/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <div
          className="rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(124,58,237,0.06) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Gradient border glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.08), transparent)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1px",
          }} />

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Mail size={26} className="text-purple-300" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-8" dir="rtl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-bold mb-4">
              <Sparkles size={11} />
              حصري للمشتركين
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              ابقَ متقدماً دائماً
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              أدوات الذكاء الاصطناعي الجديدة، نصائح التسويق، وعروض حصرية — مباشرةً إلى بريدك الإلكتروني
            </p>
          </div>

          {/* Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <CheckCircle size={40} className="text-green-400" />
              <p className="text-white font-bold text-lg">تم الاشتراك بنجاح! 🎉</p>
              <p className="text-slate-400 text-sm text-center">ستصلك أول رسالة قريباً. يمكنك إلغاء الاشتراك في أي وقت.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} dir="rtl" className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني…"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/6 border border-white/12 text-white placeholder-slate-500 text-sm outline-none focus:border-purple-500/60 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shrink-0 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowLeft size={14} className="rotate-180" />
                    اشترك مجاناً
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-slate-600 text-xs text-center mt-4">
            بدون سبام. نرسل نشرة واحدة أسبوعياً فقط.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
