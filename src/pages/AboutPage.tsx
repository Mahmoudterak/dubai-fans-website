import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/about");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaLinkedin } from "react-icons/fa";
import { Target, Eye, Heart, Users, TrendingUp, Globe, Award, CheckCircle } from "lucide-react";

const stats = [
  { value: "1,200+", label: "عميل راضٍ", icon: Users },
  { value: "500+", label: "حملة منفذة", icon: TrendingUp },
  { value: "200+", label: "موقع إلكتروني", icon: Globe },
  { value: "3+", label: "سنوات خبرة", icon: Award },
];

const values = [
  { icon: Target,   title: "النتائج أولاً",   desc: "كل قرار نتخذه مبني على بيانات حقيقية وأهداف قابلة للقياس. لا وعود فارغة." },
  { icon: Heart,    title: "الشفافية الكاملة",  desc: "تقارير واضحة ودقيقة كل شهر. تعرف بالضبط أين يذهب كل درهم من ميزانيتك." },
  { icon: Eye,      title: "الإبداع المحلي",    desc: "نفهم السوق الإماراتي والعربي من الداخل — ثقافةً، لغةً، وسلوك المستهلك." },
  { icon: CheckCircle, title: "الالتزام بالمواعيد", desc: "نسلم في الوقت المحدد دائماً. احترام وقتك جزء من احترافيتنا." },
];

const team = [
  { name: "محمود طارق", role: "المؤسس والمدير التنفيذي", specialty: "استراتيجية التسويق الرقمي، الإرشاد النفسي", initials: "م" },
  { name: "فريق الإبداع", role: "قسم التصميم والمحتوى", specialty: "الهوية البصرية، تصميم المنشورات، الريلز", initials: "إ" },
  { name: "فريق الإعلانات", role: "قسم الحملات المدفوعة", specialty: "Meta Ads، Google Ads، TikTok Ads", initials: "ح" },
  { name: "فريق التطوير", role: "قسم المواقع والتقنية", specialty: "تطوير المواقع، SEO، تحليل البيانات", initials: "ت" },
];

const milestones = [
  { year: "2021", title: "التأسيس", desc: "بدأت رحلة دبي فانز بفريق صغير وحلم كبير في دبي" },
  { year: "2022", title: "أول 100 عميل", desc: "تجاوزنا 100 عميل راضٍ في مختلف القطاعات" },
  { year: "2023", title: "شراكات معتمدة", desc: "أصبحنا شركاء معتمدين لـ Meta وGoogle" },
  { year: "2024", title: "التوسع الرقمي", desc: "إطلاق منصات AMLAK OS وسيرفر دبي فانز" },
  { year: "2025", title: "1200+ عميل", desc: "تجاوزنا 1200 عميل ونمو 300% في الإيرادات" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/about"
        keywords="من نحن دبي فانز, وكالة تسويق رقمي الإمارات, فريق دبي فانز, خبرة تسويق رقمي دبي"
        ogImage={PAGE_META.ogImage}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#F3F4F6] to-[#FAFAFA] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000]/5 rounded-full blur-[140px]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-5">
              من نحن
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#111827] mb-6 leading-tight">
              وكالة تسويق رقمي<br />
              <span className="text-[#CC0000]">مبنية للنتائج</span>
            </h1>
            <p className="text-[#6B7280] text-xl leading-relaxed mb-4">
              مرحباً بكم في وكالة دبي فانز للتسويق الرقمي — حيث يلتقي الإبداع بالنجاح!
            </p>
            <p className="text-[#6B7280] text-base leading-relaxed mb-8">
              نحن وكالة إبداعية رائدة تجمع بين أساليب بناء العلامات التجارية التقليدية والحلول الرقمية المبتكرة واستراتيجيات التواصل الاجتماعي الفعّالة. بخبرة تمتد لعشرين عاماً في المنطقة، نتخصص في صياغة حملات تواصل جذابة وفعّالة من حيث التكلفة وموجهة نحو تحقيق الأهداف، مما يعزز صورة عملائنا ويزيد مبيعاتهم.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/971551981564"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#CC0000] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#AA0000] transition-colors"
              >
                <FaWhatsapp size={18} />
                تواصل معنا
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 border-2 border-[#111827] text-[#111827] font-bold px-6 py-3 rounded-xl hover:bg-[#111827] hover:text-white transition-colors"
              >
                خدماتنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-[#111827]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className="w-12 h-12 bg-[#CC0000]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-[#CC0000]" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-[#9CA3AF] text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#F0B429]/10 text-[#F0B429] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              قصتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4">رحلة من الطموح إلى الإنجاز</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-[#E5E7EB] md:right-1/2 md:-translate-x-0.5" />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
                  variants={fadeUp}
                  className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`flex-1 pb-2 pr-12 md:pr-0 ${i % 2 === 0 ? "md:pl-10 md:text-right" : "md:pr-10 md:text-left"}`}>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#CC0000]/30 transition-colors">
                      <span className="text-[#CC0000] font-black text-sm">{m.year}</span>
                      <h3 className="text-[#111827] font-bold text-lg mt-1 mb-2">{m.title}</h3>
                      <p className="text-[#6B7280] text-sm">{m.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute right-4 top-5 w-4 h-4 rounded-full bg-[#CC0000] border-4 border-white shadow-md md:right-1/2 md:-translate-x-1/2" />

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[#F3F4F6]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              قيمنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">ما يميزنا عن البقية</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#CC0000]/30 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 bg-[#CC0000]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[#CC0000]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              الفريق
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">أهل الخبرة والشغف</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map(({ name, role, specialty, initials }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 text-center hover:shadow-md hover:border-[#CC0000]/20 transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#CC0000] to-[#880000] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white shadow-lg">
                  {initials}
                </div>
                <h3 className="font-bold text-[#111827] mb-1">{name}</h3>
                <p className="text-[#CC0000] text-xs font-semibold mb-2">{role}</p>
                <p className="text-[#9CA3AF] text-xs">{specialty}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Social + CTA ── */}
      <section className="py-16 bg-[#111827]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">تابعنا على مواقع التواصل</h2>
            <div className="flex justify-center gap-4 mb-8">
              {[
                { icon: FaInstagram, href: "https://www.instagram.com/mtuaefans", label: "انستقرام" },
                { icon: FaFacebook,  href: "https://www.facebook.com/mtuaefans",  label: "فيسبوك" },
                { icon: FaTiktok,    href: "https://www.tiktok.com/@mtuaefans",   label: "تيك توك" },
                { icon: FaWhatsapp,  href: "https://wa.me/971551981564",           label: "واتساب" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/mahmoudterak-mt-050a97427/", label: "لينكدإن" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 hover:bg-[#CC0000] rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  title={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-white/60 mb-6">هل أنت جاهز للنمو الحقيقي؟</p>
            <a
              href="https://wa.me/971551981564?text=أريد الاستفسار عن خدمات دبي فانز"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              <FaWhatsapp size={18} />
              ابدأ رحلتك معنا اليوم
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
