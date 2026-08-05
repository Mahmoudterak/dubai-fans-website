import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, MousePointerClick, MessageSquare,
  Trophy, CheckCircle, ChevronLeft, ArrowLeft,
} from "lucide-react";

const BASE = "https://mtuaefans.com";

const results = [
  { icon: Users,            value: "+60%", label: "زيادة في الزوار الفريدين خلال 3 أشهر",   color: "#10B981" },
  { icon: TrendingUp,       value: "-50%", label: "انخفاض في معدل الارتداد",                  color: "#3B82F6" },
  { icon: MousePointerClick,value: "+40%", label: "زيادة في إجمالي حركة المرور",              color: "#F59E0B" },
  { icon: MessageSquare,    value: "+80%", label: "زيادة في الاستفسارات خلال أول 3 أشهر",    color: "#CC0000" },
  { icon: Trophy,           value: "#1",   label: "الصفحة الأولى على جوجل للكلمات المفتاحية", color: "#8B5CF6" },
];

const challenges = [
  "ترتيب منخفض للكلمات المفتاحية ذات النية العالية لزراعة الأسنان",
  "معدل ارتداد مرتفع أدى إلى ضعف في تفاعل المستخدمين",
  "انخفاض حاد في حجم الاستفسارات الإلكترونية",
  "جودة منخفضة للموقع وميزانية تسويق غير مُحسَّنة",
  "حركة مرور عضوية ضعيفة جداً",
  "عدد محدود من المتابعين والتفاعل على فيسبوك",
];

const solutions = [
  {
    title: "تصميم موقع جديد سريع الاستجابة",
    desc: "موقع عصري متوافق مع الجوّال بواجهة مستخدم نظيفة، ودعوة واضحة لاتخاذ إجراء، وإبراز نقاط القوة التنافسية (USP) لتميّزهم عن المنافسين.",
    color: "#CC0000",
  },
  {
    title: "استراتيجية تسويق رقمي شاملة",
    desc: "خطة متكاملة لتحقيق الأهداف، مع دمج أدوات تحليلية لتتبع نتائج الموقع وتحسين الحملات في الوقت المناسب للوصول إلى الجمهور المستهدف.",
    color: "#3B82F6",
  },
  {
    title: "حملة إعلانية على شبكة البحث (Call Ads)",
    desc: "إطلاق حملة Call Ads على شبكة البحث لاستقطاب العملاء المحتملين مباشرةً عبر المكالمات، مع تحسين مستمر لعروض الأسعار والإعلانات.",
    color: "#10B981",
  },
  {
    title: "حملة فيسبوك لزيادة قاعدة المعجبين",
    desc: "حملة مدفوعة على فيسبوك لزيادة المتابعين وجذب حركة مرور عالية الجودة إلى الموقع، مع استهداف دقيق للجمهور المناسب.",
    color: "#F59E0B",
  },
  {
    title: "صفحات ويب محسَّنة لمحركات البحث (SEO)",
    desc: "تطوير صفحات هبوط ملائمة لكبار المسئولين الاقتصاديين (SEO) تستهدف الكلمات المفتاحية عالية الحركة، مما أدى إلى تحسن ملحوظ في الترتيب والزيارات العضوية.",
    color: "#8B5CF6",
  },
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function SameDayDentalPage() {
  return (
    <>
      <SEOHead
        title="دراسة حالة: زراعة الأسنان في نفس اليوم دبي | دبي فانز"
        description="كيف حققنا زيادة 80% في الاستفسارات لأول عيادة زراعة أسنان في نفس اليوم بالشرق الأوسط — تصميم موقع، SEO، وإعلانات رقمية."
        keywords="زراعة الأسنان في نفس اليوم دبي, دراسة حالة تسويق رقمي, SEO عيادة أسنان دبي"
        canonical={`${BASE}/projects/sameday-dental`}
        ogImage={`${BASE}/sameday-dental.jpg`}
        ogType="article"
        jsonLd={[
          /* ── Article (Case Study) ─────────────────────────────── */
          {
            "@type": "Article",
            "headline": "دراسة حالة: كيف حققنا زيادة 80% في استفسارات SameDay Dental",
            "description": "كيف حققنا زيادة 80% في الاستفسارات لأول عيادة زراعة أسنان في نفس اليوم بالشرق الأوسط — تصميم موقع، SEO، وإعلانات رقمية.",
            "image": `${BASE}/sameday-dental.jpg`,
            "url": `${BASE}/projects/sameday-dental`,
            "datePublished": "2023-06-01",
            "dateModified": "2024-01-01",
            "inLanguage": "ar",
            "author": {
              "@type": "Organization",
              "name": "دبي فانز",
              "url": BASE,
            },
            "publisher": {
              "@type": "Organization",
              "name": "دبي فانز",
              "url": BASE,
              "logo": { "@type": "ImageObject", "url": `${BASE}/logo.png` },
            },
            "about": {
              "@type": "Organization",
              "name": "SameDay Dental",
              "description": "أول عيادة زراعة أسنان في نفس اليوم في الشرق الأوسط — دبي، الإمارات",
              "areaServed": "AE",
              "address": { "@type": "PostalAddress", "addressCountry": "AE", "addressLocality": "دبي" },
            },
            "keywords": "زراعة أسنان دبي, SEO, Google Ads, تسويق رقمي",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/projects/sameday-dental` },
          },
          /* ── BreadcrumbList ──────────────────────────────────── */
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية",  "item": BASE },
              { "@type": "ListItem", "position": 2, "name": "أعمالنا",   "item": `${BASE}/projects` },
              { "@type": "ListItem", "position": 3, "name": "SameDay Dental", "item": `${BASE}/projects/sameday-dental` },
            ],
          },
          /* ── FAQPage — key results as Q&A ───────────────────── */
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "كم زادت الاستفسارات لعيادة SameDay Dental بعد التسويق الرقمي؟",
                "acceptedAnswer": { "@type": "Answer", "text": "حققنا زيادة +80% في الاستفسارات الإلكترونية خلال أول 3 أشهر فقط من تطبيق الاستراتيجية الرقمية." },
              },
              {
                "@type": "Question",
                "name": "ما الخدمات التسويقية المقدمة لعيادة SameDay Dental؟",
                "acceptedAnswer": { "@type": "Answer", "text": "تصميم موقع جديد متجاوب، تحسين محركات البحث (SEO)، حملة Google Ads على شبكة البحث (Call Ads)، وحملة فيسبوك لزيادة المتابعين." },
              },
              {
                "@type": "Question",
                "name": "كم كانت نسبة انخفاض معدل الارتداد؟",
                "acceptedAnswer": { "@type": "Answer", "text": "انخفض معدل الارتداد بنسبة 50% وزادت حركة المرور الكلية بنسبة 40% مع الوصول إلى الصفحة الأولى على Google للكلمات المفتاحية الرئيسية." },
              },
            ],
          },
        ]}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20" dir="rtl">

        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-8">
          <nav className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#CC0000] transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} />
            <Link href="/projects" className="hover:text-[#CC0000] transition-colors">أعمالنا</Link>
            <ChevronLeft size={14} />
            <span className="text-[#374151] font-semibold">زراعة الأسنان في نفس اليوم</span>
          </nav>
        </div>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="container mx-auto px-6 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fade} initial="hidden" animate="show"
              transition={{ duration: 0.6 }}
            >
              {/* Client logo */}
              <div className="flex items-center gap-4 mb-5">
                <img loading="eager" decoding="async"
                  src="/sameday-dental-logo.jpg"
                  alt="SameDay Dental Implants Logo"
                  className="h-16 w-auto rounded-xl border border-[#E5E7EB] shadow-sm bg-white p-1 object-contain"
                />
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-bold">
                  <Trophy size={13} />
                  دراسة حالة — تصميم مواقع دبي
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-[#111827] leading-tight mb-4">
                زراعة الأسنان<br />
                <span className="text-[#CC0000]">في نفس اليوم</span>
              </h1>

              <p className="text-lg text-[#6B7280] font-medium mb-6 leading-relaxed">
                أول عيادة في الشرق الأوسط تقدم زراعة الأسنان وتركيبها في نفس اليوم — 
                نُخدم الأشخاص ذوي الحياة المزدحمة الذين يرغبون في حل سريع وفعّال.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["تصميم مواقع دبي", "SEO", "Google Ads", "Facebook Ads", "تسويق رقمي"].map(t => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "+80%", label: "استفسارات خلال 3 أشهر" },
                  { value: "#1",   label: "صفحة جوجل الأولى" },
                  { value: "+60%", label: "زوار فريدون" },
                  { value: "-50%", label: "معدل ارتداد أقل" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-3xl font-black text-[#CC0000] mb-0.5">{s.value}</p>
                    <p className="text-xs text-[#6B7280] font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Website screenshot */}
            <motion.div
              variants={fade} initial="hidden" animate="show"
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-[#CC0000]/20 to-[#1E1B4B]/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5E7EB] shadow-2xl">
                {/* Browser chrome mock */}
                <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex-1 mx-3 bg-white rounded-lg px-3 py-1 text-[10px] text-[#9CA3AF] font-mono border border-[#E5E7EB]" dir="ltr">
                    www.sameday.me
                  </div>
                </div>
                <img loading="lazy" decoding="async"
                  src="/sameday-dental.webp"
                  alt="SameDay Dental Implants Dubai Website"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: 520 }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Challenge ───────────────────────────────────────── */}
        <section className="bg-[#111827] py-16 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#CC0000]/20 text-[#CC0000] text-xs font-bold mb-3">
                التحدي
              </span>
              <h2 className="text-3xl font-black text-white">ما واجهناه</h2>
              <p className="text-white/60 mt-2 max-w-xl mx-auto">
                قبل التعاون مع دبي فانز، كانت العيادة تعاني من مشكلات حادة في حضورها الرقمي
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {challenges.map((c, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#CC0000]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#CC0000] text-xs font-black">{i + 1}</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">{c}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Solution ────────────────────────────────────────── */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            variants={fade} initial="hidden" whileInView="show"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3">
              الحل
            </span>
            <h2 className="text-3xl font-black text-[#111827]">استراتيجيتنا</h2>
            <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
              خطة متكاملة جمعت بين تصميم الموقع والتسويق الرقمي الشامل
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {solutions.map((s, i) => (
              <motion.div
                key={i}
                variants={fade} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <CheckCircle size={20} style={{ color: s.color }} />
                </div>
                <h3 className="font-black text-[#111827] mb-2 text-base">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Results ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#1E1B4B] to-[#111827] py-16 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0B429]/20 text-[#F0B429] text-xs font-bold mb-3">
                النتائج
              </span>
              <h2 className="text-3xl font-black text-white">ماذا حققنا معاً</h2>
              <p className="text-white/60 mt-2">نتائج ملموسة خلال الأشهر الثلاثة الأولى</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-5xl mx-auto">
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${r.color}25` }}
                  >
                    <r.icon size={22} style={{ color: r.color }} />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">{r.value}</p>
                  <p className="text-white/60 text-xs font-medium leading-snug">{r.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-10">
            <h2 className="text-2xl font-black text-[#111827] mb-3">
              تريد نتائج مشابهة لعملك؟
            </h2>
            <p className="text-[#6B7280] mb-6">
              تواصل مع فريق دبي فانز لتحليل مجاني لحالتك وخطة تسويقية مخصصة
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/971551981564"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#CC0000] text-white font-bold hover:bg-[#AA0000] transition-all shadow-md hover:shadow-lg"
              >
                تواصل معنا عبر واتساب
              </a>
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#E5E7EB] text-[#374151] font-bold hover:border-[#CC0000]/40 hover:text-[#CC0000] transition-all"
              >
                <ArrowLeft size={16} />
                عرض جميع الأعمال
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
