import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/refund-policy");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { RefreshCw, XCircle, CheckCircle, Clock, AlertTriangle, Phone } from "lucide-react";

const sections = [
  {
    icon: CheckCircle,
    title: "الحالات المؤهلة للاسترجاع",
    color: "#10B981",
    content: [
      "الاسترجاع الكامل (100%): إذا أخفقت الوكالة في بدء تقديم الخدمة خلال 10 أيام عمل من تاريخ السداد دون عذر مقبول.",
      "الاسترجاع الجزئي (50%): إذا تم إلغاء الخدمة خلال أول 7 أيام من بدء العمل الفعلي وقبل تسليم أي مخرجات.",
      "استرجاع بحسب المنجز: إذا أُوقفت الخدمة بعد البدء، يُحسب المبلغ المستحق للاسترجاع بناءً على نسبة العمل المنجز مقارنةً بما تم دفعه.",
      "خلل تقني موثق: إذا أخفق نظام تقني أو أداة تابعة للوكالة بشكل كامل وأثّر سلباً على الخدمة المتفق عليها.",
    ],
  },
  {
    icon: XCircle,
    title: "الحالات غير المؤهلة للاسترجاع",
    color: "#CC0000",
    content: [
      "ميزانيات الإعلانات المُنفقة على المنصات (Meta، Google، TikTok) بعد إطلاق الحملة — هذه الأموال تذهب مباشرةً للمنصة.",
      "الخدمات المكتملة وتم تسليمها بالكامل وفق المتفق عليه.",
      "التصاميم والمحتوى الذي تم إنتاجه والاطلاع عليه من العميل.",
      "في حال أخفق العميل في توفير المعلومات أو المواد المطلوبة لإتمام الخدمة خلال 14 يوماً من الطلب.",
      "تغيير رأي العميل أو أهدافه التجارية بعد بدء العمل الفعلي.",
      "انخفاض أداء الحملة بسبب عوامل السوق، الموسمية، أو تغييرات خوارزميات المنصة.",
      "رسوم الاشتراك الشهري بعد مرور 48 ساعة من بدء دورة الشهر.",
    ],
  },
  {
    icon: RefreshCw,
    title: "إجراءات طلب الاسترجاع",
    color: "#3B82F6",
    content: [
      "تقديم الطلب: أرسل طلب الاسترجاع كتابياً عبر واتساب أو البريد الإلكتروني مع ذكر رقم العقد وسبب الطلب.",
      "المراجعة: تستغرق مراجعة الطلب من 3 إلى 5 أيام عمل. قد يطلب فريقنا مزيداً من التوضيحات.",
      "الإخطار: سيتم إخطارك بقرار القبول أو الرفض مع الأسباب خطياً.",
      "المعالجة: في حال قبول الطلب، يُعالج الاسترجاع خلال 7 إلى 14 يوم عمل عبر نفس وسيلة الدفع الأصلية.",
      "طريقة التواصل: واتساب +971 55 198 1564 أو البريد الإلكتروني info@mtuaefans.sbs.",
    ],
  },
  {
    icon: XCircle,
    title: "سياسة الإلغاء",
    color: "#F0B429",
    content: [
      "إلغاء قبل البدء: إلغاء العقد قبل بدء العمل الفعلي يستوجب إشعاراً مكتوباً ويخضع للرسوم الإدارية بنسبة 10% من قيمة العقد.",
      "إلغاء الخدمات الشهرية: يُلزم بإشعار مسبق لا يقل عن 15 يوماً قبل تاريخ التجديد لتجنب الفوترة للشهر القادم.",
      "إلغاء الباقات السنوية: يُلزم بإشعار 30 يوماً مسبقاً. يُحسب المبلغ المستحق للاسترجاع بعد خصم رسوم الأشهر المُستخدمة بالسعر الشهري الكامل (بدون خصم السنوي).",
      "إلغاء فوري: في الحالات الاستثنائية القاهرة، تدرس الوكالة الطلب بشكل منفرد وتسعى للتوصل لحل عادل.",
    ],
  },
  {
    icon: Clock,
    title: "التعديلات والتأجيل",
    color: "#06B6D4",
    content: [
      "يحق للعميل تأجيل بدء الخدمة لمدة تصل إلى 30 يوماً من تاريخ السداد دون أي رسوم إضافية.",
      "تعديل نطاق الخدمة المتفق عليه يخضع لتقييم جديد وقد يستوجب رسوماً إضافية.",
      "تعليق الخدمة (Pause): يمكن تعليق الخدمة بإشعار مسبق 7 أيام لمدة أقصاها شهر واحد دون فقدان الرصيد المدفوع.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "النزاعات والتحكيم",
    color: "#9CA3AF",
    content: [
      "في حال نشوء أي نزاع، يُلتزم أولاً بمحاولة التسوية الودية خلال 14 يوماً من تاريخ الإبلاغ.",
      "إذا تعذرت التسوية الودية، يُلجأ إلى التحكيم وفق أحكام القانون الإماراتي في إمارة دبي.",
      "تخضع هذه السياسة لقوانين وتشريعات الإمارات العربية المتحدة.",
      "تحتفظ الوكالة بحق تعديل هذه السياسة مع إخطار العملاء الحاليين قبل 30 يوماً من التطبيق.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/refund-policy"
        noindex={PAGE_META.noindex}
      />
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-14 mb-12">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
                السياسات القانونية
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
                سياسة الاسترجاع والإلغاء
              </h1>
              <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
                سياسة شفافة ومنصفة تحمي حقوق عملائنا وتضمن تجربة تعامل واضحة مع وكالتنا
              </p>
              <p className="text-[#9CA3AF] text-sm mt-4">آخر تحديث: يناير 2025</p>
            </motion.div>
          </div>
        </div>

        {/* Quick summary */}
        <div className="container mx-auto px-6 max-w-4xl mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FEF9E7] border border-[#F0B429]/30 rounded-2xl p-6"
          >
            <h2 className="font-black text-[#111827] mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#F0B429]" />
              ملخص سريع
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle size={15} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#6B7280]">قابل للاسترجاع: الخدمات غير المبدوءة أو المبدوءة جزئياً وفق الشروط</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle size={15} className="text-[#CC0000] mt-0.5 flex-shrink-0" />
                <span className="text-[#6B7280]">غير قابل: ميزانيات الإعلانات المُنفقة والخدمات المكتملة</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-[#3B82F6] mt-0.5 flex-shrink-0" />
                <span className="text-[#6B7280]">مدة المعالجة: 7–14 يوم عمل بعد قبول الطلب</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-6">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:border-[#CC0000]/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <h2 className="text-xl font-black text-[#111827]">{s.title}</h2>
                </div>
                <ul className="space-y-3">
                  {s.content.map((item, j) => (
                    <li key={j} className="flex gap-3 text-[#6B7280] leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="bg-[#111827] rounded-2xl p-7"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-xl font-black text-white mb-2">هل تريد تقديم طلب استرجاع؟</h3>
                  <p className="text-[#9CA3AF] text-sm">تواصل معنا وسنرد عليك خلال 24 ساعة في أيام العمل</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href="https://wa.me/971551981564?text=أريد تقديم طلب استرجاع"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Phone size={15} />
                    واتساب
                  </a>
                  <a
                    href="mailto:info@mtuaefans.sbs"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    البريد الإلكتروني
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
