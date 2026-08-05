import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Calendar, Lock, Plus, Trash2, CheckCircle, AlertCircle, Loader,
  Pencil, X, GraduationCap, BookOpen, ChevronDown, ChevronUp,
  RefreshCw, Phone, Mail, MapPin, CreditCard, Users, Link2, Unlink,
  Building2, BarChart2,
} from "lucide-react";
import { Bot, Globe, FileSearch } from "lucide-react";
import { ClientsTab } from "./admin/ClientsTab";
import { AibosLeadsTab } from "./admin/AibosLeadsTab";
import { WebsiteOrdersTab } from "./admin/WebsiteOrdersTab";
import { BusinessAuditsTab } from "./admin/BusinessAuditsTab";
import { ReportsTab } from "./admin/ReportsTab";

const API = "/api";

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/60 focus:outline-none transition-colors";

// ─────────────────────────────────────────────────────────────────────────────
// Blog tab data types + helpers
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "التسويق الرقمي", "إعلانات مدفوعة", "السوشيال ميديا", "الهوية البصرية",
  "تصميم المواقع", "تحسين محركات البحث", "التجارة الإلكترونية", "استراتيجية المحتوى",
];

const IMAGES = [
  { label: "تسويق رقمي", value: "/blog-seo.webp" },
  { label: "إعلانات",    value: "/blog-ads.webp" },
  { label: "سوشيال ميديا", value: "/blog-marketing.webp" },
  { label: "تصميم",       value: "/hero-marketing.webp" },
];

function toArabicDate(iso: string): string {
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const [, m, d] = iso.split("-");
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1] ?? ""} ${iso.slice(0, 4)}`;
}

function slugify(title: string): string {
  return title.trim().toLowerCase()
    .replace(/\s+/g, "-").replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 80);
}

interface Post { id: string; title: string; category: string; dateISO: string; }
interface FormState { title: string; category: string; image: string; excerpt: string; dateISO: string; readTime: string; content: string; }
const emptyForm = (): FormState => ({
  title: "", category: CATEGORIES[0], image: IMAGES[0].value, excerpt: "",
  dateISO: new Date().toISOString().slice(0, 10), readTime: "5 دقائق", content: "",
});

// ─────────────────────────────────────────────────────────────────────────────
// Enrollment tab data types + helpers
// ─────────────────────────────────────────────────────────────────────────────
type EnrollStatus = "new" | "contacted" | "enrolled" | "cancelled";

interface Enrollment {
  id: number;
  courseSlug: string;
  courseName: string;
  fullName: string;
  phone: string;
  email: string;
  jobTitle: string;
  city: string;
  paymentMethod: string;
  howDidYouHear: string;
  questions: string;
  status: EnrollStatus;
  studentId: number | null;
  createdAt: string;
}

const STATUS_META: Record<EnrollStatus, { label: string; bg: string; text: string; border: string }> = {
  new:       { label: "جديد",         bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  contacted: { label: "تم التواصل",   bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  enrolled:  { label: "مُسجَّل",      bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  cancelled: { label: "ملغى",         bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
};

const PAYMENT_LABELS: Record<string, string> = {
  online: "دفع أون لاين", bank: "تحويل بنكي",
  paypal: "باي بال", "western-union": "ويسترن يونيون",
};

// ─────────────────────────────────────────────────────────────────────────────
// Enrollment row component
// ─────────────────────────────────────────────────────────────────────────────
function EnrollmentRow({
  enrollment,
  onStatusChange,
  onStudentLink,
}: {
  enrollment: Enrollment;
  onStatusChange: (id: number, status: EnrollStatus) => Promise<void>;
  onStudentLink: (id: number, studentId: number | null) => Promise<void>;
}) {
  const [expanded,    setExpanded]    = useState(false);
  const [updating,    setUpdating]    = useState(false);
  const [linking,     setLinking]     = useState(false);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [linkMsg,     setLinkMsg]     = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const sm = STATUS_META[enrollment.status] ?? STATUS_META.new;
  const date = new Date(enrollment.createdAt).toLocaleDateString("ar-AE", {
    year: "numeric", month: "short", day: "numeric",
  });

  async function handleChange(s: EnrollStatus) {
    setUpdating(true);
    await onStatusChange(enrollment.id, s);
    setUpdating(false);
  }

  async function handleLink() {
    const sid = parseInt(studentIdInput.trim(), 10);
    if (isNaN(sid) || sid < 1) {
      setLinkMsg({ kind: "err", text: "أدخل معرّف الطالب (رقم صحيح)" });
      setTimeout(() => setLinkMsg(null), 3000);
      return;
    }
    setLinking(true);
    await onStudentLink(enrollment.id, sid);
    setStudentIdInput("");
    setLinking(false);
  }

  async function handleUnlink() {
    setLinking(true);
    await onStudentLink(enrollment.id, null);
    setLinking(false);
  }

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-0.5 text-[#9CA3AF] hover:text-[#111827] transition-colors shrink-0"
          title="تفاصيل"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-[#111827] text-sm">{enrollment.fullName}</span>
            {enrollment.studentId ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                حساب مرتبط
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF] text-[10px] font-bold border border-[#E5E7EB]">
                زائر
              </span>
            )}
            <span className="text-xs text-[#9CA3AF]">—</span>
            <span className="text-xs text-[#6B7280] truncate max-w-[160px]">{enrollment.courseName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
            <span dir="ltr">{enrollment.phone}</span>
            <span dir="ltr">{enrollment.email}</span>
            <span>{date}</span>
          </div>
        </div>

        {/* Status select */}
        <div className="shrink-0">
          {updating ? (
            <Loader size={14} className="animate-spin text-[#CC0000] mt-1" />
          ) : (
            <select
              value={enrollment.status}
              onChange={(e) => handleChange(e.target.value as EnrollStatus)}
              style={{
                backgroundColor: sm.bg,
                color: sm.text,
                borderColor: sm.border,
              }}
              className="text-xs font-bold rounded-lg px-2 py-1.5 border cursor-pointer focus:outline-none"
            >
              {(Object.entries(STATUS_META) as [EnrollStatus, typeof STATUS_META[EnrollStatus]][]).map(
                ([val, meta]) => (
                  <option key={val} value={val}>{meta.label}</option>
                )
              )}
            </select>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#E5E7EB] px-4 py-4 bg-[#F9FAFB]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {enrollment.jobTitle && (
              <div className="flex items-start gap-2">
                <Users size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#9CA3AF]">المسمى الوظيفي</p>
                  <p className="font-semibold text-[#111827]">{enrollment.jobTitle}</p>
                </div>
              </div>
            )}
            {enrollment.city && (
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#9CA3AF]">المدينة</p>
                  <p className="font-semibold text-[#111827]">{enrollment.city}</p>
                </div>
              </div>
            )}
            {enrollment.paymentMethod && (
              <div className="flex items-start gap-2">
                <CreditCard size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#9CA3AF]">طريقة الدفع</p>
                  <p className="font-semibold text-[#111827]">
                    {PAYMENT_LABELS[enrollment.paymentMethod] ?? enrollment.paymentMethod}
                  </p>
                </div>
              </div>
            )}
            {enrollment.howDidYouHear && (
              <div className="flex items-start gap-2">
                <Phone size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#9CA3AF]">كيف تعرّف علينا</p>
                  <p className="font-semibold text-[#111827]">{enrollment.howDidYouHear}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Phone size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#9CA3AF]">الهاتف</p>
                <p className="font-semibold text-[#111827]" dir="ltr">{enrollment.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail size={13} className="text-[#9CA3AF] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#9CA3AF]">البريد الإلكتروني</p>
                <p className="font-semibold text-[#111827]" dir="ltr">{enrollment.email}</p>
              </div>
            </div>
          </div>
          {enrollment.questions && (
            <div className="mt-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <p className="text-xs text-[#9CA3AF] mb-1">أسئلة واستفسارات</p>
              <p className="text-sm text-[#374151] leading-relaxed">{enrollment.questions}</p>
            </div>
          )}
          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${enrollment.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`السلام عليكم ${enrollment.fullName}، تواصل معك فريق دبي فانز بخصوص تسجيلك في ${enrollment.courseName} 🎓`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors"
          >
            <Phone size={13} /> تواصل عبر واتساب
          </a>

          {/* Student account linking */}
          <div className="mt-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
            <p className="text-xs font-bold text-[#6B7280] mb-2 flex items-center gap-1">
              <Link2 size={12} /> ربط بحساب طالب
            </p>
            {enrollment.studentId ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#111827]">
                  مرتبط بالطالب رقم <strong>#{enrollment.studentId}</strong>
                </span>
                <button
                  onClick={handleUnlink}
                  disabled={linking}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold hover:bg-[#FECACA] disabled:opacity-50 transition-colors"
                >
                  {linking ? <Loader size={10} className="animate-spin" /> : <Unlink size={10} />}
                  فك الربط
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={studentIdInput}
                  onChange={e => setStudentIdInput(e.target.value)}
                  placeholder="معرّف الطالب"
                  min="1"
                  className="w-28 px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] focus:outline-none focus:border-[#CC0000]/60"
                  onKeyDown={e => { if (e.key === "Enter") void handleLink(); }}
                />
                <button
                  onClick={handleLink}
                  disabled={linking || !studentIdInput}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold hover:bg-[#DBEAFE] disabled:opacity-50 transition-colors"
                >
                  {linking ? <Loader size={10} className="animate-spin" /> : <Link2 size={10} />}
                  ربط
                </button>
                {linkMsg && (
                  <span className={`text-[10px] font-semibold ${linkMsg.kind === "ok" ? "text-[#10B981]" : "text-[#CC0000]"}`}>
                    {linkMsg.text}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Course Enrollments Tab
// ─────────────────────────────────────────────────────────────────────────────
function EnrollmentsTab() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<EnrollStatus | "all">("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [updateMsg, setUpdateMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/course-enrollments`, { credentials: "include" });
      if (!res.ok) { setError("فشل في جلب البيانات"); return; }
      const data = await res.json() as { enrollments: Enrollment[] };
      setEnrollments(data.enrollments ?? []);
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function handleStudentLink(id: number, studentId: number | null) {
    try {
      const res = await fetch(`${API}/admin/course-enrollments/${id}/link-student`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ studentId }),
      });
      if (!res.ok) {
        setUpdateMsg({ kind: "err", text: "فشل في تحديث ربط الطالب" });
      } else {
        setEnrollments(prev => prev.map(e => e.id === id ? { ...e, studentId } : e));
        setUpdateMsg({
          kind: "ok",
          text: studentId ? `تم ربط التسجيل بالطالب #${studentId}` : "تم فك ربط الحساب",
        });
      }
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch {
      setUpdateMsg({ kind: "err", text: "خطأ في الاتصال" });
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  }

  async function handleStatusChange(id: number, status: EnrollStatus) {
    try {
      const res = await fetch(`${API}/admin/course-enrollments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setUpdateMsg({ kind: "err", text: "فشل في تحديث الحالة" });
        setTimeout(() => setUpdateMsg(null), 3000);
        return;
      }
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      const meta = STATUS_META[status];
      setUpdateMsg({ kind: "ok", text: `تم تحديث الحالة إلى "${meta?.label}"` });
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch {
      setUpdateMsg({ kind: "err", text: "خطأ في الاتصال" });
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  }

  // Stats
  const stats = {
    total:     enrollments.length,
    new:       enrollments.filter(e => e.status === "new").length,
    contacted: enrollments.filter(e => e.status === "contacted").length,
    enrolled:  enrollments.filter(e => e.status === "enrolled").length,
    cancelled: enrollments.filter(e => e.status === "cancelled").length,
  };

  // Unique courses + totals per course
  const courseCounts = enrollments.reduce<Record<string, number>>((acc, e) => {
    acc[e.courseName] = (acc[e.courseName] ?? 0) + 1;
    return acc;
  }, {});
  const courses = Object.keys(courseCounts);

  // Filtered list
  const filtered = enrollments.filter(e => {
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (filterCourse !== "all" && e.courseName !== filterCourse) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-[#CC0000]" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="text-[#CC0000]" size={32} />
        <p className="text-[#CC0000] font-bold">{error}</p>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-xl text-sm font-bold hover:bg-[#AA0000] transition-colors">
          <RefreshCw size={14} /> إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "إجمالي الطلبات", value: stats.total,     color: "#111827" },
          { label: STATUS_META.new.label,       value: stats.new,       color: STATUS_META.new.text       },
          { label: STATUS_META.contacted.label, value: stats.contacted, color: STATUS_META.contacted.text },
          { label: STATUS_META.enrolled.label,  value: stats.enrolled,  color: STATUS_META.enrolled.text  },
          { label: STATUS_META.cancelled.label, value: stats.cancelled, color: STATUS_META.cancelled.text },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 border border-[#E5E7EB] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-course totals */}
      {courses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {courses.map(c => (
            <button
              key={c}
              onClick={() => setFilterCourse(filterCourse === c ? "all" : c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                filterCourse === c
                  ? "bg-[#CC0000] text-white border-[#CC0000]"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#9CA3AF]"
              }`}
            >
              <GraduationCap size={12} />
              {c}
              <span className={`px-1.5 rounded-full ${filterCourse === c ? "bg-white/20" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                {courseCounts[c]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Filters + refresh */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as EnrollStatus | "all")}
          className="text-sm px-3 py-2 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] focus:outline-none focus:border-[#CC0000]/60"
        >
          <option value="all">جميع الحالات</option>
          {(Object.entries(STATUS_META) as [EnrollStatus, typeof STATUS_META[EnrollStatus]][]).map(([val, meta]) => (
            <option key={val} value={val}>{meta.label}</option>
          ))}
        </select>

        {courses.length > 1 && (
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="text-sm px-3 py-2 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] focus:outline-none focus:border-[#CC0000]/60 max-w-[200px] truncate"
          >
            <option value="all">جميع الكورسات</option>
            {courses.map(c => <option key={c} value={c}>{c} ({courseCounts[c]})</option>)}
          </select>
        )}

        <button
          onClick={load}
          className="mr-auto flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF] transition-colors"
        >
          <RefreshCw size={13} /> تحديث
        </button>
      </div>

      {/* Toast notification */}
      {updateMsg && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
          updateMsg.kind === "ok"
            ? "text-green-700 bg-green-50 border border-green-200"
            : "text-[#CC0000] bg-red-50 border border-red-200"
        }`}>
          {updateMsg.kind === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {updateMsg.text}
        </div>
      )}

      {/* Enrollments list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا توجد طلبات بهذه المعايير</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[#9CA3AF] mb-2">
            يُعرض {filtered.length} {filtered.length !== enrollments.length ? `من ${enrollments.length}` : ""} طلب
          </p>
          {filtered.map(e => (
            <EnrollmentRow key={e.id} enrollment={e} onStatusChange={handleStatusChange} onStudentLink={handleStudentLink} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Blog Tab (extracted from original AdminPage — identical logic)
// ─────────────────────────────────────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  const savedFormRef = useRef<FormState>(emptyForm());
  const [discardDialog, setDiscardDialog] = useState<{ open: boolean; onConfirm: () => void }>({ open: false, onConfirm: () => {} });

  const isDirty = useCallback((): boolean => {
    const saved = savedFormRef.current;
    return (Object.keys(form) as (keyof FormState)[]).some(k => form[k] !== saved[k]);
  }, [form]);

  const guardUnsaved = useCallback((action: () => void) => {
    if (isDirty()) setDiscardDialog({ open: true, onConfirm: action });
    else action();
  }, [isDirty]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty()) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    fetch(`${API}/blog/posts`, { credentials: "include" })
      .then(r => r.ok ? r.json() : { posts: [] })
      .then((d: { posts?: Post[] }) => setPosts(Array.isArray(d.posts) ? d.posts : []));
  }, []);

  async function handleEdit(id: string) {
    const doEdit = async () => {
      setStatus({ kind: "loading" });
      const res = await fetch(`${API}/blog/posts/${encodeURIComponent(id)}`, { credentials: "include" });
      if (!res.ok) { setStatus({ kind: "err", msg: "فشل في تحميل بيانات المقال" }); return; }
      const data = await res.json() as { post?: FormState & { id: string } };
      if (!data.post) { setStatus({ kind: "err", msg: "المقال غير موجود" }); return; }
      const { id: _id, ...rest } = data.post;
      const loaded: FormState = {
        title: rest.title ?? "", category: rest.category ?? CATEGORIES[0],
        image: rest.image ?? IMAGES[0].value, excerpt: rest.excerpt ?? "",
        dateISO: rest.dateISO ?? new Date().toISOString().slice(0, 10),
        readTime: rest.readTime ?? "5 دقائق", content: rest.content ?? "",
      };
      savedFormRef.current = loaded; setForm(loaded); setEditingId(id); setStatus({ kind: "idle" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    guardUnsaved(doEdit);
  }

  function handleCancelEdit() {
    guardUnsaved(() => { setEditingId(null); savedFormRef.current = emptyForm(); setForm(emptyForm()); setStatus({ kind: "idle" }); });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setStatus({ kind: "err", msg: "العنوان والمحتوى مطلوبان" }); return; }
    setStatus({ kind: "loading" });

    if (editingId) {
      const payload = { date: toArabicDate(form.dateISO), ...form };
      const res = await apiFetch(`${API}/admin/blog/posts/${encodeURIComponent(editingId)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(payload),
      });
      const data = await res.json() as { post?: Post; error?: string };
      if (!res.ok) { setStatus({ kind: "err", msg: data.error ?? "حدث خطأ" }); return; }
      setStatus({ kind: "ok", msg: `تم حفظ التعديلات على "${data.post?.title}"` });
      setEditingId(null); const fresh = emptyForm(); savedFormRef.current = fresh; setForm(fresh);
      if (data.post) setPosts(prev => prev.map(p => p.id === (data.post as Post).id ? (data.post as Post) : p));
    } else {
      const id = slugify(form.title) || `post-${Date.now()}`;
      const payload = { id, date: toArabicDate(form.dateISO), ...form };
      const res = await apiFetch(`${API}/admin/blog/posts`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(payload),
      });
      const data = await res.json() as { post?: Post; error?: string };
      if (!res.ok) { setStatus({ kind: "err", msg: data.error ?? "حدث خطأ" }); return; }
      setStatus({ kind: "ok", msg: `تم نشر المقال "${data.post?.title}"` });
      const fresh = emptyForm(); savedFormRef.current = fresh; setForm(fresh);
      if (data.post) setPosts(prev => [data.post as Post, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`حذف المقال "${id}"؟`)) return;
    const res = await apiFetch(`${API}/admin/blog/posts/${encodeURIComponent(id)}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
  }

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <>
      {/* Create / Edit form */}
      <div className="glass-card rounded-2xl p-8 border border-[#E5E7EB] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
            {editingId ? <><Pencil size={18} className="text-[#CC0000]" /> تعديل المقال</> : <><Plus size={18} className="text-[#CC0000]" /> مقال جديد</>}
          </h2>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="flex items-center gap-1 text-[#9CA3AF] hover:text-[#111827] text-sm font-semibold transition-colors">
              <X size={14} /> إلغاء التعديل
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5">العنوان *</label>
            <input {...field("title")} type="text" placeholder="عنوان المقال" className={inputCls} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5">المقتطف</label>
            <input {...field("excerpt")} type="text" placeholder="جملة أو جملتان تصفان المقال..." className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">التصنيف *</label>
              <select {...field("category")} className={inputCls}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">الصورة</label>
              <select {...field("image")} className={inputCls}>{IMAGES.map(img => <option key={img.value} value={img.value}>{img.label}</option>)}</select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5 flex items-center gap-1"><Calendar size={12} /> تاريخ النشر *</label>
              <input {...field("dateISO")} type="date" className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">وقت القراءة</label>
              <input {...field("readTime")} type="text" placeholder="مثال: 5 دقائق" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5">المحتوى *</label>
            <textarea {...field("content")} rows={14} placeholder="اكتب محتوى المقال هنا..." className={`${inputCls} resize-y leading-relaxed`} required />
          </div>
          {status.kind === "ok" && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-semibold"><CheckCircle size={16} /> {status.msg}</div>}
          {status.kind === "err" && <div className="flex items-center gap-2 text-[#CC0000] bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold"><AlertCircle size={16} /> {status.msg}</div>}
          <button type="submit" disabled={status.kind === "loading"} className="w-full py-3.5 bg-[#CC0000] text-white rounded-xl font-black text-sm hover:bg-[#AA0000] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {status.kind === "loading" ? <><Loader size={16} className="animate-spin" /> {editingId ? "جارٍ الحفظ..." : "جارٍ النشر..."}</> : editingId ? <><Pencil size={16} /> حفظ التعديلات</> : <><Plus size={16} /> نشر المقال</>}
          </button>
        </form>
      </div>

      {/* Published posts list */}
      {posts.length > 0 && (
        <div className="glass-card rounded-2xl p-8 border border-[#E5E7EB]">
          <h2 className="text-lg font-black text-[#111827] mb-5">المقالات المنشورة ({posts.length})</h2>
          <div className="space-y-3">
            {posts.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#111827] truncate">{p.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{p.category} · {p.dateISO}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEdit(p.id)} className="text-[#9CA3AF] hover:text-[#2563EB] transition-colors" title="تعديل"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-[#9CA3AF] hover:text-[#CC0000] transition-colors" title="حذف"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unsaved-changes dialog */}
      {discardDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-[#E5E7EB]">
            <div className="flex justify-center mb-4"><span className="w-12 h-12 rounded-full bg-[#CC0000]/10 flex items-center justify-center"><AlertCircle className="text-[#CC0000]" size={24} /></span></div>
            <h2 className="text-lg font-black text-[#111827] text-center mb-2">هل تريد المغادرة؟</h2>
            <p className="text-[#6B7280] text-sm text-center mb-6 leading-relaxed">لديك تعديلات غير محفوظة. إذا غادرت الآن ستضيع جميع التعديلات.</p>
            <div className="flex gap-3">
              <button onClick={() => { const a = discardDialog.onConfirm; setDiscardDialog({ open: false, onConfirm: () => {} }); a(); }} className="flex-1 py-2.5 bg-[#CC0000] text-white rounded-xl font-bold text-sm hover:bg-[#AA0000] transition-colors">تجاهل التعديلات</button>
              <button onClick={() => setDiscardDialog({ open: false, onConfirm: () => {} })} className="flex-1 py-2.5 bg-[#F3F4F6] text-[#111827] rounded-xl font-bold text-sm hover:bg-[#E5E7EB] transition-colors">البقاء والتعديل</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminPage
// ─────────────────────────────────────────────────────────────────────────────
type TabId = "blog" | "enrollments" | "clients" | "reports" | "aibos-leads" | "website-orders" | "business-audits";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("enrollments");

  useEffect(() => {
    fetch(`${API}/admin/session`, { credentials: "include" })
      .then(res => setAuthed(res.ok))
      .catch(() => setAuthed(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(""); setLoginLoading(true);
    try {
      const res = await apiFetch(`${API}/admin/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ password: passwordInput }),
      });
      if (res.ok) setAuthed(true);
      else setAuthError("كلمة المرور غير صحيحة");
    } catch { setAuthError("خطأ في الاتصال"); }
    finally { setLoginLoading(false); }
  }

  async function handleLogout() {
    await apiFetch(`${API}/admin/logout`, { method: "POST", credentials: "include" });
    setAuthed(false); setPasswordInput("");
  }

  /* Checking session */
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
        <SEOHead title="لوحة التحكم | دبي فانز" description="" noindex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center"><Loader className="animate-spin text-[#CC0000]" size={32} /></main>
        <Footer />
      </div>
    );
  }

  /* Password gate */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
        <SEOHead title="لوحة التحكم | دبي فانز" description="" noindex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20 pb-20 px-6">
          <div className="glass-card rounded-2xl p-8 w-full max-w-sm border border-[#E5E7EB]">
            <div className="flex justify-center mb-6">
              <span className="w-14 h-14 rounded-full bg-[#CC0000]/10 flex items-center justify-center">
                <Lock className="text-[#CC0000]" size={26} />
              </span>
            </div>
            <h1 className="text-xl font-black text-center text-[#111827] mb-2">لوحة إدارة دبي فانز</h1>
            <p className="text-[#9CA3AF] text-xs text-center mb-6">أدخل كلمة المرور للدخول</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password" value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="كلمة المرور" className={inputCls} autoFocus required
              />
              {authError && <p className="text-[#CC0000] text-xs font-semibold flex items-center gap-1"><AlertCircle size={13} /> {authError}</p>}
              <button type="submit" disabled={loginLoading} className="w-full py-3 bg-[#CC0000] text-white rounded-xl font-bold text-sm hover:bg-[#AA0000] disabled:opacity-60 transition-colors">
                {loginLoading ? "جارٍ التحقق..." : "دخول"}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* Dashboard */
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "enrollments", label: "طلبات الكورسات", icon: <GraduationCap size={16} /> },
    { id: "blog",        label: "إدارة المدونة",   icon: <BookOpen size={16} /> },
    { id: "clients",     label: "العملاء",         icon: <Building2 size={16} /> },
    { id: "reports",     label: "التقارير",        icon: <BarChart2 size={16} /> },
    { id: "aibos-leads", label: "AI Business OS Leads", icon: <Bot size={16} /> },
    { id: "website-orders", label: "طلبات المواقع", icon: <Globe size={16} /> },
    { id: "business-audits", label: "طلبات التحليل", icon: <FileSearch size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead title="لوحة التحكم | دبي فانز" description="" noindex />
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#111827]">لوحة إدارة دبي فانز</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">إدارة طلبات الكورسات والمدونة</p>
            </div>
            <button onClick={handleLogout} className="text-[#9CA3AF] hover:text-[#CC0000] text-sm font-semibold transition-colors">خروج</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-[#F3F4F6] rounded-2xl border border-[#E5E7EB]">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === t.id
                    ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                    : "text-[#9CA3AF] hover:text-[#374151]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "enrollments" && <EnrollmentsTab />}
          {activeTab === "blog"        && <BlogTab />}
          {activeTab === "clients"     && <ClientsTab />}
          {activeTab === "reports"     && <ReportsTab />}
          {activeTab === "aibos-leads" && <AibosLeadsTab />}
          {activeTab === "website-orders" && <WebsiteOrdersTab />}
          {activeTab === "business-audits" && <BusinessAuditsTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
