import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Bot,
  Stethoscope,
  Building2,
  ArrowLeft,
  Play,
  BarChart3,
  CalendarCheck,
  MessageSquareText,
  Home,
  Users,
  FileText,
  TrendingUp,
  Bell,
  Map,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { cn } from "@workspace/dubai-fans-ds/lib/utils";

/* ── Product definitions ─────────────────────────────────────────────── */
const products = [
  {
    id: "ai-os",
    href: "/ai-business-os",
    label: "AI Business OS",
    tagline: "منصة ذكاء اصطناعي للأعمال",
    desc: "حلّل موقعك، حملاتك، وحساباتك على السوشيال ميديا بالذكاء الاصطناعي — واحصل على خطة نمو فورية تحسّن مبيعاتك.",
    features: [
      "تحليل شامل للموقع والحملات",
      "تقرير SEO آني بالذكاء الاصطناعي",
      "خطة نمو 90 يوم",
      "مساعد AI للأعمال",
    ],
    featureIcons: [BarChart3, TrendingUp, CalendarCheck, MessageSquareText],
    // Product-specific brand colors (not DS tokens — intentional per-product identity)
    color: "#7C3AED",
    colorAlpha12: "rgba(124,58,237,0.12)",
    colorAlpha33: "rgba(124,58,237,0.33)",
    glowAlpha20: "rgba(124,58,237,0.20)",
    Icon: Bot,
    badge: "AI Platform",
  },
  {
    id: "clinic-os",
    href: "/projects/clinic-os",
    label: "Clinic OS",
    tagline: "نظام إدارة ذكي للعيادات",
    desc: "نظام SaaS متكامل لإدارة المواعيد، المرضى، الفواتير، وفريق عملك — مصمم خصيصاً للعيادات الخليجية.",
    features: [
      "جدولة المواعيد الذكية",
      "سجلات المرضى الإلكترونية",
      "الفواتير والتقارير",
      "إشعارات SMS تلقائية",
    ],
    featureIcons: [CalendarCheck, FileText, TrendingUp, Bell],
    color: "#0EA5E9",
    colorAlpha12: "rgba(14,165,233,0.12)",
    colorAlpha33: "rgba(14,165,233,0.33)",
    glowAlpha20: "rgba(14,165,233,0.20)",
    Icon: Stethoscope,
    badge: "Healthcare SaaS",
  },
  {
    id: "amlak-os",
    href: "/projects/amlak-os",
    label: "AMLAK OS",
    tagline: "نظام SaaS لإدارة العقارات",
    desc: "منصة عقارية ذكية لإدارة العقارات، العملاء، والعقود — مع خريطة تفاعلية وتقارير استثمارية فورية.",
    features: [
      "إدارة العقارات والوحدات",
      "خريطة تفاعلية للعقارات",
      "إدارة العملاء والعقود",
      "تقارير الأداء الاستثماري",
    ],
    featureIcons: [Home, Map, Users, TrendingUp],
    color: "#10B981",
    colorAlpha12: "rgba(16,185,129,0.12)",
    colorAlpha33: "rgba(16,185,129,0.33)",
    glowAlpha20: "rgba(16,185,129,0.20)",
    Icon: Building2,
    badge: "Real Estate SaaS",
  },
];

type Product = (typeof products)[0];
function TiltCard({
  product,
  onDemoRequest,
}: {
  product: Product;
  onDemoRequest: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const { Icon, color, colorAlpha12, colorAlpha33, glowAlpha20, badge } = product;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isMobile ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={isMobile ? { scale: 0.97 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative group cursor-default select-none h-full"
    >
      {/* Soft glow — uses DS ambient-purple animation pattern */}
      <div
        className="absolute inset-0 rounded-[var(--radius-xl)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110 ambient-purple"
        style={{ background: glowAlpha20 }}
      />

      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-[var(--radius-xl)] opacity-30 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, transparent 60%)`,
          padding: "1.5px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card body — DS glass-dark + card-premium */}
      <div
        className={cn(
          "glass-dark card-premium rounded-[var(--radius-xl)] p-7 h-full flex flex-col gap-5 overflow-hidden",
          "group-hover:border-white/20 transition-colors duration-300",
        )}
        style={{
          background: `linear-gradient(135deg, ${colorAlpha12} 0%, rgba(15,12,32,0.82) 100%)`,
        }}
      >
        {/* Badge + icon row */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{
              background: colorAlpha12,
              color,
              borderColor: colorAlpha33,
            }}
          >
            {badge}
          </span>

          <motion.div
            className="icon-hover w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            <Icon size={22} className="text-white" />
          </motion.div>
        </div>

        {/* Title + tagline */}
        <div className="relative z-10">
          <h3
            className="text-[22px] font-extrabold text-white leading-tight tracking-tight"
            dir="ltr"
          >
            {product.label}
          </h3>
          <p className="text-[13px] mt-0.5 font-medium" style={{ color }}>
            {product.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="relative z-10 text-sm text-white/65 leading-relaxed" dir="rtl">
          {product.desc}
        </p>

        {/* Feature list */}
        <ul className="relative z-10 flex flex-col gap-2 mt-1" dir="rtl">
          {product.features.map((feat, i) => {
            const FeatIcon = product.featureIcons[i];
            return (
              <li key={i} className="flex items-center gap-2.5 text-[13px] text-white/75">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: colorAlpha12, color }}
                >
                  <FeatIcon size={11} />
                </span>
                {feat}
              </li>
            );
          })}
        </ul>

        {/* CTA buttons */}
        <div className="relative z-10 flex gap-2.5 mt-auto pt-4" dir="rtl">
          {/* Demo → opens modal */}
          <Button
            className="btn-premium flex items-center gap-1.5 text-[13px] font-bold text-white border-0"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
              boxShadow: `0 4px 18px ${colorAlpha33}`,
            }}
            onClick={onDemoRequest}
          >
            <Play size={13} />
            Demo
          </Button>

          {/* "Learn more" → navigate */}
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 text-[13px] font-semibold border transition-colors duration-200"
            style={{
              color,
              borderColor: colorAlpha33,
              background: colorAlpha12,
            }}
            onClick={() => navigate(product.href)}
          >
            اعرف أكثر
            <ArrowLeft size={13} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */
export function ProductsSection() {
  const isMobile = useIsMobile();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <section
      className="relative py-24 overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(180deg, #0A0A14 0%, #0D0D1A 100%)" }}
    >
      {/* Ambient orbs — DS blob-drift + ambient-purple pattern */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ambient-purple"
        style={{ background: "rgba(124,58,237,0.12)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ambient-purple"
        style={{ background: "rgba(14,165,233,0.10)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none ambient-purple"
        style={{ background: "rgba(16,185,129,0.08)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.22em] uppercase text-[#CC0000] mb-4 px-4 py-1.5 rounded-full bg-[#CC000015] border border-[#CC000030]">
            منتجاتنا البرمجية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            حلولنا{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #7C3AED 0%, #0EA5E9 100%)",
              }}
            >
              البرمجية الذكية
            </span>
          </h2>
          <p className="mt-4 text-base text-white/55 max-w-xl mx-auto leading-relaxed">
            منصات SaaS متكاملة تدير أعمالك، عيادتك، أو محفظتك العقارية — بالذكاء الاصطناعي وتجربة استخدام استثنائية.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          style={isMobile ? undefined : { perspective: "1200px" }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="flex"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <TiltCard
                product={product}
                onDemoRequest={() => setActiveProduct(product)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo request modal */}
      <AnimatePresence>
        {activeProduct && (
          <DemoModal
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function DemoModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { color, colorAlpha12, colorAlpha33, Icon, label } = product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/demo-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({ product: product.id, name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
      } else {
        setErrorMsg(data.error ?? "حدث خطأ — يرجى المحاولة مجدداً");
        setState("error");
      }
    } catch {
      setErrorMsg("تعذّر الاتصال — يرجى التحقق من الاتصال والمحاولة مجدداً");
      setState("error");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Dialog */}
      <motion.div
        className="relative w-full max-w-md rounded-[var(--radius-xl)] overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0F0C20 0%, #0D0D1A 100%)" }}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        dir="rtl"
      >
        {/* Gradient border top */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}66 100%)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
            >
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-white leading-tight" dir="ltr">
                {label}
              </h2>
              <p className="text-[12px] text-white/50 mt-0.5">طلب تجربة مجانية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {state === "success" ? (
            <motion.div
              className="flex flex-col items-center gap-3 py-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ background: colorAlpha12, border: `2px solid ${colorAlpha33}` }}
              >
                <CheckCircle2 size={32} style={{ color }} />
              </div>
              <h3 className="text-[18px] font-bold text-white">تم إرسال طلبك!</h3>
              <p className="text-sm text-white/60 max-w-xs leading-relaxed">
                سيتواصل معك فريقنا خلال 24 ساعة لتحديد موعد التجربة.
              </p>
              <Button
                className="mt-4 text-[13px] font-semibold border"
                style={{ color, borderColor: colorAlpha33, background: colorAlpha12 }}
                onClick={onClose}
              >
                إغلاق
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-[13px] text-white/55 leading-relaxed -mt-1">
                أدخل بياناتك وسيتواصل معك فريقنا لترتيب عرض توضيحي مخصص.
              </p>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-white/70">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className={cn(
                    "w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[14px] text-white placeholder-white/30",
                    "bg-white/5 border border-white/10 focus:border-white/25 focus:outline-none transition-colors",
                  )}
                  disabled={state === "loading"}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-white/70">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  dir="ltr"
                  className={cn(
                    "w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[14px] text-white placeholder-white/30",
                    "bg-white/5 border border-white/10 focus:border-white/25 focus:outline-none transition-colors",
                  )}
                  disabled={state === "loading"}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-white/70">
                  رسالة إضافية <span className="text-white/35">(اختياري)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="أخبرنا عن نشاطك التجاري أو أي تساؤلات لديك…"
                  className={cn(
                    "w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[14px] text-white placeholder-white/30 resize-none",
                    "bg-white/5 border border-white/10 focus:border-white/25 focus:outline-none transition-colors",
                  )}
                  disabled={state === "loading"}
                />
              </div>

              {/* Error */}
              {state === "error" && errorMsg && (
                <p className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-md)] px-3 py-2">
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={state === "loading"}
                className="btn-premium mt-1 flex items-center justify-center gap-2 text-[14px] font-bold text-white border-0 py-3"
                style={{
                  background: state === "loading"
                    ? `${color}88`
                    : `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
                  boxShadow: `0 4px 18px ${colorAlpha33}`,
                }}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    جاري الإرسال…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    أرسل طلب التجربة
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

type ModalState = "idle" | "loading" | "success" | "error";
