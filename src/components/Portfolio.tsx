import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowLeft, TrendingUp, Users, Globe } from "lucide-react";

const cases = [
  {
    client: "AKA UAE",
    sector: "تجارة إلكترونية",
    sectorColor: "#CC0000",
    image: "/portfolio-ecommerce.webp",
    results: [
      { icon: TrendingUp, label: "نمو المبيعات", value: "+320%" },
      { icon: Users, label: "عملاء جدد", value: "850+" },
    ],
    services: ["إعلانات ميتا", "إدارة محتوى", "تصوير منتجات"],
    desc: "إدارة حملات إعلانية متكاملة على فيسبوك وإنستغرام أدت إلى ثلاثة أضعاف المبيعات خلال 3 أشهر.",
  },
  {
    client: "عقار لاين",
    sector: "عقارات",
    sectorColor: "#F0B429",
    image: "/portfolio-realestate.webp",
    results: [
      { icon: TrendingUp, label: "عملاء محتملين", value: "1,200+" },
      { icon: Globe, label: "تكلفة العميل", value: "-45%" },
    ],
    services: ["حملات جوجل", "صفحات هبوط", "تتبع التحويلات"],
    desc: "بناء منظومة إعلانية متكاملة على جوجل وميتا مع صفحات هبوط محسّنة لتوليد عملاء عقاريين مؤهلين.",
  },
  {
    client: "UAE Fans",
    sector: "ترفيه ومجتمع",
    sectorColor: "#10B981",
    image: "/portfolio-social.webp",
    results: [
      { icon: Users, label: "متابعون جدد", value: "+15K" },
      { icon: TrendingUp, label: "نمو التفاعل", value: "+280%" },
    ],
    services: ["إدارة سوشيال ميديا", "تصميم محتوى", "ريلز"],
    desc: "إدارة كاملة للحسابات على إنستغرام وتيك توك مع محتوى إبداعي أدى إلى نمو كبير في الجمهور.",
  },
  {
    client: "مطعم البرج الذهبي",
    sector: "مطاعم",
    sectorColor: "#EC4899",
    image: "/portfolio-restaurant.webp",
    results: [
      { icon: TrendingUp, label: "حجوزات أونلاين", value: "+450%" },
      { icon: Users, label: "مراجعات جوجل", value: "+180" },
    ],
    services: ["موقع إلكتروني", "SEO محلي", "إعلانات جوجل"],
    desc: "موقع احترافي مع SEO محلي قوي وإعلانات جوجل أدت إلى ظهور في TOP 3 لأهم كلمات البحث.",
  },
  {
    client: "مركز بريق الطبي",
    sector: "طبي",
    sectorColor: "#06B6D4",
    image: "/portfolio-medical.webp",
    results: [
      { icon: TrendingUp, label: "حجوزات طبية", value: "+200%" },
      { icon: Users, label: "مرضى جدد", value: "300+" },
    ],
    services: ["تسويق طبي", "إعلانات ميتا", "محتوى صحي"],
    desc: "استراتيجية تسويق طبي شاملة تستهدف المرضى المحتملين في المنطقة مع محتوى يبني الثقة.",
  },
  {
    client: "معهد ليدرز للتدريب",
    sector: "تعليم",
    sectorColor: "#8B5CF6",
    image: "/portfolio-training.webp",
    results: [
      { icon: Users, label: "تسجيلات جديدة", value: "+380%" },
      { icon: TrendingUp, label: "تكلفة التسجيل", value: "-52%" },
    ],
    services: ["حملات Meta", "صفحات هبوط", "تسويق تعليمي"],
    desc: "حملات إعلانية مخصصة للمعاهد التعليمية أدت إلى ارتفاع كبير في التسجيلات مع تخفيض التكلفة.",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#CC0000]/8 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#F0B429]/30 bg-[#F0B429]/10 text-[#F0B429] text-sm font-bold mb-3">
            دراسات الحالة
          </span>
          <p className="text-[#CC0000] text-sm font-bold mb-4">قصص نجاح موثّقة مباشرة</p>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
            نتائج حقيقية لعملاء <span className="gradient-text">حقيقيين</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg">
            أرقام موثقة من حملات نفذناها لعملاء في مختلف القطاعات
          </p>
        </motion.div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group card-premium card-lift rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="h-44 relative overflow-hidden bg-white">
                <img
                  src={c.image}
                  alt={c.client}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070F]/80 to-transparent" />
                <span
                  className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ backgroundColor: `${c.sectorColor}25`, color: c.sectorColor, border: `1px solid ${c.sectorColor}40` }}
                >
                  {c.sector}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[#111827] font-black text-lg mb-2">{c.client}</h3>
                <p className="text-[#9CA3AF] text-sm mb-4 leading-relaxed flex-grow">{c.desc}</p>

                {/* Results */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {c.results.map((r, j) => (
                    <div key={j} className="bg-[#F3F4F6] rounded-xl p-3 text-center border border-[#E5E7EB]">
                      <div className="text-xl font-black text-[#CC0000]">{r.value}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">{r.label}</div>
                    </div>
                  ))}
                </div>

                {/* Services used */}
                <div className="flex flex-wrap gap-1.5">
                  {c.services.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-[#E5E7EB] text-[#9CA3AF]">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/971551981564"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-3 px-8 py-4 bg-[#CC0000] text-white rounded-xl font-bold text-base"
          >
            <FaWhatsapp size={20} />
            ابدأ قصة نجاحك معنا
          </a>
        </motion.div>
      </div>
    </section>
  );
}
