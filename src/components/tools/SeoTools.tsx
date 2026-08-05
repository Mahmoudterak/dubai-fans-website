import { useState } from "react";
import { useGenerateKeywords, useAuditSeo, useGenerateMeta } from "@workspace/api-client-react";
import { Copy, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { RateLimitCountdown, useRateLimitCountdown } from "@/components/RateLimitCountdown";

function KeywordGenerator() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const generateKeywords = useGenerateKeywords();
  const rateLimit = useRateLimitCountdown();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم النسخ بنجاح" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword || rateLimit.isRateLimited) return;
    generateKeywords.mutate(
      { data: { keyword, language } },
      { onError: (error) => rateLimit.handleError(error) },
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <h2 className="text-2xl font-black text-[#111827] mb-2">مُولّد الكلمات المفتاحية</h2>
      <p className="text-[#9CA3AF] mb-8 font-medium">احصل على أفكار كلمات مفتاحية، أسئلة شائعة، وكلمات طويلة الذيل لتعزيز محتواك.</p>
      
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-4 font-medium focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all" 
          placeholder="أدخل الكلمة المفتاحية الرئيسية..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="flex gap-4">
          <select 
            className="rounded-2xl border-2 border-[#E5E7EB] glass-card px-5 py-4 font-bold text-[#9CA3AF] focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
          <button 
            disabled={generateKeywords.isPending || !keyword || rateLimit.isRateLimited}
            className="bg-[#CC0000] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#AA0000] transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-[0_4px_16px_rgba(124,58,237,0.2)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
          >
            {generateKeywords.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "ولّد الآن"}
          </button>
        </div>
      </form>

      {rateLimit.isRateLimited && (
        <div className="mb-6"><RateLimitCountdown secondsLeft={rateLimit.secondsLeft} /></div>
      )}

      {generateKeywords.isError && !rateLimit.isRateLimited && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
          <span>حدث خطأ أثناء المعالجة، يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {generateKeywords.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
              الكلمات المقترحة
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
              <table className="w-full text-right border-collapse">
                <thead className="bg-[#F3F4F6] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-bold text-[#9CA3AF]">الكلمة</th>
                    <th className="px-5 py-4 text-sm font-bold text-[#9CA3AF]">النية (Intent)</th>
                    <th className="px-5 py-4 text-sm font-bold text-[#9CA3AF]">الصعوبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {generateKeywords.data.keywords.map((k, i) => (
                    <tr key={i} className="hover:bg-[#F3F4F6] transition-colors">
                      <td className="px-5 py-4 font-bold text-white">{k.keyword}</td>
                      <td className="px-5 py-4">
                        <span className="bg-[#F3F4F6] text-[#9CA3AF] px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">
                          {k.intent}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-block ${
                          k.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          k.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {k.difficulty === 'easy' ? 'سهل' : k.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F3F4F6] p-6 rounded-2xl border border-[#E5E7EB]">
              <h3 className="font-bold text-lg mb-5 text-white">أسئلة يبحث عنها الناس</h3>
              <div className="space-y-3">
                {generateKeywords.data.questions.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-card border border-[#E5E7EB] shadow-sm hover:border-[#CC0000]/30 transition-all group">
                    <span className="text-sm font-bold text-[#9CA3AF]">{q}</span>
                    <button 
                      onClick={() => handleCopy(q)} 
                      className="text-[#9CA3AF] hover:text-[#CC0000] bg-[#F3F4F6] hover:bg-[#CC0000]/10 p-2 rounded-lg transition-all"
                      title="نسخ"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#CC0000]/[0.02] p-6 rounded-2xl border border-[#CC0000]/10">
              <h3 className="font-bold text-lg mb-5 text-white">كلمات مفتاحية طويلة الذيل</h3>
              <div className="flex flex-wrap gap-2.5">
                {generateKeywords.data.longtail.map((lt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleCopy(lt)}
                    className="px-4 py-2 rounded-xl glass-card border border-[#E5E7EB] text-[#9CA3AF] hover:border-[#CC0000] hover:text-[#CC0000] shadow-sm transition-all text-sm font-bold flex items-center gap-2 group"
                  >
                    <span>{lt}</span>
                    <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SeoAudit() {
  const [url, setUrl] = useState("");
  const auditSeo = useAuditSeo();
  const rateLimit = useRateLimitCountdown();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || rateLimit.isRateLimited) return;
    auditSeo.mutate(
      { data: { url } },
      { onError: (error) => rateLimit.handleError(error) },
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "#10B981"; // green
    if (score >= 50) return "#F59E0B"; // yellow
    return "#EF4444"; // red
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <h2 className="text-2xl font-black text-[#111827] mb-2">فاحص السيو السريع</h2>
      <p className="text-[#9CA3AF] mb-8 font-medium">أدخل رابط موقعك واكتشف بسرعة أهم المشاكل وفرص التحسين.</p>
      
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          type="url"
          required
          className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-4 font-medium focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all text-left" 
          placeholder="https://example.com"
          dir="ltr"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          disabled={auditSeo.isPending || !url || rateLimit.isRateLimited}
          className="bg-[#1E1B4B] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-lg hover:-translate-y-0.5"
        >
          {auditSeo.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "افحص الموقع"}
        </button>
      </form>

      {rateLimit.isRateLimited && (
        <div className="mb-6"><RateLimitCountdown secondsLeft={rateLimit.secondsLeft} /></div>
      )}

      {auditSeo.isError && !rateLimit.isRateLimited && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
          <span>تعذر فحص الموقع. تأكد من صحة الرابط وحاول مجدداً.</span>
        </div>
      )}

      {auditSeo.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8 items-start">
          
          <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-[#F3F4F6] rounded-2xl border border-[#E5E7EB]">
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={getScoreColor(auditSeo.data.score)} 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 300" }}
                  animate={{ strokeDasharray: `${(auditSeo.data.score / 100) * 283}, 300` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{auditSeo.data.score}</span>
                <span className="text-xs font-bold text-[#9CA3AF] mt-1 uppercase tracking-widest">Score</span>
              </div>
            </div>
            <div className="text-center font-bold">
              {auditSeo.data.score >= 75 ? <span className="text-green-600">حالة ممتازة</span> :
               auditSeo.data.score >= 50 ? <span className="text-yellow-600">يحتاج بعض التحسين</span> :
               <span className="text-red-600">حالة حرجة</span>}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#CC0000] rounded-2xl p-6 text-white shadow-lg shadow-[#CC0000]/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-[#F0B429]">✦</span> إجراءات سريعة
              </h3>
              <ul className="space-y-3">
                {auditSeo.data.quickWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3 glass-card/10 p-3 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-[#F0B429] shrink-0 mt-0.5" />
                    <span className="font-medium text-sm leading-relaxed">{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg text-white mb-2">تفاصيل الفحص</h3>
              {auditSeo.data.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[#E5E7EB] glass-card shadow-sm">
                  <div className="mt-1 shrink-0">
                    {check.status === 'pass' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                     check.status === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                     <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white">{check.name}</h4>
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                        check.impact === 'high' ? 'bg-red-100 text-red-700' :
                        check.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        تأثير {check.impact === 'high' ? 'عالي' : check.impact === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] font-medium">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MetaGenerator() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const generateMeta = useGenerateMeta();
  const rateLimit = useRateLimitCountdown();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم النسخ بنجاح" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || rateLimit.isRateLimited) return;
    generateMeta.mutate(
      { data: { topic, language } },
      { onError: (error) => rateLimit.handleError(error) },
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <h2 className="text-2xl font-black text-[#111827] mb-2">مُولّد عنوان ووصف السيو</h2>
      <p className="text-[#9CA3AF] mb-8 font-medium">اكتب موضوع الصفحة وسيقوم الذكاء الاصطناعي بكتابة عنوان ووصف احترافي متوافق مع محركات البحث.</p>
      
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-4 font-medium focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all" 
          placeholder="موضوع الصفحة أو العنوان الحالي..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="flex gap-4">
          <select 
            className="rounded-2xl border-2 border-[#E5E7EB] glass-card px-5 py-4 font-bold text-[#9CA3AF] focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
          <button 
            disabled={generateMeta.isPending || !topic || rateLimit.isRateLimited}
            className="bg-[#CC0000] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#AA0000] transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-[0_4px_16px_rgba(124,58,237,0.2)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
          >
            {generateMeta.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "ولّد النصوص"}
          </button>
        </div>
      </form>

      {rateLimit.isRateLimited && (
        <div className="mb-6"><RateLimitCountdown secondsLeft={rateLimit.secondsLeft} /></div>
      )}

      {generateMeta.isError && !rateLimit.isRateLimited && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
          <span>حدث خطأ أثناء المعالجة، يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {generateMeta.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
          {generateMeta.data.variants.map((v, i) => (
            <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#CC0000]/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#1E1B4B] text-white text-xs font-bold px-3 py-1 rounded-lg">الخيار {i + 1}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[#9CA3AF]">العنوان (Title)</label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${v.titleLength > 60 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {v.titleLength} حرف
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 glass-card p-3 rounded-xl border border-[#E5E7EB] text-white font-bold text-lg shadow-sm">
                      {v.title}
                    </div>
                    <button onClick={() => handleCopy(v.title)} className="glass-card border border-[#E5E7EB] p-3 rounded-xl text-[#9CA3AF] hover:text-[#CC0000] hover:border-[#CC0000]/30 transition-all shadow-sm shrink-0">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[#9CA3AF]">الوصف (Description)</label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${v.descriptionLength > 160 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {v.descriptionLength} حرف
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 glass-card p-3 rounded-xl border border-[#E5E7EB] text-[#9CA3AF] font-medium text-sm leading-relaxed shadow-sm">
                      {v.description}
                    </div>
                    <button onClick={() => handleCopy(v.description)} className="glass-card border border-[#E5E7EB] p-3 rounded-xl text-[#9CA3AF] hover:text-[#CC0000] hover:border-[#CC0000]/30 transition-all shadow-sm shrink-0">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function SeoTools() {
  return (
    <div className="space-y-8">
      <KeywordGenerator />
      <SeoAudit />
      <MetaGenerator />
    </div>
  );
}
