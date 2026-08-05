import { motion } from "framer-motion";
import { Link } from "wouter";
import { Sparkles, Calendar } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      className="relative py-28 px-4 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #06030F 0%, #130828 50%, #06030F 100%)" }}
    >
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-700/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#CC0000]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400/40"
          style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <div className="max-w-3xl mx-auto relative z-10 text-center" dir="rtl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-bold mb-8">
            <Sparkles size={13} />
            استشارتك الأولى مجانية
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6"
        >
          مستعد لبناء
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #A78BFA, #818CF8, #C084FC)" }}
          >
            مشروعك الرقمي القادم؟
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          من تصميم المواقع والمتاجر إلى أنظمة ERP والذكاء الاصطناعي — نبني معك منظومة رقمية كاملة تنمو معك.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/971551981564?text=أريد البدء في مشروع جديد"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
            }}
          >
            <Sparkles size={18} />
            ابدأ مشروعك الآن
          </a>

          <Link
            href="/book-demo"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base border border-white/15 transition-all duration-300 hover:bg-white/8 hover:-translate-y-1 hover:border-white/30"
          >
            <Calendar size={18} className="text-purple-300" />
            احجز استشارة مجانية
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-6 flex-wrap"
        >
          {["1200+ عميل", "500+ مشروع", "3+ سنوات خبرة", "نتائج مضمونة"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-slate-500 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
