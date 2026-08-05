import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Bot, Mail } from "lucide-react";
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

const API = "/api";

// ─────────────────────────────────────────────────────────────────────────────
// AI Business OS Leads Tab — Early Access requests follow-up
// ─────────────────────────────────────────────────────────────────────────────
type LeadStatus = "new" | "contacted" | "interested" | "not_interested";

interface AibosLead {
  id: number;
  name: string;
  email: string;
  businessType: string;
  city: string;
  status: LeadStatus;
  createdAt: string;
}

const STATUS_META: Record<LeadStatus, { label: string; badgeClass: string }> = {
  new:            { label: "جديد",         badgeClass: "bg-primary/10 text-primary border-primary/20" },
  contacted:      { label: "تمت المتابعة", badgeClass: "bg-secondary text-secondary-foreground border-border" },
  interested:     { label: "مهتم",         badgeClass: "bg-accent text-accent-foreground border-border" },
  not_interested: { label: "لا يهمه",      badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
};

const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "interested", "not_interested"];

export function AibosLeadsTab() {
  const [leads, setLeads] = useState<AibosLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updateMsg, setUpdateMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/aibos-leads`, { credentials: "include" });
      if (!res.ok) { setError("فشل في جلب البيانات"); return; }
      const data = await res.json() as { leads: AibosLead[] };
      setLeads(data.leads ?? []);
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

  async function handleStatusChange(id: number, status: LeadStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/admin/aibos-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { flash("err", "فشل في تحديث الحالة"); return; }
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      flash("ok", `تم تحديث الحالة إلى "${STATUS_META[status].label}"`);
    } catch {
      flash("err", "خطأ في الاتصال");
    } finally {
      setUpdatingId(null);
    }
  }

  // Stats
  const stats: { label: string; value: number }[] = [
    { label: "إجمالي الطلبات", value: leads.length },
    ...STATUS_ORDER.map(s => ({
      label: STATUS_META[s].label,
      value: leads.filter(l => l.status === s).length,
    })),
  ];

  const filtered = filterStatus === "all" ? leads : leads.filter(l => l.status === filterStatus);

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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
          onValueChange={v => setFilterStatus(v as LeadStatus | "all")}
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

      {/* Toast notification */}
      {updateMsg && (
        <Alert variant={updateMsg.kind === "ok" ? "default" : "destructive"}>
          {updateMsg.kind === "ok" ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
          <AlertDescription>{updateMsg.text}</AlertDescription>
        </Alert>
      )}

      {/* Leads table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bot className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا توجد طلبات بهذه المعايير</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground px-4 pt-4">
              يُعرض {filtered.length} {filtered.length !== leads.length ? `من ${leads.length}` : ""} طلب
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد</TableHead>
                  <TableHead className="text-right">نوع النشاط</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(lead => {
                  const date = new Date(lead.createdAt).toLocaleDateString("ar-AE", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-bold whitespace-nowrap">{lead.name}</TableCell>
                      <TableCell dir="ltr">
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="size-3" /> {lead.email}
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{lead.businessType}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{lead.city || "—"}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{date}</TableCell>
                      <TableCell>
                        {updatingId === lead.id ? (
                          <Spinner className="size-4 text-primary" />
                        ) : (
                          <Select
                            value={lead.status}
                            onValueChange={v => handleStatusChange(lead.id, v as LeadStatus)}
                            dir="rtl"
                          >
                            <SelectTrigger className="h-8 w-36 text-xs font-bold">
                              <SelectValue>
                                <Badge variant="outline" className={cn("font-bold", STATUS_META[lead.status].badgeClass)}>
                                  {STATUS_META[lead.status].label}
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
    </div>
  );
}
