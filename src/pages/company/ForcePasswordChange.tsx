/**
 * ForcePasswordChange — full-screen gate shown when the server responds with
 * { ok: false, forcePasswordChange: true }. The user must set a new password
 * before accessing the portal.
 */
import { useState } from "react";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Loader, Lock, AlertCircle, ShieldAlert } from "lucide-react";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

export function ForcePasswordChange({ onDone }: { onDone: () => void }) {
  const [current, setCurrent]   = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/company/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ current_password: current, new_password: password }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) onDone();
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
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)`, boxShadow: `0 8px 30px ${PORTAL_ACCENT}40` }}>
            <ShieldAlert size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-foreground">تغيير كلمة المرور مطلوب</h1>
          <p className="text-muted-foreground text-sm mt-1">
            لأمان حسابك، يجب تعيين كلمة مرور جديدة قبل المتابعة
          </p>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-1.5">
                  <Lock size={11} /> كلمة المرور الحالية
                </label>
                <input
                  type="password" value={current}
                  onChange={e => setCurrent(e.target.value)}
                  placeholder="الكلمة المرسلة إليك"
                  className={inputCls}
                  autoComplete="current-password" required
                />
              </div>

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
                  <Lock size={11} /> تأكيد كلمة المرور الجديدة
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
                {loading ? <Loader size={16} className="animate-spin" /> : "تغيير كلمة المرور والمتابعة"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
