import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Mic, MessageSquare, Pill, User, CalendarCheck,
  DollarSign, BarChart3, Package, CheckCircle, ArrowLeft, Stethoscope, Sparkles,
  LogIn, ChevronDown, ShieldCheck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const BASE = "https://mtuaefans.com";

const features = [
  {
    icon: Mic,
    title: "الإدخال الصوتي والذكاء اللغوي",
    desc: "إدخال البيانات بسهولة عبر الصوت أو الكتابة باللهجة العامية، مع فهم ذكي للأوامر.",
    color: "#6366F1",
  },
  {
    icon: MessageSquare,
    title: "تكامل واتساب المتقدم",
    desc: "إرسال رسائل أوتوماتيكية وتفاعلية للمرضى، تذكيرات، وعروض — بدون أي تدخل يدوي.",
    color: "#22C55E",
  },
  {
    icon: Pill,
    title: "الروشتة الإلكترونية الذكية",
    desc: "نظام وصف دوائي بالذكاء الاصطناعي لتحسين الدقة والسرعة وتقليل أخطاء الأدوية.",
    color: "#0EA5E9",
  },
  {
    icon: User,
    title: "ملف المريض الذكي",
    desc: "سجل طبي وإداري شامل يحتوي على مساعد ذكي يلخص التاريخ المرضي فورياً.",
    color: "#8B5CF6",
  },
  {
    icon: CalendarCheck,
    title: "الحجز الإلكتروني",
    desc: "واجهة حجز مخصصة وقابلة للتحكم الكامل من داخل النظام مع تأكيد فوري للمرضى.",
    color: "#F59E0B",
  },
  {
    icon: DollarSign,
    title: "الحسابات والماليات",
    desc: "وحدة مالية شاملة للرواتب، المصروفات، والإيرادات مع تقارير لحظية دقيقة.",
    color: "#10B981",
  },
  {
    icon: BarChart3,
    title: "التقارير والتحليلات",
    desc: "تقارير شاملة ومؤشرات أداء لقياس نمو العيادة واتخاذ قرارات مبنية على البيانات.",
    color: "#CC0000",
  },
  {
    icon: Package,
    title: "إدارة المنتجات والمخزون",
    desc: "نظام مخزون متكامل لمتابعة المواد الطبية والاستهلاك والمبيعات لحظة بلحظة.",
    color: "#0891B2",
  },
];

const screens = [
  { src: "/portfolio/clinic-os/dashboard.jpg",        label: "لوحة التحكم الرئيسية" },
  { src: "/portfolio/clinic-os/doctor-dashboard.jpg", label: "لوحة تحكم الطبيب" },
  { src: "/portfolio/clinic-os/patient-file.jpg",     label: "ملف المريض الذكي" },
  { src: "/portfolio/clinic-os/users.jpg",            label: "إدارة المستخدمين" },
  { src: "/portfolio/clinic-os/settings.jpg",         label: "الإعدادات" },
  { src: "/portfolio/clinic-os/login.jpg",            label: "صفحة تسجيل الدخول" },
];

const highlights = [
  { value: "247+", label: "مريض مُدار" },
  { value: "18",   label: "موعد يومياً" },
  { value: "100%", label: "رقمي بالكامل" },
  { value: "24/7", label: "دعم فني" },
];

const whyList = [
  "مصمم خصيصاً لعيادات الإمارات والعالم العربي",
  "يدعم العربية والإنجليزية بشكل كامل",
  "الإدخال الصوتي باللهجة العامية — لا حاجة للكتابة",
  "تكامل مباشر مع واتساب لتذكير المرضى تلقائياً",
  "ذكاء اصطناعي في كل خطوة — الروشتة والتشخيص والملفات",
  "سحابي 100% — يعمل من أي جهاز وأي مكان",
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
};

function AdminLoginDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-indigo-400/40 bg-indigo-500/10 text-indigo-200 font-bold text-base hover:bg-indigo-500/20 transition-all duration-200"
      >
        <ShieldCheck size={16} />
        دخول المدير
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0D1B2A] shadow-2xl shadow-black/60 z-50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/10">
            <p className="text-slate-400 text-xs">نظام Clinic OS</p>
          </div>
          <a
            href="https://elite-architect-amlakosuae.replit.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-white text-sm font-semibold hover:bg-indigo-500/20 transition-colors"
            onClick={() => setOpen(false)}
          >
            <LogIn size={15} className="text-indigo-400" />
            تسجيل دخول المدير
          </a>
        </div>
      )}
    </div>
  );
}

export default function ClinicOSPage() {
  return (
    <>
      <SEOHead
        title="Clinic OS — نظام ذكي لإدارة العيادات | دبي فانز"
        description="Clinic OS نظام متكامل لإدارة العيادات مدعوم بالذكاء الاصطناعي — إدخال صوتي، واتساب، روشتة ذكية، ملف المريض، الحجز، الحسابات، والمخزون."
        keywords="Clinic OS, نظام إدارة عيادات, برنامج عيادة ذكي, إدارة مواعيد, ملف مريض إلكتروني, روشتة ذكية"
        canonical={`${BASE}/projects/clinic-os`}
        ogImage={`${BASE}/portfolio/clinic-os/dashboard.jpg`}
        ogType="article"
      />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        dir="rtl"
        className="relative pt-28 pb-20 px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1a2744 55%, #0D1B2A 100%)" }}
      >
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Back */}
          <motion.div initial="hidden" animate="show" custom={0} variants={fade} className="mb-8">
            <Link href="/projects">
              <span className="inline-flex items-center gap-2 text-indigo-300 text-sm hover:text-white transition-colors">
                <ArrowLeft size={15} className="rotate-180" />
                العودة إلى أعمالنا
              </span>
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Text */}
            <div className="flex-1">
              <motion.div initial="hidden" animate="show" custom={0.05} variants={fade} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles size={12} />
                  ✨ الجيل الجديد من إدارة العيادات
                </span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="show" custom={0.1} variants={fade}
                className="text-5xl sm:text-6xl font-black text-white mb-2 tracking-tight"
              >
                Clinic OS
              </motion.h1>
              <motion.p
                initial="hidden" animate="show" custom={0.14} variants={fade}
                className="text-indigo-300 text-lg font-semibold mb-4"
              >
                إدارة عيادتك أصبحت أسرع، أذكى، وأسهل.
              </motion.p>
              <motion.p
                initial="hidden" animate="show" custom={0.18} variants={fade}
                className="text-slate-300 text-base leading-relaxed mb-8 max-w-xl"
              >
                يجمع بين إدارة العيادة، الإدخال الصوتي، المساعد الذكي لملف المريض، وأتمتة واتساب في نظام واحد — مصمم لتبسيط العمل اليومي للأطباء والإداريين.
              </motion.p>

              <motion.div
                initial="hidden" animate="show" custom={0.22} variants={fade}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href="https://wa.me/971551981564?text=أريد معرفة المزيد عن نظام Clinic OS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-base transition-all duration-200 shadow-lg shadow-green-900/30 hover:-translate-y-0.5"
                >
                  <FaWhatsapp size={18} />
                  احجز عرضاً تجريبياً
                </a>
                <a
                  href="https://wa.me/971551981564?text=استفسار عن Clinic OS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all duration-200"
                >
                  <Stethoscope size={16} />
                  تواصل معنا
                </a>
                <AdminLoginDropdown />
              </motion.div>
            </div>

            {/* Hero screenshot */}
            <motion.div
              initial="hidden" animate="show" custom={0.2} variants={fade}
              className="w-full lg:w-[480px] shrink-0"
            >
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/40">
                <img
                  src="/portfolio/clinic-os/dashboard.jpg"
                  alt="لوحة تحكم Clinic OS"
                  className="w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section dir="rtl" className="py-10 border-b border-white/5" style={{ background: "#0D1B2A" }}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {highlights.map((h, i) => (
            <motion.div key={h.label} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.07} variants={fade}>
              <p className="text-3xl font-black text-indigo-400">{h.value}</p>
              <p className="text-sm text-slate-400 mt-1">{h.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section dir="rtl" className="py-20 px-4" style={{ background: "#0D1B2A" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-500/25 mb-4">
              مميزات النظام
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              اكتشف كيف يحوّل Clinic OS عيادتك
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              إلى مؤسسة ذكية متكاملة تعمل بأقل جهد وأعلى كفاءة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-30px" }} custom={i * 0.06} variants={fade}
                className="rounded-2xl p-5 border border-white/8 hover:border-indigo-500/40 transition-all duration-300 group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}35` }}
                >
                  <f.icon size={19} style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-black text-sm mb-2 leading-snug">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Screenshots gallery ───────────────────────────────────────── */}
      <section dir="rtl" className="py-16 px-4" style={{ background: "#0A1220" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">من داخل النظام</h2>
            <p className="text-slate-400 text-sm">لقطات حقيقية من واجهة Clinic OS</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {screens.map((s, i) => (
              <motion.div
                key={s.src}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-30px" }} custom={i * 0.07} variants={fade}
                className="group rounded-xl overflow-hidden border border-white/8 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={s.src}
                    alt={s.label}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-bold">{s.label}</span>
                  </div>
                </div>
                <div className="px-3 py-2 text-xs text-slate-400 font-medium" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────────────── */}
      <section dir="rtl" className="py-16 px-4" style={{ background: "#0D1B2A" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade}
            className="rounded-2xl p-8 sm:p-12 border border-indigo-500/20"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(14,165,233,0.08) 100%)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">لماذا Clinic OS؟</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyList.map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.07} variants={fade}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        dir="rtl"
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #1a2744 0%, #0D1B2A 100%)" }}
      >
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade} className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">جاهز لتحويل عيادتك إلى عيادة ذكية؟</h2>
          <p className="text-slate-400 text-sm mb-8">تواصل معنا الآن لحجز عرض تجريبي مجاني</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/971551981564?text=أريد عرض تجريبي لنظام Clinic OS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-base transition-all shadow-lg shadow-green-900/30 hover:-translate-y-0.5"
            >
              <FaWhatsapp size={18} />
              احجز عرضاً تجريبياً
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
