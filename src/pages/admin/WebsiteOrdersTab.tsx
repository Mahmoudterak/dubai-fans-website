import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Globe, Mail, Phone } from "lucide-react";
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
// Website Orders Tab — طلبات "أنشئ موقعك بالذكاء الاصطناعي" (499 درهم)
// ─────────────────────────────────────────────────────────────────────────────
type OrderStatus = "new" | "contacted" | "in_progress" | "delivered" | "cancelled";

interface WebsiteOrder {
  id: number;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  siteType: "website" | "store";
  details: string;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_META: Record<OrderStatus, { label: string; badgeClass: string }> = {
  new:         { label: "جديد",          badgeClass: "bg-primary/10 text-primary border-primary/20" },
  contacted:   { label: "تم التواصل",    badgeClass: "bg-secondary text-secondary-foreground border-border" },
  in_progress: { label: "قيد التنفيذ",   badgeClass: "bg-accent text-accent-foreground border-border" },
  delivered:   { label: "تم التسليم",    badgeClass: "bg-primary/10 text-primary border-primary/20" },
  cancelled:   { label: "ملغي",          badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
};

const STATUS_ORDER: OrderStatus[] = ["new", "contacted", "in_progress", "delivered", "cancelled"];

export function WebsiteOrdersTab() {
  const [orders, setOrders] = useState<WebsiteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updateMsg, setUpdateMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API}/admin/website-orders`, { credentials: "include" });
      if (!res.ok) { setError("فشل في جلب البيانات"); return; }
      const data = await res.json() as { orders: WebsiteOrder[] };
      setOrders(data.orders ?? []);
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

  async function handleStatusChange(id: number, status: OrderStatus) {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`${API}/admin/website-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { flash("err", "فشل في تحديث الحالة"); return; }
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      flash("ok", `تم تحديث الحالة إلى "${STATUS_META[status].label}"`);
    } catch {
      flash("err", "خطأ في الاتصال");
    } finally {
      setUpdatingId(null);
    }
  }

  const stats: { label: string; value: number }[] = [
    { label: "إجمالي الطلبات", value: orders.length },
    ...STATUS_ORDER.map(s => ({
      label: STATUS_META[s].label,
      value: orders.filter(o => o.status === s).length,
    })),
  ];

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
          onValueChange={v => setFilterStatus(v as OrderStatus | "all")}
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

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Globe className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا توجد طلبات بهذه المعايير</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground px-4 pt-4">
              يُعرض {filtered.length} {filtered.length !== orders.length ? `من ${orders.length}` : ""} طلب
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">النشاط</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الموقع المطلوب</TableHead>
                  <TableHead className="text-right">التواصل</TableHead>
                  <TableHead className="text-right">التفاصيل</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(order => {
                  const date = new Date(order.createdAt).toLocaleDateString("ar-AE", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                  const expanded = expandedId === order.id;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold whitespace-nowrap">{order.businessName}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.businessType}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {order.siteType === "store" ? "متجر إلكتروني" : "موقع تعريفي"}
                      </TableCell>
                      <TableCell dir="ltr">
                        <div className="flex flex-col gap-1 text-xs">
                          <a href={`mailto:${order.email}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="size-3" /> {order.email}
                          </a>
                          <a href={`tel:${order.phone}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="size-3" /> {order.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[260px]">
                        {order.details ? (
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : order.id)}
                            className={cn("text-right text-xs text-muted-foreground hover:text-foreground transition-colors", !expanded && "line-clamp-2")}
                          >
                            {order.details}
                          </button>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{date}</TableCell>
                      <TableCell>
                        {updatingId === order.id ? (
                          <Spinner className="size-4 text-primary" />
                        ) : (
                          <Select
                            value={order.status}
                            onValueChange={v => handleStatusChange(order.id, v as OrderStatus)}
                            dir="rtl"
                          >
                            <SelectTrigger className="h-8 w-36 text-xs font-bold">
                              <SelectValue>
                                <Badge variant="outline" className={cn("font-bold", STATUS_META[order.status].badgeClass)}>
                                  {STATUS_META[order.status].label}
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
