import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Target, Eye, Award, Users, Briefcase, TrendingUp } from "lucide-react";

const stats = [
  { value: "1,200+", label: "عميل راضٍ", icon: Users, color: "#CC0000" },
  { value: "500+", label: "حملة مُدارة", icon: Briefcase, color: "#F0B429" },
  { value: "200+", label: "موقع مُنجز", icon: TrendingUp, color: "#10B981" },
  { value: "21+", label: "خبرة تقنية وتسويقية", icon: Award, color: "#EC4899" },
];

const methodology = [
  {
    step: "01",
    title: "تحليل وتشخيص",
    desc: "نبدأ بدراسة شاملة لنشاطك التجاري، جمهورك المستهدف، المنافسين، ونقاط القوة والضعف.",
    color: "#CC0000",
  },
  {
    step: "02",
    title: "بناء الاستراتيجية",
    desc: "نضع خطة تسويقية مخصصة تربط الإعلانات، المحتوى، SEO، والتتبع في منظومة واحدة.",
    color: "#F0B429",
  },
  {
    step: "03",
    title: "التنفيذ الاحترافي",
    desc: "ننفذ الحملات والمحتوى والتصاميم بمعايير عالية ومتابعة يومية للأداء.",
    color: "#10B981",
  },
  {
    step: "04",
    title: "قياس وتحسين مستمر",
    desc: "نراقب المؤشرات، نحسّن الأداء، ونقدم تقارير تنفيذية شفافة مع توصيات النمو.",
    color: "#06B6D4",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-[#F3F4F6] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F0B429]/5 rounded-full blur-[120px]" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#CC0000]/8 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
            عن دبي فانز
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
            رؤيتنا وقيمنا في <span className="gradient-text">بناء نمو رقمي حقيقي</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg leading-relaxed">
            في دبي فانز لا نرى التسويق مجرد منشورات أو إعلانات ممولة — بل منظومة نمو متكاملة تبدأ من الاستراتيجية وتنتهي بالمبيعات.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card card-lift rounded-2xl p-6 text-center hover:border-[#CC0000]/40 transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black text-[#111827] mb-1">{s.value}</div>
              <div className="text-xs text-[#9CA3AF] font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission + Methodology */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#CC0000]/15 flex items-center justify-center">
                <Target size={20} className="text-[#CC0000]" />
              </div>
              <h3 className="text-xl font-black text-[#111827]">مهمتنا</h3>
            </div>
            <p className="text-[#9CA3AF] leading-relaxed mb-4">
              نحن وكالة إبداعية رائدة تجمع بين أساليب بناء العلامات التجارية التقليدية والحلول الرقمية المبتكرة واستراتيجيات التواصل الاجتماعي الفعّالة.
            </p>
            <p className="text-[#9CA3AF] leading-relaxed mb-4">
              بخبرة تمتد لعشرين عاماً في المنطقة، نتخصص في صياغة حملات تواصل جذابة وفعّالة من حيث التكلفة وموجهة نحو تحقيق الأهداف، مما يعزز صورة عملائنا ويزيد مبيعاتهم.
            </p>
            <p className="text-[#9CA3AF] leading-relaxed">
              بصفتنا وكالة إعلانية متكاملة، نقدم حلولاً شاملة للتواصل المؤسسي والعلامات التجارية لمختلف القطاعات — يكرس فريقنا ذو الخبرة جهوده لابتكار حلول تسويقية مصممة خصيصاً لتناسب جمهوركم المستهدف.
            </p>

            <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-[#CC0000]/10 border border-[#CC0000]/20">
              <Eye size={20} className="text-[#CC0000] shrink-0" />
              <p className="text-sm text-[#111827] font-semibold">
                نحن نفكر في نمو عملك… وأنت تكسب.
              </p>
            </div>

            <a
              href="https://wa.me/971551981564"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#CC0000] text-white rounded-xl font-bold text-sm"
            >
              <FaWhatsapp size={16} />
              احجز استشارة مجانية
            </a>
          </motion.div>

          {/* Methodology steps */}
          <div className="space-y-4">
            {methodology.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card card-lift rounded-xl p-5 hover:border-[#CC0000]/30 transition-all duration-300 flex items-start gap-4"
              >
                <div
                  className="text-2xl font-black shrink-0 w-10 text-right"
                  style={{ color: m.color }}
                >
                  {m.step}
                </div>
                <div>
                  <h4 className="text-[#111827] font-bold mb-1">{m.title}</h4>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
