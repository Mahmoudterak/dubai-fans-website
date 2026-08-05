import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Globe, Award } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: 500,  suffix: "+", label: "مشروع منجز",        color: "#CC0000",  desc: "موقع، متجر، وحملة إعلانية" },
  { icon: Users,      value: 1200, suffix: "+", label: "عميل راضٍ",         color: "#D97706",  desc: "في الإمارات والخليج العربي" },
  { icon: Globe,      value: 12,   suffix: "",  label: "دولة نخدمها",        color: "#7C3AED",  desc: "حضور عربي وعالمي متنامٍ" },
  { icon: Award,      value: 98,   suffix: "%", label: "نسبة رضا العملاء",   color: "#10B981",  desc: "معدّل تجديد العقود سنوياً" },
];

function Counter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setCount(Math.round((value / steps) * current));
      if (current >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-black tabular-nums" style={{ color }}>
      {count.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="py-20 px-4 bg-[#F3F4F6] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#CC0000]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
          dir="rtl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/8 text-[#CC0000] text-sm font-bold mb-4">
            أرقام حقيقية
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111827]">
            نتائج موثّقة تتحدث عن نفسها
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" dir="rtl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-md border border-[#E5E7EB] flex flex-col items-center text-center gap-3 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <Counter value={s.value} suffix={s.suffix} color={s.color} />
              <p className="text-[#111827] font-bold text-base leading-tight">{s.label}</p>
              <p className="text-[#9CA3AF] text-xs leading-snug">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
