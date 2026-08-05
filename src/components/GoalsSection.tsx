import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Check } from "lucide-react";

const GOALS = [
  { label: "العلامة التجارية داخل المتجر",          emoji: "🏪" },
  { label: "مفاهيم إبداعية",                          emoji: "🎨" },
  { label: "تصاميم التغليف",                          emoji: "📦" },
  { label: "التصوير الفوتوغرافي والفيديو",            emoji: "📸" },
  { label: "إعلانات مطبوعة",                          emoji: "🗞️" },
  { label: "الإعلانات التلفزيونية والإذاعية",          emoji: "📺" },
  { label: "الإعلانات الخارجية",                      emoji: "🚀" },
  { label: "تصميم العلامة التجارية",                  emoji: "🏷️" },
  { label: "استراتيجية العلامة التجارية",             emoji: "🎯" },
  { label: "حملة تسويقية",                            emoji: "📢" },
  { label: "أبحاث السوق",                             emoji: "🔍" },
  { label: "إطلاق المنتج",                            emoji: "🚀" },
  { label: "إدارة الفعاليات",                         emoji: "🎪" },
  { label: "إدارة وسائل التواصل الاجتماعي",          emoji: "📱" },
  { label: "تحسين محركات البحث",                      emoji: "🔎" },
  { label: "تصميم وتطوير المواقع الإلكترونية",        emoji: "💻" },
  { label: "إنشاء المحتوى",                           emoji: "✍️" },
  { label: "إدارة المؤثرين",                          emoji: "⭐" },
  { label: "التسويق عبر البريد الإلكتروني",           emoji: "📧" },
  { label: "الإعلان بنظام الدفع لكل نقرة",           emoji: "🖱️" },
  { label: "الإعلانات المصورة عبر الإنترنت",          emoji: "🖼️" },
];

export function GoalsSection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (label: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const handleSend = () => {
    if (selected.size === 0) return;
    const list = [...selected].map((g) => `• ${g}`).join("\n");
    const msg = `مرحباً دبي فانز 👋\n\nأنا مهتم بالخدمات التالية:\n${list}\n\nأرجو التواصل معي لمناقشة التفاصيل.`;
    window.open(`https://wa.me/971551981564?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section id="goals" className="py-20 bg-white relative overflow-hidden">
      {/* subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#CC000008_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#CC0000]">
            ما هي الطموحات التي تسعى لتحقيقها اليوم؟
          </h2>
          <p className="text-[#9CA3AF] mt-3 text-base">
            اختر الخدمات التي تحتاجها وسنتواصل معك بخطة مخصصة
          </p>
        </motion.div>

        {/* Goals grid — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          {GOALS.map((goal, i) => {
            const active = selected.has(goal.label);
            return (
              <motion.button
                key={goal.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => toggle(goal.label)}
                className={`flex items-center justify-between gap-3 w-full px-5 py-4 rounded-full border-2 text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${active
                    ? "bg-[#CC0000] border-[#CC0000] text-white shadow-lg"
                    : "bg-white border-[#CC0000]/40 text-[#374151] hover:border-[#CC0000] hover:shadow-md"
                  }`}
              >
                {/* Right side: emoji + label */}
                <span className="flex items-center gap-2">
                  <span className="text-lg">{goal.emoji}</span>
                  <span className="text-right leading-tight">{goal.label}</span>
                </span>

                {/* Left side: checkmark */}
                <span
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${active ? "bg-white border-white" : "border-[#CC0000]/40"}`}
                >
                  {active && <Check size={11} className="text-[#CC0000]" strokeWidth={3} />}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          {selected.size > 0 && (
            <p className="text-[#6B7280] text-sm font-semibold">
              تم اختيار <span className="text-[#CC0000] font-black">{selected.size}</span> خدمة
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            disabled={selected.size === 0}
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white rounded-2xl font-black text-base hover:bg-[#1EBE57] transition-all duration-300 shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <FaWhatsapp size={22} />
            أرسل اختياراتك عبر واتساب
          </motion.button>
        </div>
      </div>
    </section>
  );
}
