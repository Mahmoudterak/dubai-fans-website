/**
 * CompanyResetPasswordPage — /company/reset-password?token=...
 * Set a new password using an emailed one-time token.
 */
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Loader, Lock, AlertCircle, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

export default function CompanyResetPasswordPage() {
  const [, navigate] = useLocation();
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token") ?? "",
    [],
  );

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/company/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) setDone(true);
      else setError(data.error ?? "حدث خطأ غير متوقع");
    } catch {
      setError("خطأ في الاتصال — تحقق من اتصالك بالإنترنت");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-card/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[#7C3AED] transition-all";

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4 py-16" dir="rtl">
      <SEOHead title="تعيين كلمة مرور جديدة | دبي فانز" description="" noindex />
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)`, boxShadow: `0 8px 30px ${PORTAL_ACCENT}40` }}>
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-foreground">تعيين كلمة مرور جديدة</h1>
          <p className="text-muted-foreground text-sm mt-1">بوابة العملاء — دبي فانز</p>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="p-8">
            {!token ? (
              <div className="text-center space-y-4">
                <AlertCircle size={40} className="mx-auto text-destructive" />
                <p className="text-sm text-foreground">الرابط غير مكتمل — استخدم الرابط المرسل إلى بريدك.</p>
                <Link href="/company/forgot-password" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: PORTAL_ACCENT }}>
                  طلب رابط جديد <ArrowRight size={14} />
                </Link>
              </div>
            ) : done ? (
              <div className="text-center space-y-4">
                <CheckCircle2 size={40} className="mx-auto text-green-500" />
                <p className="text-sm text-foreground leading-relaxed">
                  تم تعيين كلمة المرور الجديدة بنجاح — يمكنك الآن تسجيل الدخول.
                </p>
                <Button
                  onClick={() => navigate("/company/login")}
                  className="w-full py-3 text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)` }}
                >
                  تسجيل الدخول
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                    <Lock size={11} /> كلمة المرور الجديدة
                  </label>
                  <input
                    type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8 أحرف على الأقل"
                    className={inputCls}
                    autoComplete="new-password" required minLength={8}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                    <Lock size={11} /> تأكيد كلمة المرور
                  </label>
                  <input
                    type="password" value={confirm}
                    onChange={e => setConfirm(e.target.value)}
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
                  {loading ? <Loader size={16} className="animate-spin" /> : "تعيين كلمة المرور"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
