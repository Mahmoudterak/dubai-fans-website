import { useState, useEffect, useRef } from "react";
import {
  Loader, AlertCircle, CheckCircle, Plus, Trash2, X, RefreshCw,
  ChevronDown, ChevronUp, Sparkles, Eye, EyeOff, BarChart2,
  ArrowLeft, Check, ImagePlus, Image as ImageIcon, Send,
} from "lucide-react";

const API = "/api";
const inputCls =
  "w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/60 focus:outline-none transition-colors";

interface Client { id: number; slug: string; name: string; }
interface Report {
  id: number; clientId: number; title: string;
  periodStart: string; periodEnd: string;
  status: "draft" | "published"; createdAt: string;
  notificationStatus: "sent" | "failed" | "not_configured" | null;
}
interface CampaignDataRow {
  platform: string;
  spend: number; impressions: number; reach: number; clicks: number;
  messages: number; calls: number; leads: number; bookings: number;
  prevSpend: number; prevImpressions: number; prevReach: number; prevClicks: number;
  prevMessages: number; prevCalls: number; prevLeads: number; prevBookings: number;
}

interface Toast { kind: "ok" | "err"; text: string }

const PLATFORMS = ["meta", "google", "tiktok", "snapchat", "twitter", "youtube"];
const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta (فيسبوك/انستقرام)", google: "Google Ads", tiktok: "TikTok",
  snapchat: "سناب شات", twitter: "تويتر/X", youtube: "يوتيوب",
};

const emptyRow = (platform: string): CampaignDataRow => ({
  platform, spend: 0, impressions: 0, reach: 0, clicks: 0,
  messages: 0, calls: 0, leads: 0, bookings: 0,
  prevSpend: 0, prevImpressions: 0, prevReach: 0, prevClicks: 0,
  prevMessages: 0, prevCalls: 0, prevLeads: 0, prevBookings: 0,
});

function Pill({ status }: { status: "draft" | "published" }) {
  return status === "published"
    ? <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">منشور</span>
    : <span className="px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] text-[10px] font-bold">مسودة</span>;
}

// ── Wizard ────────────────────────────────────────────────────────────────────
function ReportWizard({
  clients, onClose, onDone,
}: { clients: Client[]; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 4000); };

  // Step 1: basic info
  const [info, setInfo] = useState({ clientId: clients[0]?.id ?? 0, title: "", periodStart: "", periodEnd: "" });

  // Step 2: campaign data — start with meta
  const [dataRows, setDataRows] = useState<CampaignDataRow[]>([emptyRow("meta")]);
  const [reportId, setReportId] = useState<number | null>(null);

  // Step 3: generated content preview
  const [content, setContent] = useState<Record<string, unknown> | null>(null);

  // Step 4: media upload
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateRow(idx: number, key: keyof CampaignDataRow, value: string | number) {
    setDataRows(rows => rows.map((r, i) => i === idx ? { ...r, [key]: typeof value === "string" ? parseFloat(value) || 0 : value } : r));
  }

  function addPlatform(platform: string) {
    if (dataRows.some(r => r.platform === platform)) return;
    setDataRows(rows => [...rows, emptyRow(platform)]);
  }
  function removeRow(idx: number) { setDataRows(rows => rows.filter((_, i) => i !== idx)); }

  async function handleStep1() {
    if (!info.clientId || !info.title.trim() || !info.periodStart || !info.periodEnd) {
      showToast({ kind: "err", text: "جميع الحقول مطلوبة" }); return;
    }
    setSaving(true);
    try {
      // Create or reuse report
      if (!reportId) {
        const res = await fetch(`${API}/admin/reports`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
          body: JSON.stringify(info),
        });
        const data = await res.json() as { report?: Report; error?: string };
        if (!res.ok) { showToast({ kind: "err", text: data.error ?? "فشل في إنشاء التقرير" }); return; }
        setReportId(data.report!.id);
      }
      setStep(2);
    } finally { setSaving(false); }
  }

  async function handleStep2() {
    if (!reportId || dataRows.length === 0) { showToast({ kind: "err", text: "أضف بيانات منصة واحدة على الأقل" }); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/reports/${reportId}/data`, {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify(dataRows),
      });
      if (!res.ok) { showToast({ kind: "err", text: "فشل في حفظ البيانات" }); return; }
      setStep(3);
    } finally { setSaving(false); }
  }

  async function handleGenerate() {
    if (!reportId) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/admin/reports/${reportId}/generate`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      });
      const data = await res.json() as { content?: Record<string, unknown>; error?: string };
      if (!res.ok) { showToast({ kind: "err", text: data.error ?? "فشل في توليد المحتوى" }); return; }
      setContent(data.content ?? null);
      setStep(4);
    } finally { setGenerating(false); }
  }

  async function handlePublish(status: "draft" | "published") {
    if (!reportId) return;
    setSaving(true);
    try {
      await fetch(`${API}/admin/reports/${reportId}/publish`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ status }),
      });
      onDone();
    } finally { setSaving(false); }
  }

  async function handleImageUpload(file: File) {
    if (!reportId) return;
    if (mediaUrls.length >= 5) { showToast({ kind: "err", text: "الحد الأقصى 5 صور لكل تقرير" }); return; }
    if (!file.type.startsWith("image/")) { showToast({ kind: "err", text: "يُسمح بالصور فقط (JPG, PNG, WEBP)" }); return; }
    if (file.size > 10 * 1024 * 1024) { showToast({ kind: "err", text: "حجم الصورة يجب أن يكون أقل من 10 ميجابايت" }); return; }
    setUploading(true);
    try {
      // Step 1: get presigned URL
      const urlRes = await fetch(`${API}/admin/reports/${reportId}/upload-url`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) { showToast({ kind: "err", text: "فشل في الحصول على رابط الرفع" }); return; }
      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };

      // Step 2: upload directly to GCS
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) { showToast({ kind: "err", text: "فشل في رفع الصورة" }); return; }

      // Step 3: save objectPath to report
      const newUrls = [...mediaUrls, objectPath];
      const saveRes = await fetch(`${API}/admin/reports/${reportId}/media`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ mediaUrls: newUrls }),
      });
      if (!saveRes.ok) { showToast({ kind: "err", text: "فشل في حفظ الصورة" }); return; }
      setMediaUrls(newUrls);
      showToast({ kind: "ok", text: "تم رفع الصورة بنجاح" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemoveImage(idx: number) {
    if (!reportId) return;
    const res = await fetch(`${API}/admin/reports/${reportId}/media/${idx}`, {
      method: "DELETE", credentials: "include",
      headers: { "X-Requested-With": "fetch" },
    });
    if (res.ok) {
      const d = await res.json() as { mediaUrls: string[] };
      setMediaUrls(d.mediaUrls);
    }
  }

  const usedPlatforms = new Set(dataRows.map(r => r.platform));
  const availablePlatforms = PLATFORMS.filter(p => !usedPlatforms.has(p));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-[#E5E7EB] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 className="text-base font-black text-[#111827]">تقرير جديد</h2>
            <div className="flex items-center gap-2 mt-1">
              {[1,2,3,4].map(s => (
                <div key={s} className={`flex items-center gap-1 text-xs font-bold ${step >= s ? "text-[#CC0000]" : "text-[#D1D5DB]"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > s ? "bg-[#10B981] text-white" : step === s ? "bg-[#CC0000] text-white" : "bg-[#E5E7EB] text-[#9CA3AF]"}`}>
                    {step > s ? <Check size={10} /> : s}
                  </span>
                  {s === 1 ? "المعلومات" : s === 2 ? "البيانات" : s === 3 ? "التوليد" : "النشر"}
                  {s < 4 && <span className="text-[#D1D5DB] mx-0.5">›</span>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151]"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {toast && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${toast.kind === "ok" ? "text-green-700 bg-green-50 border border-green-200" : "text-[#CC0000] bg-red-50 border border-red-200"}`}>
              {toast.kind === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.text}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">العميل *</label>
                <select value={info.clientId} onChange={e => setInfo(f => ({ ...f, clientId: parseInt(e.target.value) }))} className={inputCls}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">عنوان التقرير *</label>
                <input type="text" value={info.title} onChange={e => setInfo(f => ({ ...f, title: e.target.value }))} placeholder="مثال: تقرير أداء حملة يوليو 2026" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">بداية الفترة *</label>
                  <input type="date" value={info.periodStart} onChange={e => setInfo(f => ({ ...f, periodStart: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">نهاية الفترة *</label>
                  <input type="date" value={info.periodEnd} onChange={e => setInfo(f => ({ ...f, periodEnd: e.target.value }))} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-[#6B7280]">أدخل أرقام الأداء لكل منصة. الحقول السابقة (prev) للمقارنة الشهرية.</p>
              {dataRows.map((row, idx) => (
                <div key={row.platform} className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB] space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#111827]">{PLATFORM_LABELS[row.platform] ?? row.platform}</span>
                    {dataRows.length > 1 && (
                      <button onClick={() => removeRow(idx)} className="text-[#9CA3AF] hover:text-[#CC0000]"><X size={14} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["spend","impressions","reach","clicks","messages","calls","leads","bookings"] as const).map(field => (
                      <div key={field}>
                        <label className="block text-[10px] text-[#9CA3AF] mb-1 font-semibold">{
                          { spend:"الإنفاق (AED)", impressions:"المشاهدات", reach:"الوصول", clicks:"النقرات", messages:"الرسائل", calls:"المكالمات", leads:"العملاء", bookings:"الحجوزات" }[field]
                        }</label>
                        <input type="number" min="0" value={row[field]} onChange={e => updateRow(idx, field, e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#111827] focus:outline-none focus:border-[#CC0000]/60" />
                      </div>
                    ))}
                  </div>
                  <details className="mt-1">
                    <summary className="text-xs text-[#9CA3AF] cursor-pointer select-none hover:text-[#6B7280]">▸ بيانات الشهر السابق (اختياري)</summary>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {(["prevSpend","prevImpressions","prevReach","prevClicks","prevMessages","prevCalls","prevLeads","prevBookings"] as const).map(field => (
                        <div key={field}>
                          <label className="block text-[10px] text-[#9CA3AF] mb-1 font-semibold">{
                            { prevSpend:"الإنفاق السابق", prevImpressions:"مشاهدات سابقة", prevReach:"وصول سابق", prevClicks:"نقرات سابقة", prevMessages:"رسائل سابقة", prevCalls:"مكالمات سابقة", prevLeads:"عملاء سابقون", prevBookings:"حجوزات سابقة" }[field]
                          }</label>
                          <input type="number" min="0" value={row[field]} onChange={e => updateRow(idx, field, e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#111827] focus:outline-none focus:border-[#CC0000]/60" />
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ))}

              {availablePlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-[#9CA3AF] self-center">إضافة منصة:</span>
                  {availablePlatforms.map(p => (
                    <button key={p} onClick={() => addPlatform(p)}
                      className="px-3 py-1.5 text-xs font-bold border border-dashed border-[#D1D5DB] rounded-lg text-[#6B7280] hover:border-[#CC0000] hover:text-[#CC0000] transition-colors">
                      + {PLATFORM_LABELS[p] ?? p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#CC0000] flex items-center justify-center mx-auto">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#111827]">توليد المحتوى بالذكاء الاصطناعي</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed max-w-md mx-auto">
                  سيحلل الذكاء الاصطناعي بيانات حملتك ويولد الخلاصة التنفيذية، التحليل، التوصيات وخطة الشهر القادم.
                </p>
              </div>
              {generating ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader size={32} className="animate-spin text-[#7C3AED]" />
                  <p className="text-sm text-[#6B7280]">جارٍ التحليل... قد يستغرق هذا دقيقة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={handleGenerate} className="px-8 py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-xl font-bold text-sm hover:from-[#6D28D9] hover:to-[#7C3AED] transition-all shadow-lg">
                    <Sparkles size={16} className="inline mr-2" /> توليد التحليل الآن
                  </button>
                  <div>
                    <button onClick={() => setStep(4)} className="text-xs text-[#9CA3AF] hover:text-[#374151] underline">تخطي التوليد والنشر مباشرة</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                <CheckCircle size={16} /> التقرير جاهز — أضف صوراً ثم اختر حالة النشر
              </div>

              {/* Media upload */}
              <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={15} className="text-[#7C3AED]" />
                    <span className="text-sm font-bold text-[#111827]">معرض الإعلانات ({mediaUrls.length}/5)</span>
                  </div>
                  {mediaUrls.length < 5 && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold hover:bg-[#6D28D9] disabled:opacity-60 transition-colors"
                      >
                        {uploading ? <Loader size={12} className="animate-spin" /> : <ImagePlus size={12} />}
                        {uploading ? "جارٍ الرفع…" : "رفع صورة"}
                      </button>
                    </>
                  )}
                </div>
                {mediaUrls.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center py-3">لا توجد صور — أضف حتى 5 صور لإعلاناتك (اختياري)</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {mediaUrls.map((url, i) => (
                      <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-[#E5E7EB]">
                        <img loading="lazy" decoding="async" src={`/api/storage${url}`} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => void handleRemoveImage(i)}
                          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {content && (
                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB] space-y-3 text-sm">
                  <p className="font-bold text-[#111827] text-xs uppercase tracking-wide">معاينة المحتوى المولَّد</p>
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] mb-1">الخلاصة التنفيذية</p>
                    <p className="text-[#374151] text-xs leading-relaxed line-clamp-3">{String((content as { executiveSummary?: string }).executiveSummary ?? "")}</p>
                  </div>
                  {Array.isArray((content as { recommendations?: Array<{ title: string; impact: string }> }).recommendations) && (
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] mb-1">التوصيات</p>
                      <div className="space-y-1">
                        {((content as { recommendations: Array<{ title: string; impact: string }> }).recommendations).slice(0, 3).map((r, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${r.impact === "high" ? "bg-red-100 text-red-700" : r.impact === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                              {r.impact === "high" ? "عالي" : r.impact === "medium" ? "متوسط" : "منخفض"}
                            </span>
                            <span className="text-[#374151]">{r.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handlePublish("published")} disabled={saving}
                  className="py-3.5 bg-[#10B981] text-white rounded-xl font-bold text-sm hover:bg-[#059669] disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <Loader size={14} className="animate-spin" /> : <><Eye size={14} /> نشر التقرير</>}
                </button>
                <button onClick={() => handlePublish("draft")} disabled={saving}
                  className="py-3.5 bg-[#F3F4F6] text-[#374151] rounded-xl font-bold text-sm hover:bg-[#E5E7EB] disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <Loader size={14} className="animate-spin" /> : <><EyeOff size={14} /> حفظ كمسودة</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {step < 3 && (
          <div className="border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-between shrink-0">
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827] font-semibold"><ArrowLeft size={14} /> السابق</button>
              : <span />
            }
            <button
              onClick={step === 1 ? handleStep1 : handleStep2}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#CC0000] text-white rounded-xl font-bold text-sm hover:bg-[#AA0000] disabled:opacity-60"
            >
              {saving ? <Loader size={14} className="animate-spin" /> : step === 1 ? "التالي: بيانات الحملة" : "التالي: توليد AI"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const NOTIF_META: Record<string, { label: string; cls: string; icon: string }> = {
  sent:           { label: "الإشعار وصل",       cls: "bg-green-50 text-green-700 border-green-200",   icon: "✅" },
  failed:         { label: "فشل إرسال الإشعار", cls: "bg-red-50 text-red-700 border-red-200",         icon: "⚠️" },
  not_configured: { label: "البريد غير مُعدّ",   cls: "bg-gray-50 text-gray-500 border-gray-200",      icon: "✉️" },
};

function MediaModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/admin/reports/${report.id}`, {
          credentials: "include", headers: { "X-Requested-With": "fetch" },
        });
        if (!res.ok) { if (alive) showToast({ kind: "err", text: "فشل في جلب صور التقرير" }); return; }
        const d = await res.json() as { content?: { mediaUrls?: string[] } | null };
        if (alive) setMediaUrls(Array.isArray(d.content?.mediaUrls) ? d.content.mediaUrls : []);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [report.id]);

  async function handleUpload(file: File) {
    if (mediaUrls.length >= 5) { showToast({ kind: "err", text: "الحد الأقصى 5 صور لكل تقرير" }); return; }
    if (!file.type.startsWith("image/")) { showToast({ kind: "err", text: "يُسمح بالصور فقط (JPG, PNG, WEBP)" }); return; }
    if (file.size > 10 * 1024 * 1024) { showToast({ kind: "err", text: "حجم الصورة يجب أن يكون أقل من 10 ميجابايت" }); return; }
    setUploading(true);
    try {
      const urlRes = await fetch(`${API}/admin/reports/${report.id}/upload-url`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) { showToast({ kind: "err", text: "فشل في الحصول على رابط الرفع" }); return; }
      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };

      const putRes = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!putRes.ok) { showToast({ kind: "err", text: "فشل في رفع الصورة" }); return; }

      const newUrls = [...mediaUrls, objectPath];
      const saveRes = await fetch(`${API}/admin/reports/${report.id}/media`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ mediaUrls: newUrls }),
      });
      if (!saveRes.ok) { showToast({ kind: "err", text: "فشل في حفظ الصورة" }); return; }
      setMediaUrls(newUrls);
      showToast({ kind: "ok", text: "تم رفع الصورة بنجاح" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove(idx: number) {
    const res = await fetch(`${API}/admin/reports/${report.id}/media/${idx}`, {
      method: "DELETE", credentials: "include", headers: { "X-Requested-With": "fetch" },
    });
    if (res.ok) {
      const d = await res.json() as { mediaUrls: string[] };
      setMediaUrls(d.mediaUrls);
      showToast({ kind: "ok", text: "تم حذف الصورة" });
    } else {
      showToast({ kind: "err", text: "فشل في حذف الصورة" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E5E7EB] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon size={16} className="text-[#7C3AED] shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-black text-[#111827] truncate">صور التقرير</h2>
              <p className="text-xs text-[#9CA3AF] truncate">{report.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151] shrink-0"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {toast && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${toast.kind === "ok" ? "text-green-700 bg-green-50 border border-green-200" : "text-[#CC0000] bg-red-50 border border-red-200"}`}>
              {toast.kind === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10"><Loader size={24} className="animate-spin text-[#7C3AED]" /></div>
          ) : (
            <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#111827]">معرض الإعلانات ({mediaUrls.length}/5)</span>
                {mediaUrls.length < 5 && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) void handleUpload(f); }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold hover:bg-[#6D28D9] disabled:opacity-60 transition-colors"
                    >
                      {uploading ? <Loader size={12} className="animate-spin" /> : <ImagePlus size={12} />}
                      {uploading ? "جارٍ الرفع…" : "رفع صورة"}
                    </button>
                  </>
                )}
              </div>
              {mediaUrls.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">لا توجد صور — أضف حتى 5 صور لإعلاناتك</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {mediaUrls.map((url, i) => (
                    <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-[#E5E7EB]">
                      <img loading="lazy" decoding="async" src={`/api/storage${url}`} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => void handleRemove(i)}
                        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <p className="text-[11px] text-[#9CA3AF] text-center">التغييرات تُحفظ فوراً — لا حاجة لإعادة النشر</p>
        </div>
      </div>
    </div>
  );
}
function ReportRow({ report, clientName, onDelete, onTogglePublish, onRegenerate, onNotify }: {
  report: Report; clientName: string;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, current: "draft" | "published") => void;
  onRegenerate: (id: number) => void;
  onNotify: (id: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [regen, setRegen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(v => !v)} className="text-[#9CA3AF] hover:text-[#111827] shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-[#111827] truncate">{report.title}</span>
            <Pill status={report.status} />
            <NotifPill report={report} />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {clientName} · {report.periodStart} → {report.periodEnd}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {report.status === "published" && (
            <button
              onClick={async () => { setNotifying(true); try { await onNotify(report.id); } finally { setNotifying(false); } }}
              disabled={notifying}
              title="إعادة إرسال الإشعار"
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2563EB] hover:bg-blue-50 disabled:opacity-60 transition-colors"
            >
              {notifying ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          )}
          <button onClick={() => setShowMedia(true)}
            title="إدارة الصور" className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2563EB] hover:bg-blue-50 transition-colors">
            <ImageIcon size={14} />
          </button>
          <button onClick={async () => { setRegen(true); onRegenerate(report.id); setTimeout(() => setRegen(false), 10000); }}
            title="إعادة توليد AI" className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors">
            {regen ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
          </button>
          <button onClick={async () => { setToggling(true); onTogglePublish(report.id, report.status); setTimeout(() => setToggling(false), 2000); }}
            title={report.status === "published" ? "إلغاء النشر" : "نشر"} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#10B981] hover:bg-green-50 transition-colors">
            {toggling ? <Loader size={14} className="animate-spin" /> : report.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => onDelete(report.id)} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#CC0000] hover:bg-[#FEF2F2] transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#E5E7EB] px-4 py-3 bg-[#F9FAFB] text-xs text-[#6B7280] space-y-1">
          <p>العميل: <strong>{clientName}</strong></p>
          <p>الفترة: <strong>{report.periodStart} → {report.periodEnd}</strong></p>
          <p>الحالة: <strong>{report.status === "published" ? "منشور" : "مسودة"}</strong></p>
          <p>أُنشئ في: {new Date(report.createdAt).toLocaleDateString("ar-AE")}</p>
        </div>
      )}
      {showMedia && <MediaModal report={report} onClose={() => setShowMedia(false)} />}
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export function ReportsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [filterClient, setFilterClient] = useState<number | "all">("all");
  const [regenId, setRegenId] = useState<number | null>(null);

  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3500); };

  async function load() {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        fetch(`${API}/admin/clients`, { credentials: "include", headers: { "X-Requested-With": "fetch" } }),
        fetch(`${API}/admin/reports`, { credentials: "include", headers: { "X-Requested-With": "fetch" } }),
      ]);
      const cd = await cRes.json() as { clients: Client[] };
      const rd = await rRes.json() as { reports: Report[] };
      setClients(cd.clients ?? []);
      setReports(rd.reports ?? []);
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]));
  const filtered = filterClient === "all" ? reports : reports.filter(r => r.clientId === filterClient);

  async function handleDelete(id: number) {
    if (!confirm("حذف هذا التقرير؟")) return;
    const res = await fetch(`${API}/admin/reports/${id}`, { method: "DELETE", credentials: "include", headers: { "X-Requested-With": "fetch" } });
    if (res.ok) { setReports(prev => prev.filter(r => r.id !== id)); showToast({ kind: "ok", text: "تم حذف التقرير" }); }
    else showToast({ kind: "err", text: "فشل في الحذف" });
  }

  async function handleTogglePublish(id: number, current: "draft" | "published") {
    const newStatus = current === "published" ? "draft" : "published";
    const res = await fetch(`${API}/admin/reports/${id}/publish`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      showToast({ kind: "ok", text: newStatus === "published" ? "تم نشر التقرير" : "تم إلغاء النشر" });
      // Email notification is sent in the background — refetch shortly so the
      // delivery-status badge (✅ / ⚠️) appears without a manual reload
      if (newStatus === "published") setTimeout(() => { void load(); }, 4000);
    }
  }

  async function handleNotify(id: number) {
    try {
      const res = await fetch(`${API}/admin/reports/${id}/notify`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      });
      const data = await res.json() as { ok?: boolean; sent?: number; failed?: number; warning?: string; error?: string };
      if (res.ok) {
        if (data.warning) showToast({ kind: "err", text: data.warning });
        else showToast({ kind: "ok", text: `تم إعادة إرسال الإشعار إلى ${data.sent ?? 0} مستلم` });
      } else showToast({ kind: "err", text: data.error ?? "فشل في إعادة إرسال الإشعار" });
    } catch {
      showToast({ kind: "err", text: "فشل في إعادة إرسال الإشعار" });
    }
  }

  async function handleRegenerate(id: number) {
    setRegenId(id);
    try {
      const res = await fetch(`${API}/admin/reports/${id}/generate`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      });
      if (res.ok) showToast({ kind: "ok", text: "تم إعادة توليد المحتوى بنجاح" });
      else showToast({ kind: "err", text: "فشل في إعادة التوليد" });
    } finally { setRegenId(null); }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-[#CC0000]" size={28} /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#111827]">التقارير ({reports.length})</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">إدارة تقارير أداء الحملات الإعلانية</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:border-[#9CA3AF] transition-colors"><RefreshCw size={14} /></button>
          <button onClick={() => setShowWizard(true)} className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-xl text-sm font-bold hover:bg-[#AA0000] transition-colors">
            <Plus size={14} /> تقرير جديد
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${toast.kind === "ok" ? "text-green-700 bg-green-50 border border-green-200" : "text-[#CC0000] bg-red-50 border border-red-200"}`}>
          {toast.kind === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {toast.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "إجمالي التقارير", value: reports.length, color: "#111827" },
          { label: "منشور", value: reports.filter(r => r.status === "published").length, color: "#10B981" },
          { label: "مسودة", value: reports.filter(r => r.status === "draft").length, color: "#B45309" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 border border-[#E5E7EB] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      {clients.length > 1 && (
        <select value={filterClient} onChange={e => setFilterClient(e.target.value === "all" ? "all" : parseInt(e.target.value))}
          className="text-sm px-3 py-2 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] focus:outline-none">
          <option value="all">جميع العملاء</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <BarChart2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا توجد تقارير{filterClient !== "all" ? " لهذا العميل" : " بعد"}</p>
          <button onClick={() => setShowWizard(true)} className="mt-4 px-4 py-2 bg-[#CC0000] text-white rounded-xl text-sm font-bold">أنشئ أول تقرير</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => (
            <ReportRow key={r.id} report={r} clientName={clientMap[r.clientId] ?? `عميل #${r.clientId}`}
              onDelete={handleDelete} onTogglePublish={handleTogglePublish} onRegenerate={handleRegenerate} onNotify={handleNotify} />
          ))}
        </div>
      )}

      {/* Wizard */}
      {showWizard && clients.length === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <AlertCircle size={32} className="mx-auto mb-3 text-[#CC0000]" />
            <h3 className="font-black text-[#111827] mb-2">لا يوجد عملاء</h3>
            <p className="text-sm text-[#6B7280] mb-4">يجب إنشاء عميل أولاً قبل إضافة تقرير.</p>
            <button onClick={() => setShowWizard(false)} className="px-6 py-2.5 bg-[#CC0000] text-white rounded-xl font-bold text-sm">حسناً</button>
          </div>
        </div>
      )}
      {showWizard && clients.length > 0 && (
        <ReportWizard
          clients={clients}
          onClose={() => setShowWizard(false)}
          onDone={() => { setShowWizard(false); void load(); setTimeout(() => { void load(); }, 4000); }}
        />
      )}
    </div>
  );
}

function NotifPill({ report }: { report: Report }) {
  if (report.status !== "published" || !report.notificationStatus) return null;
  const m = NOTIF_META[report.notificationStatus];
  if (!m) return null;
  return (
    <span title={m.label} className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${m.cls}`}>
      {m.icon} {m.label}
    </span>
  );
}
