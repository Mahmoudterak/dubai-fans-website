import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Trophy, Users, TrendingUp, Clock, ShieldCheck, Star,
  HeartHandshake, BadgeCheck, ArrowLeft,
} from "lucide-react";

const STATS = [
  { value: "+1,200", label: "عميل راضٍ", icon: Users, color: "#CC0000" },
  { value: "+500",   label: "حملة ناجحة",  icon: TrendingUp, color: "#D97706" },
  { value: "3+",     label: "سنوات خبرة",  icon: Trophy, color: "#10B981" },
  { value: "97%",    label: "نسبة الرضا",  icon: Star, color: "#3B82F6" },
];

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    color: "#CC0000",
    title: "فريق معتمد من Google & Meta",
    desc: "فريقنا يحمل شهادات احترافية معتمدة من أكبر منصات الإعلانات في العالم — نضمن أعلى كفاءة لكل درهم تُنفقه.",
  },
  {
    icon: ShieldCheck,
    color: "#10B981",
    title: "شفافية كاملة في التقارير",
    desc: "تقارير أسبوعية وشهرية مفصّلة تُظهر كل رقم بوضوح — لا إخفاء، لا مصطلحات معقّدة، فقط نتائج حقيقية قابلة للقياس.",
  },
  {
    icon: HeartHandshake,
    color: "#D97706",
    title: "مدير حساب خاص بك",
    desc: "لست مجرد رقم عندنا. كل عميل لديه مدير حساب مخصص يتابع مشروعك يومياً ويرد على واتساب خلال 60 دقيقة.",
  },
  {
    icon: Clock,
    color: "#3B82F6",
    title: "دعم 7 أيام في الأسبوع",
    desc: "السبت إلى الخميس 9 ص–11 م، والجمعة 2 م–10 م. فريقنا متاح عبر واتساب لأي طارئ أو استفسار عاجل.",
  },
  {
    icon: TrendingUp,
    color: "#CC0000",
    title: "استراتيجية مبنية على البيانات",
    desc: "نحن لا نخمّن — نحلّل. كل قرار إعلاني يُبنى على بيانات السوق الإماراتي، سلوك جمهورك، ومقارنة بمنافسيك.",
  },
  {
    icon: Trophy,
    color: "#D97706",
    title: "خبرة حصرية في السوق الإماراتي",
    desc: "نعرف السوق الإماراتي كالراحة — المواسم، المنافسون، أوقات الذروة، واللغات المناسبة لكل جمهور في الإمارات.",
  },
];

const COMPARISON = [
  { feature: "مدير حساب مخصص",         us: true,  generic: false, inhouse: true  },
  { feature: "تقارير شفافة أسبوعياً",   us: true,  generic: false, inhouse: true  },
  { feature: "خبرة السوق الإماراتي",    us: true,  generic: false, inhouse: false },
  { feature: "شهادات Google & Meta",    us: true,  generic: false, inhouse: false },
  { feature: "دعم واتساب 7 أيام",       us: true,  generic: false, inhouse: true  },
  { feature: "سعر مناسب للشركات الصغيرة", us: true, generic: true, inhouse: false },
  { feature: "نتائج قابلة للقياس",       us: true, generic: false, inhouse: false },
];

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-[#10B981] font-black text-base">✓</span>
    : <span className="text-[#E5E7EB] font-black text-base">✕</span>;
}

export function WhyUs() {
  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            لماذا دبي فانز؟
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 leading-tight">
            ليس مجرد وكالة —<br />
            <span className="text-[#CC0000]">شريك نمو حقيقي</span>
          </h2>
          <p className="text-[#6B7280] text-lg leading-relaxed">
            نتائج موثّقة، فريق معتمد، وخبرة حصرية بالسوق الإماراتي تجعلنا الخيار الأمثل لأصحاب الأعمال
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 text-center hover:border-[#CC0000]/25 hover:shadow-md transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black text-[#111827] mb-1">{s.value}</div>
              <div className="text-[#6B7280] text-sm font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Advantages grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ADVANTAGES.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#CC0000]/25 hover:shadow-lg transition-all duration-300 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${adv.color}15` }}
              >
                <adv.icon size={22} style={{ color: adv.color }} />
              </div>
              <h3 className="text-base font-black text-[#111827] mb-2">{adv.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{adv.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl overflow-hidden mb-12"
        >
          <div className="p-6 border-b border-[#E5E7EB]">
            <h3 className="text-xl font-black text-[#111827] text-center">
              دبي فانز مقابل البدائل الأخرى
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-right p-4 text-sm font-bold text-[#6B7280] w-1/2">الميزة</th>
                  <th className="p-4 text-center text-sm font-black text-[#CC0000]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs bg-[#CC0000] text-white px-2 py-0.5 rounded-full">موصى به</span>
                      دبي فانز
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-bold text-[#9CA3AF]">وكالة عادية</th>
                  <th className="p-4 text-center text-sm font-bold text-[#9CA3AF]">موظف داخلي</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-[#E5E7EB] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                  >
                    <td className="p-4 text-sm font-semibold text-[#374151] text-right">{row.feature}</td>
                    <td className="p-4 text-center bg-[#CC0000]/5"><Check ok={row.us} /></td>
                    <td className="p-4 text-center"><Check ok={row.generic} /></td>
                    <td className="p-4 text-center"><Check ok={row.inhouse} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[#6B7280] text-base mb-5">جاهز لمعرفة الفرق بنفسك؟</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/971551981564?text=أريد استشارة مجانية"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#CC0000] text-white font-black px-7 py-3.5 rounded-xl hover:bg-[#AA0000] transition-all shadow-lg shadow-[#CC0000]/25 text-sm"
            >
              ابدأ استشارتك المجانية
            </a>
            <Link href="/projects">
              <button className="flex items-center gap-2 border-2 border-[#E5E7EB] text-[#374151] hover:border-[#CC0000]/40 font-bold px-7 py-3.5 rounded-xl transition-all text-sm">
                شاهد أعمالنا
                <ArrowLeft size={15} />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
