/**
 * Reusable template for keyword-specific service landing pages.
 * Each page imports this and passes its own data.
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta, DEFAULT_OG_IMAGE } from "@/seo/routes-meta.mjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronDown, ChevronUp, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";

export interface Stat {
  value: string;
  label: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface ServiceLandingData {
  /* SEO — title/description/ogImage come from src/seo/routes-meta.mjs (single source of truth) */
  slug: string;          // e.g. "meta-ads-dubai"
  keywords: string;
  jsonLd: Record<string, unknown>;

  /* Hero */
  badge: string;         // small coloured tag above h1
  h1: string;            // exact keyword-targeted heading
  heroSubtitle: string;

  /* Body */
  description: string;
  features: string[];
  stats: Stat[];
  faqs: FAQ[];

  /* CTA */
  ctaLabel: string;
  ctaService: string;    // passed to WhatsApp message

  accentColor?: string;
}

function FAQItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-right bg-white hover:bg-[#F9FAFB] transition-colors"
      >
        <span className="font-bold text-[#111827] text-sm leading-relaxed">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-[#9CA3AF] shrink-0 ms-3" />
        ) : (
          <ChevronDown size={18} className="text-[#9CA3AF] shrink-0 ms-3" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E5E7EB] text-[#374151] text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ServiceLandingTemplate({
  slug,
  keywords,
  jsonLd,
  badge,
  h1,
  heroSubtitle,
  description,
  features,
  stats,
  faqs,
  ctaLabel,
  ctaService,
  accentColor = "#CC0000",
}: ServiceLandingData) {
  const meta = getRouteMeta(`/services/${slug}`);
  const waLink = `https://wa.me/971551981564?text=${encodeURIComponent(
    `مرحباً دبي فانز 👋\n\nأريد الاستفسار عن خدمة: *${ctaService}*`
  )}`;

  /** FAQPage JSON-LD — auto-generated from the faqs array */
  const faqSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  /** BreadcrumbList JSON-LD — auto-generated from slug + badge, mirrors the visible breadcrumb */
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://mtuaefans.com/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الخدمات",
        "item": "https://mtuaefans.com/services",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": badge,
        "item": `https://mtuaefans.com/services/${slug}`,
      },
    ],
  };

  /** Merge the Service schema (already has @context from each page) with FAQPage + BreadcrumbList */
  const allSchemas: Record<string, unknown>[] = [
    { "@context": "https://schema.org", ...jsonLd },
    faqSchema,
    breadcrumbSchema,
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={meta.title}
        description={meta.description}
        canonical={`/services/${slug}`}
        keywords={keywords}
        ogImage={meta.ogImage ?? DEFAULT_OG_IMAGE}
        jsonLd={allSchemas}
      />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#F3F4F6] border-b border-[#E5E7EB] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ backgroundColor: `${accentColor}09` }}
          />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F0B429]/05 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-3xl text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] mb-6">
            <Link href="/" className="hover:text-[#111827] transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#111827] transition-colors">الخدمات</Link>
            <span>/</span>
            <span className="text-[#111827]">{badge}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-5 border"
              style={{
                backgroundColor: `${accentColor}12`,
                color: accentColor,
                borderColor: `${accentColor}30`,
              }}
            >
              {badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-5 leading-tight">
              {h1}
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">{heroSubtitle}</p>

            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <button
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "#25D366",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                }}
              >
                <FaWhatsapp size={22} />
                {ctaLabel}
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-6 py-10 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-black mb-1"
                  style={{ color: accentColor }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-[#6B7280] leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Description + Features ───────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-4 leading-snug">
              لماذا تختار دبي فانز؟
            </h2>
            <p className="text-[#6B7280] leading-relaxed mb-6">{description}</p>

            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                احصل على استشارة مجانية
                <ArrowLeft size={15} />
              </button>
            </a>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-sm"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: accentColor }}
                />
                <span className="text-sm text-[#374151] leading-relaxed">{f}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#F3F4F6] border-t border-[#E5E7EB] py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
              الأسئلة الشائعة
            </h2>
            <p className="text-[#6B7280] text-sm">إجابات على أكثر الأسئلة شيوعاً</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-[#E5E7EB]">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
              ابدأ اليوم بدون أي التزام
            </h2>
            <p className="text-[#6B7280] mb-8 text-sm">
              استشارة مجانية · ردّ خلال ساعة · بدون عقود طويلة
            </p>

            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <button
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  backgroundColor: "#25D366",
                  boxShadow: "0 4px 24px rgba(37,211,102,0.35)",
                }}
              >
                <FaWhatsapp size={22} />
                {ctaLabel}
              </button>
            </a>

            <div className="mt-6">
              <Link href="/services" className="text-sm text-[#9CA3AF] hover:text-[#111827] transition-colors">
                ← عرض جميع الخدمات
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustBar showPayments={false} />
      <Footer />
    </div>
  );
}
