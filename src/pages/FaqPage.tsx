import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";

const BASE = "https://mtuaefans.com";

const categories = [
  {
    title: "عام",
    color: "#CC0000",
    faqs: [
      {
        q: "ما هي دبي فانز؟",
        a: "دبي فانز وكالة تسويق رقمي متخصصة في دبي والإمارات، تقدم خدمات إعلانات Google وميتا وتيك توك وسناب شات، وتصميم مواقع، وإدارة سوشيال ميديا، وتحسين محركات البحث (SEO).",
      },
      {
        q: "كيف أبدأ العمل مع دبي فانز؟",
        a: "ابدأ بالتواصل معنا عبر واتساب أو نموذج الاتصال. سنحدد موعداً للاستشارة المجانية لفهم أهدافك ونشاطك، ثم نضع خطة تسويقية مخصصة.",
      },
      {
        q: "هل تعملون مع الشركات الصغيرة والمتوسطة؟",
        a: "نعم، نخدم الشركات بجميع أحجامها — من الشركات الناشئة إلى المؤسسات الكبرى. نصمم الخطط التسويقية وفق ميزانيتك وأهدافك الفعلية.",
      },
      {
        q: "هل تقدمون استشارة مجانية؟",
        a: "نعم، نقدم استشارة أولية مجانية لتحليل وضعك الرقمي الحالي ومناقشة أفضل الحلول لنشاطك.",
      },
    ],
  },
  {
    title: "الإعلانات الرقمية",
    color: "#3B82F6",
    faqs: [
      {
        q: "ما الفرق بين إعلانات Google وإعلانات ميتا (فيسبوك/إنستغرام)؟",
        a: "إعلانات Google تستهدف من يبحث بنشاط عن خدماتك (نية شراء عالية). إعلانات ميتا تصل إلى جمهور مستهدف بناءً على اهتماماته وديموغرافيته، وهي أقوى للتوعية وبناء العلامة التجارية.",
      },
      {
        q: "ما الحد الأدنى للميزانية الإعلانية؟",
        a: "يختلف حسب المنصة والهدف. نوصي بالحد الأدنى 3,000 درهم شهرياً لإعلانات Google، و2,000 درهم لإعلانات ميتا لتحقيق نتائج قابسة للقياس.",
      },
      {
        q: "هل يمكنكم إدارة إعلانات تيك توك وسناب شات؟",
        a: "نعم، نُدير إعلانات جميع المنصات الرئيسية: Google، ميتا، تيك توك، سناب شات، وLinkedIn. نختار المنصات المناسبة لجمهورك ونشاطك.",
      },
      {
        q: "كم يستغرق رؤية نتائج من الإعلانات الرقمية؟",
        a: "إعلانات البحث (Google) تبدأ بتوليد نتائج خلال 24–48 ساعة. إعلانات السوشيال ميديا عادةً خلال 3–7 أيام. النتائج المثلى تظهر بعد شهر من التحسين المستمر.",
      },
    ],
  },
  {
    title: "تحسين محركات البحث SEO",
    color: "#10B981",
    faqs: [
      {
        q: "كم تكلفة خدمة SEO في دبي؟",
        a: "تبدأ خدمة SEO لدى دبي فانز من 1,200 درهم شهرياً حسب حجم الموقع والمنافسة في مجالك. نبدأ بتدقيق مجاني لموقعك لتحديد التكلفة الفعلية.",
      },
      {
        q: "كم يستغرق الوصول للصفحة الأولى في جوجل؟",
        a: "عادةً 3–6 أشهر حسب المنافسة في مجالك. التحسينات التقنية تظهر خلال 2–4 أسابيع. SEO استثمار طويل الأمد بعوائد مستدامة لا تتوقف بتوقف الميزانية.",
      },
      {
        q: "هل تحسّنون SEO للمواقع العربية والإنجليزية؟",
        a: "نعم، نتخصص في SEO ثنائي اللغة (عربي وإنجليزي) وهو ضروري لاستهداف الجمهور الواسع في الإمارات من مواطنين وجاليات وسياح.",
      },
    ],
  },
  {
    title: "تصميم المواقع",
    color: "#8B5CF6",
    faqs: [
      {
        q: "كم تكلفة تصميم موقع ويب في دبي؟",
        a: "تبدأ تكلفة المواقع الاحترافية من 3,000 درهم للمواقع البسيطة وترتفع حسب التعقيد والميزات المطلوبة. نقدم عروض أسعار مخصصة بعد فهم متطلباتك.",
      },
      {
        q: "كم يستغرق تصميم وتطوير الموقع؟",
        a: "المواقع البسيطة تستغرق 1–2 أسبوع. المواقع المتقدمة مع متجر إلكتروني 3–6 أسابيع. نلتزم بالمواعيد المتفق عليها.",
      },
      {
        q: "هل المواقع التي تصمّمونها متجاوبة مع الجوال؟",
        a: "بالتأكيد، جميع مواقعنا مصممة بمبدأ Mobile-First — تعمل بشكل مثالي على الهواتف والأجهزة اللوحية وأجهزة الحاسوب.",
      },
    ],
  },
  {
    title: "العقود والأسعار",
    color: "#F59E0B",
    faqs: [
      {
        q: "هل تلتزمون بعقود طويلة الأمد؟",
        a: "نقدم باقات شهرية مرنة وباقات سنوية بخصم. لا نُلزم عملاءنا بعقود طويلة لا تناسبهم — نؤمن بأن النتائج هي التي تُبقي العملاء.",
      },
      {
        q: "ما طرق الدفع المتاحة؟",
        a: "نقبل التحويل البنكي، والبطاقات الائتمانية، والدفع عبر حسابات الإمارات. يمكن الاتفاق على دفعات شهرية أو ربع سنوية.",
      },
      {
        q: "هل تقدمون ضماناً على النتائج؟",
        a: "نضمن الجودة والالتزام بالخطة المتفق عليها. النتائج تعتمد على عوامل متعددة (المنافسة، الميزانية، طبيعة النشاط) لكننا نلتزم بالشفافية الكاملة في تقارير الأداء الشهرية.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-[#FAFAFA] transition-colors text-right"
      >
        <span className="font-bold text-[#111827] text-sm leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#CC0000] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 pt-2 text-sm text-[#6B7280] leading-relaxed border-t border-[#F3F4F6] bg-white">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [active, setActive] = useState("عام");

  return (
    <>
      <SEOHead
        title="الأسئلة الشائعة | دبي فانز — التسويق الرقمي في الإمارات"
        description="إجابات على أكثر الأسئلة شيوعاً حول خدمات التسويق الرقمي، SEO، إعلانات Google وميتا، تصميم المواقع في دبي والإمارات."
        keywords="أسئلة شائعة تسويق رقمي دبي, FAQ إعلانات Google الإمارات, خدمات SEO دبي أسعار"
        canonical={`${BASE}/faq`}
      />
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20" dir="rtl">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1E1B4B] to-[#111827] py-16 mb-12">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#CC0000]/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-[#CC0000]" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3">الأسئلة الشائعة</h1>
              <p className="text-white/60 max-w-xl mx-auto">
                إجابات واضحة على أكثر ما يسألنا عنه عملاؤنا حول خدماتنا وأسعارنا وطريقة عملنا
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-4xl">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(c => (
              <button
                key={c.title}
                onClick={() => setActive(c.title)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  active === c.title
                    ? "text-white shadow-md"
                    : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#CC0000]/40"
                }`}
                style={active === c.title ? { backgroundColor: c.color } : {}}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          {categories.map(c => c.title === active && (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {c.faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </motion.div>
          ))}

          {/* CTA */}
          <div className="mt-12 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8 text-center">
            <h2 className="text-xl font-black text-[#111827] mb-2">لم تجد إجابة لسؤالك؟</h2>
            <p className="text-[#6B7280] text-sm mb-5">تواصل مع فريقنا مباشرةً وسنرد خلال ساعات</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/971551981564"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#CC0000] text-white font-bold text-sm hover:bg-[#AA0000] transition-all shadow-md"
              >
                اسألنا عبر واتساب
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#E5E7EB] text-[#374151] font-bold text-sm hover:border-[#CC0000]/40 hover:text-[#CC0000] transition-all"
              >
                نموذج الاتصال
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
