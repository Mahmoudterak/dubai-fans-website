import { Link } from "wouter";
import {
  Shield, Cookie, BarChart2, Megaphone, Globe,
  Settings, Trash2, Mail, ChevronRight, SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/cookie-policy");
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/CookieBanner";
import { CONSENT_KEY, HAS_ANALYTICS, HAS_MARKETING } from "@/lib/consent";

const BASE = "https://mtuaefans.com";

/* ── Small reusable building blocks ──────────────────────────────────────── */

function Section({ icon, title, children }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] p-8 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000]">
          {icon}
        </div>
        <h2 className="text-xl font-black text-[#111827]">{title}</h2>
      </div>
      <div className="text-[#374151] leading-relaxed space-y-3 text-sm">{children}</div>
    </section>
  );
}

function CookieRow({ name, purpose, duration, required }: {
  name: string;
  purpose: string;
  duration: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-3 border-b border-[#F3F4F6] last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <code className="text-xs bg-[#F3F4F6] px-2 py-0.5 rounded font-mono text-[#374151]">
            {name}
          </code>
          {required && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">ضروري</span>
          )}
        </div>
        <p className="text-[#6B7280] text-xs mt-1">{purpose}</p>
      </div>
      <span className="text-xs text-[#9CA3AF] shrink-0 whitespace-nowrap pt-0.5">{duration}</span>
    </div>
  );
}

function ManageButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))}
      className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
    >
      <SlidersHorizontal size={15} />
      إدارة تفضيلاتي الآن
    </button>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function CookiePolicyPage() {
  const hasOptional = HAS_ANALYTICS || HAS_MARKETING;

  return (
    <>
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/cookie-policy"
        noindex={PAGE_META.noindex}
        jsonLd={[
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: BASE },
              { "@type": "ListItem", position: 2, name: "سياسة ملفات تعريف الارتباط", item: `${BASE}/cookie-policy` },
            ],
          },
        ]}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16" dir="rtl">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0F0A2A] via-[#1E1B4B] to-[#CC0000]/60 py-16 mb-10">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-5">
              <Cookie size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
              سياسة ملفات تعريف الارتباط
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm mb-6">
              آخر تحديث: يناير ٢٠٢٥ · نحن نحترم خصوصيتك ونلتزم بالشفافية الكاملة.
            </p>
            <ManageButton />
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/50">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronRight size={12} />
              <span className="text-white/80">سياسة ملفات تعريف الارتباط</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-3xl">

          {/* Manage call-out */}
          <div className="bg-[#1E1B4B]/5 border border-[#1E1B4B]/15 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#111827] text-sm">هل تريد تغيير إعداداتك؟</p>
              <p className="text-[#6B7280] text-xs mt-0.5">
                يمكنك تحديث اختياراتك أو سحب موافقتك في أي وقت.
              </p>
            </div>
            <ManageButton />
          </div>

          {/* 1 — What are cookies */}
          <Section icon={<Cookie size={20} />} title="ما هي ملفات تعريف الارتباط؟">
            <p>
              ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة موقعنا.
              تساعدنا على تذكّر تفضيلاتك وتأمين النماذج وتحسين الأداء.
            </p>
            <p>
              يمكنك إدارة هذه الملفات أو حذفها عبر إعدادات متصفحك، أو عبر زر «إدارة تفضيلاتي» أعلاه.
            </p>
          </Section>

          {/* 2 — Actual cookies in use */}
          <Section icon={<Settings size={20} />} title="ملفات الارتباط المستخدمة فعلياً">

            {/* Necessary */}
            <div className={hasOptional ? "mb-6" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-green-600" />
                <h3 className="font-bold text-[#111827]">
                  ١. ملفات ضرورية
                  <span className="mr-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                    دائماً مفعّلة
                  </span>
                </h3>
              </div>
              <p className="mb-3 text-[#6B7280]">
                لا يمكن تعطيل هذه الملفات لأنها ضرورية لأمان الموقع ووظائفه الأساسية.
                الأساس القانوني: المصلحة المشروعة — GDPR Art. 6(1)(f).
              </p>
              <div className="bg-[#F9FAFB] rounded-xl px-4 divide-y divide-[#F3F4F6]">
                <CookieRow
                  name={CONSENT_KEY}
                  purpose="يُخزَّن في localStorage (ليس cookie تقليدياً) — يحفظ اختيارك لمدة سنة حتى لا يظهر البانر في كل زيارة"
                  duration="سنة واحدة"
                  required
                />
              </div>
            </div>

            {/* Third-party — reCAPTCHA (always necessary) */}
            <div className={hasOptional ? "mb-6" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-purple-600" />
                <h3 className="font-bold text-[#111827]">
                  ٢. ملفات جهات خارجية — أمان النماذج
                  <span className="mr-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                    ضرورية
                  </span>
                </h3>
              </div>
              <p className="mb-3 text-[#6B7280]">
                تضعها Google reCAPTCHA Enterprise المستخدمة في نماذج التواصل والتسجيل لمنع البريد المزعج.
                تُحمَّل دائماً بموجب المصلحة المشروعة (أمان الموقع).
              </p>
              <div className="bg-[#F9FAFB] rounded-xl px-4 divide-y divide-[#F3F4F6]">
                <CookieRow name="NID" purpose="Google reCAPTCHA — تحديد المستخدم وحساب درجة الأمان" duration="٦ أشهر" required />
                <CookieRow name="CONSENT" purpose="Google — يحفظ حالة الموافقة على خدمات Google" duration="سنتان" required />
              </div>
            </div>

            {/* Analytics — conditional on HAS_ANALYTICS */}
            {HAS_ANALYTICS && (
              <div className={HAS_MARKETING ? "mb-6" : ""}>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 size={16} className="text-blue-600" />
                  <h3 className="font-bold text-[#111827]">
                    ٣. ملفات التحليل
                    <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-normal">اختيارية</span>
                  </h3>
                </div>
                <p className="mb-3 text-[#6B7280]">
                  تُستخدم لفهم سلوك الزوار (Google Analytics 4).
                  تُحمَّل فقط بعد موافقتك، وتُحذف فور الرفض.
                </p>
                <div className="bg-[#F9FAFB] rounded-xl px-4 divide-y divide-[#F3F4F6]">
                  <CookieRow name="_ga"   purpose="Google Analytics 4 — تمييز الجلسات" duration="سنتان" />
                  <CookieRow name="_ga_*" purpose="Google Analytics 4 — حالة الجلسة لكل خاصية" duration="سنتان" />
                </div>
              </div>
            )}

            {/* Marketing — conditional on HAS_MARKETING */}
            {HAS_MARKETING && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={16} className="text-[#CC0000]" />
                  <h3 className="font-bold text-[#111827]">
                    {HAS_ANALYTICS ? "٤" : "٣"}. ملفات التسويق
                    <span className="mr-2 text-xs bg-red-100 text-[#CC0000] px-2 py-0.5 rounded-full font-normal">اختيارية</span>
                  </h3>
                </div>
                <p className="mb-3 text-[#6B7280]">
                  تُستخدم لتقديم إعلانات ذات صلة (Meta Pixel).
                  تُحمَّل فقط بعد موافقتك، وتُحذف فور الرفض.
                </p>
                <div className="bg-[#F9FAFB] rounded-xl px-4 divide-y divide-[#F3F4F6]">
                  <CookieRow name="_fbp" purpose="Meta Pixel — تتبع التحويلات لحملات Meta" duration="٣ أشهر" />
                  <CookieRow name="_fbc" purpose="Meta — تتبع النقرات من روابط فيسبوك" duration="سنتان" />
                </div>
              </div>
            )}

            {/* If no optional trackers at all */}
            {!hasOptional && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-800 text-sm font-semibold">
                  ✅ هذا الموقع يستخدم ملفات ضرورية فقط — لا توجد ملفات تتبع أو إعلانات.
                </p>
                <p className="text-green-700 text-xs mt-1">
                  لا نستخدم Google Analytics أو Meta Pixel أو أي متتبع إعلاني اختياري حالياً.
                </p>
              </div>
            )}
          </Section>

          {/* 3 — How to manage */}
          <Section icon={<Settings size={20} />} title="كيفية إدارة تفضيلاتك">
            <div className="mb-5">
              <ManageButton />
            </div>
            <p className="mb-4">أو عبر إعدادات متصفحك مباشرة:</p>
            <div className="space-y-3">
              {[
                { b: "Google Chrome",   s: "الإعدادات ← الخصوصية والأمان ← ملفات تعريف الارتباط وبيانات الموقع" },
                { b: "Mozilla Firefox", s: "الخيارات ← الخصوصية والأمان ← ملفات تعريف الارتباط" },
                { b: "Safari",          s: "الإعدادات ← Safari ← مسح السجل وبيانات الموقع" },
                { b: "Microsoft Edge",  s: "الإعدادات ← الخصوصية والأمان ← ملفات تعريف الارتباط" },
              ].map(({ b, s }) => (
                <div key={b} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#CC0000] mt-1.5 shrink-0" />
                  <div><strong className="text-[#111827]">{b}:</strong> <span className="text-[#6B7280]">{s}</span></div>
                </div>
              ))}
            </div>
          </Section>

          {/* 4 — How to delete */}
          <Section icon={<Trash2 size={20} />} title="كيفية حذف ملفات تعريف الارتباط">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                { b: "Chrome",  s: "Ctrl+Shift+Delete → ملفات تعريف الارتباط → مسح البيانات" },
                { b: "Firefox", s: "Ctrl+Shift+Delete → ملفات تعريف الارتباط → مسح الآن" },
                { b: "Safari",  s: "Safari → مسح السجل → اختر المدة → مسح" },
                { b: "Edge",    s: "Ctrl+Shift+Delete → ملفات تعريف الارتباط → مسح الآن" },
              ].map(({ b, s }) => (
                <div key={b} className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="font-semibold text-[#111827] mb-1">{b}</div>
                  <div className="text-[#6B7280] text-xs">{s}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[#9CA3AF] text-xs">
              بعد الحذف يُعرض البانر مجدداً في زيارتك التالية.
              مفتاح الحفظ: <code className="bg-[#F3F4F6] px-1 rounded">{CONSENT_KEY}</code> (localStorage).
            </p>
          </Section>

          {/* 5 — Withdraw / change */}
          <Section icon={<SlidersHorizontal size={20} />} title="سحب الموافقة أو تغييرها">
            <p>يحق لك سحب موافقتك أو تعديلها في أي وقت وبأثر فوري.</p>
            <div className="mt-4 p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280] mb-3">
                اضغط الزر أدناه لإعادة فتح لوحة الإعدادات:
              </p>
              <ManageButton />
            </div>
          </Section>

          {/* 6 — Contact */}
          <Section icon={<Mail size={20} />} title="تواصل معنا">
            <p>لأي استفسار حول هذه السياسة أو معالجة بياناتك:</p>
            <div className="mt-4 space-y-2">
              <a href="mailto:info@mtuaefans.sbs" className="flex items-center gap-2 text-[#CC0000] font-semibold hover:underline">
                <Mail size={15} />
                info@mtuaefans.sbs
              </a>
              <p className="text-[#6B7280] text-xs">
                دبي فانز للتسويق الرقمي · دبي، الإمارات العربية المتحدة<br />
                رقم الإعلان التجاري: 0701430 · CN-6394197
              </p>
            </div>
            <div className="mt-5 pt-5 border-t border-[#F3F4F6] flex flex-wrap gap-3">
              <Link href="/privacy" className="text-sm text-[#CC0000] font-semibold hover:underline">سياسة الخصوصية</Link>
              <span className="text-[#E5E7EB]">|</span>
              <Link href="/terms" className="text-sm text-[#CC0000] font-semibold hover:underline">شروط الاستخدام</Link>
              <span className="text-[#E5E7EB]">|</span>
              <Link href="/contact" className="text-sm text-[#CC0000] font-semibold hover:underline">تواصل معنا</Link>
            </div>
          </Section>

        </div>
      </main>

      <Footer />
    </>
  );
}
