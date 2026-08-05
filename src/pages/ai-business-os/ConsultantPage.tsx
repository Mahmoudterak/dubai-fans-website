import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";
import {
  Send, Plus, Bot, User, Trash2, ArrowRight, Sparkles, ChevronRight,
} from "lucide-react";

const API = "/api";

/* ─── Types ─────────────────────────────────────────────── */
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
interface Session {
  id: string;           // local key
  dbId?: number;        // DB conversation id — set after first message is saved
  title: string;
  messages: Message[];
  createdAt: number;
  loaded?: boolean;     // whether messages have been fetched from DB
}

/* ─── Suggested questions ────────────────────────────────── */
const suggestions = [
  "كيف أزيد مبيعاتي عبر الإنستغرام؟",
  "ما هي أفضل استراتيجية إعلانية في دبي؟",
  "كيف أبني هوية تجارية قوية بميزانية محدودة؟",
  "ما هي أفضل أوقات النشر على السوشيال ميديا؟",
  "كيف أحسّن تقييمات نشاطي على جوجل؟",
  "كيف أبدأ في TikTok Ads في الإمارات؟",
];

/* ─── MarkdownText ───────────────────────────────────────── */
function MessageText({ content }: { content: string }) {
  // Simple markdown: bold, bullet lists
  const lines = content.split("\n");
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#CC0000] mt-1 shrink-0">•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        if (line.match(/^\d+\./)) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="font-bold text-[#CC0000] shrink-0">{line.match(/^\d+/)![0]}.</span>
              <span>{line.replace(/^\d+\./, "").trim()}</span>
            </div>
          );
        }
        // Bold within line
        const parts = line.split(/\*\*([^*]+)\*\*/g);
        if (parts.length > 1) {
          return (
            <p key={i}>
              {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
            </p>
          );
        }
        return line ? <p key={i}>{line}</p> : <div key={i} className="h-1" />;
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function ConsultantPage() {
  const [sessions, setSessions]       = useState<Session[]>(() => {
    try { return JSON.parse(localStorage.getItem("aib_sessions") || "[]"); }
    catch { return []; }
  });
  const [currentId, setCurrentId]     = useState<string>(() => {
    const saved = JSON.parse(localStorage.getItem("aib_sessions") || "[]");
    return saved[0]?.id || "";
  });
  const [input, setInput]             = useState("");
  const [streaming, setStreaming]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  const currentSession = sessions.find(s => s.id === currentId);

  const saveSessions = useCallback((updated: Session[]) => {
    setSessions(updated);
    localStorage.setItem("aib_sessions", JSON.stringify(updated));
  }, []);

  const newSession = useCallback(() => {
    const s: Session = {
      id:        Date.now().toString(),
      title:     "محادثة جديدة",
      messages:  [],
      createdAt: Date.now(),
      loaded:    true,
    };
    const updated = [s, ...sessions];
    saveSessions(updated);
    setCurrentId(s.id);
    if (isMobile()) setSidebarOpen(false);
  }, [sessions, saveSessions]);

  /* ── On mount: load conversations from DB ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/ai-business-os/conversations`, { headers: { "X-Requested-With": "fetch" } });
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations) && data.conversations.length) {
          let mergedFirstId = `db-${data.conversations[0].id}`;

          setSessions(prev => {
            // Build a lookup: dbId → local session id (so we never break existing currentId refs)
            const dbIdToLocalId: Record<number, string> = {};
            for (const s of prev) {
              if (s.dbId != null) dbIdToLocalId[s.dbId] = s.id;
            }

            const dbSessions: Session[] = data.conversations.map((c: any) => {
              const localId = dbIdToLocalId[c.id] ?? `db-${c.id}`;
              return {
                id:        localId,
                dbId:      c.id,
                title:     c.title || "محادثة",
                messages:  [],
                createdAt: new Date(c.createdAt).getTime(),
                loaded:    false,
              };
            });

            // Remember the stable id for the first DB session
            mergedFirstId = dbSessions[0].id;

            // Keep local sessions that have no DB counterpart (new unsaved chats)
            const dbSessionIds = new Set(dbSessions.map(s => s.id));
            const localOnly    = prev.filter(s => !s.dbId && !dbSessionIds.has(s.id));
            const merged       = [...dbSessions, ...localOnly];
            localStorage.setItem("aib_sessions", JSON.stringify(merged));
            return merged;
          });

          // Only update currentId if it is empty; otherwise the preserved local id stays valid
          setCurrentId(prev => prev || mergedFirstId);
        } else if (sessions.length === 0) {
          newSession();
        }
      } catch {
        if (sessions.length === 0) newSession();
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Load messages when switching to a DB session ── */
  useEffect(() => {
    const sess = sessions.find(s => s.id === currentId);
    if (!sess || sess.loaded || !sess.dbId) return;
    (async () => {
      try {
        const res  = await fetch(`${API}/ai-business-os/conversations/${sess.dbId}`, { headers: { "X-Requested-With": "fetch" } });
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const msgs: Message[] = data.messages.map((m: any) => ({
            role:      m.role as "user" | "assistant",
            content:   m.content,
            timestamp: new Date(m.createdAt).getTime(),
          }));
          setSessions(prev => {
            const updated = prev.map(s =>
              s.id !== currentId ? s : { ...s, messages: msgs, loaded: true }
            );
            localStorage.setItem("aib_sessions", JSON.stringify(updated));
            return updated;
          });
        }
      } catch { /**/ }
    })();
  }, [currentId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages]);

  const MAX_MESSAGE_LENGTH = 4000;

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    if (text.trim().length > MAX_MESSAGE_LENGTH) return;

    const userMsg: Message = { role: "user", content: text.trim(), timestamp: Date.now() };
    const currentDbId      = currentSession?.dbId;

    const updatedWithUser = sessions.map(s =>
      s.id !== currentId ? s : {
        ...s,
        title:   s.messages.length === 0 ? text.slice(0, 40) : s.title,
        messages: [...s.messages, userMsg],
        loaded:  true,
      }
    );
    saveSessions(updatedWithUser);
    setInput("");
    setStreaming(true);

    // Placeholder for assistant response
    const assistantMsg: Message = { role: "assistant", content: "", timestamp: Date.now() };
    const updatedWithPlaceholder = updatedWithUser.map(s =>
      s.id !== currentId ? s : { ...s, messages: [...s.messages, assistantMsg] }
    );
    saveSessions(updatedWithPlaceholder);

    try {
      const history = currentSession?.messages.slice(-12) ?? [];
      const body: Record<string, unknown> = { message: text.trim(), history };
      if (currentDbId) body.conversationId = currentDbId;

      const res = await fetch(`${API}/ai-business-os/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "عذراً، حدث خطأ. يرجى المحاولة مجدداً.");
      }

      if (!res.body) throw new Error("No stream");
      const reader   = res.body.getReader();
      const decoder  = new TextDecoder();
      let full       = "";
      let newDbId    : number | undefined;
      let buffer     = "";  // carry-over for split SSE frames

      while (true) {
        const { done, value } = await reader.read();
        // On done flush remaining buffer; otherwise accumulate
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

        // Split on double-newline (SSE event boundary) to get complete events
        const events = buffer.split(/\n\n/);
        // Keep the last (potentially incomplete) segment in the buffer
        buffer = events.pop() ?? "";

        for (const event of events) {
          for (const line of event.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const evt = JSON.parse(line.slice(6));
              // First event carries metadata (conversationId) — keep local id intact
              if (evt.meta?.conversationId) {
                newDbId = evt.meta.conversationId;
                setSessions(prev => {
                  const u = prev.map(s =>
                    s.id !== currentId ? s : { ...s, dbId: newDbId }
                  );
                  localStorage.setItem("aib_sessions", JSON.stringify(u));
                  return u;
                });
              }
              if (evt.content) {
                full += evt.content;
                setSessions(prev => {
                  const u = prev.map(s =>
                    s.id !== currentId ? s : {
                      ...s,
                      messages: s.messages.map((m, i) =>
                        i === s.messages.length - 1 ? { ...m, content: full } : m
                      ),
                    }
                  );
                  localStorage.setItem("aib_sessions", JSON.stringify(u));
                  return u;
                });
              }
            } catch { /* skip malformed JSON */ }
          }
        }

        if (done) break;
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error && err.message && err.message !== "No stream"
        ? err.message
        : "عذراً، حدث خطأ. يرجى المحاولة مجدداً.";
      setSessions(prev => {
        const u = prev.map(s =>
          s.id !== currentId ? s : {
            ...s,
            messages: s.messages.map((m, i) =>
              i === s.messages.length - 1 ? { ...m, content: errMsg } : m
            ),
          }
        );
        localStorage.setItem("aib_sessions", JSON.stringify(u));
        return u;
      });
    }
    setStreaming(false);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (currentId === id) {
      if (updated.length > 0) setCurrentId(updated[0].id);
      else newSession();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="min-h-screen bg-[#06060F] flex flex-col" dir="rtl">
      <SEOHead
        title="مستشار الأعمال الذكي | AI Business OS"
        description="مستشار أعمال مدعوم بالذكاء الاصطناعي يجيب عن أسئلتك في التسويق والنمو والمبيعات."
        canonical="/ai-business-os/consultant"
      />
      <Navbar />

      <div className="flex flex-1 pt-20">

        {/* ─── Sidebar ─── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 top-20 bg-black/60 z-30 lg:hidden"
            />
            <motion.aside
              initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="bg-[#0D0D1A] border-l border-white/10 flex flex-col overflow-hidden shrink-0 fixed top-20 bottom-0 right-0 z-40 lg:static lg:z-auto"
            >
              <div className="p-4 border-b border-white/10">
                <Link href="/ai-business-os" className="flex items-center gap-2 text-white/60 text-xs mb-4 hover:text-white transition-colors">
                  <ArrowRight size={12} /> AI Business OS
                </Link>
                <button
                  onClick={newSession}
                  className="w-full flex items-center justify-center gap-2 bg-[#CC0000] text-white rounded-xl py-2.5 font-bold text-sm hover:bg-[#AA0000] transition-colors"
                >
                  <Plus size={16} /> محادثة جديدة
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {sessions.length === 0 && (
                  <p className="text-white/30 text-xs text-center mt-8">لا توجد محادثات</p>
                )}
                {sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { setCurrentId(s.id); if (isMobile()) setSidebarOpen(false); }}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      s.id === currentId ? "bg-[#CC0000]/20 border border-[#CC0000]/30" : "hover:bg-white/5"
                    }`}
                  >
                    <Bot size={13} className={s.id === currentId ? "text-[#CC0000]" : "text-white/40"} />
                    <span className="flex-1 text-xs text-white/70 truncate">{s.title}</span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteSession(s.id); }}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── Toggle sidebar ─── */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="fixed lg:absolute right-0 top-1/2 -translate-y-1/2 z-50 w-6 h-14 lg:w-5 lg:h-12 bg-[#0D0D1A] border border-white/10 rounded-r-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
          style={{ right: sidebarOpen ? "260px" : "0" }}
          aria-label={sidebarOpen ? "إغلاق قائمة المحادثات" : "فتح قائمة المحادثات"}
        >
          <ChevronRight size={12} className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
        </button>

        {/* ─── Main chat area ─── */}
        <div className="flex-1 flex flex-col min-w-0 relative">

          {/* Chat header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#CC0000] to-[#880000] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(204,0,0,0.4)]">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">AI Business Consultant</p>
              <p className="text-white/40 text-xs">مدعوم بالذكاء الاصطناعي • متخصص في السوق الإماراتي</p>
            </div>
            <div className="mr-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-xs">متاح الآن</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">

            {/* Empty state / suggestions */}
            {(!currentSession || currentSession.messages.length === 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CC0000]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={28} className="text-[#CC0000]" />
                  </div>
                  <h2 className="text-white font-black text-xl mb-2">كيف يمكنني مساعدتك؟</h2>
                  <p className="text-white/40 text-sm">اسألني أي شيء عن تسويقك، مبيعاتك، أو نمو نشاطك</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-right bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm hover:bg-white/10 hover:text-white hover:border-[#CC0000]/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message list */}
            {currentSession?.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-[#CC0000] text-white"
                    : "bg-gradient-to-br from-[#CC0000] to-[#880000] text-white shadow-[0_0_10px_rgba(204,0,0,0.3)]"
                }`}>
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-[#CC0000] text-white rounded-tl-sm"
                    : "bg-white/5 border border-white/10 text-white/90 rounded-tr-sm"
                }`}>
                  {msg.content ? (
                    <MessageText content={msg.content} />
                  ) : (
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-white/40"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.2 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 md:px-6 py-3 md:py-4 border-t border-white/10">
            <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="اكتب سؤالك هنا…"
                rows={1}
                disabled={streaming}
                className="flex-1 bg-transparent text-white/90 placeholder:text-white/30 text-sm resize-none outline-none px-2 py-2 max-h-32 overflow-y-auto"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || input.trim().length > MAX_MESSAGE_LENGTH || streaming}
                className="w-10 h-10 bg-[#CC0000] rounded-xl flex items-center justify-center text-white hover:bg-[#AA0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end"
              >
                <Send size={16} className="rotate-180" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-white/20 text-xs">AI Consultant • AI Business OS • دبي فانز</p>
              <p className={`text-xs ${input.trim().length > MAX_MESSAGE_LENGTH ? "text-red-400" : "text-white/20"}`}>
                {input.trim().length > MAX_MESSAGE_LENGTH
                  ? `الرسالة طويلة جداً — الحد الأقصى ${MAX_MESSAGE_LENGTH} حرف (${input.trim().length} حالياً)`
                  : `${input.trim().length} / ${MAX_MESSAGE_LENGTH}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
