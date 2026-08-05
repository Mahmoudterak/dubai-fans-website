import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/privacy");
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "مقدمة",
    content: `تلتزم دبي فانز بحماية خصوصية زوارها وعملائها. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للمعلومات الشخصية التي نحصل عليها من خلال موقعنا الإلكتروني mtuaefans.com والخدمات المرتبطة به.

باستخدامك لموقعنا أو خدماتنا، فإنك توافق على ممارسات الخصوصية الموضحة في هذه السياسة.`,
  },
  {
    title: "المعلومات التي نجمعها",
    content: `نجمع أنواعاً مختلفة من المعلومات لتقديم خدماتنا وتحسينها:

• معلومات الاتصال: الاسم، البريد الإلكتروني، رقم الهاتف، واسم الشركة عند التواصل معنا.
• معلومات الاستخدام: البيانات المتعلقة بكيفية استخدامك لموقعنا، بما في ذلك الصفحات المُزارة، ومدة الزيارة.
• البيانات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل، والأجهزة المستخدمة.
• ملفات تعريف الارتباط (Cookies): نستخدم ملفات Cookies لتحسين تجربة المستخدم وتحليل حركة المرور.`,
  },
  {
    title: "كيفية استخدام المعلومات",
    content: `نستخدم المعلومات التي نجمعها للأغراض التالية:

• تقديم وتحسين خدماتنا التسويقية والرقمية.
• التواصل معك بشأن طلباتك واستفساراتك.
• إرسال تحديثات وعروض تسويقية ذات صلة (مع إمكانية إلغاء الاشتراك).
• تحليل استخدام الموقع لتحسين تجربة المستخدم.
• الامتثال للمتطلبات القانونية المعمول بها في الإمارات.`,
  },
  {
    title: "مشاركة المعلومات",
    content: `نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات في الحالات التالية:

• مزودو الخدمات الموثوقون: أطراف ثالثة تساعدنا في تقديم خدماتنا (مثل أدوات التحليل والاستضافة) وفق اتفاقيات سرية صارمة.
• المتطلبات القانونية: عند الحاجة للامتثال للقوانين أو الأوامر القضائية في الإمارات.
• نقل الأعمال: في حالة الاندماج أو الاستحواذ، مع إخطارك مسبقاً.`,
  },
  {
    title: "الكوكيز وتقنيات التتبع",
    content: `يستخدم موقعنا ملفات تعريف الارتباط (Cookies) وتقنيات مشابهة لـ:

• تذكر تفضيلاتك وجلسات تصفحك.
• تحليل حركة المرور عبر Google Analytics.
• قياس أداء الحملات الإعلانية عبر Meta Pixel وGoogle Tag.

يمكنك ضبط متصفحك لرفض ملفات Cookies، لكن قد يؤثر ذلك على بعض وظائف الموقع.`,
  },
  {
    title: "حقوقك",
    content: `وفقاً لقوانين حماية البيانات المعمول بها، لديك الحق في:

• الوصول إلى معلوماتك الشخصية المحفوظة لدينا.
• طلب تصحيح أي معلومات غير دقيقة.
• طلب حذف معلوماتك الشخصية (بالقدر المسموح قانونياً).
• إلغاء الاشتراك في الاتصالات التسويقية.
• تقديم شكوى لدى السلطات المختصة في الإمارات.`,
  },
  {
    title: "أمان المعلومات",
    content: `نتخذ إجراءات أمنية معقولة لحماية معلوماتك من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف، بما في ذلك تشفير SSL وضوابط الوصول الإدارية.

رغم ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%، لذا لا يمكننا ضمان أمان مطلق.`,
  },
  {
    title: "خصوصية الأطفال",
    content: `خدماتنا موجهة للأعمال التجارية والبالغين. لا نجمع عن قصد معلومات شخصية من أفراد دون 18 عاماً. إذا علمنا بجمع معلومات من قاصر، سنحذفها فوراً.`,
  },
  {
    title: "التعديلات على السياسة",
    content: `قد نُحدّث هذه السياسة من وقت لآخر. سننشر أي تعديلات على هذه الصفحة مع تاريخ التحديث. نشجعك على مراجعة هذه السياسة دورياً للاطلاع على أي تغييرات.`,
  },
  {
    title: "التواصل معنا",
    content: `إذا كانت لديك أسئلة حول سياسة الخصوصية هذه أو ممارساتنا، تواصل معنا:\n\nالبريد الإلكتروني: info@mtuaefans.sbs\nواتساب: +971 55 198 1564\nالموقع: دبي، الإمارات العربية المتحدة`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-white font-sans">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        ogImage={PAGE_META.ogImage}
        canonical="/privacy"
        noindex={PAGE_META.noindex}
      />
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-14 mb-12">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
                آخر تحديث: يوليو 2025
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">سياسة الخصوصية</h1>
              <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
                نلتزم بحماية خصوصيتك وبياناتك الشخصية وفق أعلى معايير الأمان
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-[#CC0000]/20 text-[#CC0000] text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h2 className="text-xl font-black text-[#111827]">{s.title}</h2>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed text-sm whitespace-pre-line">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
