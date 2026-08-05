import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from "lucide-react";

const SUGGESTED = [
  { label: "أسعار المواقع", msg: "كم تكلفة تصميم موقع إلكتروني؟" },
  { label: "أنظمة ERP", msg: "ما هي أنظمة ERP التي تقدمونها؟" },
  { label: "Clinic OS", msg: "أريد معرفة تفاصيل نظام Clinic OS لإدارة العيادات" },
  { label: "AMLAK OS", msg: "ما هو نظام AMLAK OS لإدارة العقارات؟" },
  { label: "AI Business OS", msg: "ما هو نظام AI Business OS؟" },
  { label: "حجز استشارة", msg: "أريد حجز استشارة مجانية" },
];

type Message = { from: "user" | "bot"; text: string };

const QUICK_REPLIES: Record<string, string> = {
  "كم تكلفة تصميم موقع إلكتروني؟":
    "تبدأ أسعار تصميم المواقع لدينا من **2,500 درهم** للمواقع الأساسية وتصل إلى **15,000+ درهم** للمتاجر والمشاريع المتقدمة. يمكنني مساعدتك بعرض سعر مخصص — تواصل معنا عبر واتساب! 💬",
  "ما هي أنظمة ERP التي تقدمونها؟":
    "نقدم نظامين رائدين مطورَين داخلياً:\n• **Clinic OS** — لإدارة العيادات بالذكاء الاصطناعي\n• **AMLAK OS** — لإدارة العقارات والأملاك\nكلا النظامين مصمّمان خصيصاً للسوق العربي! 🚀",
  "أريد معرفة تفاصيل نظام Clinic OS لإدارة العيادات":
    "**Clinic OS** نظام ذكي يشمل:\n✔ إدخال صوتي بالعامية\n✔ روشتة ذكية بالذكاء الاصطناعي\n✔ إدارة المواعيد والمرضى\n✔ تكامل واتساب\n✔ تقارير مالية تفصيلية\nاحجز عرضاً تجريبياً مجانياً الآن! 🏥",
  "ما هو نظام AMLAK OS لإدارة العقارات؟":
    "**AMLAK OS** منصة SaaS عربية متكاملة لإدارة:\n✔ العقود والمستأجرين\n✔ المدفوعات والتحصيل\n✔ القضايا القانونية\n✔ طلبات الصيانة\n✔ إشعارات ذكية تلقائية\nزور amlakly.app للتجربة! 🏢",
  "ما هو نظام AI Business OS؟":
    "**AI Business OS** أول منصة عربية تجمع:\n✔ تحليل موقعك وحساباتك تلقائياً\n✔ مساعد ذكاء اصطناعي لأعمالك\n✔ خطط نمو مخصصة\n✔ تقارير أداء دورية\nجرّبها الآن مجاناً! ✨",
  "أريد حجز استشارة مجانية":
    "رائع! الاستشارة الأولى مجانية تماماً 🎉\nيمكنك حجزها عبر:\n• **واتساب:** wa.me/971551981564\n• أو انقر على رابط 'احجز عرضاً' في أي صفحة\nسيتواصل معك أحد متخصصينا خلال ساعات!",
};

export function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "مرحباً! 👋 أنا المساعد الذكي لدبي فانز. كيف يمكنني مساعدتك اليوم؟" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply =
        QUICK_REPLIES[text] ||
        "شكراً لسؤالك! للحصول على إجابة مفصّلة، تواصل معنا مباشرةً عبر واتساب وسيرد عليك أحد المتخصصين 💬";
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  }

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 left-4 sm:left-6 z-50 w-[340px] sm:w-[380px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-900/40"
            style={{
              background: "linear-gradient(135deg, rgba(13,17,35,0.98) 0%, rgba(30,20,60,0.98) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10"
              style={{ background: "linear-gradient(90deg, #7C3AED22 0%, #4F46E522 100%)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                    <Bot size={18} className="text-purple-300" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0D1123]" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">مساعد دبي فانز</p>
                  <p className="text-green-400 text-[11px] mt-0.5">متصل الآن</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      m.from === "user"
                        ? "bg-white/8 text-slate-200 rounded-bl-sm border border-white/8"
                        : "bg-gradient-to-br from-purple-600/80 to-indigo-600/80 text-white rounded-br-sm"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: m.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </div>
              ))}
              {typing && (
                <div className="flex justify-end">
                  <div className="bg-purple-600/40 border border-purple-500/20 px-4 py-2.5 rounded-2xl rounded-br-sm flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-purple-300 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: d, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 border-t border-white/6 pt-2">
              <p className="text-slate-500 text-[10px] mb-2 flex items-center gap-1">
                <Sparkles size={10} /> أسئلة مقترحة
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.msg)}
                    className="px-2.5 py-1 rounded-lg bg-white/6 border border-white/10 text-slate-300 text-[11px] hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-white transition-all duration-200 flex items-center gap-1"
                  >
                    <ChevronRight size={9} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="اكتب سؤالك هنا…"
                  dir="rtl"
                  className="flex-1 bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/50 transition-colors"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 flex items-center justify-center text-white transition-all duration-200 shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        animate={open ? {} : { boxShadow: ["0 0 0 0 rgba(139,92,246,0.5)", "0 0 0 14px rgba(139,92,246,0)", "0 0 0 0 rgba(139,92,246,0)"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-xl transition-all duration-300 hover:scale-110"
        style={{
          background: open
            ? "linear-gradient(135deg, #6D28D9, #4F46E5)"
            : "linear-gradient(135deg, #7C3AED, #6366F1)",
          boxShadow: open ? "0 4px 24px rgba(109,40,217,0.6)" : undefined,
        }}
        aria-label="المساعد الذكي"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
