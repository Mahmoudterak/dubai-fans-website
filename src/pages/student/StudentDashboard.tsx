/**
 * StudentDashboard — full 9-section student portal
 * Sections: لوحة التحكم | الدورات | نسبة الإنجاز | الشهادات | الاختبارات | الواجبات | التحميلات | الدعم | الملف الشخصي
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, BookOpen, BarChart2, Award, ClipboardList,
  FileText, Download, LifeBuoy, User, LogOut, Menu, X,
  CheckCircle, Circle, Loader, AlertCircle, RefreshCw,
  Send, ExternalLink, Eye, ChevronRight, Lock, Phone, MapPin,
  Clock, CheckCheck, Inbox, Star,
} from "lucide-react";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";

const API = "/api";

// ── Types ──────────────────────────────────────────────────────────────────────
type Section =
  | "dashboard" | "courses" | "progress" | "certificates"
  | "exams" | "assignments" | "downloads" | "support" | "profile";

interface StudentInfo { id: number; fullName: string; email: string }
interface EnrolledCourse { courseSlug: string; courseName: string }

interface RecentAchievement { certificateId: number; courseSlug: string; courseName: string; issuedAt: string }
interface DashboardSummary {
  student: StudentInfo;
  enrolledCourses: number;
  certificates: number;
  openTickets: number;
  completedLessons: number;
  totalLessons: number;
  courses: EnrolledCourse[];
  recentAchievements?: RecentAchievement[];
}
interface Lesson { id: string; title: string; completed: boolean }
interface ProgressData { courseSlug: string; lessons: Lesson[]; completedCount: number; totalCount: number }
interface Certificate { id: number; courseSlug: string; courseName: string; issuedAt: string }
interface Exam { id: number; courseSlug: string; title: string; description: string; attempts: ExamAttempt[] }
interface ExamAttempt { id: number; score: number; maxScore: number; takenAt: string }
interface Assignment {
  id: number; courseSlug: string; title: string; description: string;
  dueDate: string | null; submission: AssignmentSubmission | null
}
interface AssignmentSubmission { id: number; fileUrl: string; notes: string; submittedAt: string; grade: number | null; feedback: string }
interface CourseDownload { id: number; courseSlug: string; courseName: string; title: string; fileUrl: string; fileSize: string; fileType: string }
interface SupportTicket { id: number; subject: string; body: string; status: string; createdAt: string }
interface TicketReply { id: number; body: string; isAdmin: boolean; createdAt: string }
interface StudentProfile { id: number; fullName: string; email: string; phone: string; city: string; createdAt: string; hasGoogle?: boolean; hasPassword?: boolean }

// ── Sidebar nav items ──────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Section; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "dashboard",    label: "لوحة التحكم",  icon: LayoutDashboard },
  { id: "courses",      label: "الدورات",       icon: BookOpen },
  { id: "progress",     label: "نسبة الإنجاز",  icon: BarChart2 },
  { id: "certificates", label: "الشهادات",      icon: Award },
  { id: "exams",        label: "الاختبارات",    icon: ClipboardList },
  { id: "assignments",  label: "الواجبات",      icon: FileText },
  { id: "downloads",    label: "التحميلات",     icon: Download },
  { id: "support",      label: "الدعم",         icon: LifeBuoy },
  { id: "profile",      label: "الملف الشخصي",  icon: User },
];

// ── Shared helpers ──────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-AE", { year: "numeric", month: "short", day: "numeric" });
}
function classNames(...cls: (string | undefined | false)[]): string {
  return cls.filter(Boolean).join(" ");
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorCls, bgCls }: {
  label: string; value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorCls: string; bgCls: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgCls}`}>
        <Icon size={22} className={colorCls} />
      </div>
      <div>
        <p className="text-2xl font-black text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Progress ring ──────────────────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = circ - (circ * Math.min(pct, 100)) / 100;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="block">
      <circle cx="45" cy="45" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={r} fill="none"
        stroke="var(--color-primary)" strokeWidth="8"
        strokeDasharray={`${circ}`} strokeDashoffset={dash}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text x="45" y="49" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--color-foreground)">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Loading / error states ─────────────────────────────────────────────────────
function Loading() {
  return <div className="flex items-center justify-center py-24"><Loader size={28} className="animate-spin text-primary" /></div>;
}
function Err({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-primary">
      <AlertCircle size={32} />
      <p className="font-bold text-sm">{msg}</p>
      {onRetry && <button onClick={onRetry} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg"><RefreshCw size={12} /> إعادة المحاولة</button>}
    </div>
  );
}
function Empty({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <Icon size={40} className="opacity-30" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

// ── Section: لوحة التحكم ─────────────────────────────────────────────────────
function DashboardSection({ summary }: { summary: DashboardSummary | null }) {
  if (!summary) return <Loading />;
  const pct = summary.completedLessons > 0 && summary.totalLessons > 0
    ? Math.min(100, Math.round((summary.completedLessons / summary.totalLessons) * 100))
    : 0;
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary to-foreground rounded-2xl p-6 text-white">
        <p className="text-white/70 text-sm">مرحباً بك</p>
        <h2 className="text-2xl font-black mt-1">{summary.student.fullName} 👋</h2>
        <p className="text-white/60 text-sm mt-1">{summary.student.email}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="دوراتي" value={summary.enrolledCourses} icon={BookOpen} colorCls="text-primary" bgCls="bg-primary/10" />
        <StatCard label="شهاداتي" value={summary.certificates} icon={Award} colorCls="text-accent" bgCls="bg-accent/10" />
        <StatCard label="دروس مكتملة" value={summary.completedLessons} icon={CheckCheck} colorCls="text-chart-4" bgCls="bg-chart-4/10" />
        <StatCard label="تذاكر مفتوحة" value={summary.openTickets} icon={LifeBuoy} colorCls="text-chart-5" bgCls="bg-chart-5/10" />
      </div>
      {/* Recent achievements */}
      {summary.recentAchievements && summary.recentAchievements.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Star size={16} className="text-accent" /> إنجازات حديثة</h3>
          <div className="space-y-2">
            {summary.recentAchievements.map(a => (
              <div key={a.certificateId} className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shrink-0">
                  <Award size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">أتممت كورس {a.courseName} 🎉</p>
                  <p className="text-[11px] text-muted-foreground">شهادة صادرة بتاريخ {formatDate(a.issuedAt)}</p>
                </div>
                <a
                  href={`/api/student/certificates/${a.certificateId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-[11px] font-bold hover:bg-accent/90 transition-colors"
                >
                  <Eye size={11} /> عرض الشهادة
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-primary" /> إنجازك الإجمالي</h3>
          <div className="flex items-center gap-4">
            <ProgressRing pct={pct} />
            <div>
              <p className="text-2xl font-black text-primary">{summary.completedLessons}</p>
              <p className="text-xs text-muted-foreground">درس مكتمل</p>
              <p className="text-xs text-muted-foreground mt-1">من {summary.enrolledCourses} دورة مسجّلة</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen size={16} className="text-primary" /> دوراتي المسجّلة</h3>
          {summary.courses.length === 0
            ? <p className="text-sm text-muted-foreground">لم تُسجَّل في أي دورة بعد</p>
            : <div className="space-y-2">
                {summary.courses.slice(0, 4).map(c => (
                  <div key={c.courseSlug} className="flex items-center gap-2 text-sm">
                    <ChevronRight size={14} className="text-primary shrink-0" />
                    <span className="text-foreground/80 font-medium truncate">{c.courseName}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ── Section: الدورات ──────────────────────────────────────────────────────────
function CoursesSection({ summary }: { summary: DashboardSummary | null }) {
  if (!summary) return <Loading />;
  if (summary.courses.length === 0) return <Empty icon={BookOpen} label="لا توجد دورات مسجّلة — تواصل مع الإدارة لتفعيل دورتك" />;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {summary.courses.map(c => (
        <div key={c.courseSlug} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <BookOpen size={18} className="text-primary" />
          </div>
          <h3 className="font-bold text-foreground mb-1">{c.courseName}</h3>
          <p className="text-xs text-muted-foreground mb-3">{c.courseSlug}</p>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-chart-4/10 text-chart-4 rounded-full text-[11px] font-bold">
            <CheckCircle size={11} /> مسجّل
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Section: نسبة الإنجاز ─────────────────────────────────────────────────────
function ProgressSection({ courses }: { courses: EnrolledCourse[] }) {
  const [selected, setSelected] = useState<string>(courses[0]?.courseSlug ?? "");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ certificateId: number; courseName: string } | null>(null);
  const [certInfo, setCertInfo] = useState<{ certificateId: number } | null>(null);

  const load = useCallback(async (slug: string) => {
    if (!slug) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/student/progress/${slug}`, { credentials: "include" });
      if (r.ok) setData(await r.json() as ProgressData);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (selected) void load(selected); }, [selected, load]);

  async function toggle(lesson: Lesson) {
    if (!selected || toggling) return;
    setToggling(lesson.id);
    try {
      const r = await fetch(`${API}/student/progress`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ courseSlug: selected, lessonId: lesson.id, lessonTitle: lesson.title, completed: !lesson.completed }),
      });
      if (r.ok) {
        const d = await r.json() as { ok: boolean; courseCompleted?: boolean; certificateId?: number; newlyIssued?: boolean; courseName?: string };
        if (d.courseCompleted && d.certificateId) {
          setCertInfo({ certificateId: d.certificateId });
          // Only celebrate the first time the certificate is issued
          if (d.newlyIssued) {
            setCelebration({ certificateId: d.certificateId, courseName: d.courseName ?? "" });
          }
        }
      }
      await load(selected);
    } finally { setToggling(null); }
  }

  // Reset cached certificate info when switching course
  useEffect(() => { setCertInfo(null); }, [selected]);

  if (courses.length === 0) return <Empty icon={BarChart2} label="لا توجد دورات مسجّلة" />;

  return (
    <div className="space-y-4">
      {/* Course selector */}
      <div className="flex flex-wrap gap-2">
        {courses.map(c => (
          <button
            key={c.courseSlug}
            onClick={() => setSelected(c.courseSlug)}
            className={classNames(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              selected === c.courseSlug
                ? "bg-primary text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            {c.courseName}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : data ? (
        <div className="bg-card rounded-2xl border border-border p-5">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">{data.completedCount} / {data.totalCount} دروس مكتملة</h3>
            <ProgressRing pct={Math.round((data.completedCount / Math.max(1, data.totalCount)) * 100)} />
          </div>
          <div className="w-full h-2 bg-muted rounded-full mb-5">
            <div
              className="h-2 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${Math.round((data.completedCount / Math.max(1, data.totalCount)) * 100)}%` }}
            />
          </div>

          {/* Lesson list */}
          <div className="space-y-2">
            {data.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => void toggle(l)}
                disabled={toggling === l.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-right disabled:opacity-60"
              >
                {toggling === l.id
                  ? <Loader size={18} className="animate-spin text-primary shrink-0" />
                  : l.completed
                    ? <CheckCircle size={18} className="text-chart-4 shrink-0" />
                    : <Circle size={18} className="text-muted-foreground/50 shrink-0" />
                }
                <span className={classNames("text-sm flex-1", l.completed ? "text-chart-4 line-through" : "text-foreground/80")}>
                  {i + 1}. {l.title}
                </span>
                {l.completed && <span className="text-[10px] text-chart-4 font-bold">مكتمل</span>}
              </button>
            ))}
          </div>

          {/* Course completed — certificate is auto-issued */}
          {data.completedCount === data.totalCount && data.totalCount > 0 && (
            <div className="mt-5 p-4 bg-chart-4/10 border border-chart-4/30 rounded-xl flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-chart-4" />
                <span className="text-sm font-bold text-chart-4">أتممت جميع الدروس! تم إصدار شهادتك تلقائياً 🎉</span>
              </div>
              {certInfo ? (
                <a
                  href={`/api/student/certificates/${certInfo.certificateId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-chart-4 text-white rounded-xl text-xs font-bold hover:bg-chart-4/80 transition-colors"
                >
                  <Eye size={13} /> عرض الشهادة
                </a>
              ) : (
                <span className="text-xs text-muted-foreground font-semibold">تجدها في قسم «الشهادات»</span>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* 🎉 Congratulation modal — shown when the last lesson auto-issues the certificate */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCelebration(null)} />
          <div className="relative bg-card rounded-3xl border border-border shadow-2xl max-w-md w-full p-8 text-center" dir="rtl">
            <button
              onClick={() => setCelebration(null)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-4">
              <Award size={36} className="text-white" />
            </div>
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-black text-foreground mb-2">مبروك! أتممت الكورس بنجاح</h3>
            <p className="text-sm text-muted-foreground mb-1">
              {celebration.courseName && <>أكملت جميع دروس <span className="font-bold text-foreground">{celebration.courseName}</span></>}
            </p>
            <p className="text-sm text-muted-foreground mb-6">تم إصدار شهادتك تلقائياً وهي جاهزة الآن للعرض والطباعة</p>
            <div className="flex gap-2 justify-center">
              <a
                href={`/api/student/certificates/${celebration.certificateId}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <Eye size={15} /> عرض شهادتي
              </a>
              <Button variant="outline" onClick={() => setCelebration(null)}>
                لاحقاً
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section: الشهادات ─────────────────────────────────────────────────────────
function CertificatesSection() {
  const [certs, setCerts] = useState<Certificate[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API}/student/certificates`, { credentials: "include" })
      .then(r => r.json() as Promise<{ certificates: Certificate[] }>)
      .then(d => setCerts(d.certificates))
      .catch(() => setErr("فشل في جلب الشهادات"));
  }, []);

  if (err) return <Err msg={err} />;
  if (!certs) return <Loading />;
  if (certs.length === 0) return <Empty icon={Award} label="لا توجد شهادات بعد — أكمل دورة للحصول على شهادتك" />;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {certs.map(c => (
        <div key={c.id} className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <Award size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{c.courseName}</p>
              <p className="text-xs text-muted-foreground">صادرة بتاريخ {formatDate(c.issuedAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`/api/student/certificates/${c.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <Eye size={13} /> عرض الشهادة
            </a>
            <a
              href={`/api/student/certificates/${c.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 border border-border text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const w = window.open(`/api/student/certificates/${c.id}/view`, "_blank");
                if (w) { w.focus(); setTimeout(() => w.print(), 800); }
              }}
            >
              <Download size={13} /> PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section: الاختبارات ───────────────────────────────────────────────────────
function ExamsSection() {
  const [data, setData] = useState<{ exams: Exam[] } | null>(null);
  const [err, setErr] = useState("");
  // Per-exam submission state: examId → { open, score, saving, msg }
  const [submitting, setSubmitting] = useState<Record<number, { open: boolean; score: string; saving: boolean; msg?: { kind: "ok" | "err"; text: string } }>>({});

  function loadExams() {
    fetch(`${API}/student/exams`, { credentials: "include" })
      .then(r => r.json() as Promise<{ exams: Exam[] }>)
      .then(setData)
      .catch(() => setErr("فشل في جلب الاختبارات"));
  }
  useEffect(loadExams, []);

  async function submitAttempt(examId: number) {
    const st = submitting[examId];
    if (!st) return;
    const score = parseFloat(st.score);
    if (isNaN(score) || score < 0 || score > 100) {
      setSubmitting(p => ({ ...p, [examId]: { ...p[examId]!, msg: { kind: "err", text: "أدخل درجة صحيحة بين 0 و 100" } } }));
      return;
    }
    setSubmitting(p => ({ ...p, [examId]: { ...p[examId]!, saving: true, msg: undefined } }));
    try {
      const res = await fetch(`${API}/student/exams/${examId}/attempt`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ score }),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        setSubmitting(p => ({ ...p, [examId]: { ...p[examId]!, saving: false, msg: { kind: "err", text: j.error ?? "فشل تسجيل المحاولة" } } }));
        return;
      }
      setSubmitting(p => ({ ...p, [examId]: { open: false, score: "", saving: false, msg: undefined } }));
      loadExams(); // refresh to show new attempt
    } catch {
      setSubmitting(p => ({ ...p, [examId]: { ...p[examId]!, saving: false, msg: { kind: "err", text: "خطأ في الشبكة" } } }));
    }
  }

  if (err) return <Err msg={err} />;
  if (!data) return <Loading />;

  return (
    <div className="space-y-4">
      {data.exams.length === 0
        ? <Empty icon={ClipboardList} label="لا توجد اختبارات مضافة بعد" />
        : data.exams.map(ex => {
          const st = submitting[ex.id];
          const best = ex.attempts.length > 0
            ? Math.max(...ex.attempts.map(a => Math.round((a.score / a.maxScore) * 100)))
            : null;
          return (
            <div key={ex.id} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">{ex.title}</h3>
                  {ex.description && <p className="text-sm text-muted-foreground mt-1">{ex.description}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="px-2 py-1 bg-chart-3/10 text-chart-3 rounded-lg text-[11px] font-bold">{ex.courseSlug}</span>
                  {best !== null && (
                    <span className={classNames("px-2 py-1 rounded-lg text-[11px] font-bold",
                      best >= 60 ? "bg-chart-4/10 text-chart-4" : "bg-destructive/10 text-primary")}>
                      أفضل درجة: {best}%
                    </span>
                  )}
                </div>
              </div>

              {/* Attempt history */}
              {ex.attempts.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-xs font-bold text-muted-foreground">محاولاتك السابقة</p>
                  {ex.attempts.slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center justify-between bg-muted rounded-xl px-3 py-2 text-sm">
                      <span className="text-muted-foreground">{formatDate(a.takenAt)}</span>
                      <span className="font-bold text-foreground">
                        {a.score} / {a.maxScore}
                        <span className="text-xs text-muted-foreground mr-1">
                          ({Math.round((a.score / a.maxScore) * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit attempt */}
              {!st?.open ? (
                <Button size="sm" variant="outline"
                  onClick={() => setSubmitting(p => ({ ...p, [ex.id]: { open: true, score: "", saving: false } }))}>
                  {ex.attempts.length > 0 ? "محاولة جديدة" : "تسجيل محاولة"}
                </Button>
              ) : (
                <div className="mt-2 p-3 bg-muted rounded-xl space-y-2">
                  <p className="text-xs font-bold text-foreground">أدخل درجتك (0 – 100)</p>
                  <div className="flex gap-2">
                    <input
                      type="number" min={0} max={100} step={1}
                      value={st.score}
                      onChange={e => setSubmitting(p => ({ ...p, [ex.id]: { ...p[ex.id]!, score: e.target.value } }))}
                      className="w-24 border border-border rounded-xl px-3 py-2 text-sm text-foreground bg-card focus:outline-none focus:border-primary"
                      placeholder="مثال: 85"
                    />
                    <Button size="sm" disabled={st.saving} onClick={() => void submitAttempt(ex.id)}>
                      {st.saving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => setSubmitting(p => ({ ...p, [ex.id]: { open: false, score: "", saving: false } }))}>
                      إلغاء
                    </Button>
                  </div>
                  {st.msg && (
                    <p className={`text-xs font-semibold ${st.msg.kind === "ok" ? "text-chart-4" : "text-primary"}`}>
                      {st.msg.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      }
    </div>
  );
}

// ── Section: الواجبات ─────────────────────────────────────────────────────────
function AssignmentsSection() {
  const [data, setData] = useState<{ assignments: Assignment[] } | null>(null);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [form, setForm] = useState<Record<number, { fileUrl: string; notes: string }>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/student/assignments`, { credentials: "include" });
      if (r.ok) setData(await r.json() as { assignments: Assignment[] });
    } catch { setErr("فشل في جلب الواجبات"); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function submit(id: number) {
    const f = form[id];
    if (!f?.fileUrl?.trim()) { setMsg({ kind: "err", text: "أدخل رابط الملف" }); return; }
    setSubmitting(id);
    try {
      const r = await fetch(`${API}/student/assignments/${id}/submit`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ fileUrl: f.fileUrl.trim(), notes: f.notes }),
      });
      if (r.ok) {
        setMsg({ kind: "ok", text: "تم تسليم الواجب بنجاح ✅" });
        setForm(prev => { const n = { ...prev }; delete n[id]; return n; });
        void load();
      } else {
        setMsg({ kind: "err", text: "فشل التسليم" });
      }
    } finally { setSubmitting(null); setTimeout(() => setMsg(null), 3000); }
  }

  if (err) return <Err msg={err} />;
  if (!data) return <Loading />;
  if (data.assignments.length === 0) return <Empty icon={FileText} label="لا توجد واجبات متاحة بعد" />;

  return (
    <div className="space-y-3">
      {msg && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${msg.kind === "ok" ? "bg-chart-4/10 text-chart-4 border border-chart-4/30" : "bg-destructive/10 text-primary border border-destructive/30"}`}>
          {msg.kind === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
        </div>
      )}
      {data.assignments.map(a => {
        const f = form[a.id] ?? { fileUrl: "", notes: "" };
        const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
        return (
          <div key={a.id} className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-foreground">{a.title}</h3>
              {a.dueDate && (
                <span className={classNames("shrink-0 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1", isOverdue ? "bg-destructive/10 text-primary" : "bg-accent/10 text-accent")}>
                  <Clock size={11} />
                  {isOverdue ? "انتهى" : "حتى"} {new Date(a.dueDate).toLocaleDateString("ar-AE")}
                </span>
              )}
            </div>
            {a.description && <p className="text-sm text-muted-foreground mb-3">{a.description}</p>}

            {a.submission ? (
              <div className="bg-chart-4/10 border border-chart-4/30 rounded-xl p-3 space-y-1">
                <p className="text-xs font-bold text-chart-4 flex items-center gap-1"><CheckCircle size={12} /> تم التسليم بتاريخ {formatDate(a.submission.submittedAt)}</p>
                <a href={a.submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-chart-3 flex items-center gap-1 hover:underline">
                  <ExternalLink size={11} /> {a.submission.fileUrl}
                </a>
                {a.submission.grade !== null && (
                  <p className="text-xs font-bold text-foreground">الدرجة: {a.submission.grade} {a.submission.feedback && `— ${a.submission.feedback}`}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <input
                  type="url"
                  placeholder="رابط الملف (Google Drive، Dropbox، ...)"
                  value={f.fileUrl}
                  onChange={e => setForm(p => ({ ...p, [a.id]: { ...f, fileUrl: e.target.value } }))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60"
                />
                <textarea
                  placeholder="ملاحظات (اختياري)"
                  value={f.notes}
                  onChange={e => setForm(p => ({ ...p, [a.id]: { ...f, notes: e.target.value } }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60 resize-none"
                />
                <Button
                  size="sm"
                  onClick={() => void submit(a.id)}
                  disabled={submitting === a.id || !f.fileUrl?.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {submitting === a.id ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                  تسليم الواجب
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Section: التحميلات ────────────────────────────────────────────────────────
function DownloadsSection() {
  const [data, setData] = useState<{ downloads: CourseDownload[] } | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API}/student/downloads`, { credentials: "include" })
      .then(r => r.json() as Promise<{ downloads: CourseDownload[] }>)
      .then(setData)
      .catch(() => setErr("فشل في جلب المواد"));
  }, []);

  if (err) return <Err msg={err} />;
  if (!data) return <Loading />;
  if (data.downloads.length === 0) return <Empty icon={Download} label="لا توجد مواد للتحميل بعد" />;

  const fileIcon: Record<string, string> = { pdf: "📄", video: "🎬", zip: "🗜️" };

  return (
    <div className="space-y-3">
      {data.downloads.map(d => (
        <div key={d.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="text-3xl shrink-0">{fileIcon[d.fileType] ?? "📁"}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate">{d.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{d.courseName} {d.fileSize && `· ${d.fileSize}`}</p>
          </div>
          <a
            href={d.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <Download size={13} /> تحميل
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Section: الدعم ────────────────────────────────────────────────────────────
function SupportSection() {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [selected, setSelected] = useState<{ ticket: SupportTicket; replies: TicketReply[] } | null>(null);
  const [form, setForm] = useState({ subject: "", body: "" });
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      const r = await fetch(`${API}/student/tickets`, { credentials: "include" });
      if (r.ok) setTickets((await r.json() as { tickets: SupportTicket[] }).tickets);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { void loadTickets(); }, [loadTickets]);

  const loadTicket = async (id: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/student/tickets/${id}`, { credentials: "include" });
      if (r.ok) setSelected(await r.json() as { ticket: SupportTicket; replies: TicketReply[] });
    } finally { setLoading(false); }
  };

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/student/tickets`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setMsg({ kind: "ok", text: "تم إرسال تذكرة الدعم ✅" });
        setForm({ subject: "", body: "" });
        void loadTickets();
      } else { setMsg({ kind: "err", text: "فشل الإرسال" }); }
    } finally { setSubmitting(false); setTimeout(() => setMsg(null), 3000); }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !replyText.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/student/tickets/${selected.ticket.id}/reply`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ body: replyText.trim() }),
      });
      if (r.ok) { setReplyText(""); void loadTicket(selected.ticket.id); }
    } finally { setSubmitting(false); }
  }

  const statusMeta: Record<string, { label: string; cls: string }> = {
    open:      { label: "مفتوحة",    cls: "bg-chart-3/10 text-chart-3" },
    in_review: { label: "قيد المراجعة", cls: "bg-accent/10 text-accent" },
    resolved:  { label: "مُغلقة",    cls: "bg-chart-4/10 text-chart-4" },
  };

  return (
    <div className="space-y-6">
      {/* New ticket form */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><LifeBuoy size={16} className="text-primary" /> فتح تذكرة دعم جديدة</h3>
        {msg && (
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold mb-3 ${msg.kind === "ok" ? "bg-chart-4/10 text-chart-4 border border-chart-4/30" : "bg-destructive/10 text-primary border border-destructive/30"}`}>
            {msg.kind === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {msg.text}
          </div>
        )}
        <form onSubmit={(e) => void submitTicket(e)} className="space-y-3">
          <input
            type="text"
            placeholder="عنوان المشكلة"
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60"
          />
          <textarea
            placeholder="وصف تفصيلي للمشكلة أو السؤال..."
            value={form.body}
            onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            rows={3}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60 resize-none"
          />
          <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white">
            {submitting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            إرسال التذكرة
          </Button>
        </form>
      </div>

      {/* Ticket list */}
      {tickets && tickets.length > 0 && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2"><Inbox size={16} className="text-primary" /> تذاكري ({tickets.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {tickets.map(t => {
              const sm = statusMeta[t.status] ?? statusMeta.open;
              return (
                <button
                  key={t.id}
                  onClick={() => void loadTicket(t.id)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted transition-colors text-right"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(t.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${sm.cls}`}>{sm.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Single ticket view */}
      {loading && <Loading />}
      {selected && !loading && (
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">{selected.ticket.subject}</h3>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          {/* Original message */}
          <div className="bg-muted rounded-xl p-3 text-sm text-foreground/80">{selected.ticket.body}</div>
          {/* Replies */}
          {selected.replies.map(r => (
            <div key={r.id} className={classNames("rounded-xl p-3 text-sm", r.isAdmin ? "bg-chart-3/10 border border-chart-3/30" : "bg-muted border border-border")}>
              <p className="text-xs font-bold text-muted-foreground mb-1">{r.isAdmin ? "فريق الدعم" : "أنت"} · {formatDate(r.createdAt)}</p>
              <p className="text-foreground/80">{r.body}</p>
            </div>
          ))}
          {/* Reply form */}
          {selected.ticket.status !== "resolved" && (
            <form onSubmit={(e) => void sendReply(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="أضف رداً..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60"
              />
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1">
                {submitting ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section: الملف الشخصي ─────────────────────────────────────────────────────
function ProfileSection() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", city: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [logoutAllBusy, setLogoutAllBusy] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/student/profile`, { credentials: "include" })
      .then(r => r.json() as Promise<{ ok: boolean; student: StudentProfile } | StudentProfile>)
      .then(d => {
        const p = "student" in d ? d.student : d;
        setProfile(p); setForm({ fullName: p.fullName, phone: p.phone, city: p.city });
      })
      .catch(() => { /* ignore */ });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch(`${API}/student/profile`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ fullName: form.fullName, phone: form.phone, city: form.city }),
      });
      setMsg(r.ok ? { kind: "ok", text: "تم حفظ التغييرات ✅" } : { kind: "err", text: "فشل الحفظ" });
    } finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setMsg({ kind: "err", text: "كلمتا المرور غير متطابقتين" }); return; }
    if (pwForm.next.length < 8) { setMsg({ kind: "err", text: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }); return; }
    setPwSaving(true);
    try {
      const r = await fetch(`${API}/student/profile/password`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (r.ok) { setMsg({ kind: "ok", text: "تم تغيير كلمة المرور ✅" }); setPwForm({ current: "", next: "", confirm: "" }); }
      else {
        const d = await r.json() as { error?: string };
        setMsg({ kind: "err", text: d.error ?? "فشل تغيير كلمة المرور" });
      }
    } finally { setPwSaving(false); setTimeout(() => setMsg(null), 4000); }
  }

  async function logoutAllDevices() {
    setLogoutAllBusy(true);
    try {
      const r = await fetch(`${API}/student/logout-all`, {
        method: "POST", credentials: "include",
        headers: { "X-Requested-With": "fetch" },
      });
      setMsg(r.ok
        ? { kind: "ok", text: "تم تسجيل الخروج من جميع الأجهزة الأخرى ✅" }
        : { kind: "err", text: "فشل تسجيل الخروج من الأجهزة الأخرى" });
    } catch {
      setMsg({ kind: "err", text: "فشل تسجيل الخروج من الأجهزة الأخرى" });
    } finally { setLogoutAllBusy(false); setTimeout(() => setMsg(null), 4000); }
  }

  async function unlinkGoogle() {
    if (!window.confirm("هل أنت متأكد من فصل حساب Google؟ ستحتاج إلى كلمة المرور لتسجيل الدخول بعد ذلك.")) return;
    setUnlinking(true);
    try {
      const r = await fetch(`${API}/student/profile/google`, {
        method: "DELETE", credentials: "include",
        headers: { "X-Requested-With": "fetch" },
      });
      if (r.ok) {
        setMsg({ kind: "ok", text: "تم فصل حساب Google ✅" });
        setProfile(p => (p ? { ...p, hasGoogle: false } : p));
      } else {
        const d = await r.json() as { error?: string };
        setMsg({ kind: "err", text: d.error ?? "فشل فصل حساب Google" });
      }
    } catch {
      setMsg({ kind: "err", text: "فشل فصل حساب Google" });
    } finally { setUnlinking(false); setTimeout(() => setMsg(null), 5000); }
  }

  const inputCls = "w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary/60";

  if (!profile) return <Loading />;
  return (
    <div className="space-y-5">
      {msg && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${msg.kind === "ok" ? "bg-chart-4/10 text-chart-4 border border-chart-4/30" : "bg-destructive/10 text-primary border border-destructive/30"}`}>
          {msg.kind === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
        </div>
      )}
      {/* Profile info */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-foreground flex items-center justify-center text-white text-2xl font-black">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{profile.fullName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground">عضو منذ {formatDate(profile.createdAt)}</p>
          </div>
        </div>
        <form onSubmit={(e) => void saveProfile(e)} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1"><User size={12} /> الاسم الكامل</label>
            <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1"><Phone size={12} /> رقم الهاتف</label>
            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={12} /> المدينة</label>
            <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className={inputCls} />
          </div>
          <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
            {saving ? <Loader size={14} className="animate-spin" /> : null}
            حفظ التغييرات
          </Button>
        </form>
      </div>

      {/* Google account linking */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-3">حساب Google</h3>
        {profile.hasGoogle ? (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-chart-4 font-semibold">
              <CheckCircle size={15} /> حسابك مرتبط بحساب Google — يمكنك تسجيل الدخول بنقرة واحدة
            </p>
            {profile.hasPassword ? (
              <button
                type="button"
                onClick={() => void unlinkGoogle()}
                disabled={unlinking}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/40 bg-background text-primary text-sm font-bold hover:bg-destructive/10 transition-colors disabled:opacity-60"
              >
                {unlinking ? <Loader size={14} className="animate-spin" /> : <X size={14} />}
                فصل حساب Google
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">
                لا يمكن فصل حساب Google لأن حسابك لا يملك كلمة مرور — عيّن كلمة مرور أولاً حتى لا تفقد الوصول إلى حسابك.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              اربط حسابك بحساب Google لتسجيل الدخول بنقرة واحدة دون كلمة مرور.
            </p>
            <a
              href="/api/student/auth/google?link=1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-bold hover:bg-muted transition-colors"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29A7.19 7.19 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.97 11.97 0 0 0 0 10.76l3.98-3.09z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
              </svg>
              ربط حساب Google
            </a>
          </div>
        )}
      </div>

      {/* Change password */}
      {profile.hasPassword !== false && (
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Lock size={16} className="text-primary" /> تغيير كلمة المرور</h3>
        <form onSubmit={(e) => void changePassword(e)} className="space-y-3">
          <input type="password" placeholder="كلمة المرور الحالية" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required className={inputCls} />
          <input type="password" placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} required className={inputCls} />
          <input type="password" placeholder="تأكيد كلمة المرور الجديدة" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required className={inputCls} />
          <Button type="submit" disabled={pwSaving} className="bg-foreground hover:bg-foreground/80 text-background">
            {pwSaving ? <Loader size={14} className="animate-spin" /> : <Lock size={14} />}
            تغيير كلمة المرور
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">عند تغيير كلمة المرور يتم تسجيل الخروج تلقائياً من جميع الأجهزة الأخرى.</p>
      </div>
      )}

      {/* Sessions & devices */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><Lock size={16} className="text-primary" /> الجلسات والأجهزة</h3>
        <p className="text-sm text-muted-foreground mb-4">
          إذا كنت تشك بأن أحداً يستخدم حسابك، يمكنك إنهاء جميع الجلسات على الأجهزة الأخرى — سيبقى هذا الجهاز مسجّلاً للدخول.
        </p>
        <Button type="button" onClick={() => void logoutAllDevices()} disabled={logoutAllBusy} variant="outline" className="border-destructive/40 text-primary hover:bg-destructive/10">
          {logoutAllBusy ? <Loader size={14} className="animate-spin" /> : <LogOut size={14} />}
          تسجيل الخروج من جميع الأجهزة الأخرى
        </Button>
      </div>
    </div>
  );
}

// ── Main dashboard component ──────────────────────────────────────────────────
export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section>("dashboard");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard + initial data load
  useEffect(() => {
    fetch(`${API}/student/session`, { credentials: "include" })
      .then(r => {
        if (!r.ok) { navigate("/student/login"); return null; }
        return r.json() as Promise<{ student: StudentInfo }>;
      })
      .then(d => {
        if (!d) return;
        setAuthChecked(true);
        // Load dashboard summary
        return fetch(`${API}/student/dashboard/summary`, { credentials: "include" })
          .then(r => r.json() as Promise<DashboardSummary>)
          .then(setSummary);
      })
      .catch(() => navigate("/student/login"));
  }, [navigate]);

  async function logout() {
    await fetch(`${API}/student/logout`, {
      method: "POST", credentials: "include",
      headers: { "X-Requested-With": "fetch" },
    });
    navigate("/student/login");
  }

  if (!authChecked) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  const activeItem = NAV_ITEMS.find(n => n.id === section)!;

  return (
    <div className="min-h-screen bg-muted flex flex-col" dir="rtl">
      {/* Top bar */}
      <header className="bg-card border-b border-border h-14 flex items-center px-4 gap-3 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white font-black text-sm">
            د
          </div>
          <span className="font-black text-foreground text-sm hidden sm:block">أكاديمية دبي فانز</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 mr-2">
          <span className="text-muted-foreground/50">/</span>
          <span className="text-sm font-semibold text-primary">{activeItem.label}</span>
        </div>
        <div className="mr-auto flex items-center gap-2">
          {summary?.student && (
            <span className="hidden sm:block text-sm text-muted-foreground font-medium">{summary.student.fullName}</span>
          )}
          <button
            onClick={() => void logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground border border-border rounded-lg hover:text-primary hover:border-primary/40 transition-colors"
          >
            <LogOut size={13} /> خروج
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={classNames(
          "fixed inset-y-0 top-14 right-0 z-20 w-56 bg-card border-l border-border flex flex-col transition-transform duration-200",
          "lg:static lg:translate-x-0 lg:z-auto",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            {NAV_ITEMS.map(item => {
              const isActive = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                  className={classNames(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  {item.label}
                  {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border">
            <a href="/courses" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink size={12} /> استعرض الكورسات
            </a>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 top-14 z-10 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Section title */}
          <div className="flex items-center gap-2 mb-5">
            <activeItem.icon size={20} className="text-primary" />
            <h1 className="text-lg font-black text-foreground">{activeItem.label}</h1>
          </div>

          {section === "dashboard"    && <DashboardSection summary={summary} />}
          {section === "courses"      && <CoursesSection summary={summary} />}
          {section === "progress"     && <ProgressSection courses={summary?.courses ?? []} />}
          {section === "certificates" && <CertificatesSection />}
          {section === "exams"        && <ExamsSection />}
          {section === "assignments"  && <AssignmentsSection />}
          {section === "downloads"    && <DownloadsSection />}
          {section === "support"      && <SupportSection />}
          {section === "profile"      && <ProfileSection />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 right-0 left-0 bg-card border-t border-border flex z-30">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={classNames(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors",
              section === item.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={18} />
            <span className="truncate">{item.label.split(" ")[0]}</span>
          </button>
        ))}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className={classNames("flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold", "text-muted-foreground")}
        >
          <Menu size={18} />
          <span>المزيد</span>
        </button>
      </nav>
    </div>
  );
}
