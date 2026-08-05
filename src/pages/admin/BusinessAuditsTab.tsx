import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Mail, Phone, FileSearch, X } from "lucide-react";
import { Button } from "@workspace/dubai-fans-ds/components/ui/button";
import { Card, CardContent } from "@workspace/dubai-fans-ds/components/ui/card";
import { Alert, AlertDescription } from "@workspace/dubai-fans-ds/components/ui/alert";
import { Spinner } from "@workspace/dubai-fans-ds/components/ui/spinner";
import { Badge } from "@workspace/dubai-fans-ds/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@workspace/dubai-fans-ds/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@workspace/dubai-fans-ds/components/ui/select";
import { cn } from "@workspace/dubai-fans-ds/lib/utils";
import { apiFetch } from "@/lib/apiFetch";

const API = "/api";

// ─────────────────────────────────────────────────────────────────────────────
// Business Audits Tab — طلبات "AI Business Audit" (تحليل النشاط التجاري)
// ─────────────────────────────────────────────────────────────────────────────
type AuditStatus = "new" | "contacted" | "interested" | "not_interested";

interface AuditRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  businessType: string;
  country: string;
  city: string;
  targets: string[];
  status: AuditStatus;
  createdAt: string;
}

interface AuditReport {
  healthScore?: number;
  scores?: Record<string, number>;
  summary?: string;
  problems?: string[];
  opportunities?: string[];
  recommendations?: { title: string; priority: string; description: string; impact?: string }[];
  plan30?: string[];
  plan90?: string[];
  growthPotentialPercent?: number;
}

const STATUS_META: Record<AuditStatus, { label: string; badgeClass: string }> = {
  new:            { label: "جديد",         badgeClass: "bg-primary/10 text-primary border-primary/20" },
  contacted:      { label: "تم التواصل",   badgeClass: "bg-secondary text-secondary-foreground border-border" },
  interested:     { label: "مهتم",         badgeClass: "bg-primary/10 text-primary border-primary/20" },
  not_interested: { label: "غير مهتم",     badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
};
const STATUS_ORDER: AuditStatus[] = ["new", "contacted", "interested", "not_interested"];

const TARGET_LABELS: Record<string, string> = {
  website: "الموقع", instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok",
  snapchat: "Snapchat", google_business: "Google Business", full_business: "النشاط كاملاً",
};

export function BusinessAuditsTab() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<AuditStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updateMsg, setUpdateMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [reportOpen, setReportOpen] = useState<{ row: AuditRow; report: AuditReport | null } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API}/admin/business-audits`, { credentials: "include" });
      if (!res.ok) { setError("فشل في جلب البيانات"); return; }
      const data = await res.json() as { audits: AuditRow[] };
      setRows(data.audits ?? []);
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function flash(kind: "ok" | "err", text: string) {
    setUpdateMsg({ kind, text });
    setTimeout(() => setUpdateMsg(null), 3000);
  }

  async function handleStatusChange(id: number, status: AuditStatus) {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`${API}/admin/business-audits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { flash("err", "فشل في تحديث الحالة"); return; }
      setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      flash("ok", `تم تحديث الحالة إلى "${STATUS_META[status].label}"`);
    } catch {
      flash("err", "خطأ في الاتصال");
    } finally {
      setUpdatingId(null);
    }
  }

  async function openReport(row: AuditRow) {
    setReportOpen({ row, report: null });
    setReportLoading(true);
    try {
      const res = await apiFetch(`${API}/admin/business-audits/${row.id}`, { credentials: "include" });
      if (!res.ok) { flash("err", "فشل في جلب التقرير"); setReportOpen(null); return; }
      const data = await res.json() as { audit: { report: AuditReport | null } };
      setReportOpen({ row, report: data.audit.report });
    } catch {
      flash("err", "خطأ في الاتصال");
      setReportOpen(null);
    } finally {
      setReportLoading(false);
    }
  }

  const stats: { label: string; value: number }[] = [
    { label: "إجمالي الطلبات", value: rows.length },
    ...STATUS_ORDER.map(s => ({
      label: STATUS_META[s].label,
      value: rows.filter(r => r.status === s).length,
    })),
  ];

  const filtered = filterStatus === "all" ? rows : rows.filter(r => r.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-7 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={load}>
          <RefreshCw className="size-4" /> إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter + refresh */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filterStatus}
          onValueChange={v => setFilterStatus(v as AuditStatus | "all")}
          dir="rtl"
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {STATUS_ORDER.map(s => (
              <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={load} className="mr-auto">
          <RefreshCw className="size-3.5" /> تحديث
        </Button>
      </div>

      {updateMsg && (
        <Alert variant={updateMsg.kind === "ok" ? "default" : "destructive"}>
          {updateMsg.kind === "ok" ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
          <AlertDescription>{updateMsg.text}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileSearch className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا توجد طلبات بهذه المعايير</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground px-4 pt-4">
              يُعرض {filtered.length} {filtered.length !== rows.length ? `من ${rows.length}` : ""} طلب
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الشركة</TableHead>
                  <TableHead className="text-right">النشاط</TableHead>
                  <TableHead className="text-right">الموقع</TableHead>
                  <TableHead className="text-right">التواصل</TableHead>
                  <TableHead className="text-right">ما تم تحليله</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">التقرير</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(row => {
                  const date = new Date(row.createdAt).toLocaleDateString("ar-AE", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-bold whitespace-nowrap">
                        {row.companyName}
                        <span className="block text-xs font-normal text-muted-foreground">{row.name}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{row.businessType}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                        {[row.city, row.country].filter(Boolean).join("، ") || "—"}
                      </TableCell>
                      <TableCell dir="ltr">
                        <div className="flex flex-col gap-1 text-xs">
                          <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="size-3" /> {row.email}
                          </a>
                          <a href={`tel:${row.phone}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="size-3" /> {row.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(row.targets) ? row.targets : []).map(t => (
                            <Badge key={t} variant="outline" className="text-[10px]">{TARGET_LABELS[t] ?? t}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openReport(row)}>
                          <FileSearch className="size-3.5" /> عرض
                        </Button>
                      </TableCell>
                      <TableCell>
                        {updatingId === row.id ? (
                          <Spinner className="size-4 text-primary" />
                        ) : (
                          <Select
                            value={row.status}
                            onValueChange={v => handleStatusChange(row.id, v as AuditStatus)}
                            dir="rtl"
                          >
                            <SelectTrigger className="h-8 w-36 text-xs font-bold">
                              <SelectValue>
                                <Badge variant="outline" className={cn("font-bold", STATUS_META[row.status].badgeClass)}>
                                  {STATUS_META[row.status].label}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_ORDER.map(s => (
                                <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setReportOpen(null)}>
          <div
            dir="rtl"
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setReportOpen(null)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-black mb-1">تقرير: {reportOpen.row.companyName}</h3>
            <p className="text-xs text-muted-foreground mb-4">{reportOpen.row.businessType} · {reportOpen.row.name}</p>
            {reportLoading ? (
              <div className="flex justify-center py-10"><Spinner className="size-6 text-primary" /></div>
            ) : !reportOpen.report ? (
              <p className="text-sm text-muted-foreground py-6">لا يوجد تقرير محفوظ لهذا الطلب.</p>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-sm">Health Score: {reportOpen.report.healthScore ?? "—"}/100</Badge>
                  {reportOpen.report.growthPotentialPercent !== undefined && (
                    <Badge variant="outline">فرصة نمو: +{reportOpen.report.growthPotentialPercent}%</Badge>
                  )}
                </div>
                {reportOpen.report.scores && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(reportOpen.report.scores).map(([k, v]) => (
                      <div key={k} className="border border-border rounded-lg p-2 text-center">
                        <p className="font-black">{v}</p>
                        <p className="text-[10px] text-muted-foreground" dir="ltr">{k}</p>
                      </div>
                    ))}
                  </div>
                )}
                {reportOpen.report.summary && <p className="text-muted-foreground leading-relaxed">{reportOpen.report.summary}</p>}
                {reportOpen.report.problems && reportOpen.report.problems.length > 0 && (
                  <div>
                    <p className="font-black mb-1.5">المشاكل ({reportOpen.report.problems.length})</p>
                    <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
                      {reportOpen.report.problems.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {reportOpen.report.recommendations && reportOpen.report.recommendations.length > 0 && (
                  <div>
                    <p className="font-black mb-1.5">التوصيات ({reportOpen.report.recommendations.length})</p>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {reportOpen.report.recommendations.map((r, i) => (
                        <li key={i}><span className="font-bold text-foreground">{r.title}:</span> {r.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
