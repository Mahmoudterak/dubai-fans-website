import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { GraduationCap, Mail, Lock, AlertCircle, Loader } from "lucide-react";
import { GoogleAuthButton, googleErrorMessage } from "./GoogleAuthButton";

const API = "/api";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/30 focus:border-[#CC0000] transition-all";

export default function StudentLoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  // Show OAuth callback errors (e.g. /student/login?error=google_failed)
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    const msg = googleErrorMessage(code);
    if (msg) setError(msg);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    fetch(`${API}/student/session`, { credentials: "include" })
      .then(r => { if (r.ok) navigate("/student/dashboard"); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await apiFetch(`${API}/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        navigate("/student/dashboard");
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "حدث خطأ غير متوقع");
      }
    } catch {
      setError("خطأ في الاتصال — تحقق من اتصالك بالإنترنت");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader className="animate-spin text-[#CC0000]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans" dir="rtl">
      <SEOHead title="بوابة الطالب — تسجيل الدخول | دبي فانز" description="" noindex />
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-6">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#1E1B4B] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap size={28} color="white" />
            </div>
            <h1 className="text-2xl font-black text-[#111827] mb-1">بوابة الطالب</h1>
            <p className="text-[#6B7280] text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني" className={`${inputCls} pr-10`}
                  autoFocus required autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="كلمة المرور" className={`${inputCls} pr-10`}
                  required autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-[#CC0000] text-xs font-semibold">
                  <AlertCircle size={13} /> {error}
                </p>
              )}

              <Button
                type="submit" disabled={loading} className="w-full"
              >
                {loading ? <Loader size={14} className="animate-spin mx-auto" /> : "دخول"}
              </Button>
            </form>

            {/* Divider + Google */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#F3F4F6]" />
              <span className="text-xs text-[#9CA3AF]">أو</span>
              <div className="flex-1 h-px bg-[#F3F4F6]" />
            </div>
            <GoogleAuthButton />

            <div className="mt-6 pt-5 border-t border-[#F3F4F6] text-center">
              <p className="text-sm text-[#6B7280]">
                ليس لديك حساب؟{" "}
                <Link href="/student/register" className="text-[#CC0000] font-bold hover:underline">
                  سجّل الآن
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-6">
            مخصص لطلاب أكاديمية دبي فانز فقط
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
