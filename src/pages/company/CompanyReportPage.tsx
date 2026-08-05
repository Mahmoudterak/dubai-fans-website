/**
 * CompanyReportPage — /company/:slug/report/:reportId
 * Full interactive campaign report with KPI cards, charts, AI analysis, and PDF print.
 * Styled via Dubai Fans DS tokens (dark mode) + purple portal accent (#7C3AED).
 * Add ?print=1 to the URL to trigger window.print() automatically on load.
 */
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { TrustedBy } from "@/components/TrustedBy";
import { Footer } from "@/components/Footer";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/dubai-fans-ds/components/ui/card";
import { Badge } from "@workspace/dubai-fans-ds/components/ui/badge";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@workspace/dubai-fans-ds/components/ui/table";
import {
  Loader, AlertCircle, BarChart2, LogOut, Calendar, Printer,
  ArrowRight, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  Sparkles, Star, Target, Zap, Award, Archive, ImageIcon,
} from "lucide-react";

const API = "/api";

// Portal accent — DS has no violet primary; this is the dedicated portal brand colour.
const PORTAL_ACCENT = "#7C3AED";

// ── Types ────────────────────────────────────────────────────────────────────
interface Client { id: number; slug: string; name: string; logoUrl: string; industry: string; }
interface PortalUser { id: number; email: string; name: string; role: string; }
const ROLE_LABELS: Record<string, string> = {
  owner: "مالك", gm: "مدير عام", marketing: "تسويق", doctor: "طبيب",
};
interface Report { id: number; title: string; periodStart: string; periodEnd: string; status: string; createdAt: string; }
interface CampaignDataRow {
  platform: string;
  spend: string; impressions: number; reach: number; clicks: number;
  messages: number; calls: number; leads: number; bookings: number;
  prevSpend: string; prevImpressions: number; prevReach: number; prevClicks: number;
  prevMessages: number; prevCalls: number; prevLeads: number; prevBookings: number;
}
interface Totals {
  spend: number; impressions: number; reach: number; clicks: number;
  messages: number; calls: number; leads: number; bookings: number;
  prevSpend: number; prevImpressions: number; prevReach: number; prevClicks: number;
  prevMessages: number; prevCalls: number; prevLeads: number; prevBookings: number;
}
interface AiAnalysis {
  bestPlatform?: string; bestAd?: string; bestAudience?: string; bestTime?: string;
  strengths?: string[]; weaknesses?: string[];
}
interface Recommendation { title: string; description: string; impact: "high" | "medium" | "low"; }
interface WeeklyItem { week: string; focus?: string; budget?: string; channels?: string[]; notes?: string; }
interface ReportContent {
  executiveSummary: string;
  aiAnalysis: AiAnalysis | null;
  recommendations: Recommendation[] | null;
  nextMonthPlan: WeeklyItem[] | null;
  weeklyTimeline: WeeklyItem[] | null;
  mediaUrls?: string[] | null;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200): number {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
/**
 * @param lowerIsBetter  When true (cost metrics: CPL, CPM, CPA), a DECREASE is
 *                       good → shown green; an INCREASE is bad → shown red.
 */
function KPICard({ label, value, unit = "", prev, format = "number", lowerIsBetter = false }: {
  label: string; value: number; unit?: string; prev?: number;
  format?: "number" | "currency" | "decimal"; lowerIsBetter?: boolean;
}) {
  const animated = useCountUp(value);
  const delta = prev != null && prev > 0 ? ((value - prev) / prev) * 100 : null;
  // For higher-is-better: green if delta > 0. For lower-is-better: green if delta < 0.
  const isPositive = delta != null && (lowerIsBetter ? delta <= 0 : delta >= 0);

  const fmt = (v: number) => {
    if (format === "currency") return v.toLocaleString("ar-AE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    if (format === "decimal") return v.toFixed(2);
    return v.toLocaleString("ar-AE");
  };

  return (
    <Card className="bg-card/60 border-border hover:border-[#7C3AED]/40 transition-all print:bg-white">
      <CardContent className="p-5">
        <p className="text-muted-foreground text-xs font-semibold mb-2 truncate">{label}</p>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-2xl font-black text-foreground">{fmt(animated)}</span>
          {unit && <span className="text-muted-foreground text-xs mb-0.5">{unit}</span>}
        </div>
        {delta != null ? (
          <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>{Math.abs(delta).toFixed(1)}% {isPositive ? "↑" : "↓"} عن الشهر الماضي</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Minus size={10} /> لا توجد بيانات سابقة
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Portal header ─────────────────────────────────────────────────────────────
function PortalHeader({ client, user, slug, onLogout }: { client: Client | null; user: PortalUser | null; slug: string; onLogout: () => void; }) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-40 print:hidden">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-4">
        <Link href={`/company/${slug}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors">
          <ArrowRight size={13} /> العودة للتقارير
        </Link>
        <span className="text-border">|</span>
        <div className="flex items-center gap-2 flex-1">
          {client?.logoUrl ? (
            <img loading="lazy" decoding="async" src={client.logoUrl} alt={client.name} className="w-7 h-7 rounded-md object-cover border border-border" />
          ) : (
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${PORTAL_ACCENT}33` }}>
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
        <div className="flex items-center gap-2 flex-wrap">
          <a href="/projects" target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">أعمالنا</a>
          <a href="/courses" target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">الكورسات</a>
          <a href="/ai-business-os" target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">AI Business OS</a>
          <span className="text-border text-xs">|</span>
          <Link href={`/company/${slug}/archive`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Archive size={13} /> الأرشيف
          </Link>
          <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <LogOut size={13} /> خروج
          </Button>
        </div>
      </div>
    </header>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${PORTAL_ACCENT}22`, color: PORTAL_ACCENT }}>
        {icon}
      </div>
      <h2 className="text-lg font-black text-foreground">{title}</h2>
    </div>
  );
}

const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta", google: "Google", tiktok: "TikTok",
  snapchat: "Snapchat", twitter: "Twitter", youtube: "YouTube",
};

const chartTooltipStyle = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
  borderRadius: 12, color: "hsl(var(--card-foreground))", fontSize: 12,
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function CompanyReportPage() {
  const { slug, reportId } = useParams<{ slug: string; reportId: string }>();
  const [, navigate] = useLocation();
  const didAutoPrint = useRef(false);

  const [client, setClient]       = useState<Client | null>(null);
  const [user, setUser]           = useState<PortalUser | null>(null);
  const [report, setReport]       = useState<Report | null>(null);
  const [data, setData]           = useState<CampaignDataRow[]>([]);
  const [totals, setTotals]       = useState<Totals | null>(null);
  const [content, setContent]     = useState<ReportContent | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [openTimeline, setOpenTimeline] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!slug || !reportId) return;
    setLoading(true);
    fetch(`${API}/company/${slug}/reports/${reportId}`, { credentials: "include" })
      .then(async res => {
        if (res.status === 401) { navigate("/company/login"); return; }
        if (res.status === 403) { navigate("/company/login"); return; }
        if (!res.ok) { setError("التقرير غير موجود"); return; }
        const d = await res.json() as {
          client: Client; report: Report;
          campaignData: CampaignDataRow[]; totals: Totals; content: ReportContent | null;
          mediaUrls?: string[];
          user?: PortalUser;
        };
        setClient(d.client);
        setUser(d.user ?? null);
        setReport(d.report);
        setData(d.campaignData ?? []);
        setTotals(d.totals ?? null);
        setContent(d.content);
        setMediaUrls(d.mediaUrls ?? []);
      })
      .catch(() => setError("خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, [slug, reportId]);

  // Auto-trigger print when ?print=1 is in the URL (called from archive PDF button)
  useEffect(() => {
    if (loading || !report) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "1" && !didAutoPrint.current) {
      didAutoPrint.current = true;
      // Expand all timeline items before printing
      setOpenTimeline(prev => {
        const all: Record<number, boolean> = { ...prev };
        for (let i = 0; i < 10; i++) all[i] = true;
        return all;
      });
      // Small delay so DOM settles
      setTimeout(() => window.print(), 600);
    }
  }, [loading, report]);

  async function handleLogout() {
    await fetch(`${API}/company/auth/logout`, {
      method: "POST", credentials: "include",
      headers: { "X-Requested-With": "fetch" },
    });
    navigate("/company/login");
  }

  if (loading) return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader className="animate-spin mx-auto" size={36} style={{ color: PORTAL_ACCENT }} />
        <p className="text-muted-foreground text-sm">جارٍ تحميل التقرير…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle size={40} className="text-destructive" />
      <p className="text-destructive font-bold">{error}</p>
      <Button onClick={() => navigate(`/company/${slug}`)}>العودة للتقارير</Button>
    </div>
  );

  if (!report || !totals) return null;

  // ── Derived KPIs ──────────────────────────────────────────────────────────
  const t = totals;
  const ctr      = t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0;
  const cpl      = t.leads > 0 ? t.spend / t.leads : 0;
  const cpm      = t.impressions > 0 ? (t.spend / t.impressions) * 1000 : 0;
  const cpa      = t.bookings > 0 ? t.spend / t.bookings : 0;
  const prevCtr  = t.prevImpressions > 0 ? (t.prevClicks / t.prevImpressions) * 100 : 0;
  const prevCpl  = t.prevLeads > 0 ? t.prevSpend / t.prevLeads : 0;
  const prevCpm  = t.prevImpressions > 0 ? (t.prevSpend / t.prevImpressions) * 1000 : 0;
  const prevCpa  = t.prevBookings > 0 ? t.prevSpend / t.prevBookings : 0;

  // Chart datasets
  const platformSpendData = data.map(r => ({
    name: PLATFORM_LABELS[r.platform] ?? r.platform,
    إنفاق: Math.round(parseFloat(r.spend)),
  }));
  const platformLeadsData = data.map(r => ({
    name: PLATFORM_LABELS[r.platform] ?? r.platform,
    leads: r.leads, messages: r.messages, calls: r.calls,
  }));
  const platformReachData = data.map(r => ({
    name: PLATFORM_LABELS[r.platform] ?? r.platform,
    وصول: Math.round(r.reach / 1000),
  }));

  const aiA = content?.aiAnalysis;
  const recs = content?.recommendations ?? [];
  const timeline = content?.weeklyTimeline ?? [];
  const plan = content?.nextMonthPlan ?? [];

  return (
    <div className="dark min-h-screen bg-background text-foreground print:bg-white print:text-gray-900" dir="rtl">
      <SEOHead title={`${report.title} | ${client?.name}`} description="" noindex />
      <PortalHeader client={client} user={user} slug={slug ?? ""} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10 print:px-0 print:py-4 print:space-y-6">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section>
          <Card className="bg-card border-border print:border-gray-300">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {client?.logoUrl && (
                      <img loading="lazy" decoding="async" src={client.logoUrl} alt={client.name} className="w-10 h-10 rounded-xl object-cover border border-border" />
                    )}
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">{client?.name}</p>
                      {client?.industry && <p className="text-muted-foreground text-[10px]">{client.industry}</p>}
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">{report.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {report.periodStart} — {report.periodEnd}
                    </span>
                    <Badge className="text-[10px]" style={{ background: `${PORTAL_ACCENT}22`, color: "#A78BFA", border: `1px solid ${PORTAL_ACCENT}44` }}>
                      تقرير منشور
                    </Badge>
                  </div>
                </div>
                <div className="print:hidden shrink-0">
                  <Button
                    onClick={() => {
                      setOpenTimeline(prev => {
                        const all: Record<number, boolean> = { ...prev };
                        for (let i = 0; i < 20; i++) all[i] = true;
                        return all;
                      });
                      setTimeout(() => window.print(), 300);
                    }}
                    style={{ background: PORTAL_ACCENT }}
                    className="flex items-center gap-2 text-white hover:opacity-90"
                  >
                    <Printer size={15} /> طباعة / PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── EXECUTIVE SUMMARY ───────────────────────────────────────────── */}
        {content?.executiveSummary && (
          <section>
            <SectionTitle icon={<Sparkles size={16} />} title="الخلاصة التنفيذية" />
            <Card className="border-border" style={{ borderColor: `${PORTAL_ACCENT}33` }}>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-loose text-sm">{content.executiveSummary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border">
                  {[
                    { label: "إجمالي الإنفاق", value: `${t.spend.toFixed(0)} د.إ` },
                    { label: "الوصول الكلي", value: t.reach.toLocaleString("ar-AE") },
                    { label: "إجمالي العملاء", value: t.leads.toLocaleString("ar-AE") },
                    { label: "تكلفة العميل", value: cpl > 0 ? `${cpl.toFixed(0)} د.إ` : "—" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-xl font-black" style={{ color: "#A78BFA" }}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── KPI CARDS ─────────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<BarChart2 size={16} />} title="مؤشرات الأداء الرئيسية (KPIs)" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <KPICard label="إجمالي الإنفاق (AED)" value={Math.round(t.spend)} unit="د.إ" prev={t.prevSpend} format="currency" />
            <KPICard label="الوصول الكلي"           value={t.reach}       prev={t.prevReach} />
            <KPICard label="مجموع المشاهدات"        value={t.impressions} prev={t.prevImpressions} />
            <KPICard label="النقرات"                value={t.clicks}      prev={t.prevClicks} />
            <KPICard label="نسبة النقر (CTR %)"    value={parseFloat(ctr.toFixed(2))}    prev={prevCtr > 0 ? parseFloat(prevCtr.toFixed(2)) : undefined} unit="%" format="decimal" />
            <KPICard label="الرسائل"                value={t.messages}    prev={t.prevMessages} />
            <KPICard label="المكالمات"              value={t.calls}       prev={t.prevCalls} />
            <KPICard label="العملاء المحتملون"      value={t.leads}       prev={t.prevLeads} />
            <KPICard label="الحجوزات"              value={t.bookings}     prev={t.prevBookings} />
            {/* Cost metrics: lower is better → invert delta colour */}
            <KPICard label="تكلفة العميل (CPL)" value={parseFloat(cpl.toFixed(2))} prev={prevCpl > 0 ? parseFloat(prevCpl.toFixed(2)) : undefined} unit="د.إ" format="decimal" lowerIsBetter />
            <KPICard label="تكلفة الألف (CPM)"  value={parseFloat(cpm.toFixed(2))} prev={prevCpm > 0 ? parseFloat(prevCpm.toFixed(2)) : undefined} unit="د.إ" format="decimal" lowerIsBetter />
            <KPICard label="تكلفة الحجز (CPA)"  value={parseFloat(cpa.toFixed(2))} prev={prevCpa > 0 ? parseFloat(prevCpa.toFixed(2)) : undefined} unit="د.إ" format="decimal" lowerIsBetter />
          </div>
        </section>

        {/* ── CHARTS ────────────────────────────────────────────────────────── */}
        {platformSpendData.length > 0 && (
          <section>
            <SectionTitle icon={<TrendingUp size={16} />} title="لوحة الرسوم البيانية" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:grid-cols-1">

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">الإنفاق حسب المنصة (AED)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformSpendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="إنفاق" fill={PORTAL_ACCENT} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">العملاء والرسائل حسب المنصة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformLeadsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Bar dataKey="leads" name="عملاء محتملون" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="messages" name="رسائل" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">الوصول حسب المنصة (بالآلاف)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={platformReachData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={PORTAL_ACCENT} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={PORTAL_ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Area type="monotone" dataKey="وصول" stroke={PORTAL_ACCENT} fill="url(#aG)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">المكالمات والرسائل حسب المنصة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={platformLeadsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Line type="monotone" dataKey="calls"    name="مكالمات" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="messages" name="رسائل"   stroke="#06B6D4" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* ── PLATFORM TABLE ────────────────────────────────────────────────── */}
        {data.length > 0 && (
          <section>
            <SectionTitle icon={<Award size={16} />} title="تفاصيل الأداء حسب المنصة" />
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {["المنصة","الإنفاق (د.إ)","الوصول","النقرات","الرسائل","المكالمات","العملاء","الحجوزات","CTR %"].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs font-bold whitespace-nowrap">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(r => {
                    const rowCtr = r.impressions > 0 ? ((r.clicks / r.impressions) * 100).toFixed(2) : "0";
                    const sp = parseFloat(r.spend);
                    const prevSp = parseFloat(r.prevSpend);
                    const delta = prevSp > 0 ? ((sp - prevSp) / prevSp * 100).toFixed(1) : null;
                    return (
                      <TableRow key={r.platform} className="border-border">
                        <TableCell className="font-bold text-foreground">
                          <span>{PLATFORM_LABELS[r.platform] ?? r.platform}</span>
                          {delta != null && (
                            <span className={`mr-2 text-[10px] font-normal ${parseFloat(delta) <= 0 ? "text-green-400" : "text-red-400"}`}>
                              {parseFloat(delta) >= 0 ? "+" : ""}{delta}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{sp.toFixed(0)}</TableCell>
                        <TableCell className="text-muted-foreground">{r.reach.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.messages.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.calls.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.leads.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.bookings.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{rowCtr}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="border-t-2 font-bold" style={{ borderColor: `${PORTAL_ACCENT}60` }}>
                    <TableCell className="font-black" style={{ color: "#A78BFA" }}>الإجمالي</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.spend.toFixed(0)}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.reach.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.clicks.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.messages.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.calls.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.leads.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{t.bookings.toLocaleString()}</TableCell>
                    <TableCell style={{ color: "#A78BFA" }}>{ctr.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </section>
        )}

        {/* ── AI ANALYSIS ───────────────────────────────────────────────────── */}
        {aiA && (
          <section>
            <SectionTitle icon={<Sparkles size={16} />} title="تحليل الذكاء الاصطناعي" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {([
                { label: "أفضل منصة",           value: aiA.bestPlatform, icon: <Star size={14} /> },
                { label: "أفضل نوع إعلان",      value: aiA.bestAd,       icon: <Zap size={14} /> },
                { label: "أفضل جمهور مستهدف",  value: aiA.bestAudience, icon: <Target size={14} /> },
                { label: "أفضل وقت للإعلان",   value: aiA.bestTime,     icon: <TrendingUp size={14} /> },
              ] as { label: string; value?: string; icon: React.ReactNode }[]).filter(i => i.value).map(item => (
                <Card key={item.label} className="bg-card border-border">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${PORTAL_ACCENT}22`, color: "#A78BFA" }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiA.strengths && aiA.strengths.length > 0 && (
                <Card className="border-green-500/20 bg-green-900/10">
                  <CardContent className="p-5">
                    <p className="text-green-400 font-bold text-sm mb-3">نقاط القوة</p>
                    <ul className="space-y-2">
                      {aiA.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-green-400 mt-0.5 shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {aiA.weaknesses && aiA.weaknesses.length > 0 && (
                <Card className="border-red-500/20 bg-red-900/10">
                  <CardContent className="p-5">
                    <p className="text-destructive font-bold text-sm mb-3">نقاط للتحسين</p>
                    <ul className="space-y-2">
                      {aiA.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive mt-0.5 shrink-0">→</span> {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* ── RECOMMENDATIONS ───────────────────────────────────────────────── */}
        {recs.length > 0 && (
          <section>
            <SectionTitle icon={<Target size={16} />} title="التوصيات الاستراتيجية" />
            <div className="space-y-3">
              {recs.map((rec, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-5 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 text-white" style={{ background: PORTAL_ACCENT }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-foreground text-sm">{rec.title}</span>
                        <Badge
                          variant="outline"
                          className={
                            rec.impact === "high"   ? "border-red-500/40 text-red-400" :
                            rec.impact === "medium" ? "border-yellow-500/40 text-yellow-400" :
                                                      "border-blue-500/40 text-blue-400"
                          }
                        >
                          {rec.impact === "high" ? "تأثير عالٍ" : rec.impact === "medium" ? "تأثير متوسط" : "تأثير منخفض"}
                        </Badge>
                      </div>
                      {rec.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── WEEKLY TIMELINE ───────────────────────────────────────────────── */}
        {timeline.length > 0 && (
          <section>
            <SectionTitle icon={<Calendar size={16} />} title="الجدول الزمني الأسبوعي" />
            <div className="space-y-2">
              {timeline.map((item, i) => (
                <Card key={i} className="bg-card border-border overflow-hidden">
                  <button
                    onClick={() => setOpenTimeline(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors print:hidden"
                  >
                    <span className="font-bold text-foreground text-sm">{item.week}</span>
                    {openTimeline[i]
                      ? <ChevronUp size={15} className="text-muted-foreground" />
                      : <ChevronDown size={15} className="text-muted-foreground" />}
                  </button>
                  <div className={`px-5 pb-4 print:block ${openTimeline[i] ? "block" : "hidden print:block"}`}>
                    <p className="font-bold text-foreground text-sm mb-1 hidden print:block">{item.week}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.notes}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── NEXT MONTH PLAN ───────────────────────────────────────────────── */}
        {plan.length > 0 && (
          <section>
            <SectionTitle icon={<Zap size={16} />} title="خطة الشهر القادم" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.map((item, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: PORTAL_ACCENT }}>
                        {i + 1}
                      </span>
                      <p className="font-bold text-sm" style={{ color: "#A78BFA" }}>{item.week}</p>
                    </div>
                    {item.focus  && <p className="text-sm text-foreground font-semibold mb-1">{item.focus}</p>}
                    {item.budget && <p className="text-xs text-muted-foreground mb-2">الميزانية: {item.budget}</p>}
                    {item.channels && item.channels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.channels.map(ch => (
                          <Badge key={ch} variant="outline" className="text-[10px]" style={{ borderColor: `${PORTAL_ACCENT}44`, color: "#A78BFA" }}>
                            {ch}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {item.notes && <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── MEDIA GALLERY ────────────────────────────────────────────────── */}
        {mediaUrls.length > 0 && (
          <section>
            <SectionTitle icon={<ImageIcon size={16} />} title="معرض الإعلانات" />
            <div className={`grid gap-4 ${mediaUrls.length === 1 ? "grid-cols-1" : mediaUrls.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
              {mediaUrls.map((url, i) => (
                <a
                  key={i}
                  href={`/api/storage${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-video rounded-xl overflow-hidden border border-border hover:border-[#7C3AED]/60 transition-all print:block"
                >
                  <img
                    src={`/api/storage${url}`}
                    alt={`صورة إعلانية ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                      صورة {i + 1}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── PRINT FOOTER ──────────────────────────────────────────────────── */}
        <div className="hidden print:block border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            تقرير أداء — {client?.name} · {report.periodStart} إلى {report.periodEnd} · أُعِدَّ بواسطة دبي فانز
          </p>
        </div>

        {/* ── BOTTOM NAV ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-border print:hidden">
          <Link href={`/company/${slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight size={14} /> العودة للتقارير
          </Link>
          <Button
            onClick={() => {
              setOpenTimeline(prev => {
                const all: Record<number, boolean> = { ...prev };
                for (let i = 0; i < 20; i++) all[i] = true;
                return all;
              });
              setTimeout(() => window.print(), 300);
            }}
            style={{ background: PORTAL_ACCENT }}
            className="flex items-center gap-2 text-white hover:opacity-90"
          >
            <Printer size={15} /> طباعة / تصدير PDF
          </Button>
        </div>
      </main>
      <div className="print:hidden">
        <TrustedBy />
        <Footer />
      </div>
    </div>
  );
}
