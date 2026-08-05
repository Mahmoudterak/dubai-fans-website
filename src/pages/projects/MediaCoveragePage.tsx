import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Newspaper, Star, Award } from "lucide-react";

const BASE = "https://mtuaefans.com";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

/* ── Partner badges (images we have) ─────────── */
const partnerBadges = [
  { src: "/badge-meta.png",      alt: "Meta Business Partners",      bg: "bg-white" },
  { src: "/badge-linkedin.png",  alt: "LinkedIn Marketing Partners", bg: "bg-[#0A66C2]" },
  { src: "/badge-pinterest.png", alt: "Pinterest Marketing Partners", bg: "bg-[#E60023]" },
];

/* ── Newspapers ───────────────────────────────── */
const newspapers = [
  { name: "LA Times",           style: "font-serif font-black text-[#1a1a1a]",      size: "text-2xl" },
  { name: "GULF NEWS",          style: "font-black text-[#1a1a1a] tracking-widest", size: "text-lg" },
  { name: "USA TODAY",          style: "font-black text-[#009BFF] tracking-wide",   size: "text-xl" },
  { name: "Khaleej Times",      style: "font-serif italic text-[#1a1a1a]",          size: "text-xl" },
  { name: "WSJ",                style: "font-black text-white bg-[#1a1a1a] px-3 py-1 rounded", size: "text-2xl" },
  { name: "The Washington Post",style: "font-serif font-black text-[#1a1a1a]",      size: "text-lg" },
  { name: "The New York Times", style: "font-serif font-black text-[#1a1a1a]",      size: "text-lg" },
];

/* ── Accreditations ───────────────────────────── */
const accreditations = [
  { name: "AMASA",         color: "#1a1a1a", bg: "#f3f4f6" },
  { name: "SMSDC",         color: "#003087", bg: "#eef2ff" },
  { name: "GHP",           color: "#cc0000", bg: "#fff0f0" },
  { name: "BCMS",          color: "#2563eb", bg: "#eff6ff" },
  { name: "Bing Ads",      color: "#008272", bg: "#f0fdf4" },
  { name: "Yahoo!",        color: "#6001D2", bg: "#faf5ff" },
  { name: "Google Partner",color: "#4285F4", bg: "#eff6ff" },
  { name: "Social Media",  color: "#374151", bg: "#f9fafb" },
];

/* ── Press mentions copy ─────────────────────── */
const pressItems = [
  {
    title: "تميّزنا في أبرز الصحف العالمية",
    desc: "حضور إعلامي واسع في كبرى المنابر الإخبارية العالمية — من لوس أنجلوس تايمز وجلف نيوز إلى نيويورك تايمز وواشنطن بوست.",
    icon: Newspaper,
    color: "#CC0000",
  },
  {
    title: "شريك معتمد من أكبر الأسماء",
    desc: "اعتمادات رسمية من منظمات تسويقية عالمية ومنصات رقمية كبرى — تُثبت مستوى خبرتنا وكفاءتنا في السوق الإماراتي والعالمي.",
    icon: Star,
    color: "#F59E0B",
  },
  {
    title: "شراكات استراتيجية مع المنصات الكبرى",
    desc: "شركاء رسميون معتمدون لدى Meta وLinkedIn وPinterest — وهو ما يمنحنا وصولاً حصرياً لأدوات وبيانات لا تتوفر للوكالات العادية.",
    icon: Award,
    color: "#8B5CF6",
  },
];

export default function MediaCoveragePage() {
  return (
    <>
      <SEOHead
        title="الصحف والمجالات الإخبارية | دبي فانز — حضور عالمي موثّق"
        description="دبي فانز في أبرز الصحف العالمية: LA Times، Gulf News، Khaleej Times، New York Times. شريك معتمد من Meta وLinkedIn وPinterest."
        keywords="دبي فانز في الصحف, وكالة تسويق دبي إعلامية, Meta Partner دبي, LinkedIn Partner الإمارات"
        canonical={`${BASE}/projects/media-coverage`}
        ogImage={`${BASE}/media-coverage.png`}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20" dir="rtl">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 mb-8">
          <nav className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#CC0000] transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} />
            <Link href="/projects" className="hover:text-[#CC0000] transition-colors">أعمالنا</Link>
            <ChevronLeft size={14} />
            <span className="text-[#374151] font-semibold">الصحف والمجالات الإخبارية</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1E1B4B] via-[#CC0000]/80 to-[#111827] py-20 mb-16">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                الصحف والمجالات <span className="text-[#F0B429]">الإخبارية</span>
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                حضور إعلامي موثّق في أبرز الصحف العالمية، واعتمادات رسمية من أكبر المنصات الرقمية —
                ثقة مكتسبة بالنتائج.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Value props */}
        <section className="container mx-auto px-6 mb-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pressItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fade} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <h3 className="font-black text-[#111827] mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partner Badges */}
        <section className="bg-white border-y border-[#E5E7EB] py-14 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold mb-3 uppercase tracking-widest">
                شراكات رسمية
              </span>
              <h2 className="text-3xl font-black text-[#111827]">شركاء معتمدون</h2>
              <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
                اعتمادات رسمية من أكبر منصات الإعلانات الرقمية في العالم
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-6 max-w-3xl mx-auto">
              {partnerBadges.map((b, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#E5E7EB]"
                >
                  <img loading="lazy" decoding="async"
                    src={b.src}
                    alt={b.alt}
                    className="h-16 w-auto object-contain"
                    style={{ minWidth: 160 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newspapers section */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            variants={fade} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-bold mb-3 uppercase tracking-widest">
              حضور إعلامي عالمي
            </span>
            <h2 className="text-3xl font-black text-[#111827]">نحن نتميّز في أفضل الصحف</h2>
            <p className="text-[#6B7280] mt-2">ذُكرنا وتميّزنا في كبرى المنابر الإخبارية العالمية</p>
          </motion.div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-10 max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8">
              {newspapers.map((n, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="hover:scale-105 transition-transform cursor-default"
                >
                  <span className={`${n.style} ${n.size} select-none`}>{n.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Accreditations */}
        <section className="bg-[#111827] py-16 mb-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0B429]/20 text-[#F0B429] text-xs font-bold mb-3 uppercase tracking-widest">
                اعتمادات دولية
              </span>
              <h2 className="text-3xl font-black text-white">معتمد من أكبر الأسماء</h2>
              <p className="text-white/60 mt-2">منظمات تسويقية ومنصات رقمية عالمية تُقرّ بكفاءتنا</p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
              {accreditations.map((a, i) => (
                <motion.div
                  key={i}
                  variants={fade} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform cursor-default border border-white/10"
                  style={{ backgroundColor: a.bg, color: a.color }}
                >
                  {a.name}
                </motion.div>
              ))}
            </div>

            {/* Reference screenshot */}
            <motion.div
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img loading="lazy" decoding="async"
                src="/media-coverage.webp"
                alt="الصحف والاعتمادات"
                className="w-full object-contain bg-white"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-10">
            <h2 className="text-2xl font-black text-[#111827] mb-3">
              تريد وكالة ذات حضور إعلامي عالمي؟
            </h2>
            <p className="text-[#6B7280] mb-6">
              شراكاتنا مع كبرى المنصات تمنحك ميزة تنافسية حقيقية
            </p>
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
