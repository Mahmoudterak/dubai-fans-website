import { useState } from "react";
import { Copy, MessageCircle, Mail, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function WhatsAppLink() {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("+971");
  const [message, setMessage] = useState("");

  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = `${code.replace('+', '')}${cleanPhone}`;
  const link = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast({ description: "تم نسخ الرابط بنجاح" });
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">مُولّد رابط واتساب المباشر</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">أنشئ رابطاً مباشراً لبدء محادثة واتساب مع عملائك بسهولة.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">رقم الهاتف</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                dir="ltr"
                className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-3 font-bold focus:glass-card focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-left" 
                placeholder="55 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <select 
                dir="ltr"
                className="rounded-2xl border-2 border-[#E5E7EB] glass-card px-4 py-3 font-bold text-[#9CA3AF] focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all cursor-pointer w-28"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              >
                <option value="+971">+971 🇦🇪</option>
                <option value="+966">+966 🇸🇦</option>
                <option value="+965">+965 🇰🇼</option>
                <option value="+20">+20 🇪🇬</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">الرسالة المجهزة مسبقاً</label>
            <textarea 
              rows={4}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-3 font-medium focus:glass-card focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none" 
              placeholder="مرحباً، أريد الاستفسار عن خدماتكم..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#F3F4F6] rounded-2xl p-6 border border-[#E5E7EB] flex flex-col justify-between">
          <div className="mb-6">
            <p className="text-sm font-bold text-[#9CA3AF] mb-2">الرابط المباشر:</p>
            <div className="glass-card p-4 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#9CA3AF] break-all h-24 overflow-y-auto font-mono text-left" dir="ltr">
              {phone ? link : "https://wa.me/..."}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-3">
              <button 
                onClick={handleCopy}
                disabled={!phone}
                className="w-full bg-[#1E1B4B] text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
              >
                <Copy className="w-5 h-5" />
                نسخ الرابط
              </button>
              <a 
                href={phone ? link : "#"}
                target="_blank"
                rel="noreferrer"
                className={`w-full px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${phone ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-[#E5E7EB] text-[#9CA3AF] pointer-events-none'}`}
              >
                <ExternalLink className="w-5 h-5" />
                اختبار الرابط
              </a>
            </div>
            
            <div className="shrink-0 text-center">
              <div className="glass-card p-2 rounded-2xl border border-[#E5E7EB] mb-2 w-[120px] h-[120px] flex items-center justify-center">
                {phone ? (
                  <img loading="lazy" decoding="async" src={qrUrl} alt="QR Code" className="w-full h-full rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-[#F3F4F6] rounded-xl flex items-center justify-center">
                    <span className="text-[#9CA3AF] text-xs font-bold text-center">أدخل الرقم<br/>لإنشاء QR</span>
                  </div>
                )}
              </div>
              <a 
                href={phone ? qrUrl : "#"}
                download="whatsapp-qr.png"
                className={`text-xs font-bold flex items-center justify-center gap-1 ${phone ? 'text-green-600 hover:text-green-700' : 'text-[#9CA3AF] pointer-events-none'}`}
              >
                <Download className="w-3 h-3" /> تحميل
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSignature() {
  const { toast } = useToast();
  const [data, setData] = useState({
    name: "أحمد محمد",
    title: "مدير التسويق",
    company: "شركة دبي فانز",
    phone: "+971 50 123 4567",
    email: "ahmed@dubaifans.com",
    website: "www.dubaifans.com",
    color: "#CC0000"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const htmlString = `
<table cellpadding="0" cellspacing="0" border="0" dir="rtl" style="font-family: Arial, sans-serif; color: #1E1B4B;">
  <tr>
    <td style="padding-left: 20px; border-left: 3px solid ${data.color};">
      <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: ${data.color};">${data.name}</h2>
      <p style="margin: 4px 0 10px; font-size: 14px; color: #6B7280;">${data.title} | ${data.company}</p>
      
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; color: #4B5563;">
        <tr>
          <td style="padding-bottom: 4px;"><strong style="color: ${data.color};">م:</strong> <span dir="ltr">${data.phone}</span></td>
        </tr>
        <tr>
          <td style="padding-bottom: 4px;"><strong style="color: ${data.color};">إ:</strong> <a href="mailto:${data.email}" style="color: #4B5563; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr>
          <td><strong style="color: ${data.color};">و:</strong> <a href="http://${data.website}" style="color: #4B5563; text-decoration: none;">${data.website}</a></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `.trim();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlString);
    toast({ description: "تم نسخ كود HTML للتوقيع" });
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000]">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">مُنشئ التوقيع الإلكتروني (Email Signature)</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">صمم توقيع بريد احترافي وانسخه مباشرة إلى Gmail أو Outlook.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">الاسم الكامل</label>
              <input name="name" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">المسمى الوظيفي</label>
              <input name="title" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.title} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9CA3AF] mb-1">اسم الشركة</label>
            <input name="company" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.company} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">رقم الجوال</label>
              <input name="phone" dir="ltr" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">البريد الإلكتروني</label>
              <input name="email" dir="ltr" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.email} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">الموقع الإلكتروني</label>
              <input name="website" dir="ltr" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.website} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">اللون الرئيسي</label>
              <div className="flex gap-2">
                <input type="color" name="color" className="w-10 h-10 rounded-xl cursor-pointer p-0 border-0" value={data.color} onChange={handleChange} />
                <input name="color" dir="ltr" className="flex-1 rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={data.color} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F3F4F6] rounded-2xl p-6 border border-[#E5E7EB] flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-[#9CA3AF] mb-4">معاينة التوقيع:</p>
            <div className="glass-card p-6 rounded-2xl shadow-sm border border-[#E5E7EB] overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: htmlString }} />
            </div>
          </div>
          
          <button 
            onClick={handleCopyHtml}
            className="mt-6 w-full bg-[#1E1B4B] text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Copy className="w-5 h-5" />
            نسخ كود HTML
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommunicationTools() {
  return (
    <div className="space-y-8">
      <WhatsAppLink />
      <EmailSignature />
    </div>
  );
}
