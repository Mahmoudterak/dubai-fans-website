/**
 * CompanyArchivePage — /company/:slug/archive
 * Yearly archive of all published reports.
 * Styled via Dubai Fans DS tokens (dark mode).
 * "PDF" button navigates to the report with ?print=1, which auto-triggers window.print().
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
  Loader, AlertCircle, BarChart2, LogOut, Calendar, ChevronDown,
  ChevronUp, ArrowRight, Printer, Archive, FileText,
} from "lucide-react";

const API = "/api";
const PORTAL_ACCENT = "#7C3AED";

interface Client { id: number; slug: string; name: string; logoUrl: string; industry: string; }
interface PortalUser { id: number; email: string; name: string; role: string; }
const ROLE_LABELS: Record<string, string> = {
  owner: "مالك", gm: "مدير عام", marketing: "تسويق", doctor: "طبيب",
};
interface Report {
  id: number; title: string; periodStart: string; periodEnd: string;
  status: string; createdAt: string;
}

export default function CompanyArchivePage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const [client, setClient]       = useState<Client | null>(null);
  const [user, setUser]           = useState<PortalUser | null>(null);
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [openYears, setOpenYears] = useState<Set<number>>(new Set([new Date().getFullYear()]));

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/company/${slug}/reports`, { credentials: "include" })
      .then(async res => {
        if (res.status === 401) { navigate("/company/login"); return; }
        if (res.status === 403) { navigate("/company/login"); return; }
        if (!res.ok) { setError("فشل في جلب التقارير"); return; }
        const d = await res.json() as { client: Client; reports: Report[]; user?: PortalUser };
        setClient(d.client);
        setUser(d.user ?? null);
        const sorted = [...(d.reports ?? [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(sorted);
      })
      .catch(() => setError("خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleLogout() {
    await fetch(`${API}/company/auth/logout`, {
      method: "POST", credentials: "include",
      headers: { "X-Requested-With": "fetch" },
    });
    navigate("/company/login");
  }

  const byYear = reports.reduce((acc, r) => {
    const year = new Date(r.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(r);
    return acc;
  }, {} as Record<number, Report[]>);
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  const toggleYear = (y: number) =>
    setOpenYears(prev => {
      const next = new Set(prev);
      next.has(y) ? next.delete(y) : next.add(y);
      return next;
    });

  if (loading) return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <Loader className="animate-spin" size={32} style={{ color: PORTAL_ACCENT }} />
    </div>
  );

  if (error) return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle size={40} className="text-destructive" />
      <p className="text-destructive font-bold">{error}</p>
      <Button onClick={() => navigate(`/company/${slug}`)}>العودة للتقارير</Button>
    </div>
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground" dir="rtl">
      <SEOHead title={`أرشيف التقارير | ${client?.name}`} description="" noindex />

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center gap-4">
          <Link href={`/company/${slug}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors">
            <ArrowRight size={13} /> العودة للتقارير
          </Link>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {client?.logoUrl ? (
              <img loading="lazy" decoding="async" src={client.logoUrl} alt={client.name} className="w-7 h-7 rounded-md object-cover border border-border shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${PORTAL_ACCENT}33` }}>
                <BarChart2 size={12} style={{ color: PORTAL_ACCENT }} />
              </div>
            )}
            <span className="font-bold text-sm text-foreground truncate">{client?.name}</span>
            {user && (
              <span className="hidden sm:inline text-[10px] text-muted-foreground truncate">
                {user.name || user.email}
                <span className="mx-1 px-1.5 py-px rounded-full border font-bold" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Promotional links — hidden on mobile */}
            <a href="/projects" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">أعمالنا</a>
            <a href="/courses" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">الكورسات</a>
            <a href="/ai-business-os" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">AI Business OS</a>
            <span className="hidden sm:inline text-border text-xs">|</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LogOut size={13} /> <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${PORTAL_ACCENT}22`, color: PORTAL_ACCENT }}>
            <Archive size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">أرشيف التقارير</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{reports.length} تقرير منشور</p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-semibold text-muted-foreground">لا توجد تقارير منشورة بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {years.map(year => (
              <Card key={year} className="bg-card border-border overflow-hidden">
                {/* Year header */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg" style={{ color: "#A78BFA" }}>{year}</span>
                    <Badge variant="outline" className="text-[10px]" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                      {byYear[year].length} تقرير
                    </Badge>
                  </div>
                  {openYears.has(year)
                    ? <ChevronUp size={16} className="text-muted-foreground" />
                    : <ChevronDown size={16} className="text-muted-foreground" />}
                </button>

                {/* Report rows */}
                {openYears.has(year) && (
                  <div className="divide-y divide-border">
                    {byYear[year].map(r => (
                      <div key={r.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/20 transition-colors">
                        {/* Icon + title row */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${PORTAL_ACCENT}1A`, border: `1px solid ${PORTAL_ACCENT}33` }}>
                            <BarChart2 size={15} style={{ color: PORTAL_ACCENT }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{r.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Calendar size={10} />
                              {r.periodStart} — {r.periodEnd}
                            </p>
                          </div>
                        </div>
                        {/* Action buttons — indent on mobile to align with title */}
                        <div className="flex items-center gap-2 shrink-0 mr-[52px] sm:mr-0">
                          <Link href={`/company/${slug}/report/${r.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              عرض التقرير
                            </Button>
                          </Link>
                          <Link href={`/company/${slug}/report/${r.id}?print=1`}>
                            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                              <Printer size={11} /> PDF
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
