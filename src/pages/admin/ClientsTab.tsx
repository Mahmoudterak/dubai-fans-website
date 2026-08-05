import { useState, useEffect } from "react";
import {
  Loader, AlertCircle, CheckCircle, Plus, Pencil, Trash2,
  X, Building2, RefreshCw, Users, Globe, ChevronDown, ChevronUp,
  KeyRound, ShieldOff, ShieldCheck, UserPlus,
} from "lucide-react";

const API = "/api";
const inputCls =
  "w-full px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/60 focus:outline-none transition-colors";

interface Client {
  id: number;
  slug: string;
  name: string;
  logoUrl: string;
  industry: string;
  createdAt: string;
  reportCount: number;
  userCount: number;
  loginEmail: string | null;
}

type Role = "owner" | "gm" | "marketing" | "doctor";

interface CompanyUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  forcePasswordChange: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  owner: "مالك",
  gm: "مدير عام",
  marketing: "تسويق",
  doctor: "طبيب (قراءة فقط)",
};

const ROLE_COLORS: Record<Role, string> = {
  owner:     "bg-[#FDF2F8] text-[#BE185D] border-[#FBCFE8]",
  gm:        "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  marketing: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
  doctor:    "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
};

interface Toast { kind: "ok" | "err"; text: string }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E5E7EB] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <h2 className="text-base font-black text-[#111827]">{title}</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151]"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ClientRow({ client, onEdit, onDelete, onManageUsers }: {
  client: Client;
  onEdit: (c: Client) => void;
  onDelete: (id: number) => void;
  onManageUsers: (c: Client) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(v => !v)} className="text-[#9CA3AF] hover:text-[#111827] shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {client.logoUrl ? (
          <img loading="lazy" decoding="async" src={client.logoUrl} alt={client.name} className="w-9 h-9 rounded-lg object-cover border border-[#E5E7EB] shrink-0" />
        ) : (
          <span className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-[#9CA3AF]" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#111827] text-sm">{client.name}</span>
            <span className="text-xs text-[#9CA3AF]" dir="ltr">/{client.slug}</span>
            {client.industry && (
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold border border-[#BFDBFE]">
                {client.industry}
              </span>
            )}
          </div>
          <div className="text-xs text-[#9CA3AF] mt-0.5">
            {client.reportCount} تقرير · {client.userCount} مستخدم{client.loginEmail ? ` · ${client.loginEmail}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onManageUsers(client)} title="المستخدمون" className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors"><Users size={14} /></button>
          <button onClick={() => onEdit(client)} title="تعديل" className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"><Pencil size={14} /></button>
          <button onClick={() => onDelete(client.id)} title="حذف" className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#CC0000] hover:bg-[#FEF2F2] transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#E5E7EB] px-4 py-3 bg-[#F9FAFB] text-xs text-[#6B7280] space-y-1">
          <p>الصناعة: <strong>{client.industry || "—"}</strong></p>
          <p>الشعار: <span dir="ltr">{client.logoUrl || "—"}</span></p>
          <p>تاريخ الإنشاء: {new Date(client.createdAt).toLocaleDateString("ar-AE")}</p>
          <p>عدد المستخدمين: <strong>{client.userCount}</strong></p>
        </div>
      )}
    </div>
  );
}

// ── Users management modal ────────────────────────────────────────────────────
function UsersModal({ client, onClose, onChanged, showToast }: {
  client: Client;
  onClose: () => void;
  onChanged: () => void;
  showToast: (t: Toast) => void;
}) {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Add-user form
  const [showAdd, setShowAdd] = useState(false);
  const [addData, setAddData] = useState({ email: "", name: "", password: "", role: "marketing" as Role });

  // Reset-password form (per user)
  const [resetUser, setResetUser] = useState<CompanyUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const headers = { "Content-Type": "application/json", "X-Requested-With": "fetch" };

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/clients/${client.id}/users`, { credentials: "include", headers: { "X-Requested-With": "fetch" } });
      const data = await res.json() as { users?: CompanyUser[] };
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd() {
    if (!addData.email.trim() || addData.password.length < 8) {
      showToast({ kind: "err", text: "البريد الإلكتروني وكلمة المرور (8 أحرف) مطلوبان" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/clients/${client.id}/users`, {
        method: "POST", credentials: "include", headers,
        body: JSON.stringify(addData),
      });
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) { showToast({ kind: "err", text: data.error ?? "فشل في إنشاء المستخدم" }); return; }
      showToast({ kind: "ok", text: "تم إنشاء المستخدم بنجاح" });
      setShowAdd(false);
      setAddData({ email: "", name: "", password: "", role: "marketing" });
      await loadUsers();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function patchUser(userId: number, body: Record<string, unknown>, okText: string) {
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/clients/${client.id}/users/${userId}`, {
        method: "PATCH", credentials: "include", headers,
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) { showToast({ kind: "err", text: data.error ?? "فشل في التحديث" }); return false; }
      showToast({ kind: "ok", text: okText });
      await loadUsers();
      onChanged();
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(u: CompanyUser) {
    if (!confirm(`حذف المستخدم "${u.email}" نهائياً؟`)) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/clients/${client.id}/users/${u.id}`, {
        method: "DELETE", credentials: "include", headers: { "X-Requested-With": "fetch" },
      });
      if (!res.ok) { showToast({ kind: "err", text: "فشل في حذف المستخدم" }); return; }
      showToast({ kind: "ok", text: "تم حذف المستخدم" });
      await loadUsers();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!resetUser) return;
    if (resetPassword.length < 8) { showToast({ kind: "err", text: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }); return; }
    const ok = await patchUser(resetUser.id, { password: resetPassword }, "تم إعادة تعيين كلمة المرور — سيُطلب من المستخدم تغييرها عند أول دخول");
    if (ok) { setResetUser(null); setResetPassword(""); }
  }

  return (
    <Modal title={`مستخدمو ${client.name}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl px-4 py-3 border border-[#E5E7EB] flex items-start gap-2">
          <Globe size={13} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
          رابط بوابة العميل: <span dir="ltr" className="font-mono text-[#111827]">/company/{client.slug}</span>
        </p>

        {loading ? (
          <div className="flex justify-center py-8"><Loader className="animate-spin text-[#CC0000]" size={22} /></div>
        ) : users.length === 0 ? (
          <p className="text-center text-sm text-[#9CA3AF] py-6">لا يوجد مستخدمون بعد</p>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className={`border rounded-xl px-4 py-3 ${u.isActive ? "border-[#E5E7EB] bg-white" : "border-[#FECACA] bg-[#FEF2F2]"}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#111827]" dir="ltr">{u.email}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                  {!u.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#FEF2F2] text-[#CC0000] border-[#FECACA]">معطّل</span>
                  )}
                  {u.forcePasswordChange && u.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]">بانتظار تغيير كلمة المرور</span>
                  )}
                </div>
                {u.name && <p className="text-xs text-[#6B7280] mt-1">{u.name}</p>}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Role select */}
                  <select
                    value={u.role} disabled={busy}
                    onChange={e => void patchUser(u.id, { role: e.target.value }, "تم تغيير الدور")}
                    className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-[#F9FAFB] text-[#374151] focus:outline-none"
                  >
                    {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => void patchUser(u.id, { isActive: !u.isActive }, u.isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب")}
                    disabled={busy}
                    className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border transition-colors ${
                      u.isActive
                        ? "text-[#B45309] border-[#FDE68A] hover:bg-[#FFFBEB]"
                        : "text-[#047857] border-[#A7F3D0] hover:bg-[#ECFDF5]"
                    }`}
                  >
                    {u.isActive ? <><ShieldOff size={11} /> تعطيل</> : <><ShieldCheck size={11} /> تفعيل</>}
                  </button>
                  <button
                    onClick={() => { setResetUser(u); setResetPassword(""); }}
                    disabled={busy}
                    className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-[#DDD6FE] text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors"
                  >
                    <KeyRound size={11} /> إعادة تعيين كلمة المرور
                  </button>
                  <button
                    onClick={() => void handleDelete(u)}
                    disabled={busy}
                    className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-[#FECACA] text-[#CC0000] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <Trash2 size={11} /> حذف
                  </button>
                </div>

                {/* Inline reset-password form */}
                {resetUser?.id === u.id && (
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center gap-2">
                    <input
                      type="password" value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      placeholder="كلمة مرور جديدة (8 أحرف على الأقل)"
                      className={inputCls}
                    />
                    <button onClick={() => void handleReset()} disabled={busy} className="shrink-0 px-3 py-3 bg-[#7C3AED] text-white rounded-xl text-xs font-bold disabled:opacity-60">
                      حفظ
                    </button>
                    <button onClick={() => setResetUser(null)} className="shrink-0 px-3 py-3 bg-[#F3F4F6] text-[#111827] rounded-xl text-xs font-bold">إلغاء</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add user */}
        {showAdd ? (
          <div className="border border-[#E5E7EB] rounded-xl px-4 py-4 space-y-3 bg-[#F9FAFB]">
            <p className="text-xs font-black text-[#111827]">مستخدم جديد</p>
            <input type="email" value={addData.email} onChange={e => setAddData(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" className={inputCls} dir="ltr" />
            <input type="text" value={addData.name} onChange={e => setAddData(f => ({ ...f, name: e.target.value }))} placeholder="الاسم (اختياري)" className={inputCls} />
            <input type="password" value={addData.password} onChange={e => setAddData(f => ({ ...f, password: e.target.value }))} placeholder="كلمة مرور مؤقتة (8 أحرف على الأقل)" className={inputCls} />
            <select
              value={addData.role}
              onChange={e => setAddData(f => ({ ...f, role: e.target.value as Role }))}
              className={inputCls}
            >
              {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => void handleAdd()} disabled={busy} className="flex-1 py-3 bg-[#CC0000] text-white rounded-xl font-bold text-sm disabled:opacity-60">
                {busy ? <Loader size={14} className="animate-spin mx-auto" /> : "إنشاء المستخدم"}
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-[#F3F4F6] text-[#111827] rounded-xl font-bold text-sm">إلغاء</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-[#7C3AED] border border-dashed border-[#DDD6FE] hover:bg-[#F5F3FF] transition-colors"
          >
            <UserPlus size={14} /> إضافة مستخدم
          </button>
        )}
      </div>
    </Modal>
  );
}

export function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  // Create/edit modal
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ slug: "", name: "", logoUrl: "", industry: "" });
  const [saving, setSaving] = useState(false);

  // Users modal
  const [usersClient, setUsersClient] = useState<Client | null>(null);

  const showToast = (toast: Toast) => { setToast(toast); setTimeout(() => setToast(null), 3500); };

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/clients`, { credentials: "include", headers: { "X-Requested-With": "fetch" } });
      const data = await res.json() as { clients: Client[] };
      setClients(data.clients ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function openCreate() {
    setEditClient(null);
    setFormData({ slug: "", name: "", logoUrl: "", industry: "" });
    setShowForm(true);
  }

  function openEdit(c: Client) {
    setEditClient(c);
    setFormData({ slug: c.slug, name: c.name, logoUrl: c.logoUrl, industry: c.industry });
    setShowForm(true);
  }

  async function handleSave() {
    if (!formData.name.trim()) { showToast({ kind: "err", text: "اسم العميل مطلوب" }); return; }
    if (!editClient && !formData.slug.trim()) { showToast({ kind: "err", text: "الـ slug مطلوب" }); return; }
    setSaving(true);
    try {
      if (editClient) {
        const res = await fetch(`${API}/admin/clients/${editClient.id}`, {
          method: "PATCH", credentials: "include",
          headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
          body: JSON.stringify({ name: formData.name, logoUrl: formData.logoUrl, industry: formData.industry }),
        });
        if (!res.ok) { showToast({ kind: "err", text: "فشل في التحديث" }); return; }
        showToast({ kind: "ok", text: "تم تحديث بيانات العميل" });
      } else {
        const res = await fetch(`${API}/admin/clients`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
          body: JSON.stringify(formData),
        });
        const data = await res.json() as { error?: string };
        if (!res.ok) { showToast({ kind: "err", text: data.error ?? "فشل في الإنشاء" }); return; }
        showToast({ kind: "ok", text: "تم إنشاء العميل بنجاح" });
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("حذف العميل وجميع تقاريره ومستخدميه؟")) return;
    const res = await fetch(`${API}/admin/clients/${id}`, { method: "DELETE", credentials: "include", headers: { "X-Requested-With": "fetch" } });
    if (res.ok) {
      setClients(prev => prev.filter(c => c.id !== id));
      showToast({ kind: "ok", text: "تم حذف العميل" });
    } else {
      showToast({ kind: "err", text: "فشل في الحذف" });
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-[#CC0000]" size={28} /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#111827]">العملاء ({clients.length})</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">إدارة حسابات العملاء ومستخدمي بوابة التقارير</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:border-[#9CA3AF] transition-colors"><RefreshCw size={14} /></button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-xl text-sm font-bold hover:bg-[#AA0000] transition-colors">
            <Plus size={14} /> عميل جديد
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
          toast.kind === "ok" ? "text-green-700 bg-green-50 border border-green-200" : "text-[#CC0000] bg-red-50 border border-red-200"
        }`}>
          {toast.kind === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.text}
        </div>
      )}

      {/* List */}
      {clients.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <Building2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">لا يوجد عملاء بعد</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 bg-[#CC0000] text-white rounded-xl text-sm font-bold">أضف أول عميل</button>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map(c => (
            <ClientRow key={c.id} client={c} onEdit={openEdit} onDelete={handleDelete} onManageUsers={setUsersClient} />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <Modal title={editClient ? "تعديل بيانات العميل" : "عميل جديد"} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            {!editClient && (
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">Slug (رابط فريد) *</label>
                <div className="flex items-center gap-2">
                  <span className="text-[#9CA3AF] text-sm font-mono">/company/</span>
                  <input
                    type="text" value={formData.slug}
                    onChange={e => setFormData(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                    placeholder="client-name" className={inputCls} dir="ltr"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">اسم العميل *</label>
              <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="مثال: شركة النجوم للتسويق" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">رابط الشعار (URL)</label>
              <input type="url" value={formData.logoUrl} onChange={e => setFormData(f => ({ ...f, logoUrl: e.target.value }))} placeholder="https://..." className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">القطاع / الصناعة</label>
              <input type="text" value={formData.industry} onChange={e => setFormData(f => ({ ...f, industry: e.target.value }))} placeholder="مثال: عقارات، مطاعم، تجزئة..." className={inputCls} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#CC0000] text-white rounded-xl font-bold text-sm disabled:opacity-60">
                {saving ? <Loader size={14} className="animate-spin mx-auto" /> : editClient ? "حفظ التعديلات" : "إنشاء العميل"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-[#F3F4F6] text-[#111827] rounded-xl font-bold text-sm">إلغاء</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Users management modal */}
      {usersClient && (
        <UsersModal
          client={usersClient}
          onClose={() => setUsersClient(null)}
          onChanged={() => void load()}
          showToast={showToast}
        />
      )}
    </div>
  );
}
