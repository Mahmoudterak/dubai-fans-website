import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, BarChart3 } from "lucide-react";

const slides = [
  {
    badge: "✨ AI Business Platform",
    title: "🚀 اكتشف لماذا",
    titleHighlight: "لا ينمو نشاطك التجاري",
    desc: "حلّل موقعك الإلكتروني، وحسابات التواصل الاجتماعي، وحملاتك التسويقية باستخدام الذكاء الاصطناعي، واحصل على تقرير احترافي يكشف نقاط القوة والضعف، مع خطة نمو عملية لزيادة العملاء والمبيعات.",
    image: "/hero-marketing.webp",
    cta: "🔍 ابدأ تحليل نشاطك مجانًا",
    stat1: { label: "نمو المبيعات", value: "+248%" },
    stat2: { label: "عملاء راضون", value: "+1.2K" },
  },
  {
    badge: "إدارة الحملات الإعلانية",
    title: "إعلانات تستهدف",
    titleHighlight: "المشترين الحقيقيين.",
    desc: "نطلق حملات إعلانية مدروسة على فيسبوك وإنستغرام وتيك توك وجوجل وسناب شات — بميزانية ذكية وتحسين يومي لرفع جودة العملاء المحتملين.",
    image: "/ads-campaigns.webp",
    cta: "اطلب إدارة حملاتك",
    ctaHref: "/service-inquiry/campaigns",
    stat1: { label: "حملة مُدارة", value: "+500" },
    stat2: { label: "معدل النجاح", value: "92%" },
  },
  {
    badge: "تصميم المواقع والسيو",
    title: "موقعك أصل تجاري",
    titleHighlight: "يعمل 24/7.",
    desc: "نبني مواقع إلكترونية احترافية مع SEO شامل — مصممة لتحويل الزوار إلى عملاء، ظهور قوي في جوجل، وتجربة مستخدم تعكس قيمة علامتك التجارية.",
    image: "/website-seo.webp",
    cta: "اطلب موقعك الآن",
    ctaHref: "/service-inquiry/websites",
    stat1: { label: "موقع مُنجز", value: "+200" },
    stat2: { label: "ظهور في جوجل", value: "TOP 3" },
  },
];

/* ── Floating shapes config ─────────────────────────────────────── */
const shapes = [
  { size: 80,  top: "12%",  right: "8%",   color: "#CC0000", opacity: 0.08, cls: "float-slow",  delay: "0s",   borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
  { size: 56,  top: "68%",  right: "18%",  color: "#7C3AED", opacity: 0.10, cls: "float-mid",   delay: "1.2s", borderRadius: "50%" },
  { size: 96,  top: "30%",  left:  "4%",   color: "#F0B429", opacity: 0.07, cls: "float-fast",  delay: "0.6s", borderRadius: "50% 20% 50% 20%" },
  { size: 44,  top: "78%",  left:  "10%",  color: "#CC0000", opacity: 0.09, cls: "float-mid",   delay: "2s",   borderRadius: "50%" },
  { size: 120, top: "50%",  right: "2%",   color: "#6366F1", opacity: 0.06, cls: "float-slow",  delay: "1.8s", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [mouse, setMouse]     = useState({ x: 0, y: 0 });
  const sectionRef            = useRef<HTMLElement>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  /* Mouse parallax — track cursor relative to section */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handler = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,   // –1 → +1
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      });
    };
    section.addEventListener("mousemove", handler, { passive: true });
    return () => section.removeEventListener("mousemove", handler);
  }, []);

  const slide = slides[current];

  /* Parallax helpers */
  const px = (factor: number) => `${mouse.x * factor}px`;
  const py = (factor: number) => `${mouse.y * factor}px`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#FAFAFA] pt-24 md:pt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setMouse({ x: 0, y: 0 }); }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-100 z-0 pointer-events-none" />

      {/* Ambient glow blobs — parallax reactive */}
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#CC0000]/10 rounded-full blur-[120px] z-0 pointer-events-none ambient-red"
        style={{ transform: `translate(${px(12)}, ${py(10)})`, transition: "transform 0.6s ease-out" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#F0B429]/6 rounded-full blur-[100px] z-0 pointer-events-none"
        style={{ transform: `translate(${px(-8)}, ${py(-6)})`, transition: "transform 0.6s ease-out" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[100px] z-0 pointer-events-none ambient-purple"
        style={{ transform: `translate(calc(-50% + ${px(6)}), calc(-50% + ${py(4)}))`, transition: "transform 0.6s ease-out" }}
      />

      {/* Floating decorative shapes */}
      {shapes.map((s, i) => (
        <div
          key={i}
          className={`absolute z-0 pointer-events-none ${s.cls}`}
          style={{
            width: s.size, height: s.size,
            top: s.top, right: (s as any).right, left: (s as any).left,
            background: s.color,
            opacity: s.opacity,
            borderRadius: s.borderRadius,
            animationDelay: s.delay,
            transform: `translate(${px(6 * (i % 2 === 0 ? 1 : -1))}, ${py(4 * (i % 2 === 0 ? 1 : -1))})`,
            transition: "transform 0.7s ease-out",
          }}
        />
      ))}

      {/* Slide content */}
      <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-16">

        {/* Text side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-right flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#CC0000] animate-pulse" />
              <span className="text-[#9CA3AF] font-semibold text-sm">{slide.badge}</span>
            </motion.div>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-[#111827] leading-[1.1] mb-4 tracking-tight">
              {slide.title}
              <br />
              <span className="gradient-text">{slide.titleHighlight}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base lg:text-lg text-[#9CA3AF] mb-8 max-w-xl leading-relaxed"
            >
              {slide.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-wrap gap-3 w-full sm:w-auto"
            >
              {current === 0 ? (
                <>
                  <Link
                    href="/ai-business-audit"
                    className="btn-premium flex items-center justify-center gap-2 px-7 py-3.5 bg-[#CC0000] text-white rounded-xl font-bold text-base w-full sm:w-auto"
                  >
                    <Search size={18} />
                    ابدأ تحليل نشاطك مجانًا
                  </Link>
                  <Link
                    href="/ai-business-audit?sample=1"
                    className="btn-premium flex items-center justify-center gap-2 px-7 py-3.5 border border-[#D1D5DB] text-[#374151] rounded-xl font-bold text-base hover:border-[#CC0000]/50 hover:bg-[#CC0000]/5 transition-colors w-full sm:w-auto"
                  >
                    <BarChart3 size={18} />
                    شاهد نموذج التقرير
                  </Link>
                </>
              ) : (
                <>
                  {"ctaHref" in slide && slide.ctaHref ? (
                    <Link
                      href={slide.ctaHref}
                      className="btn-premium flex items-center justify-center gap-2 px-7 py-3.5 bg-[#CC0000] text-white rounded-xl font-bold text-base w-full sm:w-auto"
                    >
                      {slide.cta}
                      <ArrowLeft size={18} />
                    </Link>
                  ) : (
                    <a
                      href="https://wa.me/971551981564"
                      target="_blank" rel="noopener noreferrer"
                      className="btn-premium flex items-center justify-center gap-2 px-7 py-3.5 bg-[#CC0000] text-white rounded-xl font-bold text-base w-full sm:w-auto"
                    >
                      <FaWhatsapp size={18} />
                      {slide.cta}
                    </a>
                  )}
                  <a
                    href="#services"
                    className="btn-premium flex items-center justify-center gap-2 px-7 py-3.5 border border-[#D1D5DB] text-[#374151] rounded-xl font-bold text-base hover:border-[#CC0000]/50 hover:bg-[#CC0000]/5 transition-colors w-full sm:w-auto"
                  >
                    استكشف خدماتنا
                    <ArrowLeft size={18} />
                  </a>
                </>
              )}
            </motion.div>

            {/* Stats — glass premium */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex items-center gap-6 mt-10"
            >
              <div className="glass-premium rounded-2xl px-5 py-3 text-center card-premium">
                <div className="text-2xl font-black text-[#CC0000]">{slide.stat1.value}</div>
                <div className="text-xs text-[#9CA3AF] font-semibold mt-0.5">{slide.stat1.label}</div>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]" />
              <div className="glass-premium rounded-2xl px-5 py-3 text-center card-premium">
                <div className="text-2xl font-black text-[#F0B429]">{slide.stat2.value}</div>
                <div className="text-xs text-[#9CA3AF] font-semibold mt-0.5">{slide.stat2.label}</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Image side — parallax tilt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${current}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:flex items-center justify-center h-[520px]"
            style={{
              transform: `perspective(1000px) rotateY(${mouse.x * -3}deg) rotateX(${mouse.y * 2}deg) translateZ(0)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070F] via-transparent to-transparent z-10" />
            <div className="relative rounded-3xl overflow-hidden border border-[#CC0000]/20 shadow-[0_0_60px_rgba(124,58,237,0.15)] w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain object-center"
                width={760} height={520}
                loading={current === 0 ? "eager" : "lazy"}
                fetchPriority={current === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070F]/60 via-transparent to-transparent" />
            </div>

            {/* Corner glow accents */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#CC0000]/15 rounded-full blur-xl pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6]/80 backdrop-blur-sm flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000] hover:bg-[#CC0000] transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>

        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-[#CC0000]" : "w-2 bg-[#E5E7EB] hover:bg-[#CC0000]/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6]/80 backdrop-blur-sm flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000] hover:bg-[#CC0000] transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </section>
  );
}
