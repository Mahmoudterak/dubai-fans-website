import { useState } from "react";
import { contactPageSchema } from "@/seo/schemas.mjs";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/contact");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaYoutube, FaLinkedin,
} from "react-icons/fa";

/* ─────────────────────────────────────────────── */
const CONTACT_CARDS = [
  {
    icon: FaWhatsapp,
    label: "واتساب (الرئيسي)",
    value: "+971 55 198 1564",
    sub: "رد فوري — متاح طوال اليوم",
    href: "https://wa.me/971551981564?text=مرحباً دبي فانز، أريد الاستفسار عن خدماتكم",
    color: "#25D366",
    bg: "#25D36615",
    border: "#25D36630",
  },
  {
    icon: Phone,
    label: "هاتف بديل",
    value: "+971 56 895 2775",
    sub: "يمكن التواصل عبر المكالمة أو واتساب",
    href: "tel:+971568952775",
    color: "#CC0000",
    bg: "#CC000015",
    border: "#CC000030",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: "info@mtuaefans.sbs",
    sub: "للاستفسارات الرسمية والعروض",
    href: "mailto:info@mtuaefans.sbs",
    color: "#D97706",
    bg: "#D9770615",
    border: "#D9770630",
  },
  {
    icon: MapPin,
    label: "الموقع",
    value: "دبي، الإمارات العربية المتحدة",
    sub: "نقدم خدماتنا في كامل الإمارات والخليج",
    href: "https://maps.google.com/?q=Dubai,UAE",
    color: "#10B981",
    bg: "#10B98115",
    border: "#10B98130",
  },
  {
    icon: Clock,
    label: "ساعات العمل",
    value: "السبت – الخميس: 9:00 ص – 11:00 م",
    sub: "الجمعة: 2:00 م – 10:00 م",
    href: null,
    color: "#06B6D4",
    bg: "#06B6D415",
    border: "#06B6D430",
  },
];

const SOCIAL_LINKS = [
  { Icon: FaWhatsapp,  href: "https://wa.me/971551981564",                  label: "واتساب",    color: "#25D366", bg: "#25D36615" },
  { Icon: FaInstagram, href: "https://www.instagram.com/mtuaefans",          label: "إنستغرام",  color: "#E1306C", bg: "#E1306C15" },
  { Icon: FaFacebook,  href: "https://www.facebook.com/mtuaefans",           label: "فيسبوك",    color: "#1877F2", bg: "#1877F215" },
  { Icon: FaTiktok,    href: "https://www.tiktok.com/@mtuaefans",            label: "تيك توك",   color: "#111827", bg: "#11182715" },
  { Icon: FaYoutube,   href: "https://www.youtube.com/@mtuaefans",           label: "يوتيوب",    color: "#FF0000", bg: "#FF000015" },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mahmoudterak-mt-050a97427/", label: "لينكدإن",  color: "#0A66C2", bg: "#0A66C215" },
];

const FAQS = [
  { q: "ما هي أسرع طريقة للتواصل معكم؟", a: "واتساب على الرقم +971 55 198 1564 — نرد خلال دقائق خلال ساعات العمل." },
  { q: "هل تقدمون خدماتكم خارج دبي؟", a: "نعم، نخدم كامل الإمارات العربية المتحدة، ونعمل أيضاً مع عملاء في السعودية والكويت وقطر عن بُعد." },
  { q: "كم يستغرق الرد على استفسارات البريد الإلكتروني؟", a: "نرد على رسائل البريد الإلكتروني خلال 24 ساعة في أيام العمل." },
  { q: "هل يمكن حجز اجتماع أو استشارة مجانية؟", a: "بالتأكيد! تواصل معنا عبر واتساب لتحديد موعد استشارة مجانية لمدة 30 دقيقة." },
];

/* ─────────────────────────────────────────────── */

export default function ContactPage() {
  const [form, setForm] = useState(() => {
    const subject = typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("subject")?.trim() ?? "";
    return { name: "", phone: "", service: subject, message: "" };
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `مرحباً دبي فانز 👋\n\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالخدمة المطلوبة: ${form.service}\n\nالرسالة:\n${form.message}`;
    window.open(`https://wa.me/971551981564?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/contact"
        keywords="اتصل بدبي فانز, رقم دبي فانز, واتساب دبي فانز, تواصل وكالة تسويق دبي"
        ogImage={PAGE_META.ogImage}
        jsonLd={contactPageSchema}
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000]/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#D97706]/5 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-5"
          >
            تواصل معنا
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[#111827] mb-4 leading-tight"
          >
            نحن هنا لمساعدتك<br />
            <span className="text-[#CC0000]">ابدأ محادثتك الآن</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#6B7280] text-lg max-w-xl mx-auto"
          >
            فريقنا متاح للرد على استفساراتك وتقديم استشارة مجانية لمشروعك
          </motion.p>

          {/* Quick action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            <a
              href="https://wa.me/971551981564?text=مرحباً، أريد استشارة مجانية"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1ebe5d] transition-all shadow-lg shadow-[#25D366]/25 text-sm"
            >
              <FaWhatsapp size={18} />
              واتساب — رد فوري
            </a>
            <a
              href="mailto:info@mtuaefans.sbs"
              className="flex items-center gap-2 bg-white border-2 border-[#E5E7EB] text-[#111827] font-black px-6 py-3 rounded-xl hover:border-[#CC0000]/40 transition-all text-sm"
            >
              <Mail size={16} className="text-[#CC0000]" />
              info@mtuaefans.sbs
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTACT_CARDS.map((card, i) => {
              const El = card.href ? "a" : "div";
              const elProps = card.href
                ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  {/* @ts-ignore */}
                  <El
                    {...elProps}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#CC0000]/25 hover:shadow-lg transition-all duration-300 group block"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: card.bg, border: `1.5px solid ${card.border}` }}
                    >
                      <card.icon size={22} style={{ color: card.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#9CA3AF] font-semibold mb-0.5">{card.label}</div>
                      <div className="text-[#111827] font-black text-sm leading-snug">{card.value}</div>
                      <div className="text-[#9CA3AF] text-xs mt-0.5">{card.sub}</div>
                    </div>
                  </El>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAP + FORM ── */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-black text-[#111827] mb-1">موقعنا على الخريطة</h2>
                <p className="text-[#6B7280] text-sm">دبي فانز للخدمات الرقمية — دبي، الإمارات</p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md" style={{ height: 340 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14421.571308937779!2d55.401520216188274!3d25.35814778206636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60a332e0d10539d9%3A0xaa5010ad01912de0!2z2K_YqNmKINmB2KfZhtiyINmI2YPYp9mE2Kkg2KfZhNiq2LPZiNmK2YIg2KfZhNix2YXZitmK!5e0!3m2!1sar!2sae!4v1785489260082!5m2!1sar!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="موقع دبي فانز على الخريطة"
                />
              </div>

              {/* Social media */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <h3 className="text-base font-black text-[#111827] mb-4">تابعنا على منصات التواصل</h3>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map(({ Icon, href, label, color, bg }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:scale-105 hover:border-[#CC0000]/30 transition-all duration-200 text-sm font-bold"
                      style={{ backgroundColor: bg, color }}
                    >
                      <Icon size={16} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* WhatsApp form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleWhatsApp}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-5 h-fit"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-black text-[#111827]">أرسل لنا رسالة</h2>
                <p className="text-[#6B7280] text-sm mt-1">سيتم إرسال رسالتك مباشرةً عبر واتساب</p>
              </div>

              {[
                { key: "name",    label: "الاسم الكامل",          placeholder: "محمد أحمد",                        type: "text" },
                { key: "phone",   label: "رقم الهاتف / واتساب",   placeholder: "+971 55 XXX XXXX",                 type: "tel"  },
                { key: "service", label: "الخدمة المطلوبة",        placeholder: "إعلانات / موقع / سوشيال ميديا…",  type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-[#374151] mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-colors text-sm"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">رسالتك</label>
                <textarea
                  rows={4}
                  placeholder="أخبرنا عن مشروعك، ميزانيتك، وأهدافك التسويقية…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-black text-base transition-all duration-200 shadow-md shadow-[#25D366]/25"
              >
                <FaWhatsapp size={20} />
                أرسل عبر واتساب
              </button>

              <p className="text-center text-xs text-[#9CA3AF]">
                أو راسلنا مباشرة على{" "}
                <a href="mailto:info@mtuaefans.sbs" className="text-[#CC0000] font-bold hover:underline">
                  info@mtuaefans.sbs
                </a>
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-black text-[#111827] mb-2">أسئلة شائعة</h2>
            <p className="text-[#6B7280] text-sm">إجابات على أكثر الأسئلة شيوعاً حول التواصل معنا</p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-[#E5E7EB] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-right bg-white hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="font-bold text-[#111827] text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="text-[#CC0000] shrink-0" />
                    : <ChevronDown size={18} className="text-[#9CA3AF] shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 bg-[#FAFAFA] text-[#6B7280] text-sm leading-relaxed border-t border-[#E5E7EB]">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-l from-[#7C0000] to-[#CC0000] rounded-3xl p-10 text-center text-white"
          >
            <MessageCircle size={40} className="mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-black mb-2">جاهز للبدء؟</h3>
            <p className="text-white/75 mb-6 text-sm">استشارتك الأولى مجانية — دون أي التزام</p>
            <a
              href="https://wa.me/971551981564?text=مرحباً، أريد استشارة مجانية عن خدماتكم"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#CC0000] font-black px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-lg text-base"
            >
              <FaWhatsapp size={20} />
              ابدأ استشارتك المجانية
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
