import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaLinkedin } from "react-icons/fa";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { RecaptchaWidget } from "@/components/RecaptchaWidget";

export function Contact() {
  const [form, setForm] = useState(() => {
    const subject = typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("subject")?.trim() ?? "";
    return { name: "", phone: "", service: subject, message: "" };
  });
  const [humanVerified, setHumanVerified] = useState(false);

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanVerified) return;
    const msg = `مرحباً دبي فانز 👋\n\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالخدمة المطلوبة: ${form.service}\n\nالرسالة:\n${form.message}`;
    window.open(`https://wa.me/971551981564?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CC0000]/6 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4">
            ابدأ رحلة نموك <span className="gradient-text">اليوم</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg">
            فريقنا جاهز للرد خلال دقائق — أخبرنا عن مشروعك وسنبني لك خطة نمو مخصصة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleWhatsApp}
            className="glass-card rounded-2xl p-8 space-y-5"
          >
            <h3 className="text-xl font-black text-[#111827] mb-2">أرسل لنا رسالة</h3>

            {[
              { key: "name", label: "الاسم الكامل", placeholder: "محمد أحمد", type: "text" },
              { key: "phone", label: "رقم الهاتف / واتساب", placeholder: "+971 55 XXX XXXX", type: "tel" },
              { key: "service", label: "الخدمة المطلوبة", placeholder: "إدارة حملات / موقع / سوشيال ميديا", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-[#374151] mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-white placeholder:text-[#4B5563] focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-colors text-sm"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-[#374151] mb-1.5">رسالتك</label>
              <textarea
                rows={4}
                placeholder="أخبرنا عن مشروعك وأهدافك التسويقية..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-white placeholder:text-[#4B5563] focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-colors text-sm resize-none"
              />
            </div>

            <RecaptchaWidget
              onVerified={() => setHumanVerified(true)}
              onExpired={() => setHumanVerified(false)}
            />

            <button
              type="submit"
              disabled={!humanVerified}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#CC0000] text-white rounded-xl font-black text-base hover:bg-[#AA0000] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaWhatsapp size={20} />
              أرسل عبر واتساب
            </button>
          </motion.form>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {[
              { icon: Phone, label: "هاتف / واتساب", value: "+971 55 198 1564", href: "tel:+971551981564", color: "#CC0000" },
              { icon: Phone, label: "هاتف بديل", value: "+971 56 895 2775", href: "tel:+971568952775", color: "#CC0000" },
              { icon: Mail, label: "البريد الإلكتروني", value: "info@mtuaefans.sbs", href: "mailto:info@mtuaefans.sbs", color: "#F0B429" },
              { icon: MapPin, label: "الموقع", value: "دبي، الإمارات العربية المتحدة", href: "https://maps.google.com/?q=Dubai,UAE", color: "#10B981" },
              { icon: Clock, label: "ساعات العمل", value: "السبت – الخميس: 9 ص – 11 م", href: null, color: "#06B6D4" },
            ].map((info, i) => (
              <div key={i} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#CC0000]/30 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${info.color}15`, border: `1px solid ${info.color}30` }}
                >
                  <info.icon size={20} style={{ color: info.color }} />
                </div>
                <div>
                  <div className="text-xs text-[#9CA3AF] font-semibold mb-0.5">{info.label}</div>
                  {info.href ? (
                    <a href={info.href} target="_blank" rel="noopener noreferrer"
                      className="text-[#111827] font-bold hover:text-[#CC0000] transition-colors text-sm">
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-[#111827] font-bold text-sm">{info.value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm text-[#9CA3AF] font-bold mb-4">تابعنا على السوشيال ميديا</p>
              <div className="flex gap-3">
                {[
                  { Icon: FaWhatsapp, href: "https://wa.me/971551981564", color: "#25D366", label: "واتساب" },
                  { Icon: FaInstagram, href: "https://www.instagram.com/mtuaefans", color: "#E1306C", label: "إنستغرام" },
                  { Icon: FaFacebook, href: "https://www.facebook.com/mtuaefans", color: "#1877F2", label: "فيسبوك" },
                  { Icon: FaTiktok, href: "https://www.tiktok.com/@mtuaefans", color: "#FFFFFF", label: "تيك توك" },
                  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mahmoudterak-mt-050a97427/", color: "#0A66C2", label: "لينكدإن" },
                ].map(({ Icon, href, color, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center hover:border-[#CC0000]/50 hover:scale-110 transition-all duration-300"
                  >
                    <Icon size={18} style={{ color }} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
