import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/campaign-policy");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, DollarSign, BarChart2, AlertCircle, Clock, FileText } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "نطاق السياسة",
    color: "#CC0000",
    content: [
      "تنطبق هذه السياسة على جميع الحملات الإعلانية المدفوعة التي تنفذها وكالة دبي فانز للخدمات الرقمية نيابةً عن عملائها.",
      "تشمل الحملات على: Meta Ads (فيسبوك وإنستغرام)، Google Ads، TikTok Ads، Snapchat Ads، وأي منصة إعلانية رقمية أخرى متفق عليها.",
      "بتوقيع عقد الخدمة أو الموافقة الكتابية، يُقرّ العميل بقراءته وموافقته على هذه السياسة.",
    ],
  },
  {
    icon: DollarSign,
    title: "الميزانيات الإعلانية",
    color: "#10B981",
    content: [
      "الميزانية الإعلانية منفصلة تماماً عن رسوم إدارة الحملة. رسوم الإدارة تُدفع للوكالة، والميزانية الإعلانية تُدفع مباشرةً لمنصة الإعلانات.",
      "الحد الأدنى الموصى به للميزانية الإعلانية الشهرية: 500 درهم للحملات المحلية، و1,000 درهم للحملات التوسعية.",
      "يحتفظ العميل بحق تعديل الميزانية الإعلانية بإشعار مسبق لا يقل عن 72 ساعة قبل دورة الحملة.",
      "أي ميزانية مُنفقة على المنصة الإعلانية غير قابلة للاسترداد من الوكالة، حيث تذهب مباشرةً إلى المنصة.",
      "في حال تجاوز الإنفاق الفعلي الميزانية المتفق عليها بسبب خطأ تقني في المنصة، تتواصل الوكالة فوراً مع العميل وتبادر بتقديم مطالبة للمنصة عند الاقتضاء.",
    ],
  },
  {
    icon: BarChart2,
    title: "إدارة الحملات والأداء",
    color: "#3B82F6",
    content: [
      "تلتزم الوكالة بإعداد الحملات وفق أهداف مُحددة متفق عليها كتابياً (وعي بالعلامة، عملاء محتملين، مبيعات، زيارات).",
      "يُقدَّم تقرير أداء شهري يتضمن: الإنفاق، النتائج، تكلفة النتيجة، والتوصيات للشهر القادم.",
      "لا تضمن الوكالة نتائج محددة (عدد عملاء أو مبيعات) نظراً لتأثر الأداء بعوامل خارجية كالسوق والموسمية وجودة المنتج.",
      "تحتفظ الوكالة بحق إيقاف إعلان أو حملة تُخالف سياسات المنصة الإعلانية دون الرجوع للعميل، مع إشعاره فوراً.",
      "أي تعديل على الإعلانات من قِبَل العميل مباشرةً على المنصة دون إبلاغ الوكالة قد يُؤثر على الأداء وتتحمل الوكالة مسؤوليته.",
    ],
  },
  {
    icon: Clock,
    title: "مدد ومواعيد الحملات",
    color: "#F0B429",
    content: [
      "الحد الأدنى لمدة الحملة هو شهر كامل (30 يوماً) لضمان الحصول على بيانات كافية للتحسين.",
      "يُوفَّر تقرير أسبوعي أولي خلال أول 14 يوماً لضبط الاستهداف والإبداعات.",
      "في حال رغب العميل في إيقاف الحملة قبل انتهاء المدة المتفق عليها، تُطبق سياسة الإلغاء المذكورة في صفحة الاسترجاع.",
      "يُلتزم بدء الحملة خلال 5 أيام عمل من اكتمال مواد الإعلان وسداد الرسوم.",
    ],
  },
  {
    icon: AlertCircle,
    title: "المحتوى المسموح والممنوع",
    color: "#EC4899",
    content: [
      "تلتزم جميع الحملات بسياسات إعلانات المنصات ذات الصلة وقوانين الإعلانات في الإمارات العربية المتحدة.",
      "محتوى ممنوع: المواد المضللة، المبالغة في الوعود، المقارنة المسيئة بالمنافسين، المحتوى المخالف للآداب العامة.",
      "يتحمل العميل المسؤولية القانونية الكاملة عن صحة ودقة المعلومات المقدمة في الإعلانات.",
      "تحتفظ الوكالة بحق رفض أي طلب إعلاني يُخالف قيمها المهنية أو قوانين الدولة.",
    ],
  },
  {
    icon: Shield,
    title: "ملكية الحسابات الإعلانية",
    color: "#9CA3AF",
    content: [
      "الحسابات الإعلانية المُنشأة بحساب العميل تظل ملكاً للعميل في جميع الأوقات.",
      "في حال استخدام حسابات الوكالة الإعلانية، يتم نقل ملكية الحملات والبيانات للعميل عند انتهاء التعاقد.",
      "تُحتفظ بنسخة من التقارير والبيانات لمدة سنة واحدة بعد انتهاء التعاقد.",
      "لا تستخدم الوكالة بيانات إعلانات عميل لصالح عميل آخر في القطاع ذاته.",
    ],
  },
];

export default function CampaignPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/campaign-policy"
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
                سياسة الحملات الإعلانية والميزانيات
              </h1>
              <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
                نظام واضح وشفاف يحدد كيفية إدارة الحملات وتوزيع الميزانيات لضمان مصلحة الجميع
              </p>
              <p className="text-[#9CA3AF] text-sm mt-4">آخر تحديث: يناير 2025</p>
            </motion.div>
          </div>
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
              transition={{ delay: 0.5 }}
              className="bg-[#111827] rounded-2xl p-7 text-center"
            >
              <h3 className="text-xl font-black text-white mb-2">لديك استفسار حول هذه السياسة؟</h3>
              <p className="text-[#9CA3AF] text-sm mb-5">فريقنا متاح للإجابة على جميع أسئلتك</p>
              <a
                href="https://wa.me/971551981564?text=لدي استفسار حول سياسة الحملات الإعلانية"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                تواصل معنا عبر واتساب
              </a>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
