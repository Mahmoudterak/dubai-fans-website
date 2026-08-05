import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, BarChart2, Award, Zap, Users, ChevronDown, Star,
  CheckCircle, Download, MessageSquare, ChevronLeft,
  Briefcase, Brain, Video, Globe, Shield, Headphones, BookOpen,
  TrendingUp, Target, Lightbulb,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { TrustBar } from "@/components/TrustBar";
import { courses } from "@/data/courses";

const BASE = "https://mtuaefans.com";

/* ── Map Arabic duration strings to ISO 8601 ─────────────────────────────── */
function toIsoDuration(ar: string): string {
  if (ar.includes("٨") || ar.includes("8")) return "P8W";
  if (ar.includes("٦") || ar.includes("6")) return "P6W";
  if (ar.includes("٤") || ar.includes("4")) return "P4W";
  return "P8W"; // safe default
}

/* ── Build all JSON-LD for a course detail page ──────────────────────────── */
function buildCourseJsonLd(
  course: (typeof courses)[0],
  faqItems: { q: string; a: string }[],
): Record<string, unknown>[] {
  return [
    /* Course ─────────────────────────────────────────────────────────────── */
    {
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "url": `${BASE}/courses/${course.slug}`,
      "inLanguage": "ar",
      "educationalLevel": course.level,
      "timeRequired": toIsoDuration(course.duration),
      "teaches": course.skills.slice(0, 10),
      "coursePrerequisites": "لا يشترط خبرة سابقة",
      "provider": {
        "@type": "Organization",
        "name": "دبي فانز — أكاديمية التسويق الرقمي",
        "url": BASE,
        "logo": { "@type": "ImageObject", "url": `${BASE}/logo.png` },
        "sameAs": "https://mtuaefans.com",
      },
      "instructor": {
        "@type": "Person",
        "name": "محمود طارق",
        "jobTitle": "مؤسس دبي فانز — مستشار تسويق رقمي",
        "url": "https://mtcoach.blog",
        "knowsAbout": ["التسويق الرقمي", "ميديا باينج", "إعلانات ميتا", "إعلانات جوجل", "SEO"],
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "inLanguage": "ar",
        "courseSchedule": {
          "@type": "Schedule",
          "duration": toIsoDuration(course.duration),
          "repeatFrequency": "Weekly",
        },
        "offers": {
          "@type": "Offer",
          "price": course.price,
          "priceCurrency": "AED",
          "availability": "https://schema.org/InStock",
          "url": `${BASE}/courses/${course.slug}/register`,
          "validFrom": "2025-01-01",
        },
      },
      // aggregateRating derived truthfully from the displayed testimonials only.
      // All testimonials visible on the page are 5-star, so ratingValue = 5.
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": String(course.testimonials.length),
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": course.testimonials.map(t => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": t.name },
        "reviewBody": t.text,
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      })),
    },
    /* BreadcrumbList ──────────────────────────────────────────────────────── */
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": "الكورسات", "item": `${BASE}/courses` },
        { "@type": "ListItem", "position": 3, "name": course.name,  "item": `${BASE}/courses/${course.slug}` },
      ],
    },
    /* FAQPage ─────────────────────────────────────────────────────────────── */
    {
      "@type": "FAQPage",
      "mainEntity": faqItems.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ];
}

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, delay } },
});

/* ── Icon pool for skills / outcomes (cycles through) ── */
const ICONS = [Target, Globe, TrendingUp, Award, Briefcase, Brain,
               Shield, Headphones, Video, Lightbulb, BookOpen, Users, Zap, CheckCircle, BarChart2];

/* ── Benefit icons mapping (first 12 slots) ── */
const BENEFIT_ICONS = [
  Award, Shield, BookOpen, CheckCircle, Video, Target,
  Users, Headphones, Brain, Globe, TrendingUp, Briefcase,
];

function ModuleCard({ mod, index, accentColor }: { mod: { title: string; topics: string[] }; index: number; accentColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fade(index * 0.06)} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-[#FAFAFA] transition-colors">
        <span className="font-black text-[#111827] text-sm">{mod.title}</span>
        <ChevronDown size={16} style={{ color: accentColor }} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <ul className="px-6 pb-4 space-y-2 border-t border-[#F3F4F6]">
              {mod.topics.map((t, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-[#6B7280] pt-2">
                  <CheckCircle size={13} style={{ color: accentColor }} className="mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqItem({ faq, accentColor }: { faq: { q: string; a: string }; accentColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-[#FAFAFA] transition-colors">
        <span className="font-bold text-[#111827] text-sm">{faq.q}</span>
        <ChevronDown size={15} style={{ color: accentColor }} className={`transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-6 pb-4 text-sm text-[#6B7280] border-t border-[#F3F4F6] pt-3">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Generate & download curriculum as printable PDF window ── */
function downloadCurriculum(course: typeof courses[0]) {
  const w = window.open("", "_blank");
  if (!w) return;

  const modulesHtml = course.modules.map((m, i) => `
    <div class="module">
      <div class="module-header">
        <span class="module-num">${i + 1}</span>
        <strong>${m.title}</strong>
      </div>
      <ul class="topics">
        ${m.topics.map(t => `<li>&#10003; ${t}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const outcomesHtml = course.outcomes.map(o => `<li>&#10003; ${o}</li>`).join("");
  const skillsHtml   = course.skills.map(s => `<span class="badge">${s}</span>`).join("");

  w.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<title>منهج ${course.name} — أكاديمية دبي فانز</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 15mm; size: A4; }
  body { font-family: 'Arial', sans-serif; direction: rtl; color: #111827; background: #fff; line-height: 1.6; }

  .header { background: linear-gradient(135deg, ${course.color}, #1E1B4B); color: #fff; padding: 32px; border-radius: 0 0 20px 20px; margin-bottom: 28px; }
  .header h1 { font-size: 26px; font-weight: 900; margin-bottom: 6px; }
  .header p  { font-size: 14px; opacity: .85; margin-bottom: 14px; }
  .meta-row  { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; }
  .meta-item { background: rgba(255,255,255,.15); padding: 4px 12px; border-radius: 20px; }

  .logo-line { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .logo-circle { width: 36px; height: 36px; background: rgba(255,255,255,.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; }

  h2 { font-size: 16px; font-weight: 900; color: #111827; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid ${course.color}; }

  .module { border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
  .module-header { background: #F9FAFB; padding: 10px 14px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; }
  .module-num { background: ${course.color}; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0; }
  .topics { padding: 8px 14px 10px 14px; list-style: none; }
  .topics li { font-size: 12px; color: #6B7280; padding: 3px 0; }

  .outcomes { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .outcomes li { font-size: 12px; color: #374151; background: #F3F4F6; border-radius: 8px; padding: 6px 10px; }

  .badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .badge { background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 20px; padding: 4px 12px; font-size: 11px; color: #374151; }

  .footer-bar { margin-top: 36px; padding: 16px; background: #F3F4F6; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6B7280; }
  .price-tag  { background: ${course.color}; color: #fff; border-radius: 10px; padding: 6px 16px; font-size: 16px; font-weight: 900; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="logo-line">
    <div class="logo-circle">DF</div>
    <span style="font-size:13px;opacity:.8">أكاديمية دبي فانز للتسويق الرقمي</span>
  </div>
  <h1>${course.name}</h1>
  <p>${course.subtitle}</p>
  <p style="font-size:13px;opacity:.75;margin-bottom:12px">${course.description}</p>
  <div class="meta-row">
    <div class="meta-item">⏱ المدة: ${course.duration}</div>
    <div class="meta-item">📊 المستوى: ${course.level}</div>
    <div class="meta-item">🎓 مع شهادة</div>
    <div class="meta-item">🤖 ذكاء اصطناعي</div>
  </div>
</div>

<h2>📚 محتوى البرنامج — ${course.modules.length} وحدات</h2>
${modulesHtml}

<h2>🏆 بعد إتمام البرنامج ستكون قادراً على</h2>
<ul class="outcomes">${outcomesHtml}</ul>

<h2>🎯 المهارات التي ستكتسبها</h2>
<div class="badges">${skillsHtml}</div>

<div class="footer-bar">
  <div>
    <strong>للتسجيل والاستفسار</strong><br/>
    📞 +971 55 198 1564 &nbsp;|&nbsp; 📧 info@mtuaefans.sbs<br/>
    🌐 mtuaefans.com/courses/${course.slug}
  </div>
  <div class="price-tag">${course.price.toLocaleString("ar-AE")} AED</div>
</div>

<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`);
  w.document.close();
}

/* ── Static FAQs (shared, contextual) ── */
const faqs = [
  { q: "هل الكورس مناسب للمبتدئين؟",           a: "نعم — كل برنامج يبدأ من الأساسيات ويتدرج نحو المواضيع المتقدمة خطوة بخطوة." },
  { q: "هل سأحصل على شهادة؟",                  a: "بالتأكيد. ستحصل على شهادة احترافية من دبي فانز عند اجتياز جميع الوحدات ومشروع التخرج بنجاح." },
  { q: "هل سأتعلم الذكاء الاصطناعي؟",           a: "الذكاء الاصطناعي متكامل في كل برنامج — من إنتاج المحتوى وتحسين الحملات إلى التحليلات وإعداد التقارير." },
  { q: "هل الجلسات مسجّلة؟",                    a: "نعم. جميع الجلسات المباشرة مسجّلة ومتاحة للمشاهدة مدى الحياة في لوحة تحكم الطالب." },
  { q: "هل يوجد دعم بعد الكورس؟",               a: "تحصل على دعم مخصص لمدة ٦ أشهر وإمكانية الوصول مدى الحياة إلى مجتمع الطلاب الخاص." },
  { q: "هل يمكنني تطبيق ما تعلمته على أعمالي؟", a: "كل وحدة مبنية حول سيناريوهات أعمال حقيقية. ستطبق ما تتعلمه على أعمالك من اليوم الأول." },
  { q: "كم مدة الدعم بعد الانتهاء؟",            a: "يمتد الدعم بعد الانتهاء لمدة ٦ أشهر مع ساعات عمل أسبوعية ومجموعة واتساب خاصة." },
];

/* ── Instructor skills ── */
const instructorSkills = [
  "التسويق الرقمي", "التسويق الأدائي", "ميديا باينج",
  "إعلانات ميتا", "إعلانات تيك توك", "إعلانات سناب شات",
  "SEO", "بناء العلامة التجارية", "نمو الأعمال", "الذكاء الاصطناعي",
];

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const course = courses.find(c => c.slug === params.slug);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-2xl font-black mb-4">الكورس غير موجود</h1>
        <Link href="/courses" className="text-[#CC0000] font-bold">← العودة للكورسات</Link>
      </div>
    </div>
  );

  const registerUrl = `/courses/${course.slug}/register`;

  return (
    <>
      <SEOHead
        title={`${course.name} | أكاديمية دبي فانز للتسويق الرقمي`}
        description={course.description}
        keywords={`${course.name} دبي, كورس تسويق رقمي الإمارات, تدريب ${course.category}`}
        canonical={`${BASE}/courses/${course.slug}`}
        jsonLd={buildCourseJsonLd(course, faqs)}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-24" dir="rtl">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#CC0000]">الرئيسية</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <Link href="/courses" className="hover:text-[#CC0000]">الكورسات</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <span className="text-[#374151] font-semibold">{course.name}</span>
          </nav>
        </div>

        {/* ── القسم ١: Hero ── */}
        <section className={`bg-gradient-to-bl from-[#0F0A2A] via-[#1E1B4B] ${course.gradient.replace("from-", "to-")} pb-16 pt-8 relative overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ backgroundColor: course.color }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div variants={fade()} initial="hidden" animate="show">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 rounded-lg text-xs font-black text-white" style={{ backgroundColor: course.color }}>{course.category}</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-black bg-[#F0B429]/20 text-[#F0B429]">ذكاء اصطناعي</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2">{course.name}</h1>
                <p className="text-lg font-bold mb-4" style={{ color: course.color }}>{course.subtitle}</p>
                <p className="text-white/70 mb-6 leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-8">
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#F0B429]" />{course.duration}</span>
                  <span className="flex items-center gap-1.5"><BarChart2 size={14} className="text-[#F0B429]" />{course.level}</span>
                  <span className="flex items-center gap-1.5"><Award size={14} className="text-[#F0B429]" />شهادة مرفقة</span>
                </div>

                {/* Instructor mini card */}
                <div className="flex items-center gap-3 mb-8 bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm w-fit">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CC0000] to-[#1E1B4B] flex items-center justify-center text-white font-black">م</div>
                  <div>
                    <p className="text-white font-bold text-sm">محمود طارق</p>
                    <p className="text-white/60 text-xs">المؤسس والرئيس التنفيذي · دبي فانز</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(registerUrl)}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold shadow-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: course.color }}>
                    <Zap size={16} /> سجّل الآن
                  </button>
                  <button
                    onClick={() => downloadCurriculum(course)}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                    <Download size={16} /> تحميل المنهج
                  </button>
                </div>
              </motion.div>

              {/* Course visual */}
              <motion.div variants={fade(0.2)} initial="hidden" animate="show"
                className="hidden lg:flex items-center justify-center">
                <div className="w-72 h-72 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/20 backdrop-blur-sm bg-white/5 shadow-2xl">
                  <BookOpen size={64} className="text-white/80" />
                  <div className="text-center">
                    <p className="text-white font-black text-xl">{course.duration}</p>
                    <p className="text-white/60 text-sm">{course.level}</p>
                    <p className="text-[#F0B429] font-black text-2xl mt-2">{course.price.toLocaleString("ar-AE")} AED</p>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F0B429" className="text-[#F0B429]" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── القسم ٢: ما ستحصل عليه ── */}
        <section className="container mx-auto px-6 py-16">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#111827] mb-2">🚀 ما ستحصل عليه</h2>
            <p className="text-[#6B7280]">كل شيء مضمّن في تسجيلك</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {course.benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <motion.div key={i} variants={fade(i * 0.05)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${course.color}18` }}>
                    <Icon size={18} style={{ color: course.color }} />
                  </div>
                  <p className="text-xs font-bold text-[#374151]">{b}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── القسم ٣: الوحدات ── */}
        <section className="bg-[#F3F4F6] py-16">
          <div className="container mx-auto px-6">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#111827] mb-2">📚 ماذا ستتعلم</h2>
              <p className="text-[#6B7280]">{course.modules.length} وحدات — من الأساسيات إلى الاحتراف</p>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-3">
              {course.modules.map((mod, i) => (
                <ModuleCard key={i} mod={mod} index={i} accentColor={course.color} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => downloadCurriculum(course)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-all hover:text-white"
                style={{ borderColor: course.color, color: course.color }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = course.color)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Download size={16} /> تحميل المنهج الكامل PDF
              </button>
            </div>
          </div>
        </section>

        {/* ── القسم ٤: المهارات ── */}
        <section className="container mx-auto px-6 py-16">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#111827] mb-2">🎯 ما ستكتسبه من مهارات</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {course.skills.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div key={i} variants={fade(i * 0.04)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#E5E7EB] shadow-sm text-sm font-bold text-[#374151] transition-all"
                  style={{ cursor: "default" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${course.color}50`;
                    e.currentTarget.style.color = course.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.color = "#374151";
                  }}>
                  <Icon size={14} />
                  {s}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── القسم ٥: لمن هذا البرنامج ── */}
        <section className="bg-[#111827] py-16">
          <div className="container mx-auto px-6">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">👨‍💻 هذا البرنامج مثالي لـ</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {course.audiences.map((a, i) => (
                <motion.span key={i} variants={fade(i * 0.05)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm">
                  {a}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ── القسم ٦: بعد إتمام البرنامج ── */}
        <section className="container mx-auto px-6 py-16">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#111827] mb-2">🏆 بعد إتمام البرنامج</h2>
            <p className="text-[#6B7280]">ستكون قادراً على…</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {course.outcomes.map((o, i) => (
              <motion.div key={i} variants={fade(i * 0.04)} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="flex items-start gap-2 p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <CheckCircle size={14} style={{ color: course.color }} className="mt-0.5 shrink-0" />
                <span className="text-xs font-bold text-[#374151]">{o}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── القسم ٧: مميزات البرنامج ── */}
        <section className="bg-gradient-to-br from-[#1E1B4B] to-[#0F0A2A] py-16">
          <div className="container mx-auto px-6">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">⭐ مميزات البرنامج</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {course.programFeatures.map((f, i) => (
                <motion.div key={i} variants={fade(i * 0.04)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs font-bold">
                  <Zap size={11} className="text-[#F0B429] shrink-0" />
                  {f}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── القسم ٨: المدرّب ── */}
        <section className="container mx-auto px-6 py-16">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#111827] mb-2">👨‍🏫 مدرّبك</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#1E1B4B] flex items-center justify-center text-white text-4xl font-black shrink-0">م</div>
              <div>
                <h3 className="text-xl font-black text-[#111827]">محمود طارق</h3>
                <p className="font-bold text-sm mb-1" style={{ color: course.color }}>المؤسس والرئيس التنفيذي · دبي فانز للتسويق الرقمي</p>
                <p className="text-xs text-[#9CA3AF] mb-3">خبير التسويق الرقمي المدعوم بالذكاء الاصطناعي والتسويق الأدائي</p>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  محمود طارق مستشار تسويق رقمي متخصص في التسويق الأدائي والتجارة الإلكترونية والذكاء الاصطناعي ونمو الأعمال.
                  يساعد رواد الأعمال والشركات على بناء أنظمة تسويقية قابلة للتوسع من خلال التعليم التطبيقي واستراتيجيات
                  الذكاء الاصطناعي وتنفيذ الحملات الفعلية.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {instructorSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[#374151] text-[10px] font-bold">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── القسم ٩: آراء الطلاب ── */}
        <section className="bg-[#F3F4F6] py-16">
          <div className="container mx-auto px-6">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-black text-[#111827] mb-2">⭐ آراء الطلاب</h2>
            </motion.div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F0B429" className="text-[#F0B429]" />)}
                </div>
                <p className="text-[#374151] text-lg italic leading-relaxed mb-6">"{course.testimonials[activeTestimonial].text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ background: `linear-gradient(135deg, ${course.color}, #1E1B4B)` }}>
                    {course.testimonials[activeTestimonial].name[0]}
                  </div>
                  <div>
                    <p className="font-black text-[#111827] text-sm">{course.testimonials[activeTestimonial].name}</p>
                    <p className="text-[#9CA3AF] text-xs">{course.testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {course.testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)}
                    className={`h-2.5 rounded-full transition-all`}
                    style={{ backgroundColor: i === activeTestimonial ? course.color : "#D1D5DB", width: i === activeTestimonial ? "24px" : "10px" }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── القسم ١٠: الأسئلة الشائعة ── */}
        <section className="container mx-auto px-6 py-16">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#111827] mb-2">الأسئلة الشائعة</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => <FaqItem key={i} faq={faq} accentColor={course.color} />)}
          </div>
        </section>

        {/* ── القسم ١١: الأسعار ── */}
        <section className="bg-[#111827] py-16">
          <div className="container mx-auto px-6">
            <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-[#F0B429]/20 text-[#92400E] text-xs font-black mb-4">🔥 عرض الالتحاق المبكر</span>
                <h2 className="text-2xl font-black text-[#111827] mb-1">سعر التسجيل المميز</h2>
                <p className="text-[#6B7280] text-sm mb-4">أقساط متاحة · مقاعد محدودة</p>

                {/* Price display */}
                <div className="mb-6 py-4 rounded-2xl" style={{ backgroundColor: `${course.color}10` }}>
                  <p className="text-5xl font-black" style={{ color: course.color }}>{course.price.toLocaleString("ar-AE")}</p>
                  <p className="text-lg font-bold text-[#374151] mt-1">درهم إماراتي</p>
                </div>

                <div className="bg-[#FAFAFA] rounded-2xl p-4 mb-6 text-right space-y-2">
                  {["شهادة مرفقة", "دعم ٦ أشهر", "تسجيلات مدى الحياة", "مجتمع خاص", "قوالب الذكاء الاصطناعي"].map((f, i) => (
                    <p key={i} className="flex items-center gap-2 text-sm text-[#374151] font-medium">
                      <CheckCircle size={13} className="text-[#059669] shrink-0" />{f}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate(registerUrl)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-white shadow-md transition-all hover:opacity-90"
                    style={{ backgroundColor: course.color }}>
                    <Zap size={16} /> سجّل الآن
                  </button>
                  <a href="https://wa.me/971551981564" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-bold hover:opacity-90 transition-all">
                    <MessageSquare size={16} /> تواصل عبر واتساب
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── القسم ١٢: CTA النهائي ── */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }}
            className={`max-w-2xl mx-auto bg-gradient-to-bl ${course.gradient} rounded-3xl p-12 text-white shadow-2xl`}>
            <h2 className="text-3xl font-black mb-3">ابدأ بناء مستقبلك الرقمي اليوم</h2>
            <p className="text-white/70 mb-8">انضم إلى دبي فانز وأتقن المهارات التي تحتاجها الشركات الحديثة.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(registerUrl)}
                className="px-8 py-3.5 rounded-xl bg-white font-black transition-all hover:opacity-90 shadow-lg"
                style={{ color: course.color }}>
                سجّل الآن
              </button>
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
