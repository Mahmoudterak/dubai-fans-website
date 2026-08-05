/**
 * StudentDashboardStub — minimal protected landing page.
 * The full 9-section dashboard is built in Task #104.
 * This page:
 *  - checks the student session on mount
 *  - redirects unauthenticated visitors to /student/login
 *  - shows a welcome card + enrolled courses summary for authenticated students
 */
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import {
  GraduationCap, LogOut, BookOpen, Award, Loader,
  ArrowLeft, User,
} from "lucide-react";

const API = "/api";

interface StudentInfo {
  id: number; fullName: string; email: string;
  phone: string; city: string;
}
interface DashboardData {
  stats: { totalCourses: number; activeCourses: number; completedCourses: number; certificates: number };
  recentEnrollments: { courseSlug: string; courseName: string; status: string; createdAt: string }[];
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  new:       { label: "جديد",       color: "#6366F1" },
  contacted: { label: "تم التواصل", color: "#F59E0B" },
  enrolled:  { label: "مسجّل",      color: "#10B981" },
  cancelled: { label: "ملغي",       color: "#EF4444" },
};

export default function StudentDashboardStub() {
  const [, navigate] = useLocation();
  const [student, setStudent]   = useState<StudentInfo | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const sessionRes = await fetch(`${API}/student/session`, { credentials: "include" });
        if (!sessionRes.ok) { navigate("/student/login"); return; }
        const { student: s } = await sessionRes.json() as { student: StudentInfo };
        setStudent(s);

        const dashRes = await fetch(`${API}/student/dashboard`, { credentials: "include" });
        if (dashRes.ok) {
          const data = await dashRes.json() as DashboardData;
          setDashboard(data);
        }
      } catch {
        navigate("/student/login");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleLogout() {
    await apiFetch(`${API}/student/logout`, { method: "POST", credentials: "include" });
    navigate("/student/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader className="animate-spin text-[#CC0000]" size={32} />
      </div>
    );
  }

  if (!student) return null;

  const stats = dashboard?.stats ?? { totalCourses: 0, activeCourses: 0, completedCourses: 0, certificates: 0 };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans" dir="rtl">
      <SEOHead title="لوحة الطالب | دبي فانز" description="" noindex />
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">

          {/* Welcome header */}
          <div className="bg-gradient-to-l from-[#CC0000] to-[#1E1B4B] rounded-2xl p-6 sm:p-8 mb-6 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-white/70 text-sm mb-0.5">مرحباً بك،</p>
                <h1 className="text-xl sm:text-2xl font-black">{student.fullName}</h1>
                <p className="text-white/60 text-xs mt-0.5">{student.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold shrink-0"
            >
              <LogOut size={15} />
              خروج
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "إجمالي الكورسات",  value: stats.totalCourses,    icon: BookOpen, color: "#6366F1" },
              { label: "كورسات نشطة",       value: stats.activeCourses,   icon: GraduationCap, color: "#10B981" },
              { label: "كورسات مكتملة",     value: stats.completedCourses, icon: Award, color: "#F59E0B" },
              { label: "الشهادات",           value: stats.certificates,    icon: Award, color: "#CC0000" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#111827]">{s.value}</p>
                    <p className="text-[#9CA3AF] text-xs leading-tight">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enrolled courses */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-[#111827] text-lg flex items-center gap-2">
                <BookOpen size={18} className="text-[#CC0000]" />
                الكورسات المسجّلة
              </h2>
              <Link href="/courses" className="text-xs text-[#CC0000] font-bold hover:underline flex items-center gap-1">
                استعرض الكورسات <ArrowLeft size={12} />
              </Link>
            </div>

            {!dashboard?.recentEnrollments?.length ? (
              <div className="text-center py-10">
                <GraduationCap size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                <p className="text-[#9CA3AF] text-sm font-semibold">لم تسجّل في أي كورس بعد</p>
                <Link href="/courses">
                  <Button className="mt-4">استعرض الكورسات</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.recentEnrollments.map((e, i) => {
                  const st = STATUS_LABEL[e.status] ?? { label: e.status, color: "#6B7280" };
                  return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] hover:border-[#E5E7EB] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#CC0000]/10 flex items-center justify-center shrink-0">
                          <BookOpen size={16} className="text-[#CC0000]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-sm">{e.courseName}</p>
                          <p className="text-[#9CA3AF] text-xs">{new Date(e.createdAt).toLocaleDateString("ar-AE")}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${st.color}15`, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <h2 className="font-black text-[#111827] text-lg flex items-center gap-2 mb-4">
              <User size={18} className="text-[#CC0000]" />
              الملف الشخصي
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { label: "الاسم",    value: student.fullName },
                { label: "الإيميل",  value: student.email },
                { label: "الهاتف",   value: student.phone || "—" },
                { label: "المدينة",  value: student.city || "—" },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[#9CA3AF] text-xs mb-0.5">{f.label}</p>
                  <p className="font-semibold text-[#111827]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coming soon notice */}
          <div className="mt-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-center">
            <p className="text-[#1D4ED8] text-sm font-semibold">
              🚀 قيد التطوير — الأقسام الكاملة (الشهادات، الاختبارات، الواجبات، الدعم...) ستكون متاحة قريباً
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
