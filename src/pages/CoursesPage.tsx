import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, BarChart2, Award, Zap, Users, BookOpen, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { TrustBar } from "@/components/TrustBar";
import { courses } from "@/data/courses";

const BASE = "https://mtuaefans.com";

const stats = [
  { value: "+٥٠٠", label: "طالب" },
  { value: "+٣٠",  label: "مشروع حقيقي" },
  { value: "٣",    label: "برامج متخصصة" },
  { value: "١٠٠٪", label: "تعلم تطبيقي" },
];

const features = [
  "تدريب تطبيقي ١٠٠٪",
  "مشاريع أعمال حقيقية",
  "سير عمل بالذكاء الاصطناعي",
  "شهادة احترافية",
  "مجتمع خاص للطلاب",
  "دعم ٦ أشهر بعد الانتهاء",
];

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export default function CoursesPage() {
  return (
    <>
      <SEOHead
        title="كورسات التسويق الرقمي | دبي فانز — تدريب احترافي بالذكاء الاصطناعي"
        description="أتقن التسويق الرقمي وميديا باينج والتجارة الإلكترونية بالذكاء الاصطناعي. ٣ برامج احترافية مع شهادات ومشاريع حقيقية ودعم ٦ أشهر. سجّل الآن."
        keywords="كورس تسويق رقمي دبي, تدريب ميديا باينج الإمارات, كورس تجارة إلكترونية دبي, دبلوم تسويق رقمي بالذكاء الاصطناعي"
        canonical={`${BASE}/courses`}
        jsonLd={[
          /* ── BreadcrumbList ────────────────────────────────── */
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": BASE },
              { "@type": "ListItem", "position": 2, "name": "الكورسات", "item": `${BASE}/courses` },
            ],
          },
          /* ── ItemList — one Course per list item ───────────── */
          {
            "@type": "ItemList",
            "name": "كورسات أكاديمية دبي فانز للتسويق الرقمي",
            "description": "٣ برامج تدريبية احترافية في التسويق الرقمي وميديا باينج والتجارة الإلكترونية — دبي، الإمارات",
            "url": `${BASE}/courses`,
            "itemListElement": courses.map((c, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": {
                "@type": "Course",
                "name": c.name,
                "description": c.description,
                "url": `${BASE}/courses/${c.slug}`,
                "provider": {
                  "@type": "Organization",
                  "name": "دبي فانز — أكاديمية التسويق الرقمي",
                  "url": BASE,
                  "sameAs": "https://mtuaefans.com",
                },
                "educationalLevel": c.level,
                "inLanguage": "ar",
                "offers": {
                  "@type": "Offer",
                  "price": c.price,
                  "priceCurrency": "AED",
                  "availability": "https://schema.org/InStock",
                  "url": `${BASE}/courses/${c.slug}/register`,
                },
              },
            })),
          },
        ]}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA]" dir="rtl">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F0A2A] via-[#1E1B4B] to-[#CC0000]/70 pt-32 pb-20">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#CC0000]/20 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative text-center">
            <motion.div variants={fade()} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
                <Zap size={12} className="text-[#F0B429]" />
                أكاديمية دبي فانز للتسويق الرقمي
              </span>
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-5">
                أتقن التسويق الرقمي &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0B429] to-[#CC0000]">
                  نمو الأعمال بالذكاء الاصطناعي
                </span>
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                برامج تدريبية تطبيقية مصممة لمساعدة رواد الأعمال والمستقلين والمسوّقين وأصحاب الأعمال
                على إتقان التسويق الرقمي وميديا باينج والتجارة الإلكترونية باستخدام الذكاء الاصطناعي ومشاريع حقيقية.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#courses"
                  className="px-7 py-3.5 rounded-xl bg-[#CC0000] text-white font-bold hover:bg-[#AA0000] transition-all shadow-lg shadow-[#CC0000]/30 flex items-center gap-2">
                  <BookOpen size={18} /> استعرض الكورسات
                </a>
                <a href="https://wa.me/971551981564" target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2">
                  <Users size={18} /> تواصل مع مستشار
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fade(0.3)} initial="hidden" animate="show"
              className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-white/60 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Course Cards ── */}
        <section id="courses" className="container mx-auto px-6 py-20">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-bold uppercase tracking-widest mb-3">
              البرامج المميزة
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#111827]">اختر برنامجك</h2>
            <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
              ثلاثة مسارات احترافية — كل واحد مصمم لمسار مهني محدد في التسويق الرقمي.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-7">
            {courses.map((c, i) => (
              <motion.div key={c.slug}
                variants={fade(i * 0.12)} initial="hidden" whileInView="show" viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

                <div className={`h-2 bg-gradient-to-l ${c.gradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black text-white"
                      style={{ backgroundColor: c.color }}>{c.category}</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-[#F0B429]/20 text-[#92400E]">
                      ذكاء اصطناعي
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-[#059669]/15 text-[#065F46]">
                      شهادة
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#111827] mb-1">{c.name}</h3>
                  <p className="text-xs font-bold mb-3" style={{ color: c.color }}>{c.subtitle}</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-5">{c.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-5">
                    <span className="flex items-center gap-1"><Clock size={12} />{c.duration}</span>
                    <span className="flex items-center gap-1"><BarChart2 size={12} />{c.level}</span>
                    <span className="flex items-center gap-1"><Award size={12} />شهادة</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#F0B429" className="text-[#F0B429]" />)}
                    <span className="text-xs text-[#9CA3AF] mr-1">٥.٠ (دفعة جديدة)</span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-5 p-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CC0000] to-[#1E1B4B] flex items-center justify-center text-white text-[10px] font-black">م</div>
                    <div>
                      <p className="text-xs font-bold text-[#111827]">محمود طارق</p>
                      <p className="text-[10px] text-[#9CA3AF]">المؤسس والرئيس التنفيذي</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/courses/${c.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 shadow-md"
                      style={{ backgroundColor: c.color }}>
                      سجّل الآن
                    </Link>
                    <Link href={`/courses/${c.slug}`}
                      className="px-4 py-2.5 rounded-xl border-2 border-[#E5E7EB] text-[#374151] font-bold text-sm hover:border-[#CC0000]/30 hover:text-[#CC0000] transition-all flex items-center gap-1">
                      <ArrowLeft size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── لماذا الأكاديمية ── */}
        <section className="bg-[#111827] py-16">
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <h2 className="text-3xl font-black text-white mb-2">لماذا أكاديمية دبي فانز؟</h2>
              <p className="text-white/60 mb-10">كل ما تحتاجه للنجاح في التسويق الرقمي</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {features.map((f, i) => (
                  <motion.div key={i} variants={fade(i * 0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium">
                    <CheckCircle size={15} className="text-[#F0B429] shrink-0" />
                    {f}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-[#1E1B4B] to-[#CC0000]/80 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-black mb-3">ابدأ بناء مستقبلك الرقمي اليوم</h2>
            <p className="text-white/70 mb-8">انضم إلى أكاديمية دبي فانز وأتقن المهارات التي تحتاجها الشركات الحديثة.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#courses" className="px-8 py-3.5 rounded-xl bg-white text-[#CC0000] font-black hover:opacity-90 transition-all shadow-lg">
                سجّل الآن
              </a>
              <a href="https://wa.me/971551981564" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                تواصل مع مستشار
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <TrustBar showPayments={false} />
      <Footer />
    </>
  );
}
