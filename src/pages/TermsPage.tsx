import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/terms");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "قبول الشروط",
    content: `باستخدامك لموقع دبي فانز (mtuaefans.com) أو أي من خدماتنا الرقمية، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يُرجى التوقف عن استخدام الموقع.

تحتفظ دبي فانز بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد أي تعديل يُعدّ موافقةً ضمنية على الشروط المحدّثة.`,
  },
  {
    title: "هوية الشركة",
    content: `دبي فانز (mtuaefans Digital Marketing) وكالة تسويق رقمي مرخّصة ومسجّلة في الإمارات العربية المتحدة.

• رقم الترخيص الإعلاني: 0701430
• رقم السجل التجاري (CN): 6394197
• المقر الرئيسي: دبي، الإمارات العربية المتحدة
• البريد الإلكتروني: info@mtuaefans.sbs
• هاتف/واتساب: +971 55 198 1564`,
  },
  {
    title: "الخدمات المقدّمة",
    content: `تقدم دبي فانز مجموعة من الخدمات الرقمية تشمل:
• إدارة الحملات الإعلانية (Meta Ads, Google Ads, TikTok Ads, Snapchat Ads)
• تصميم وتطوير المواقع الإلكترونية والمتاجر الرقمية
• إدارة حسابات السوشيال ميديا وإنتاج المحتوى
• تحسين محركات البحث (SEO)
• تصميم الهوية البصرية والجرافيك
• الاستشارات التسويقية

تخضع جميع الخدمات لشروط العقد المبرم مع العميل، وتُعدّ هذه الاتفاقية جزءاً لا يتجزأ من الشروط العامة.`,
  },
  {
    title: "العقود والمدفوعات",
    content: `• جميع العقود مكتوبة وموقّعة من الطرفين قبل بدء أي خدمة.
• الأسعار المعروضة بالدرهم الإماراتي (AED) وتشمل الضريبة إن وُجدت.
• يُدفع ما لا يقل عن 50% من قيمة العقد مقدماً لبدء العمل.
• يستلزم إلغاء العقد إشعاراً كتابياً قبل 14 يوم عمل.
• للاطلاع على سياسة الاسترداد الكاملة، تفضّل بزيارة صفحة سياسة الاسترجاع.`,
  },
  {
    title: "حقوق الملكية الفكرية",
    content: `• جميع المحتويات على الموقع (نصوص، صور، تصاميم، فيديوهات، شعارات) مملوكة لدبي فانز أو مُرخَّصة لها.
• لا يُسمح بنسخ أو إعادة نشر أي محتوى دون إذن كتابي مسبق.
• المحتوى الإبداعي المنتج للعملاء (تصاميم، فيديوهات، نصوص) يُنقل ملكيته للعميل بعد سداد جميع المستحقات كاملة.
• تحتفظ دبي فانز بحق عرض الأعمال المنجزة في محفظتها التسويقية ما لم يُنص على خلاف ذلك في العقد.`,
  },
  {
    title: "سلوك المستخدم",
    content: `يوافق المستخدم على عدم:
• استخدام الموقع لأغراض غير قانونية أو مخالفة للتشريعات الإماراتية.
• محاولة الوصول غير المصرح به إلى أنظمة الموقع أو قواعد بياناته.
• نشر أي محتوى مسيء أو تشهيري عبر أي وسيلة تواصل مع الشركة.
• انتهاك حقوق الملكية الفكرية لدبي فانز أو عملائها.`,
  },
  {
    title: "إخلاء المسؤولية",
    content: `• تُقدَّم الأدوات المجانية (تحليل SEO، حاسبة ROI، إلخ) "كما هي" دون ضمانات.
• لا تتحمل دبي فانز مسؤولية أي خسائر ناجمة عن تطبيق توصيات الأدوات المجانية دون مراجعة متخصص.
• أداء الحملات الإعلانية يتأثر بعوامل خارجة عن سيطرة الوكالة (منافسة السوق، تغييرات المنصات، الميزانية).
• دبي فانز غير مسؤولة عن أي انقطاع في خدمات المنصات الخارجية (Meta, Google, TikTok).`,
  },
  {
    title: "الروابط الخارجية",
    content: `قد يحتوي الموقع على روابط لمواقع طرف ثالث. لا تتحمل دبي فانز أي مسؤولية عن محتوى تلك المواقع أو سياسات خصوصيتها. نشجعك على مراجعة شروط الاستخدام وسياسة الخصوصية لكل موقع تزوره.`,
  },
  {
    title: "القانون المطبّق وحل النزاعات",
    content: `• تخضع هذه الشروط لقوانين الإمارات العربية المتحدة وتُفسَّر وفقاً لها.
• في حال نشوء أي نزاع، يُسعى أولاً لحله بالتراضي خلال 30 يوم عمل.
• إذا تعذّر الحل الودّي، يُحال النزاع إلى محاكم إمارة دبي المختصة.`,
  },
  {
    title: "التواصل",
    content: `لأي استفسار بشأن هذه الشروط، يُرجى التواصل معنا:
• البريد الإلكتروني: info@mtuaefans.sbs
• واتساب: +971 55 198 1564
• ساعات العمل: السبت – الخميس: 9:00 ص – 11:00 م`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/terms"
        noindex={PAGE_META.noindex}
      />
      <Navbar />

      <div className="pt-28 pb-16">
        {/* Header */}
        <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] py-12 mb-12">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#CC0000]/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-[#CC0000]" />
            </div>
            <h1 className="text-3xl font-black text-[#111827] mb-2">شروط الاستخدام</h1>
            <p className="text-[#6B7280] text-sm">آخر تحديث: يناير 2025 | دبي فانز — mtuaefans Digital Marketing</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-8">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#CC0000] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-black text-[#111827]">{sec.title}</h2>
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed whitespace-pre-line">{sec.content}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 bg-[#FFF5F5] border border-[#CC0000]/20 rounded-2xl text-center">
            <p className="text-[#4B5563] text-sm mb-3">لديك سؤال حول هذه الشروط؟</p>
            <a
              href="https://wa.me/971551981564?text=لدي سؤال حول شروط الاستخدام"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#AA0000] transition-colors"
            >
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
