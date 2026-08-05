/**
 * CompanyPortalPage — /company/:slug
 * Client dashboard: shows all published reports.
 * Styled via Dubai Fans DS tokens (dark mode).
 */
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { TrustedBy } from "@/components/TrustedBy";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Badge } from "@workspace/dubai-fans-ds/components/ui/badge";
import {
  Loader, AlertCircle, BarChart2, LogOut, Calendar, FileText,
  ChevronRight, Archive, Users,
} from "lucide-react";
import { ForcePasswordChange } from "./ForcePasswordChange";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

interface Client { id: number; slug: string; name: string; logoUrl: string; industry: string; }

interface PortalUser { id: number; email: string; name: string; role: string; }
interface Report {
  id: number; title: string; periodStart: string; periodEnd: string;
  status: string; createdAt: string;
}

export default function CompanyPortalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const [client, setClient]   = useState<Client | null>(null);
  const [user, setUser]       = useState<PortalUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [reload, setReload]   = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/company/${slug}/reports`, { credentials: "include", headers: { "X-Requested-With": "fetch" } })
      .then(async res => {
        if (res.status === 401) { navigate("/company/login"); return; }
        if (res.status === 403) {
          const d = await res.json().catch(() => ({})) as { forcePasswordChange?: boolean };
          if (d.forcePasswordChange) { setMustChangePassword(true); return; }
          navigate("/company/login");
          return;
        }
        if (!res.ok) { setError("فشل في جلب التقارير"); return; }
        const data = await res.json() as { client: Client; reports: Report[]; user?: PortalUser };
        setClient(data.client);
        setUser(data.user ?? null);
        setReports(data.reports ?? []);
      })
      .catch(() => setError("خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, [slug, reload]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await fetch(`${API}/company/auth/logout`, {
      method: "POST", credentials: "include",
      headers: { "X-Requested-With": "fetch" },
    });
    navigate("/company/login");
  }

  if (mustChangePassword) return (
    <ForcePasswordChange onDone={() => { setMustChangePassword(false); setReload(n => n + 1); }} />
  );

  if (loading) return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <Loader className="animate-spin" size={32} style={{ color: PORTAL_ACCENT }} />
    </div>
  );

  if (error) return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle size={40} className="text-destructive" />
      <p className="text-destructive font-bold">{error}</p>
      <Button onClick={() => navigate("/company/login")}>تسجيل الدخول مجدداً</Button>
    </div>
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground" dir="rtl">
      <SEOHead title={`${client?.name ?? "البوابة"} — تقارير الأداء`} description="" noindex />

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {client?.logoUrl ? (
              <img loading="lazy" decoding="async" src={client.logoUrl} alt={client.name} className="w-9 h-9 rounded-lg object-cover border border-border" />
            ) : (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PORTAL_ACCENT}, #9333EA)` }}>
                <BarChart2 size={16} className="text-white" />
              </div>
            )}
            <div>
              <p className="font-black text-sm text-foreground">{client?.name ?? slug}</p>
              {user ? (
                <p className="text-[10px] text-muted-foreground">
                  {user.name || user.email}
                  <span className="mx-1 px-1.5 py-px rounded-full border font-bold" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </p>
              ) : (
                client?.industry && <p className="text-[10px] text-muted-foreground">{client.industry}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Promotional links — hidden on mobile to avoid overflow */}
            <a href="/projects" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">أعمالنا</a>
            <a href="/courses" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">الكورسات</a>
            <a href="/ai-business-os" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">AI Business OS</a>
            <span className="hidden sm:inline text-border text-xs">|</span>
            {(user?.role === "owner" || user?.role === "gm") && (
              <Link href={`/company/${slug}/users`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Users size={13} /> <span className="hidden sm:inline">إدارة الفريق</span>
              </Link>
            )}
            <Link href={`/company/${slug}/archive`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Archive size={13} /> <span className="hidden sm:inline">الأرشيف</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LogOut size={13} /> <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-foreground">تقارير الأداء</h1>
          <p className="text-muted-foreground text-sm mt-1">جميع تقارير حملاتك الإعلانية المنشورة</p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-semibold text-muted-foreground">لا توجد تقارير منشورة بعد</p>
            <p className="text-sm mt-2 text-muted-foreground/60">سيظهر تقريرك هنا فور نشره من فريق دبي فانز</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map(r => (
              <Card
                key={r.id}
                className="group bg-card border-border hover:border-[#7C3AED]/40 transition-all cursor-pointer"
                onClick={() => navigate(`/company/${slug}/report/${r.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-foreground text-base leading-tight">{r.title}</h2>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {r.periodStart} — {r.periodEnd}
                        </span>
                        <Badge variant="outline" className="text-[10px]" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                          منشور
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:opacity-90 transition-opacity" style={{ background: `${PORTAL_ACCENT}1A`, border: `1px solid ${PORTAL_ACCENT}33` }}>
                        <BarChart2 size={16} style={{ color: PORTAL_ACCENT }} />
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <TrustedBy />
      <Footer />
    </div>
  );
}

export const ROLE_LABELS: Record<string, string> = {
  owner: "مالك", gm: "مدير عام", marketing: "تسويق", doctor: "طبيب",
};
