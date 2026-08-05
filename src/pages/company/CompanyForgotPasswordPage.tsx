/**
 * CompanyForgotPasswordPage — /company/forgot-password
 * Request a password-reset email for the client portal.
 */
import { useState } from "react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Loader, Mail, AlertCircle, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

export default function CompanyForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/company/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
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

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-card/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[#7C3AED] transition-all";

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4 py-16" dir="rtl">
      <SEOHead title="استعادة كلمة المرور | دبي فانز" description="" noindex />
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)`, boxShadow: `0 8px 30px ${PORTAL_ACCENT}40` }}>
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-foreground">استعادة كلمة المرور</h1>
          <p className="text-muted-foreground text-sm mt-1">سنرسل لك رابط إعادة التعيين عبر البريد</p>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <CheckCircle2 size={40} className="mx-auto text-green-500" />
                <p className="text-sm text-foreground leading-relaxed">
                  إذا كان البريد مسجلاً لدينا فستصلك رسالة تحتوي رابط إعادة التعيين خلال دقائق.
                  الرابط صالح لمدة ساعة واحدة.
                </p>
                <Link href="/company/login" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: PORTAL_ACCENT }}>
                  العودة لتسجيل الدخول <ArrowRight size={14} />
                </Link>
              </div>
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
                  {loading ? <Loader size={16} className="animate-spin" /> : "إرسال رابط الاستعادة"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  تذكرت كلمتك؟{" "}
                  <Link href="/company/login" className="font-bold" style={{ color: PORTAL_ACCENT }}>
                    تسجيل الدخول
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
