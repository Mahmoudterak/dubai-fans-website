/**
 * CompanyUsersPage — /company/:slug/users
 * Team management for owner/gm roles: list, add, activate/deactivate,
 * change role, reset password, delete.
 * Styled via Dubai Fans DS tokens (dark mode, portal accent #7C3AED).
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Badge } from "@workspace/dubai-fans-ds/components/ui/badge";
import { Input } from "@workspace/dubai-fans-ds/components/ui/input";
import {
  Loader, AlertCircle, Users, ArrowRight, Plus, KeyRound, Trash2,
  ShieldCheck, ShieldOff, X, Check,
} from "lucide-react";
import { ROLE_LABELS } from "./CompanyPortalPage";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

interface CompanyUser {
  id: number; email: string; name: string; role: string;
  isActive: boolean; forcePasswordChange: boolean; createdAt: string;
}
interface SessionInfo {
  client: { id: number; slug: string; name: string };
  user: { id: number; email: string; name: string; role: string };
}

const ALL_ROLES = ["owner", "gm", "marketing", "doctor"] as const;

function fetchJson(url: string, init?: RequestInit) {
  return fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "X-Requested-With": "fetch",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}

export default function CompanyUsersPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const [me, setMe]           = useState<SessionInfo["user"] | null>(null);
  const [clientName, setClientName] = useState("");
  const [users, setUsers]     = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [notice, setNotice]   = useState("");
  const [busy, setBusy]       = useState(false);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "marketing" });
  const [formError, setFormError] = useState("");

  // Password reset inline
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const load = useCallback(async () => {
    if (!slug) return;
    try {
      const [sessRes, usersRes] = await Promise.all([
        fetchJson(`${API}/company/auth/session`),
        fetchJson(`${API}/company/${slug}/users`),
      ]);
      if (sessRes.status === 401 || usersRes.status === 401) { navigate("/company/login"); return; }
      if (usersRes.status === 403) {
        setError("صلاحياتك لا تسمح بإدارة المستخدمين");
        return;
      }
      if (!sessRes.ok || !usersRes.ok) { setError("فشل في جلب البيانات"); return; }
      const sess = await sessRes.json() as SessionInfo;
      const data = await usersRes.json() as { users: CompanyUser[] };
      setMe(sess.user);
      setClientName(sess.client?.name ?? "");
      setUsers(data.users ?? []);
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => { void load(); }, [load]);

  function flash(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function apiCall(url: string, init: RequestInit, onOk: (d: Record<string, unknown>) => void) {
    setBusy(true);
    try {
      const res = await fetchJson(url, init);
      const data = await res.json().catch(() => ({})) as Record<string, unknown>;
      if (!res.ok) {
        flash(String(data.error ?? "حدث خطأ"));
        return;
      }
      onOk(data);
    } catch {
      flash("خطأ في الاتصال");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.email.trim() || form.password.length < 8) {
      setFormError("البريد الإلكتروني وكلمة مرور من 8 أحرف على الأقل مطلوبان");
      return;
    }
    await apiCall(`${API}/company/${slug}/users`, {
      method: "POST",
      body: JSON.stringify(form),
    }, () => {
      setShowAdd(false);
      setForm({ email: "", name: "", password: "", role: "marketing" });
      flash("تمت إضافة المستخدم — سيُطلب منه تغيير كلمة المرور عند أول دخول");
      void load();
    });
  }

  async function patchUser(id: number, body: Record<string, unknown>, okMsg: string) {
    await apiCall(`${API}/company/${slug}/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }, () => { flash(okMsg); void load(); });
  }

  async function handleDelete(u: CompanyUser) {
    if (!window.confirm(`حذف المستخدم ${u.name || u.email} نهائياً؟ لا يمكن التراجع.`)) return;
    await apiCall(`${API}/company/${slug}/users/${u.id}`, { method: "DELETE" }, () => {
      flash("تم حذف المستخدم");
      void load();
    });
  }

  async function handleResetPassword(id: number) {
    if (resetPassword.length < 8) { flash("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    await patchUser(id, { password: resetPassword }, "تم تعيين كلمة مرور مؤقتة — سيُطلب تغييرها عند الدخول");
    setResetUserId(null);
    setResetPassword("");
  }

  /** Roles the current user can assign to the target (per server hierarchy). */
  function assignableRoles(target?: CompanyUser): string[] {
    if (me?.role === "owner") return [...ALL_ROLES];
    // gm: cannot grant owner/gm, and cannot touch owner/gm accounts at all
    if (target && (target.role === "owner" || target.role === "gm")) return [];
    return ["marketing", "doctor"];
  }

  /** Whether current user may manage (patch/delete) the target at all. */
  function canManage(u: CompanyUser): boolean {
    if (!me) return false;
    if (me.role === "gm" && (u.role === "owner" || u.role === "gm")) return false;
    return true;
  }

  if (loading) return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <Loader className="animate-spin" size={32} style={{ color: PORTAL_ACCENT }} />
    </div>
  );

  if (error) return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4" dir="rtl">
      <AlertCircle size={40} className="text-destructive" />
      <p className="text-destructive font-bold">{error}</p>
      <Button onClick={() => navigate(`/company/${slug}`)}>العودة للبوابة</Button>
    </div>
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground" dir="rtl">
      <SEOHead title={`${clientName || slug} — إدارة الفريق`} description="" noindex />

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)` }}>
              <Users size={16} className="text-white" />
            </div>
            <div>
              <p className="font-black text-sm text-foreground">إدارة الفريق</p>
              <p className="text-[10px] text-muted-foreground">{clientName || slug}</p>
            </div>
          </div>
          <Link href={`/company/${slug}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight size={13} /> العودة للتقارير
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-foreground">مستخدمو الشركة</h1>
            <p className="text-muted-foreground text-sm mt-1">أضف مستخدمين، عدّل الأدوار، وأعد تعيين كلمات المرور</p>
          </div>
          <Button
            onClick={() => { setShowAdd(v => !v); setFormError(""); }}
            className="flex items-center gap-1.5 text-white"
            style={{ background: PORTAL_ACCENT }}
            disabled={busy}
          >
            {showAdd ? <X size={14} /> : <Plus size={14} />}
            {showAdd ? "إلغاء" : "إضافة مستخدم"}
          </Button>
        </div>

        {notice && (
          <div className="mb-6 rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: `${PORTAL_ACCENT}44`, background: `${PORTAL_ACCENT}12`, color: "#C4B5FD" }}>
            {notice}
          </div>
        )}

        {/* Add user form */}
        {showAdd && (
          <Card className="mb-8 bg-card border-border">
            <CardContent className="p-6">
              <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">البريد الإلكتروني *</label>
                  <Input dir="ltr" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@company.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">الاسم</label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="اسم المستخدم" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">كلمة مرور مؤقتة * (8 أحرف على الأقل)</label>
                  <Input dir="ltr" type="text" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">الدور *</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                  >
                    {assignableRoles().map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
                    ))}
                  </select>
                </div>
                {formError && <p className="text-destructive text-xs sm:col-span-2">{formError}</p>}
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={busy} className="text-white" style={{ background: PORTAL_ACCENT }}>
                    {busy ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                    <span className="mr-1.5">إنشاء الحساب</span>
                  </Button>
                  <p className="text-[11px] text-muted-foreground mt-2">سيُطلب من المستخدم تغيير كلمة المرور عند أول تسجيل دخول</p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users list */}
        <div className="grid gap-4">
          {users.map(u => {
            const isSelf = me?.id === u.id;
            const manageable = canManage(u);
            const roles = assignableRoles(u);
            return (
              <Card key={u.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground text-sm">{u.name || u.email}</p>
                        <Badge variant="outline" className="text-[10px]" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </Badge>
                        {isSelf && <Badge variant="outline" className="text-[10px] text-muted-foreground">أنت</Badge>}
                        {!u.isActive && <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">معطّل</Badge>}
                        {u.forcePasswordChange && u.isActive && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">بانتظار تغيير كلمة المرور</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1" dir="ltr" style={{ textAlign: "right" }}>{u.email}</p>
                    </div>

                    {manageable && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Role select */}
                        {roles.length > 0 && !isSelf && (
                          <select
                            value={u.role}
                            disabled={busy}
                            onChange={e => { if (e.target.value !== u.role) void patchUser(u.id, { role: e.target.value }, "تم تغيير الدور"); }}
                            className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                          >
                            {(roles.includes(u.role) ? roles : [u.role, ...roles]).map(r => (
                              <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
                            ))}
                          </select>
                        )}

                        {/* Activate / deactivate */}
                        {!isSelf && (
                          <Button
                            variant="ghost" size="sm" disabled={busy}
                            onClick={() => void patchUser(u.id, { isActive: !u.isActive }, u.isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب")}
                            className="flex items-center gap-1 text-xs text-muted-foreground"
                          >
                            {u.isActive ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                            {u.isActive ? "تعطيل" : "تفعيل"}
                          </Button>
                        )}

                        {/* Reset password */}
                        <Button
                          variant="ghost" size="sm" disabled={busy}
                          onClick={() => { setResetUserId(resetUserId === u.id ? null : u.id); setResetPassword(""); }}
                          className="flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <KeyRound size={13} /> كلمة المرور
                        </Button>

                        {/* Delete */}
                        {!isSelf && (
                          <Button
                            variant="ghost" size="sm" disabled={busy}
                            onClick={() => void handleDelete(u)}
                            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 size={13} /> حذف
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Inline password reset */}
                  {resetUserId === u.id && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                      <Input
                        dir="ltr" type="text" placeholder="كلمة مرور مؤقتة جديدة (8+ أحرف)"
                        value={resetPassword} onChange={e => setResetPassword(e.target.value)}
                        className="max-w-xs text-sm"
                      />
                      <Button size="sm" disabled={busy || resetPassword.length < 8} onClick={() => void handleResetPassword(u.id)} className="text-white" style={{ background: PORTAL_ACCENT }}>
                        تعيين
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setResetUserId(null); setResetPassword(""); }} className="text-muted-foreground">
                        إلغاء
                      </Button>
                      {isSelf && <p className="text-[11px] text-muted-foreground w-full">ملاحظة: إعادة تعيين كلمة مرورك ستُنهي جلستك وسيُطلب تغييرها عند الدخول</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
