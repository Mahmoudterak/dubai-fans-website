/**
 * CompanyLoginPage — /company/login
 * Client portal login. Styled via Dubai Fans DS tokens (dark mode).
 */
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Loader, Mail, Lock, AlertCircle, BarChart2 } from "lucide-react";
import { TrustedBy } from "@/components/TrustedBy";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

export default function CompanyLoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  // Forced password-change step (admin-created accounts / admin resets)
  const [mustChange, setMustChange]   = useState(false);
  const [pendingSlug, setPendingSlug] = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    fetch(`${API}/company/auth/session`, { credentials: "include", headers: { "X-Requested-With": "fetch" } })
      .then(async r => {
        if (r.ok) {
          const d = await r.json() as { client?: { slug: string } };
          if (d.client?.slug) navigate(`/company/${d.client.slug}`);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/company/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json() as {
          client?: { slug: string };
          user?: { forcePasswordChange?: boolean };
        };
        if (data.user?.forcePasswordChange) {
          setPendingSlug(data.client?.slug ?? "");
          setMustChange(true);
        } else {
          navigate(`/company/${data.client?.slug ?? ""}`);
        }
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

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"); return; }
    if (newPassword !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/company/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: password, newPassword }),
      });
      if (res.ok) {
        navigate(`/company/${pendingSlug}`);
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

  if (checking) return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <Loader className="animate-spin" size={32} style={{ color: PORTAL_ACCENT }} />
    </div>
  );

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-card/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[#7C3AED] transition-all";

  return (
    <div className="dark min-h-screen bg-background flex flex-col" dir="rtl">
      <SEOHead title="بوابة العملاء | دبي فانز" description="" noindex />

      {/* Login area — centred vertically in the remaining space */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)`, boxShadow: `0 8px 30px ${PORTAL_ACCENT}40` }}>
            <BarChart2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-foreground">بوابة العملاء</h1>
          <p className="text-muted-foreground text-sm mt-1">دبي فانز — تقارير الأداء</p>
        </div>

        {/* Card */}
        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="p-8">
            {mustChange ? (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                لأمان حسابك، يرجى تعيين كلمة مرور جديدة قبل المتابعة.
              </p>
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                  <Lock size={11} /> كلمة المرور الجديدة
                </label>
                <input
                  type="password" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  autoComplete="new-password" required minLength={8}
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                  <Lock size={11} /> تأكيد كلمة المرور
                </label>
                <input
                  type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  autoComplete="new-password" required minLength={8}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}
              <Button
                type="submit" disabled={loading}
                className="w-full py-3.5 text-white font-bold mt-2 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)` }}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : "تعيين كلمة المرور والدخول"}
              </Button>
            </form>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                  <Mail size={11} /> البريد الإلكتروني
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputCls} dir="ltr"
                  autoComplete="email" required
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                  <Lock size={11} /> كلمة المرور
                </label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  autoComplete="current-password" required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit" disabled={loading}
                className="w-full py-3.5 text-white font-bold mt-2 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)` }}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : "تسجيل الدخول"}
              </Button>

              <p className="text-center text-xs mt-3">
                <Link href="/company/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                  نسيت كلمة المرور؟
                </Link>
              </p>
            </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          للحصول على بيانات الدخول تواصل مع فريق دبي فانز
        </p>
      </div>
      </div>

      {/* Trusted-by strip — pinned to the bottom */}
      <TrustedBy />
    </div>
  );
}
