import { Link } from "wouter";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaSnapchat, FaGoogle, FaLinkedin } from "react-icons/fa";
import { Phone, Mail, MapPin, ArrowUp, GraduationCap, Bot, BarChart3, LayoutDashboard, Target, FileBarChart, Wrench, Brain, BarChart2 } from "lucide-react";
import { courses } from "@/data/courses";

const studentLinks = [
  { label: "تسجيل الدخول", href: "/student/login" },
  { label: "إنشاء حساب", href: "/student/register" },
  { label: "لوحة تحكم الطالب", href: "/student/dashboard" },
];

const aiModules = [
  { label: "AI Business Audit",     href: "/ai-business-os/audit",      icon: BarChart3 },
  { label: "AI Business Dashboard", href: "/ai-business-os/dashboard",   icon: LayoutDashboard },
  { label: "AI Consultant",         href: "/ai-business-os/consultant",  icon: Brain },
  { label: "AI Marketing Planner",  href: "/ai-business-os/planner",     icon: Target },
  { label: "AI Reports",            href: "/ai-business-os/reports",     icon: FileBarChart },
  { label: "أدوات مجانية",          href: "/ai-business-os/tools",       icon: Wrench },
];

const quickLinks = [
  { label: "الرئيسية",        href: "/"          },
  { label: "خدماتنا",        href: "/services"   },
  { label: "الأسعار",        href: "/store#pricing" },
  { label: "الكورسات",       href: "/courses"    },
  { label: "أعمالنا",        href: "/projects"   },
  { label: "دراسات الحالة",  href: "/projects"   },
  { label: "الأسئلة الشائعة", href: "/faq"       },
  { label: "من نحن",         href: "/about"      },
  { label: "المدونة",        href: "/blog"       },
  { label: "اتصل بنا",      href: "/contact"    },
];

const serviceLinks = [
  { label: "إدارة الحملات الإعلانية",        href: "/services/paid-ads"               },
  { label: "تصميم المواقع والمتاجر",          href: "/services/web-design"             },
  { label: "تزويد المتابعين",                 href: "/services/social-media-management"},
  { label: "تصميم الجرافيك",                  href: "/services/graphic-design"         },
  { label: "إدارة السوشيال ميديا",            href: "/services/social-media-management"},
  { label: "إدارة نشاطي التجاري على جوجل",   href: "/services/google-my-business"     },
  { label: "التصوير الاحترافي",               href: "/services/photography"            },
];

const tools = [
  { label: "أدوات SEO المجانية", href: "/tools" },
  { label: "حاسبة ROI الإعلاني", href: "/tools" },
  { label: "مُولّد الهاشتاجات", href: "/tools" },
  { label: "تحليل موقعك مجاناً", href: "/analyze" },
  { label: "مدونة التسويق الرقمي", href: "/blog" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0A0A18] border-t border-[#E5E7EB] relative">
      {/* Top CTA strip */}
      <div className="bg-gradient-to-l from-[#CC0000] to-[#AA0000] py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[#111827] font-black text-xl mb-1">هل أنت مستعد لتنمية أعمالك رقمياً؟</h3>
            <p className="text-white/80 text-sm">تواصل معنا اليوم واحصل على استشارة مجانية مع خطة نمو مخصصة</p>
          </div>
          <a
            href="https://wa.me/971551981564"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 bg-white text-[#CC0000] rounded-xl font-black hover:bg-gray-100 transition-colors whitespace-nowrap shadow-lg"
          >
            <FaWhatsapp size={20} />
            تواصل معنا الآن
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CC0000] to-[#B00000] flex items-center justify-center text-[#111827] font-black text-xl shadow-lg">
                د
              </div>
              <div className="leading-none">
                <div className="font-black text-xl text-white">دبي <span className="text-[#CC0000]">فانز</span></div>
                <div className="text-[10px] text-[#9CA3AF] tracking-wider">DUBAI FANS</div>
              </div>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5">
              وكالة تسويق رقمي متخصصة في الإمارات — نبني منظومة نمو متكاملة تحوّل ظهورك الرقمي إلى عملاء ومبيعات حقيقية.
            </p>

            <div className="flex gap-2.5">
              {[
                { Icon: FaWhatsapp, href: "https://wa.me/971551981564", label: "واتساب" },
                { Icon: FaInstagram, href: "https://www.instagram.com/mtuaefans", label: "إنستغرام" },
                { Icon: FaFacebook, href: "https://www.facebook.com/mtuaefans", label: "فيسبوك" },
                { Icon: FaTiktok, href: "https://www.tiktok.com/@mtuaefans", label: "تيك توك" },
                { Icon: FaGoogle, href: "https://www.google.com/search?q=دبي+فانز+mtuaefans", label: "نشاطي على جوجل" },
                { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mahmoudterak-mt-050a97427/", label: "لينكدإن" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000]/50 hover:bg-[#CC0000]/10 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
              {/* Dribbble */}
              <a
                href="https://dribbble.com/mtuaefans"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dribbble"
                className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center hover:border-[#EA4C89]/50 hover:bg-[#EA4C89]/10 transition-all duration-300"
              >
                <img loading="lazy" decoding="async" src="/dribbble-logo.png" alt="Dribbble" className="w-4 h-auto object-contain" />
              </a>
              {/* Behance */}
              <a
                href="https://www.behance.net/mtuaefans"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center hover:border-[#1769FF]/50 hover:bg-[#1769FF]/10 transition-all duration-300"
              >
                <img loading="lazy" decoding="async" src="/behance-logo.webp" alt="Behance" className="w-5 h-5 object-contain rounded-full" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#9CA3AF] hover:text-[#CC0000] transition-colors text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">خدماتنا</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#9CA3AF] hover:text-[#CC0000] transition-colors text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={15} className="text-[#CC0000]" />
              أكاديمية دبي فانز
            </h4>
            <ul className="space-y-3">
              {courses.map(c => (
                <li key={c.slug}>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="group flex flex-col gap-0.5 text-[#9CA3AF] hover:text-[#CC0000] transition-colors"
                  >
                    <span className="text-sm font-semibold leading-snug group-hover:text-[#CC0000] transition-colors">
                      {c.name}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {c.duration} · {c.price.toLocaleString("ar-AE")} AED
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 text-xs text-[#CC0000] font-bold hover:underline"
                >
                  عرض جميع الكورسات ←
                </Link>
              </li>
            </ul>

            {/* Student Portal sub-section */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h5 className="text-white/60 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap size={12} className="text-[#CC0000]" /> بوابة الطالب
              </h5>
              <ul className="space-y-2">
                {studentLinks.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[#9CA3AF] hover:text-[#CC0000] transition-colors text-sm font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Portal sub-section */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h5 className="text-white/60 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BarChart2 size={12} className="text-[#7C3AED]" /> بوابة العملاء
              </h5>
              <Link
                href="/company/login"
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#A78BFA] transition-colors text-sm font-semibold mb-2"
              >
                <BarChart2 size={13} className="text-[#7C3AED]/60 shrink-0" />
                تقارير الأداء
              </Link>
              <p className="text-[#6B7280] text-xs leading-relaxed">
                للحصول على بيانات الدخول تواصل مع فريق دبي فانز
              </p>
            </div>
          </div>

          {/* AI Business OS */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <Bot size={15} className="text-[#CC0000]" />
              AI Business OS
            </h4>
            <p className="text-[#6B7280] text-xs mb-4 leading-relaxed">
              منصة ذكاء اصطناعي متكاملة لتحليل وإدارة وتنمية نشاطك التجاري
            </p>
            <ul className="space-y-2.5">
              {aiModules.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link href={href} className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#CC0000] transition-colors text-sm font-medium group">
                    <Icon size={13} className="text-[#CC0000]/50 group-hover:text-[#CC0000] transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/ai-business-os"
                className="inline-flex items-center gap-1.5 text-xs text-[#CC0000] font-bold hover:underline"
              >
                استكشف المنصة كاملاً ←
              </Link>
            </div>
          </div>

          {/* Contact + Tools */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">أدوات وتواصل</h4>
            <ul className="space-y-2.5 mb-6">
              {tools.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#9CA3AF] hover:text-[#CC0000] transition-colors text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <a href="tel:+971551981564" className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors text-sm">
                <Phone size={13} className="text-[#CC0000]" />
                +971 55 198 1564
              </a>
              <a href="mailto:info@mtuaefans.sbs" className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors text-sm">
                <Mail size={13} className="text-[#CC0000]" />
                info@mtuaefans.sbs
              </a>
              <span className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                <MapPin size={13} className="text-[#CC0000]" />
                دبي، الإمارات
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E5E7EB] pt-8 space-y-4">
          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#9CA3AF]">
            <Link href="/terms"           className="hover:text-[#CC0000] transition-colors">شروط الاستخدام</Link>
            <span className="text-[#6B7280]">|</span>
            <Link href="/privacy"         className="hover:text-[#CC0000] transition-colors">سياسة الخصوصية</Link>
            <span className="text-[#6B7280]">|</span>
            <Link href="/refund-policy"   className="hover:text-[#CC0000] transition-colors">سياسة الاسترجاع</Link>
            <span className="text-[#6B7280]">|</span>
            <Link href="/campaign-policy" className="hover:text-[#CC0000] transition-colors">سياسة الحملات</Link>
            <span className="text-[#6B7280]">|</span>
            <Link href="/cookie-policy"   className="hover:text-[#CC0000] transition-colors">سياسة الكوكيز</Link>
            <span className="text-[#6B7280]">|</span>
            <Link href="/sitemap"         className="hover:text-[#CC0000] transition-colors">خريطة الموقع</Link>
          </div>

          {/* reCAPTCHA badge — required by Google */}
          <p className="text-[#9CA3AF] text-xs text-center mb-3">
            هذا الموقع محمي بواسطة reCAPTCHA وتطبق{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#CC0000] transition-colors">سياسة الخصوصية</a>
            {" "}و{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#CC0000] transition-colors">شروط الخدمة</a>
            {" "}الخاصة بـ Google.
          </p>

          {/* Clutch badges + security certificate */}
          <div className="flex flex-wrap justify-center items-center gap-4 py-2">
            <a
              href="https://clutch.co/profile/mtuaefans-digital-marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Clutch Verified Profile"
            >
              <img
                src="/clutch-verified.png"
                alt="Clutch Verified"
                height={40}
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
            </a>
            <a
              href="https://clutch.co/profile/mtuaefans-digital-marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Clutch 5-Star Reviews"
            >
              <img
                src="/clutch-stars.svg"
                alt="Clutch 5 Stars"
                height={36}
                className="h-9 w-auto object-contain"
                loading="lazy"
              />
            </a>

            {/* Security certificate */}
            <Link
              href="/certificate"
              className="hover:opacity-80 transition-opacity"
              aria-label="شهادة الأمان والثقة"
            >
              <img
                src="/security-certificate.webp"
                alt="شهادة الأمان الرقمي"
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          {/* Copyright + scroll top */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[#9CA3AF] text-xs text-center leading-relaxed">
              mtuaefans Digital Marketing ® &nbsp;|&nbsp; Advertiser Permit Number: <span className="text-[#9CA3AF] font-semibold">0701430</span>
              &nbsp;|&nbsp; CN-<span className="text-[#9CA3AF] font-semibold">6394197</span>
              &nbsp;|&nbsp; جميع الحقوق محفوظة {currentYear}
            </p>
            <button
              onClick={scrollTop}
              className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000]/50 hover:bg-[#CC0000]/10 transition-all duration-300 shrink-0"
              aria-label="للأعلى"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
