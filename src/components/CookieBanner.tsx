import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getConsent, saveConsent, applyConsent, HAS_ANALYTICS, HAS_MARKETING } from "@/lib/consent";

export const OPEN_COOKIE_SETTINGS_EVENT = "df:open-cookie-settings";

/** True when there is at least one optional tracker category to show */
const HAS_OPTIONAL = HAS_ANALYTICS || HAS_MARKETING;

export function CookieBanner() {
  const [visible, setVisible]     = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  const open = useCallback(() => {
    const saved = getConsent();
    setAnalytics(saved ? saved.analytics : true);
    setMarketing(saved ? saved.marketing : true);
    setCustomize(false);
    setVisible(true);
  }, []);

  /* On mount: re-apply saved consent and show banner if undecided */
  useEffect(() => {
    applyConsent();
    const saved = getConsent();
    if (!saved?.decided) {
      const t = setTimeout(open, 800);
      return () => clearTimeout(t);
    }
    return () => undefined;
  }, [open]);

  /* Allow external triggers (footer link, policy page button) to reopen */
  useEffect(() => {
    const handler = () => open();
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handler);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handler);
  }, [open]);

  const dismiss = () => setVisible(false);

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true, decided: true });
    dismiss();
  };

  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false, decided: true });
    dismiss();
  };

  const saveCustom = () => {
    saveConsent({ analytics, marketing, decided: true });
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-2xl mx-auto"
          role="dialog"
          aria-modal="true"
          aria-label="إشعار ملفات تعريف الارتباط"
          dir="rtl"
        >
          <div className="bg-[#0F0A2A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5">

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#CC0000]/20 flex items-center justify-center shrink-0">
                    <Cookie size={18} className="text-[#CC0000]" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">
                      {HAS_OPTIONAL
                        ? "نستخدم ملفات تعريف الارتباط"
                        : "ملفات الارتباط الضرورية فقط"}
                    </h3>
                    <p className="text-white/60 text-xs mt-0.5">
                      {HAS_OPTIONAL
                        ? "لتحسين تجربتك وتحليل الأداء وعرض محتوى ملائم. "
                        : "يستخدم هذا الموقع ملفات ضرورية فقط لأمان النماذج. "}
                      <Link href="/cookie-policy" className="text-[#CC0000] hover:underline">
                        سياسة الكوكيز
                      </Link>
                    </p>
                  </div>
                </div>
                <button
                  onClick={rejectAll}
                  className="text-white/40 hover:text-white/80 transition-colors shrink-0 mt-0.5"
                  aria-label="رفض الملفات الاختيارية وإغلاق"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Customise panel — only shown when optional categories exist */}
              {HAS_OPTIONAL && (
                <AnimatePresence initial={false}>
                  {customize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 pt-4 pb-2 space-y-3 mb-3">

                        {/* Necessary — always on */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield size={14} className="text-green-400" />
                            <div>
                              <p className="text-white text-xs font-semibold">ملفات ضرورية</p>
                              <p className="text-white/40 text-[11px]">
                                reCAPTCHA وأمان النماذج — لا يمكن تعطيلها
                              </p>
                            </div>
                          </div>
                          <div
                            className="w-10 h-5 rounded-full bg-green-500/60 flex items-center justify-end px-0.5 cursor-not-allowed"
                            aria-label="ضروري — دائماً مفعّل"
                          >
                            <div className="w-4 h-4 rounded-full bg-white" />
                          </div>
                        </div>

                        {/* Analytics — only if GA is configured */}
                        {HAS_ANALYTICS && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart2 size={14} className="text-blue-400" />
                              <div>
                                <p className="text-white text-xs font-semibold">ملفات التحليل</p>
                                <p className="text-white/40 text-[11px]">Google Analytics — تحسين أداء الموقع</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setAnalytics(v => !v)}
                              className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                                analytics ? "bg-[#CC0000] justify-end" : "bg-white/20 justify-start"
                              }`}
                              role="switch"
                              aria-checked={analytics}
                              aria-label="تفعيل أو تعطيل ملفات التحليل"
                            >
                              <div className="w-4 h-4 rounded-full bg-white shadow" />
                            </button>
                          </div>
                        )}

                        {/* Marketing — only if Meta Pixel is configured */}
                        {HAS_MARKETING && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Megaphone size={14} className="text-[#CC0000]" />
                              <div>
                                <p className="text-white text-xs font-semibold">ملفات التسويق</p>
                                <p className="text-white/40 text-[11px]">Meta Pixel — إعلانات مخصصة</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setMarketing(v => !v)}
                              className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                                marketing ? "bg-[#CC0000] justify-end" : "bg-white/20 justify-start"
                              }`}
                              role="switch"
                              aria-checked={marketing}
                              aria-label="تفعيل أو تعطيل ملفات التسويق"
                            >
                              <div className="w-4 h-4 rounded-full bg-white shadow" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={acceptAll}
                  className="flex-1 min-w-[100px] bg-[#CC0000] hover:bg-[#AA0000] text-white text-xs font-black py-2.5 px-4 rounded-xl transition-colors"
                >
                  {HAS_OPTIONAL ? "قبول الكل" : "حسناً، فهمت"}
                </button>

                {HAS_OPTIONAL && (
                  <>
                    <button
                      onClick={rejectAll}
                      className="flex-1 min-w-[80px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      رفض
                    </button>
                    {customize ? (
                      <button
                        onClick={saveCustom}
                        className="flex-1 min-w-[100px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronUp size={13} />
                        حفظ الإعدادات
                      </button>
                    ) : (
                      <button
                        onClick={() => setCustomize(true)}
                        className="flex-1 min-w-[100px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronDown size={13} />
                        تخصيص
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
