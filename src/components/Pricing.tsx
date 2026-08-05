import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Check, Zap, Star, Crown } from "lucide-react";

type Period = "monthly" | "quarterly" | "yearly";

const plans = [
  {
    icon: Zap,
    name: "خطة الانطلاق",
    subtitle: "Launch Plan",
    color: "#10B981",
    popular: false,
    prices: { monthly: 1050, quarterly: 2800, yearly: 9800 },
    desc: "مثالية للمشاريع الجديدة والمستقلين والمتاجر الصغيرة",
    features: [
      "تصميم شعار احترافي",
      "تصميم الهوية البصرية الأساسية",
      "إنشاء وإدارة حساب فيسبوك وإنستغرام",
      "12 منشوراً احترافياً شهرياً",
      "كتابة المحتوى التسويقي",
      "إعداد Meta Pixel",
      "إعداد Google Business Profile",
      "ربط WhatsApp Business",
      "إدارة الحملات الإعلانية الأساسية",
      "تقرير شهري للأداء",
    ],
    forWhom: ["المشاريع الجديدة", "المستقلون", "المتاجر الصغيرة"],
  },
  {
    icon: Star,
    name: "خطة النمو",
    subtitle: "Growth Plan",
    color: "#CC0000",
    popular: true,
    prices: { monthly: 2100, quarterly: 5600, yearly: 19600 },
    desc: "للشركات التي تريد توسعاً حقيقياً وزيادة مبيعات",
    features: [
      "إدارة 3 منصات (فيسبوك، إنستغرام، يوتيوب)",
      "20 بوست + 4 ريلز + 4 قصة شهرياً",
      "12 مقالاً لموقعك وخرائط جوجل",
      "ربط واتساب + Facebook Pixel + Google Tag",
      "إدارة الحملات على Meta وGoogle",
      "جلسة تصوير واحدة كل شهرين",
      "باقة SEO Growth Plus",
      "استشارات أسبوعية من جوجل وميتا",
      "دعم تقني مرتين أسبوعياً",
      "لوحة تحكم متابعة خاصة",
      "تقارير أداء تنفيذية شهرية",
    ],
    forWhom: ["الشركات النامية", "المطاعم", "العيادات", "العقارات"],
  },
  {
    icon: Crown,
    name: "خطة السيطرة",
    subtitle: "Domination Plan",
    color: "#F0B429",
    popular: false,
    prices: { monthly: 4200, quarterly: 11000, yearly: 39000 },
    desc: "للشركات التي تريد الصدارة الكاملة في السوق الرقمي",
    features: [
      "إدارة كاملة لجميع المنصات",
      "تصميم موقع إلكتروني احترافي + SEO",
      "منشورات + ريلز + قصص يومياً",
      "حملات إعلانية على Meta وGoogle وTikTok",
      "جلسة تصوير شهرية كاملة",
      "استراتيجية محتوى مخصصة",
      "SEO شامل وتحسين مستمر",
      "تقارير تحليلية متعمقة أسبوعياً",
      "استشارة تسويقية أسبوعية",
      "دعم VIP على مدار الساعة",
      "لوحة تحكم تنفيذية متكاملة",
      "مدير حساب مخصص",
    ],
    forWhom: ["الشركات الكبيرة", "سلاسل المطاعم", "المجمعات الطبية", "التطوير العقاري"],
  },
];

const periodLabels: Record<Period, string> = {
  monthly: "شهري",
  quarterly: "3 أشهر",
  yearly: "سنوي",
};

const periodSavings: Record<Period, string | null> = {
  monthly: null,
  quarterly: "وفّر 10%",
  yearly: "وفّر 22%",
};

export function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section id="pricing" className="py-24 bg-[#F3F4F6] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#CC0000]/8 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
            باقات مصممة للنمو
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
            لا تختر الأرخص…<br />
            <span className="gradient-text">اختر الباقة التي تقرّبك من هدفك</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg">
            باقات تسويق مرنة تبدأ من تأسيس الحضور الرقمي وتصل إلى منظومات متقدمة
          </p>
        </motion.div>

        {/* Period toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-1 p-1 rounded-xl border border-[#E5E7EB] bg-white">
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  period === p
                    ? "bg-[#CC0000] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {periodLabels[p]}
                {periodSavings[p] && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-[#10B981] text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                    {periodSavings[p]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border flex flex-col ${
                plan.popular
                  ? "border-[#CC0000]/50 bg-gradient-to-b from-[#1a0000] to-[#0d0d1a] shadow-[0_0_60px_rgba(204,0,0,0.25)] md:scale-105"
                  : "border-[#E5E7EB] bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#CC0000] rounded-full text-white text-xs font-black">
                  ⭐ الأكثر طلباً
                </div>
              )}

              <div className={`p-7 border-b ${plan.popular ? "border-white/10" : "border-[#E5E7EB]"}`}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${plan.color}15`, border: `1px solid ${plan.color}30` }}
                >
                  <plan.icon size={22} style={{ color: plan.color }} />
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.popular ? "text-white/50" : "text-[#9CA3AF]"}`}>{plan.subtitle}</div>
                <h3 className={`text-xl font-black mb-1 ${plan.popular ? "text-white" : "text-[#111827]"}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.popular ? "text-white/60" : "text-[#9CA3AF]"}`}>{plan.desc}</p>

                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-[#111827]"}`}>
                    {plan.prices[period].toLocaleString()}
                  </span>
                  <span className="text-[#9CA3AF] text-sm mb-1.5">درهم / {periodLabels[period]}</span>
                </div>
              </div>

              <div className="p-7 flex flex-col flex-grow">
                <ul className="space-y-2.5 mb-7 flex-grow">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-white/80" : "text-[#374151]"}`}>
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {plan.forWhom.map((w) => (
                    <span key={w} className={`text-xs px-2 py-0.5 rounded-full ${plan.popular ? "bg-white/10 text-white/70" : "bg-[#E5E7EB] text-[#9CA3AF]"}`}>
                      {w}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://wa.me/971551981564?text=أريد الاشتراك في ${plan.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#CC0000] text-white hover:bg-[#AA0000] hover:shadow-[0_0_30px_rgba(204,0,0,0.4)]"
                      : "border-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
                  }`}
                >
                  <FaWhatsapp size={16} />
                  اشترك الآن
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom plan CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center glass-card rounded-2xl p-8 border border-[#CC0000]/20"
        >
          <h3 className="text-xl font-black text-[#111827] mb-2">تحتاج باقة مخصصة؟</h3>
          <p className="text-[#9CA3AF] mb-5 text-sm">
            تحدث معنا لنساعدك على تحديد الباقة المناسبة حسب ميزانيتك وأهدافك التسويقية
          </p>
          <a
            href="https://wa.me/971551981564?text=أحتاج استشارة لاختيار الباقة المناسبة"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#F0B429] text-[#07070F] rounded-xl font-black hover:bg-[#E0A020] transition-colors"
          >
            <FaWhatsapp size={18} />
            احجز استشارة مجانية
          </a>
        </motion.div>
      </div>
    </section>
  );
}
