import { useState } from "react";
import { useParams, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowRight, CheckCircle } from "lucide-react";

const servicesMeta: Record<string, { title: string; icon: string; color: string }> = {
  "content-management": { title: "إدارة المحتوى الرقمي", icon: "✍️", color: "#CC0000" },
  "analytics": { title: "تحليلات البيانات والتقارير", icon: "📊", color: "#F0B429" },
  "design-video": { title: "تصميم الجرافيك وإنتاج الفيديو", icon: "🎬", color: "#CC0000" },
  "websites": { title: "تطوير وتصميم المواقع", icon: "💻", color: "#F0B429" },
  "digital-marketing": { title: "التسويق الرقمي الشامل", icon: "📈", color: "#CC0000" },
  "campaigns": { title: "إدارة الحملات الإعلانية", icon: "🎯", color: "#CC0000" },
  "consulting": { title: "الاستشارات التسويقية", icon: "💡", color: "#F0B429" },
};

export default function ServiceInquiryPage() {
  const params = useParams<{ id: string }>();
  const service = servicesMeta[params.id] ?? { title: "طلب خدمة", icon: "🚀", color: "#CC0000" };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    business: "",
    city: "",
    budget: "",
    goal: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `مرحباً دبي فانز 👋\n\nأريد الاستفسار عن خدمة: *${service.title}*\n\n` +
      `الاسم: ${form.name}\nرقم الهاتف: ${form.phone}\nاسم النشاط: ${form.business}\n` +
      `المدينة: ${form.city}\nالميزانية: ${form.budget}\nالهدف: ${form.goal}\n` +
      (form.notes ? `ملاحظات: ${form.notes}` : "")
    );
    window.open(`https://wa.me/971551981564?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center max-w-md w-full"
          >
            <CheckCircle size={60} className="text-green-400 mx-auto mb-5" />
            <h2 className="text-2xl font-black text-[#111827] mb-3">تم إرسال طلبك!</h2>
            <p className="text-[#9CA3AF] mb-8">سيتواصل معك فريقنا خلال ساعات عبر واتساب.</p>
            <Link href="/services">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#CC0000] text-white rounded-xl font-bold mx-auto hover:bg-[#AA0000] transition-colors">
                <ArrowRight size={16} /> العودة للخدمات
              </button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-white">
      <SEOHead
        title={`طلب خدمة ${service.title} | دبي فانز`}
        description={`تواصل معنا لطلب خدمة ${service.title} من دبي فانز. أخبرنا عن مشروعك وميزانيتك وسيتواصل معك فريقنا خلال 24 ساعة.`}
        canonical={`/service-inquiry/${params.id}`}
        noindex={true}
      />
      <Navbar />

      <div className="pt-28 pb-20">
        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-10 mb-12">
          <div className="container mx-auto px-6">
            <Link href="/services" className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white text-sm mb-5 transition-colors">
              <ArrowRight size={16} /> العودة للخدمات
            </Link>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${service.color}20`, border: `1px solid ${service.color}30` }}
              >
                {service.icon}
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">تقديم طلب</p>
                <h1 className="text-2xl font-black text-[#111827]">{service.title}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-xl font-black text-[#111827] mb-2">أكمل بياناتك</h2>
            <p className="text-[#9CA3AF] text-sm mb-8">سيتم توجيهك إلى واتساب لإتمام التواصل مع فريقنا</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] mb-2">الاسم الكامل *</label>
                  <input required value={form.name} onChange={set("name")} placeholder="محمد أحمد"
                    className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] mb-2">رقم الواتساب *</label>
                  <input required value={form.phone} onChange={set("phone")} placeholder="+971 50 000 0000" dir="ltr"
                    className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] mb-2">اسم النشاط التجاري</label>
                  <input value={form.business} onChange={set("business")} placeholder="مثال: مطعم الفريج"
                    className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] mb-2">المدينة</label>
                  <select value={form.city} onChange={set("city")}
                    className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors">
                    <option value="">اختر المدينة</option>
                    {["دبي","أبوظبي","الشارقة","عجمان","رأس الخيمة","الفجيرة","أم القيوين"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">الميزانية الشهرية المتاحة</label>
                <select value={form.budget} onChange={set("budget")}
                  className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors">
                  <option value="">اختر الميزانية</option>
                  <option>أقل من 1,000 درهم</option>
                  <option>1,000 – 3,000 درهم</option>
                  <option>3,000 – 5,000 درهم</option>
                  <option>5,000 – 10,000 درهم</option>
                  <option>أكثر من 10,000 درهم</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">ما هدفك الرئيسي؟</label>
                <select value={form.goal} onChange={set("goal")}
                  className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors">
                  <option value="">اختر الهدف</option>
                  <option>زيادة المبيعات</option>
                  <option>بناء الوعي بالعلامة التجارية</option>
                  <option>زيادة المتابعين</option>
                  <option>إطلاق مشروع جديد</option>
                  <option>تحسين أداء الحملات الحالية</option>
                  <option>بناء موقع أو متجر إلكتروني</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea value={form.notes} onChange={set("notes")} rows={3}
                  placeholder="أي تفاصيل تريد إضافتها..."
                  className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors resize-none" />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#CC0000] text-[#111827] font-black text-base hover:bg-[#AA0000] hover:shadow-[0_0_30px_rgba(204,0,0,0.4)] transition-all duration-300"
              >
                <FaWhatsapp size={20} />
                إرسال الطلب عبر واتساب
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
