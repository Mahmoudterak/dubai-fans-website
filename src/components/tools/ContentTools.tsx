import { useState } from "react";
import { useGenerateContentIdeas, useGenerateHashtags } from "@workspace/api-client-react";
import { Copy, AlertTriangle, Loader2, Sparkles, Image as ImageIcon, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { RateLimitCountdown, useRateLimitCountdown } from "@/components/RateLimitCountdown";

function ContentIdeasGenerator() {
  const { toast } = useToast();
  const [niche, setNiche] = useState("");
  const generateIdeas = useGenerateContentIdeas();
  const rateLimit = useRateLimitCountdown();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم النسخ بنجاح" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || rateLimit.isRateLimited) return;
    generateIdeas.mutate(
      { data: { niche } },
      { onError: (error) => rateLimit.handleError(error) },
    );
  };

  const getPlatformColors = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'tiktok': return 'bg-[#F3F4F6] text-white border-[#E5E7EB]';
      case 'facebook': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // all
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">مُولّد أفكار المحتوى بالذكاء الاصطناعي</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">أدخل مجال عملك واحصل على 10 أفكار محتوى جاهزة للتنفيذ.</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-4 font-medium focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all" 
          placeholder="مثال: مطعم برجر، عيادة أسنان، مكتب عقارات..."
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
        <button 
          disabled={generateIdeas.isPending || !niche || rateLimit.isRateLimited}
          className="bg-[#1E1B4B] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-70 flex items-center justify-center min-w-[160px] shadow-lg hover:-translate-y-0.5"
        >
          {generateIdeas.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "ولّد 10 أفكار"}
        </button>
      </form>

      {rateLimit.isRateLimited && (
        <div className="mb-6"><RateLimitCountdown secondsLeft={rateLimit.secondsLeft} /></div>
      )}

      {generateIdeas.isError && !rateLimit.isRateLimited && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
          <span>حدث خطأ أثناء المعالجة، يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {generateIdeas.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
          {generateIdeas.data.ideas.map((idea, i) => (
            <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#CC0000]/30 transition-all group relative">
              <div className="flex gap-2 mb-4">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${getPlatformColors(idea.platform)}`}>
                  {idea.platform}
                </span>
                <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB]">
                  {idea.format}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-[#9CA3AF] text-xs font-bold mb-1">الـ Hook (الخطاف)</p>
                <p className="text-[#CC0000] font-bold text-sm bg-[#CC0000]/5 p-3 rounded-xl border border-[#CC0000]/10 leading-relaxed">
                  "{idea.hook}"
                </p>
              </div>

              <p className="text-white font-medium text-sm leading-relaxed mb-4">
                {idea.idea}
              </p>

              <button 
                onClick={() => handleCopy(`${idea.hook}\n\n${idea.idea}`)}
                className="absolute top-4 left-4 glass-card border border-[#E5E7EB] p-2 rounded-lg text-[#9CA3AF] hover:text-[#CC0000] shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function ImageSizes() {
  const platforms = [
    {
      name: "إنستغرام",
      color: "bg-pink-500",
      sizes: [
        { type: "Post (مربع)", size: "1080 x 1080", ratio: "1:1" },
        { type: "Post (طولي)", size: "1080 x 1350", ratio: "4:5" },
        { type: "Story / Reel", size: "1080 x 1920", ratio: "9:16" },
        { type: "Cover", size: "1080 x 566", ratio: "1.91:1" }
      ]
    },
    {
      name: "تيك توك",
      color: "bg-[#F3F4F6]",
      sizes: [
        { type: "فيديو", size: "1080 x 1920", ratio: "9:16" },
        { type: "Profile", size: "200 x 200", ratio: "1:1" }
      ]
    },
    {
      name: "فيسبوك",
      color: "bg-blue-600",
      sizes: [
        { type: "Post", size: "1200 x 630", ratio: "1.91:1" },
        { type: "Story", size: "1080 x 1920", ratio: "9:16" },
        { type: "Cover", size: "851 x 315", ratio: "2.7:1" }
      ]
    },
    {
      name: "لينكدإن",
      color: "bg-blue-800",
      sizes: [
        { type: "Post", size: "1200 x 627", ratio: "1.91:1" },
        { type: "Cover", size: "1584 x 396", ratio: "4:1" }
      ]
    }
  ];

  const { toast } = useToast();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم نسخ المقاس" });
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">مقاسات صور السوشيال ميديا 2024</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">المرجع السريع لأبعاد التصميم الصحيحة لكل منصة</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform, idx) => (
          <div key={idx} className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className={`${platform.color} text-white px-5 py-3 font-bold text-lg`}>
              {platform.name}
            </div>
            <div className="divide-y divide-gray-50 bg-[#F3F4F6]">
              {platform.sizes.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:glass-card transition-colors group">
                  <div>
                    <p className="font-bold text-white text-sm mb-1">{s.type}</p>
                    <p className="text-xs text-[#9CA3AF] font-medium">النسبة: {s.ratio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#CC0000] bg-[#CC0000]/10 px-2 py-1 rounded-md">{s.size}</span>
                    <button onClick={() => handleCopy(s.size)} className="text-[#9CA3AF] hover:text-[#CC0000] opacity-0 group-hover:opacity-100 transition-all">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HashtagGenerator() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "both">("both");
  const generateHashtags = useGenerateHashtags();
  const rateLimit = useRateLimitCountdown();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم النسخ بنجاح" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || rateLimit.isRateLimited) return;
    generateHashtags.mutate(
      { data: { topic, platform } },
      { onError: (error) => rateLimit.handleError(error) },
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#F0B429]/10 flex items-center justify-center text-[#F0B429]">
          <Hash className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">مُولّد الهاشتاجات الذكي</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">احصل على مزيج مثالي من الهاشتاجات الشائعة والمحلية لزيادة الوصول.</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          className="flex-1 rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-4 font-medium focus:glass-card focus:outline-none focus:border-[#F0B429] focus:ring-4 focus:ring-[#F0B429]/10 transition-all" 
          placeholder="موضوع المنشور (مثال: قهوة مختصة، عقارات دبي)..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="flex gap-4">
          <select 
            className="rounded-2xl border-2 border-[#E5E7EB] glass-card px-5 py-4 font-bold text-[#9CA3AF] focus:outline-none focus:border-[#F0B429] focus:ring-4 focus:ring-[#F0B429]/10 transition-all cursor-pointer"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as any)}
          >
            <option value="both">كلاهما</option>
            <option value="instagram">إنستغرام</option>
            <option value="tiktok">تيك توك</option>
          </select>
          <button 
            disabled={generateHashtags.isPending || !topic}
            className="bg-[#F0B429] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#D97706] hover:text-white transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-lg hover:-translate-y-0.5"
          >
            {generateHashtags.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "ولّد الهاشتاجات"}
          </button>
        </div>
      </form>

      {rateLimit.isRateLimited && (
        <div className="mb-6"><RateLimitCountdown secondsLeft={rateLimit.secondsLeft} /></div>
      )}

      {generateHashtags.isError && !rateLimit.isRateLimited && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
          <span>حدث خطأ أثناء المعالجة، يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {generateHashtags.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="bg-[#F3F4F6] p-6 rounded-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white">القائمة الجاهزة للنسخ</h3>
              <button 
                onClick={() => handleCopy(generateHashtags.data!.all.join(" "))}
                className="bg-[#1E1B4B] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                نسخ الكل
              </button>
            </div>
            <div className="glass-card p-4 rounded-xl border border-[#E5E7EB] text-[#9CA3AF] text-sm leading-relaxed shadow-inner">
              {generateHashtags.data.all.join(" ")}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#9CA3AF]">🔥 شائعة (High Volume)</h4>
              <div className="flex flex-wrap gap-2">
                {generateHashtags.data.popular.map((h, i) => (
                  <button key={i} onClick={() => handleCopy(h)} className="text-xs font-medium px-3 py-1.5 bg-[#F3F4F6] hover:bg-[#CC0000] hover:text-white rounded-lg transition-colors text-[#9CA3AF]">
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#9CA3AF]">🎯 تخصصية (Niche)</h4>
              <div className="flex flex-wrap gap-2">
                {generateHashtags.data.niche.map((h, i) => (
                  <button key={i} onClick={() => handleCopy(h)} className="text-xs font-medium px-3 py-1.5 bg-[#F3F4F6] hover:bg-[#CC0000] hover:text-white rounded-lg transition-colors text-[#9CA3AF]">
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#9CA3AF]">📍 محلية (Local/Gulf)</h4>
              <div className="flex flex-wrap gap-2">
                {generateHashtags.data.local.map((h, i) => (
                  <button key={i} onClick={() => handleCopy(h)} className="text-xs font-medium px-3 py-1.5 bg-[#F0B429]/10 hover:bg-[#F0B429] hover:text-white rounded-lg transition-colors text-[#D97706]">
                    {h}
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

export default function ContentTools() {
  return (
    <div className="space-y-8">
      <ContentIdeasGenerator />
      <HashtagGenerator />
      <ImageSizes />
    </div>
  );
}
