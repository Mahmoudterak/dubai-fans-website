import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";

const skills = [
  { label: "استراتيجية النمو والتسويق", pct: 88, color: "#CC0000" },
  { label: "إدارة الحملات وتحسين الأداء", pct: 92, color: "#CC0000" },
  { label: "الإنتاج المرئي وإنشاء المحتوى", pct: 86, color: "#F0B429" },
  { label: "تطوير المواقع وصفحات الهبوط", pct: 88, color: "#CC0000" },
  { label: "لوحة تحكم العميل والتقارير", pct: 85, color: "#CC0000" },
  { label: "أنظمة متابعة العملاء المحتملين", pct: 74, color: "#F0B429" },
];

function Bar({ label, pct, color, index }: { label: string; pct: number; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[#374151]">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="py-24 bg-[#F3F4F6] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#CC0000]/8 rounded-full blur-[100px]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
              منهجيتنا في البناء
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-6 leading-tight">
              نحن لا نبيع منشورات أو إعلانات منفصلة —{" "}
              <span className="gradient-text">بل نبني منظومة تسويق وتشغيل رقمية</span>
            </h2>
            <p className="text-[#9CA3AF] text-base leading-relaxed mb-8">
              تبدأ من الاستراتيجية، تمر بالإنتاج والتتبع ولوحة التحكم، وتنتهي بنتائج قابلة للقياس والتحسين. كل مبدأ في هذه المنهجية صُمم ليحول التسويق من مصروف تشغيلي إلى أصل تجاري حقيقي.
            </p>
            <a
              href="https://wa.me/971551981564"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#CC0000] text-white rounded-xl font-bold hover:bg-[#AA0000] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300"
            >
              <FaWhatsapp size={18} />
              احجز استشارة مجانية
            </a>
          </motion.div>

          {/* Progress bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {skills.map((s, i) => (
              <Bar key={i} {...s} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
