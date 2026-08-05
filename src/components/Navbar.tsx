import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import {
  Menu, X, Phone, Clock, ChevronDown, Globe,
  LayoutGrid, LogIn, UserPlus, LayoutDashboard, BarChart3,
  GraduationCap, Briefcase, Rocket, Bot, Smartphone,
  Palette, Cloud, TrendingUp, Code2, ShieldCheck, Zap,
  BookOpen, Store as StoreIcon, Wrench, Users, Mail,
  Building2, LineChart,
} from "lucide-react";
import { SeoReportModal } from "@/components/SeoReportModal";

/* ── Data ──────────────────────────────────────────────────────────── */

const solutionsDropdown = [
  { href: "/ai-business-os",        icon: Bot,       label: "AI Business OS",  sub: "منصة ذكاء اصطناعي للأعمال",   color: "#7C3AED" },
  { href: "/projects/clinic-os",    icon: Building2, label: "Clinic OS",       sub: "نظام إدارة ذكي للعيادات",     color: "#0EA5E9" },
  { href: "/projects/amlak-os",     icon: LineChart,  label: "AMLAK OS",        sub: "نظام SaaS لإدارة العقارات",   color: "#10B981" },
  { href: "/ai-business-os/tools",  icon: Wrench,    label: "أدوات مجانية",    sub: "أدوات AI وSEO مجانية",        color: "#7C3AED" },
];

const megaMenuCategories = [
  {
    title: "التسويق الرقمي",
    icon: TrendingUp,
    color: "#CC0000",
    items: ["Meta Ads", "Google Ads", "TikTok Ads", "Snapchat Ads", "SEO", "Social Media", "Content Marketing", "Email Marketing"],
  },
  {
    title: "تطوير البرمجيات",
    icon: Code2,
    color: "#7C3AED",
    items: ["Business Websites", "Landing Pages", "E-Commerce", "نماذج مواقع ومتاجر", "ERP Systems", "CRM Systems", "Admin Panels", "Custom Platforms", "API Integration"],
  },
  {
    title: "الذكاء الاصطناعي",
    icon: Bot,
    color: "#0EA5E9",
    items: ["AI Assistants", "AI Chatbots", "Business Automation", "Workflow Automation", "AI Integrations", "AI Content"],
  },
  {
    title: "تطبيقات الجوال",
    icon: Smartphone,
    color: "#10B981",
    items: ["Android", "iOS", "Flutter", "React Native", "Progressive Web Apps"],
  },
  {
    title: "الهوية والتصميم",
    icon: Palette,
    color: "#F59E0B",
    items: ["Brand Identity", "Logo Design", "UI/UX", "Graphic Design", "Motion Graphics"],
  },
  {
    title: "الاستضافة والسحابة",
    icon: Cloud,
    color: "#6366F1",
    items: ["Hosting", "Cloud Deployment", "Business Email", "Maintenance", "Domain Registration"],
  },
];

const studentDropdown = [
  { href: "/student/login",     icon: LogIn,           label: "تسجيل الدخول",     sub: "ادخل إلى حسابك" },
  { href: "/student/register",  icon: UserPlus,        label: "إنشاء حساب",       sub: "سجّل كطالب جديد" },
  { href: "/student/dashboard", icon: LayoutDashboard, label: "لوحة تحكم الطالب", sub: "كورساتك وتقدمك" },
];

const clientsDropdown = [
  { href: "/company/login", icon: BarChart3, label: "تقارير الأداء", sub: "بوابة تقارير عملاء دبي فانز" },
];

const projectsDropdown = [
  { href: "/projects",                   icon: LayoutGrid, label: "جميع الأعمال",          sub: "استعرض كل مشاريعنا" },
  { href: "/projects/sameday-dental",    icon: Briefcase,  label: "زراعة الأسنان",          sub: "SameDay Dental — دراسة حالة", logo: "/sameday-dental-logo.jpg" },
  { href: "/projects/health-factory",    icon: Briefcase,  label: "مصنع صحي",               sub: "Health Factory — ROI 7.6×",   logo: "/health-factory-logo.jpg" },
  { href: "/projects/media-coverage",    icon: Briefcase,  label: "الصحف والمجلات",          sub: "Meta · LinkedIn · Pinterest" },
  { href: "/projects/amlak-os",          icon: Briefcase,  label: "AMLAK OS",                sub: "نظام SaaS لإدارة العقارات" },
  { href: "/projects/clinic-os",         icon: Briefcase,  label: "Clinic OS",               sub: "نظام ذكي لإدارة العيادات" },
];

type MobileSection = "solutions" | "services" | "portfolio" | "student" | "clients" | null;

/* ── Component ─────────────────────────────────────────────────────── */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Desktop dropdown states
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);

  // Mobile accordion
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);

  // Mega menu hover intent (keep open while hovering panel)
  const servicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [location] = useLocation();

  const solutionsRef = useRef<HTMLDivElement>(null);
  const servicesRef  = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const studentRef   = useRef<HTMLDivElement>(null);
  const clientsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close all on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) setSolutionsOpen(false);
      if (servicesRef.current  && !servicesRef.current.contains(e.target as Node))  setServicesOpen(false);
      if (portfolioRef.current && !portfolioRef.current.contains(e.target as Node)) setPortfolioOpen(false);
      if (studentRef.current   && !studentRef.current.contains(e.target as Node))   setStudentOpen(false);
      if (clientsRef.current   && !clientsRef.current.contains(e.target as Node))   setClientsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSolutionsOpen(false); setServicesOpen(false);
      setPortfolioOpen(false); setStudentOpen(false); setClientsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => {
    setSolutionsOpen(false); setServicesOpen(false);
    setPortfolioOpen(false); setStudentOpen(false); setClientsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  // Mega menu hover helpers (delay close to allow panel hover)
  const openServices  = () => { if (servicesTimer.current) clearTimeout(servicesTimer.current); closeAll(); setServicesOpen(true); };
  const closeServices = () => { servicesTimer.current = setTimeout(() => setServicesOpen(false), 150); };
  const keepServices  = () => { if (servicesTimer.current) clearTimeout(servicesTimer.current); };

  /* ── Simple dropdown helper ───────────────────────────────────────── */
  function SimpleDropdown({
    label, icon: Icon, href, refEl, isOpen, setIsOpen, children, active,
  }: {
    label: string; icon: React.ElementType; href?: string; refEl: React.RefObject<HTMLDivElement | null>;
    isOpen: boolean; setIsOpen: (v: boolean) => void; children: React.ReactNode; active?: boolean;
  }) {
    return (
      <div
        ref={refEl}
        className="relative"
        onMouseEnter={() => { closeAll(); setIsOpen(true); }}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => { const was = isOpen; closeAll(); setIsOpen(!was); }}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            active ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
          }`}
        >
          <Icon size={15} className={active ? "text-[#CC0000]" : "text-[#CC0000]"} />
          {label}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden z-50 py-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <SeoReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />

      <header className="fixed top-0 right-0 left-0 z-50">

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="bg-[#111827] text-white text-sm hidden md:block">
          <div className="container mx-auto px-6 flex items-center justify-between py-1.5">
            <div className="flex items-center gap-6">
              <a href="tel:+971551981564" className="flex items-center gap-1.5 hover:text-[#F0B429] transition-colors">
                <Phone size={13} />
                <span className="font-bold tracking-wide">+971 55 198 1564</span>
              </a>
              <span className="flex items-center gap-1.5 text-white/80">
                <Clock size={13} />
                <span>السبت – الخميس: 9:00 صباحاً – 11:00 مساءً</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/mtuaefans" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B429] transition-colors"><FaInstagram size={14} /></a>
              <a href="https://www.facebook.com/mtuaefans"  target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B429] transition-colors"><FaFacebook  size={14} /></a>
              <a href="https://www.tiktok.com/@mtuaefans"   target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B429] transition-colors"><FaTiktok    size={14} /></a>
              <a href="https://wa.me/971551981564"           target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B429] transition-colors"><FaWhatsapp  size={14} /></a>
            </div>
          </div>
        </div>

        {/* ── Main nav ─────────────────────────────────────────────── */}
        <nav className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#FAFAFA]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.12)] border-b border-[#E5E7EB]"
            : "bg-[#FAFAFA]/85 backdrop-blur-lg"
        }`}>
          <div className="container mx-auto px-6 flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CC0000] to-[#B00000] flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-[0_0_20px_rgba(204,0,0,0.4)] transition-shadow duration-300">
                د
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl text-[#111827] tracking-tight">دبي <span className="text-[#CC0000]">فانز</span></span>
                <span className="text-[10px] text-[#9CA3AF] font-medium tracking-wider">DUBAI FANS</span>
              </div>
            </Link>

            {/* ── Desktop links ───────────────────────────────────── */}
            <div className="hidden xl:flex items-center gap-0.5">

              {/* Home */}
              <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive("/") && location === "/" ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"}`}>
                الرئيسية
              </Link>

              {/* Solutions ▼ */}
              <SimpleDropdown
                label="حلولنا" icon={Rocket}
                refEl={solutionsRef} isOpen={solutionsOpen} setIsOpen={setSolutionsOpen}
                active={solutionsOpen || location.startsWith("/ai-business-os") || location.startsWith("/projects/clinic-os") || location.startsWith("/projects/amlak-os")}
              >
                {solutionsDropdown.map((item) => (
                  <Link
                    key={item.href} href={item.href}
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: `${item.color}18` }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{item.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </SimpleDropdown>

              {/* Services ▼ — Mega Menu */}
              <div
                ref={servicesRef}
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                  onClick={() => { const was = servicesOpen; closeAll(); setServicesOpen(!was); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    servicesOpen || isActive("/services") ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Zap size={15} className="text-[#CC0000]" />
                  الخدمات
                  <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Panel */}
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.97 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      onMouseEnter={keepServices}
                      onMouseLeave={closeServices}
                      className="absolute top-full right-0 mt-2 z-50"
                      style={{ width: "min(900px, 94vw)" }}
                    >
                      {/* Glass outer wrapper */}
                      <div
                        className="rounded-[20px] overflow-hidden"
                        style={{
                          background: "rgba(15,12,32,0.97)",
                          backdropFilter: "blur(24px)",
                          border: "1px solid rgba(124,58,237,0.3)",
                          boxShadow: "0 0 0 1px rgba(124,58,237,0.15), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(124,58,237,0.12)",
                        }}
                      >
                        <div className="flex">
                          {/* Left: service categories grid */}
                          <div className="flex-1 p-6 grid grid-cols-2 lg:grid-cols-3 gap-5">
                            {megaMenuCategories.map((cat) => (
                              <div key={cat.title}>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${cat.color}25` }}>
                                    <cat.icon size={13} style={{ color: cat.color }} />
                                  </div>
                                  <p className="text-xs font-bold text-white/90 tracking-wide">{cat.title}</p>
                                </div>
                                <ul className="space-y-1">
                                  {cat.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href="/services"
                                        onClick={() => setServicesOpen(false)}
                                        className="text-xs text-white/55 hover:text-white/90 transition-colors py-0.5 block hover:translate-x-0.5 transition-transform duration-150"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Right: glass card CTA */}
                          <div className="w-56 shrink-0 p-5 flex flex-col justify-between border-r border-white/8"
                            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.08) 100%)" }}
                          >
                            {/* Glow blob */}
                            <div className="absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none" style={{ background: "#7C3AED" }} />

                            <div>
                              <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.35)" }}>
                                <Rocket size={18} className="text-purple-300" />
                              </div>
                              <p className="text-sm font-bold text-white leading-snug mb-1">لنبدأ ببناء مشروعك الرقمي</p>
                              <p className="text-xs text-white/50 leading-relaxed">هل تحتاج مساعدة في اختيار الحل المناسب؟ خبراؤنا سيرشدونك.</p>
                            </div>

                            <div className="flex flex-col gap-2 mt-5">
                              <Link
                                href="/book-demo"
                                onClick={() => setServicesOpen(false)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}
                              >
                                <Rocket size={13} />
                                ابدأ مشروعك
                              </Link>
                              <Link
                                href="/book-demo"
                                onClick={() => setServicesOpen(false)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 transition-all hover:text-white hover:bg-white/10"
                                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                              >
                                📅 احجز استشارة
                              </Link>
                              <Link
                                href="/ai-business-os/tools"
                                onClick={() => setServicesOpen(false)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-white/10"
                                style={{ color: "#A78BFA", border: "1px solid rgba(167,139,250,0.25)" }}
                              >
                                <Wrench size={13} />
                                أدوات مجانية
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Simple links */}
              {[
                { label: "الكورسات",      href: "/courses",           icon: BookOpen },
                { label: "المتجر",        href: "/store",             icon: StoreIcon },
                { label: "المقالات",      href: "/blog",              icon: BookOpen },
                { label: "من نحن",        href: "/about",             icon: Users },
                { label: "اتصل بنا",     href: "/contact",           icon: Mail },
              ].map((link) => (
                <Link
                  key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href) ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Portfolio ▼ */}
              <SimpleDropdown
                label="أعمالنا" icon={LayoutGrid}
                refEl={portfolioRef} isOpen={portfolioOpen} setIsOpen={setPortfolioOpen}
                active={portfolioOpen || location.startsWith("/projects")}
              >
                {projectsDropdown.map((item) => (
                  <Link
                    key={item.href} href={item.href}
                    onClick={() => setPortfolioOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors"
                  >
                    {(item as any).logo ? (
                      <img src={(item as any).logo} alt={item.label} className="w-9 h-9 rounded-lg object-contain bg-white border border-[#E5E7EB] p-0.5 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#CC0000]/10 flex items-center justify-center shrink-0">
                        <item.icon size={16} className="text-[#CC0000]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{item.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </SimpleDropdown>
            </div>

            {/* ── Desktop right side ──────────────────────────────── */}
            <div className="hidden xl:flex items-center gap-2 shrink-0">

              {/* Client Portal */}
              <SimpleDropdown
                label="بوابة العملاء" icon={BarChart3}
                refEl={clientsRef} isOpen={clientsOpen} setIsOpen={setClientsOpen}
                active={location.startsWith("/company")}
              >
                {clientsDropdown.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setClientsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#CC0000]/10 flex items-center justify-center shrink-0"><item.icon size={16} className="text-[#CC0000]" /></div>
                    <div><p className="text-sm font-bold text-[#111827]">{item.label}</p><p className="text-xs text-[#9CA3AF]">{item.sub}</p></div>
                  </Link>
                ))}
                <p className="px-4 pt-2 pb-1 text-xs text-[#6B7280] border-t border-[#E5E7EB] mt-1 leading-relaxed">للحصول على بيانات الدخول تواصل مع فريق دبي فانز</p>
              </SimpleDropdown>

              {/* Student Portal */}
              <SimpleDropdown
                label="بوابة الطالب" icon={GraduationCap}
                refEl={studentRef} isOpen={studentOpen} setIsOpen={setStudentOpen}
                active={location.startsWith("/student")}
              >
                {studentDropdown.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setStudentOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#CC0000]/10 flex items-center justify-center shrink-0"><item.icon size={16} className="text-[#CC0000]" /></div>
                    <div><p className="text-sm font-bold text-[#111827]">{item.label}</p><p className="text-xs text-[#9CA3AF]">{item.sub}</p></div>
                  </Link>
                ))}
              </SimpleDropdown>

              {/* Start Your Project — Primary Button */}
              <Link
                href="/book-demo"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] shrink-0"
                style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}
              >
                <Rocket size={15} />
                ابدأ مشروعك
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="xl:hidden p-2 text-[#4B5563] hover:text-[#111827] transition-colors"
              onClick={() => { setOpen(!open); setMobileSection(null); }}
              aria-label="القائمة"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* ── Mobile menu ─────────────────────────────────────────── */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="xl:hidden border-t border-[#E5E7EB] bg-[#F3F4F6] max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain"
              >
                <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
                  <Link href="/" onClick={() => setOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive("/") && location === "/" ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#FFFFFF]"}`}>الرئيسية</Link>

                  {/* Mobile accordion sections */}
                  {([
                    { key: "solutions", label: "حلولنا", icon: Rocket, items: solutionsDropdown.map(s => ({ href: s.href, label: s.label, sub: s.sub, icon: s.icon })) },
                    { key: "portfolio", label: "أعمالنا", icon: LayoutGrid, items: projectsDropdown.map(s => ({ href: s.href, label: s.label, sub: s.sub, icon: s.icon })) },
                    { key: "student",   label: "بوابة الطالب", icon: GraduationCap, items: studentDropdown },
                    { key: "clients",   label: "بوابة العملاء", icon: BarChart3, items: clientsDropdown },
                  ] as { key: MobileSection; label: string; icon: React.ElementType; items: { href: string; label: string; sub: string; icon: React.ElementType }[] }[]).map((section) => (
                    <div key={section.key} className="rounded-xl overflow-hidden">
                      <button
                        onClick={() => setMobileSection(v => v === section.key ? null : section.key)}
                        aria-expanded={mobileSection === section.key}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-[#FFFFFF] transition-colors"
                      >
                        <span className="flex items-center gap-2"><section.icon size={16} className="text-[#CC0000]" /> {section.label}</span>
                        <ChevronDown size={16} className={`transition-transform ${mobileSection === section.key ? "rotate-180" : ""}`} />
                      </button>
                      {mobileSection === section.key && (
                        <div className="px-4 pb-2 bg-white rounded-xl border border-[#E5E7EB] mt-1">
                          {section.items.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 border-b border-[#E5E7EB] last:border-0">
                              <div className="w-8 h-8 rounded-lg bg-[#CC0000]/10 flex items-center justify-center shrink-0"><item.icon size={15} className="text-[#CC0000]" /></div>
                              <div><p className="text-sm font-bold text-[#111827]">{item.label}</p><p className="text-xs text-[#9CA3AF]">{item.sub}</p></div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mobile services accordion */}
                  <div className="rounded-xl overflow-hidden">
                    <button
                      onClick={() => setMobileSection(v => v === "services" ? null : "services")}
                      aria-expanded={mobileSection === "services"}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-[#FFFFFF] transition-colors"
                    >
                      <span className="flex items-center gap-2"><Zap size={16} className="text-[#CC0000]" /> الخدمات</span>
                      <ChevronDown size={16} className={`transition-transform ${mobileSection === "services" ? "rotate-180" : ""}`} />
                    </button>
                    {mobileSection === "services" && (
                      <div className="px-4 pb-2 bg-white rounded-xl border border-[#E5E7EB] mt-1">
                        {megaMenuCategories.map((cat) => (
                          <div key={cat.title} className="py-2 border-b border-[#E5E7EB] last:border-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                                <cat.icon size={12} style={{ color: cat.color }} />
                              </div>
                              <p className="text-xs font-bold text-[#111827]">{cat.title}</p>
                            </div>
                            <p className="text-xs text-[#9CA3AF] leading-relaxed pr-8">{cat.items.join("، ")}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Simple mobile links */}
                  {[
                    { label: "الكورسات",      href: "/courses" },
                    { label: "المتجر",        href: "/store" },
                    { label: "المقالات",      href: "/blog" },
                    { label: "من نحن",        href: "/about" },
                    { label: "اتصل بنا",     href: "/contact" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.href) ? "text-[#CC0000] bg-[#CC0000]/10" : "text-[#4B5563] hover:text-[#111827] hover:bg-[#FFFFFF]"}`}>
                      {link.label}
                    </Link>
                  ))}

                  {/* Mobile CTA */}
                  <Link
                    href="/book-demo"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}
                  >
                    <Rocket size={16} />
                    ابدأ مشروعك
                  </Link>

                  <button
                    onClick={() => { setOpen(false); setReportOpen(true); }}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#CC0000] text-white rounded-xl font-bold text-sm"
                  >
                    <Globe size={16} />
                    احصل على تقرير SEO مجاني
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
