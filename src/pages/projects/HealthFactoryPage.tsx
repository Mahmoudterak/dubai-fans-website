import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Eye, DollarSign,
  Trophy, CheckCircle, ChevronLeft, ArrowLeft, Target,
} from "lucide-react";

const BASE = "https://mtuaefans.com";

const results = [
  { icon: Users,      value: "100",    label: "عميل محتمل جديد من Google",      color: "#10B981" },
  { icon: Eye,        value: "3M",     label: "مرة ظهور على Google وشبكتها",    color: "#3B82F6" },
  { icon: DollarSign, value: "22,800", label: "درهم عائد من إعلانات Google",    color: "#CC0000",  unit: "AED" },
  { icon: TrendingUp, value: "7.6×",   label: "عائد على الاستثمار (ROI)",        color: "#F59E0B" },
  { icon: Trophy,     value: "3",      label: "كلمات مفتاحية في الصفحة الأولى", color: "#8B5CF6" },
];

const solutions = [
  {
    title: "عرض حصري لحملة إعلانية",
    desc: 'اقترحنا على العميل تقديم عرض حصري خاص بحملتنا، وروّجنا له عبر إعلانات بحث Google وإعلانات شبكة المواقع الشريكة وإعلانات فيسبوك المدفوعة.',
    color: "#CC0000",
  },
  {
    title: "كلمات مفتاحية تنافسية وذات صلة",
    desc: "روّجنا للعرض عبر مجموعة واسعة من الكلمات المفتاحية ذات الصلة والكلمات المفتاحية التنافسية، مما أدى إلى نتائج استثنائية.",
    color: "#10B981",
  },
  {
    title: "تحسين محركات البحث (SEO)",
    desc: "تحسين 15 كلمة مفتاحية، منها 3 كلمات باتت في الصفحة الأولى من Google، مما عزّز الحضور العضوي للعلامة التجارية.",
    color: "#3B82F6",
  },
  {
    title: "صفحة هبوط مقنعة ومتجاوبة",
    desc: "أنشأنا صفحة هبوط احترافية متجاوبة تجذب العملاء المحتملين الباحثين عبر هواتفهم وأجهزتهم اللوحية.",
    color: "#F59E0B",
  },
  {
    title: "حملة إعلانات Google باللغة الإنجليزية",
    desc: "أطلقنا حملة Google Ads ملتزمة بإرشادات العلامة التجارية لضمان رسالة متسقة عبر جميع القنوات الرقمية.",
    color: "#8B5CF6",
  },
  {
    title: "تحليل معمّق للسوق والمنافسين",
    desc: "حللنا موقع العلامة التجارية، وقارناه بالمنافسين، وراجعنا البرامج التسويقية الحالية لاستخلاص فرص حقيقية للتحسين.",
    color: "#EC4899",
  },
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function HealthFactoryPage() {
  return (
    <>
      <SEOHead
        title="دراسة حالة: مصنع صحي — ROI 7.6× من Google Ads | دبي فانز"
        description="كيف حققنا 100 عميل جديد وعائد استثمار 7.6× لمصنع صحي لبرامج الغذاء الصحي — Google Ads، Facebook Ads، SEO."
        keywords="مصنع صحي, Google Ads دبي, دراسة حالة تسويق رقمي, برامج غذاء صحي دبي"
        canonical={`${BASE}/projects/health-factory`}
        ogImage={`${BASE}/health-factory-website.webp`}
        ogType="article"
        jsonLd={[
          /* ── Article (Case Study) ─────────────────────────────── */
          {
            "@type": "Article",
            "headline": "دراسة حالة: كيف حققنا ROI 7.6× لـ Health Factory من Google Ads",
            "description": "كيف حققنا 100 عميل جديد وعائد استثمار 7.6× لمصنع صحي لبرامج الغذاء الصحي — Google Ads، Facebook Ads، SEO.",
            "image": `${BASE}/health-factory-website.webp`,
            "url": `${BASE}/projects/health-factory`,
            "datePublished": "2023-09-01",
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
              "name": "Health Factory",
              "description": "مصنع منتجات صحية وبرامج غذاء صحي — الإمارات العربية المتحدة",
              "areaServed": "AE",
              "address": { "@type": "PostalAddress", "addressCountry": "AE", "addressLocality": "دبي" },
            },
            "keywords": "Google Ads, ROI, تسويق رقمي, منتجات صحية, دبي",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/projects/health-factory` },
          },
          /* ── BreadcrumbList ──────────────────────────────────── */
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية",    "item": BASE },
              { "@type": "ListItem", "position": 2, "name": "أعمالنا",     "item": `${BASE}/projects` },
              { "@type": "ListItem", "position": 3, "name": "Health Factory", "item": `${BASE}/projects/health-factory` },
            ],
          },
          /* ── FAQPage — key results as Q&A ───────────────────── */
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "كم بلغ عائد الاستثمار (ROI) لمصنع صحي من حملات Google Ads؟",
                "acceptedAnswer": { "@type": "Answer", "text": "حققنا عائداً على الاستثمار بلغ 7.6× من حملات Google Ads، بإجمالي عائد 22,800 درهم إماراتي من حملة واحدة." },
              },
              {
                "@type": "Question",
                "name": "كم عميل جديد حقق مصنع صحي من حملات التسويق الرقمي؟",
                "acceptedAnswer": { "@type": "Answer", "text": "حقق مصنع صحي 100 عميل محتمل جديد من Google مع 3 ملايين ظهور على شبكة Google وشبكتها الإعلانية." },
              },
              {
                "@type": "Question",
                "name": "ما الخدمات التسويقية المقدمة لـ Health Factory؟",
                "acceptedAnswer": { "@type": "Answer", "text": "Google Ads (بحث وشبكة عرض)، Facebook Ads، تحسين SEO لـ 15 كلمة مفتاحية، وصفحة هبوط متجاوبة محسّنة للتحويل." },
              },
            ],
          },
        ]}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20" dir="rtl">

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-8">
          <nav className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#CC0000] transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} />
            <Link href="/projects" className="hover:text-[#CC0000] transition-colors">أعمالنا</Link>
            <ChevronLeft size={14} />
            <span className="text-[#374151] font-semibold">مصنع صحي</span>
          </nav>
        </div>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="container mx-auto px-6 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fade} initial="hidden" animate="show"
              transition={{ duration: 0.6 }}
            >
              {/* Logo + badge */}
              <div className="flex items-center gap-4 mb-5">
                <img loading="eager" decoding="async"
                  src="/health-factory-logo.jpg"
                  alt="Health Factory Logo"
                  className="h-16 w-auto rounded-xl border border-[#E5E7EB] shadow-sm bg-white p-2 object-contain"
                />
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold">
                  <Target size={13} />
                  دراسة حالة — Google Ads & SEO
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-[#111827] leading-tight mb-4">
                مصنع صحي<br />
                <span className="text-[#10B981]">عائد 7.6× على الاستثمار</span>
              </h1>

              <p className="text-lg text-[#6B7280] font-medium mb-3 leading-relaxed">
                برامج الغذاء الصحي لمرضى السكري، نظام الحمل الغذائي، وفقدان الوزن.
                كانوا ينفقون <span className="font-bold text-[#CC0000]">$8,000</span> مع وكالة كبرى
                دون أي مبيعات — معنا أنفقوا <span className="font-bold text-[#10B981]">$5,000</span> فقط
                وحصدوا <span className="font-bold text-[#111827]">100 عميل جديد</span>.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Google Ads", "Facebook Ads", "SEO", "Landing Page", "تسويق رقمي"].map(t => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>

              {/* Key stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "7.6×",    label: "عائد على الاستثمار",          color: "#F59E0B" },
                  { value: "100",     label: "عميل محتمل جديد من Google",   color: "#10B981" },
                  { value: "AED 22,800", label: "عائد من Google Ads",       color: "#CC0000" },
                  { value: "3M",      label: "مرة ظهور على Google",          color: "#3B82F6" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-[#6B7280] font-semibold leading-snug">{s.label}</p>
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
              <div className="absolute -inset-4 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5E7EB] shadow-2xl">
                {/* Browser chrome */}
                <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex-1 mx-3 bg-white rounded-lg px-3 py-1 text-[10px] text-[#9CA3AF] font-mono border border-[#E5E7EB]" dir="ltr">
                    www.healthfactory.com
                  </div>
                </div>
                <img loading="lazy" decoding="async"
                  src="/health-factory-website.webp"
                  alt="Health Factory Website"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: 520 }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Challenge ────────────────────────────────────── */}
        <section className="bg-[#111827] py-16 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#CC0000]/20 text-[#CC0000] text-xs font-bold mb-3">التحدي</span>
              <h2 className="text-3xl font-black text-white">ما واجهناه</h2>
              <p className="text-white/60 mt-2 max-w-2xl mx-auto">
                عميل يقدم برامج غذاء صحي لمرضى السكري ونظام الحمل وفقدان الوزن،
                كان يُنفق <strong className="text-white">$8,000</strong> شهرياً مع وكالة كبرى في دبي
                دون أي مبيعات تُذكر.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                { num: "1", title: "إنفاق بلا نتائج", desc: "$8,000 مع وكالة كبرى في دبي ولا مبيعات" },
                { num: "2", title: "جمهور متخصص", desc: "استهداف مرضى السكري، الحوامل، وراغبي فقدان الوزن يتطلب دقة عالية" },
                { num: "3", title: "برامج تسويق غير محسّنة", desc: "الحملات القديمة لم تستغل الكلمات المفتاحية الصحيحة" },
              ].map((c) => (
                <motion.div
                  key={c.num}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#CC0000]/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#CC0000] font-black text-lg">{c.num}</span>
                  </div>
                  <h3 className="text-white font-black mb-2">{c.title}</h3>
                  <p className="text-white/60 text-sm">{c.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Insight box */}
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="mt-8 max-w-2xl mx-auto bg-[#F0B429]/10 border border-[#F0B429]/30 rounded-2xl p-6 text-center"
            >
              <p className="text-[#F0B429] text-xs font-bold uppercase tracking-widest mb-2">البصيرة الاستراتيجية</p>
              <p className="text-white/80 text-sm leading-relaxed">
                حللنا موقع علامتهم التجارية، قارناهم بالمنافسين، وراجعنا برامجهم التسويقية الحالية —
                لاكتشفنا فرص تحسين جوهرية لم تستغلها الوكالة السابقة.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Solution ─────────────────────────────────────── */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            variants={fade} initial="hidden" whileInView="show"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-3">الحل</span>
            <h2 className="text-3xl font-black text-[#111827]">استراتيجيتنا</h2>
            <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
              خطة متكاملة بميزانية <strong>$5,000</strong> حققت ما فشل في تحقيقه <strong>$8,000</strong>
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${s.color}15` }}>
                  <CheckCircle size={20} style={{ color: s.color }} />
                </div>
                <h3 className="font-black text-[#111827] mb-2 text-base">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Results ──────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#064E3B] to-[#111827] py-16 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold mb-3">النتائج</span>
              <h2 className="text-3xl font-black text-white">ماذا حققنا</h2>
              <p className="text-white/60 mt-2">بميزانية $5,000 فقط — مقابل كل درهم استردّوا 7.60 درهم</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-5xl mx-auto">
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${r.color}25` }}>
                    <r.icon size={22} style={{ color: r.color }} />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{r.value}</p>
                  <p className="text-white/60 text-xs font-medium leading-snug">{r.label}</p>
                </motion.div>
              ))}
            </div>

            {/* ROI highlight */}
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="mt-10 max-w-lg mx-auto bg-[#F0B429]/10 border border-[#F0B429]/30 rounded-2xl p-6 text-center"
            >
              <p className="text-[#F0B429] font-black text-lg mb-1">مقابل كل 1 درهم أنفقوه</p>
              <p className="text-white text-5xl font-black">7.60 درهم</p>
              <p className="text-white/60 text-sm mt-2">عائد صافٍ موثّق من حملات Google</p>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-10">
            <h2 className="text-2xl font-black text-[#111827] mb-3">تريد عائداً مشابهاً لعملك؟</h2>
            <p className="text-[#6B7280] mb-6">تواصل معنا لتحليل مجاني وخطة تسويق رقمي مخصصة لنشاطك</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/971551981564"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#CC0000] text-white font-bold hover:bg-[#AA0000] transition-all shadow-md"
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
