import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { GraduationCap, Mail, Lock, User, Phone, MapPin, AlertCircle, Loader, CheckCircle } from "lucide-react";
import { GoogleAuthButton } from "./GoogleAuthButton";

const API = "/api";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/30 focus:border-[#CC0000] transition-all";

export default function StudentRegisterPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    phone: "", city: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    fetch(`${API}/student/session`, { credentials: "include" })
      .then(r => { if (r.ok) navigate("/student/dashboard"); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين"); return;
    }
    if (form.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`${API}/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          city: form.city,
        }),
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
      <SEOHead title="إنشاء حساب طالب | دبي فانز" description="" noindex />
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#1E1B4B] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap size={28} color="white" />
            </div>
            <h1 className="text-2xl font-black text-[#111827] mb-1">إنشاء حساب طالب</h1>
            <p className="text-[#6B7280] text-sm">انضم إلى أكاديمية دبي فانز وابدأ رحلتك التعليمية</p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "📚", label: "متابعة الدورات" },
              { icon: "🏆", label: "شهادات معتمدة" },
              { icon: "💬", label: "دعم مباشر" },
            ].map(b => (
              <div key={b.label} className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center">
                <span className="text-xl block mb-1">{b.icon}</span>
                <span className="text-xs text-[#6B7280] font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="text" value={form.fullName} onChange={set("fullName")}
                  placeholder="الاسم الكامل" className={`${inputCls} pr-10`}
                  required autoFocus autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="email" value={form.email} onChange={set("email")}
                  placeholder="البريد الإلكتروني" className={`${inputCls} pr-10`}
                  required autoComplete="email"
                />
              </div>

              {/* Phone + City */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Phone size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                  <input
                    type="tel" value={form.phone} onChange={set("phone")}
                    placeholder="رقم الهاتف" className={`${inputCls} pr-10`}
                    autoComplete="tel"
                  />
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                  <input
                    type="text" value={form.city} onChange={set("city")}
                    placeholder="المدينة" className={`${inputCls} pr-10`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="password" value={form.password} onChange={set("password")}
                  placeholder="كلمة المرور (8 أحرف على الأقل)" className={`${inputCls} pr-10`}
                  required autoComplete="new-password"
                />
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Lock size={16} className="absolute top-3.5 right-3.5 text-[#9CA3AF]" />
                <input
                  type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="تأكيد كلمة المرور" className={`${inputCls} pr-10`}
                  required autoComplete="new-password"
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={15} className="absolute top-3.5 left-3.5 text-[#10B981]" />
                )}
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-[#CC0000] text-xs font-semibold">
                  <AlertCircle size={13} /> {error}
                </p>
              )}

              <Button
                type="submit" disabled={loading} className="w-full mt-2"
              >
                {loading ? <Loader size={16} className="animate-spin mx-auto" /> : "إنشاء الحساب"}
              </Button>
            </form>

            {/* Divider + Google */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#F3F4F6]" />
              <span className="text-xs text-[#9CA3AF]">أو</span>
              <div className="flex-1 h-px bg-[#F3F4F6]" />
            </div>
            <GoogleAuthButton label="التسجيل عبر Google" />

            <div className="mt-6 pt-5 border-t border-[#F3F4F6] text-center">
              <p className="text-sm text-[#6B7280]">
                لديك حساب بالفعل؟{" "}
                <Link href="/student/login" className="text-[#CC0000] font-bold hover:underline">
                  سجّل دخولك
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
