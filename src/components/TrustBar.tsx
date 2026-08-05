/**
 * TrustBar — Trust signals strip
 *
 * Commercial claims follow published policies exactly:
 * - Refund: 100% if agency fails to start within 10 business days;
 *           50% if cancelled in first 7 days of actual work AND before
 *           any deliverable is handed over. See /refund-policy.
 * - Support: السبت–الخميس ٩:٠٠ص–١١:٠٠م (top bar hours)
 * - Payments: WhatsApp + bank transfer only (no card gateway live yet)
 *
 * Styling uses design-system CSS variables from var(--color-*) and
 * var(--radius-*) where tokens exist; dark-brand (#0F0A2A) has no DS
 * token and is used as-is (matches all other dark-section components).
 */
import { Link } from "wouter";
import { ShieldCheck, Lock, BadgeCheck, RefreshCcw, Clock, Building2, MessageCircle } from "lucide-react";

// ── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps { icon: React.ReactNode; label: string; sub?: string }
function SecurityBadge({ icon, label, sub }: BadgeProps) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-4 py-3"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "rgba(204,0,0,0.20)", color: "var(--color-primary)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-white text-xs font-bold leading-tight">{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Guarantee ────────────────────────────────────────────────────────────────

interface GuaranteeProps { icon: React.ReactNode; label: string; sub: React.ReactNode }
function Guarantee({ icon, label, sub }: GuaranteeProps) {
  return (
    <div className="flex flex-col items-center text-center gap-2 px-4">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(204,0,0,0.15)", color: "var(--color-primary)" }}
      >
        {icon}
      </div>
      <p className="text-white font-bold text-sm">{label}</p>
      <div className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.50)" }}>{sub}</div>
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="mb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface TrustBarProps {
  /** Show payment channels row (default: true) */
  showPayments?: boolean;
  /** Show security badges row (default: true) */
  showSecurity?: boolean;
  /** Show guarantee cards row (default: true) */
  showGuarantees?: boolean;
  className?: string;
}

export function TrustBar({
  showPayments   = true,
  showSecurity   = true,
  showGuarantees = true,
  className      = "",
}: TrustBarProps) {
  return (
    <section
      className={`py-14 ${className}`}
      style={{ background: "linear-gradient(to bottom, #0F0A2A, #0a0620)" }}
      aria-label="ضمانات الأمان وطرق التواصل"
      dir="rtl"
    >
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            تعامل بأمان وثقة كاملة
          </p>
          <h2 className="text-white text-2xl font-black">حماية شاملة في كل خطوة</h2>
        </div>

        {/* ── Security badges ─────────────────────────────────────────────── */}
        {showSecurity && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <SecurityBadge
              icon={<Lock size={18} />}
              label="SSL مشفّر 256-bit"
              sub="جميع البيانات مشفّرة بالكامل"
            />
            <SecurityBadge
              icon={<ShieldCheck size={18} />}
              label="reCAPTCHA Enterprise"
              sub="حماية نماذج التواصل والطلبات"
            />
            <SecurityBadge
              icon={<BadgeCheck size={18} />}
              label="Verified Business"
              sub="رقم الإعلان التجاري: 0701430"
            />
          </div>
        )}

        {showSecurity && showPayments && <Divider />}

        {/* ── Payment channels ─────────────────────────────────────────────
            Only channels that are live: WhatsApp order + bank transfer.
            No card-payment badges until a payment gateway is integrated.
        ──────────────────────────────────────────────────────────────────── */}
        {showPayments && (
          <div className="mb-8">
            <p
              className="text-center text-xs mb-4 font-medium"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              طرق إتمام الطلبات
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                className="rounded-xl px-5 py-3 flex items-center gap-2.5 h-12"
                style={{ background: "rgba(37,211,102,0.10)", border: "1px solid rgba(37,211,102,0.30)" }}
              >
                <MessageCircle size={18} style={{ color: "#25D366" }} />
                <div>
                  <p className="text-white text-xs font-bold leading-none">واتساب</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                    تواصل وتأكيد الطلب
                  </p>
                </div>
              </div>
              <div
                className="rounded-xl px-5 py-3 flex items-center gap-2.5 h-12"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Building2 size={18} style={{ color: "rgba(255,255,255,0.70)" }} />
                <div>
                  <p className="text-white text-xs font-bold leading-none">تحويل بنكي</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                    بنوك محلية UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPayments && showGuarantees && <Divider />}

        {/* ── Guarantees ───────────────────────────────────────────────────
            Wording is verbatim from /refund-policy and the site's business hours.

            Refund policy (published at /refund-policy):
              ① Full refund if agency fails to start within 10 business days.
              ② 50% refund if cancelled within first 7 days of actual work
                 AND before any deliverable is handed over.
            Support hours (shown in site top bar):
              Saturday–Thursday 9:00 AM–11:00 PM
        ──────────────────────────────────────────────────────────────────── */}
        {showGuarantees && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Guarantee
              icon={<RefreshCcw size={22} />}
              label="سياسة استرداد واضحة"
              sub={
                <>
                  استرداد كامل إذا أخفقنا في بدء الخدمة خلال ١٠ أيام عمل من تاريخ السداد دون عذر مقبول، أو ٥٠٪ عند الإلغاء في أول ٧ أيام من بدء العمل الفعلي وقبل تسليم أي مخرجات.{" "}
                  <Link href="/refund-policy" className="underline" style={{ color: "var(--color-primary)" }}>
                    سياسة الاسترجاع
                  </Link>
                </>
              }
            />
            <Guarantee
              icon={<Clock size={22} />}
              label="دعم سريع الاستجابة"
              sub="فريق الدعم متاح السبت–الخميس ٩:٠٠ص–١١:٠٠م عبر واتساب والبريد الإلكتروني"
            />
            <Guarantee
              icon={<ShieldCheck size={22} />}
              label="بيانات مشفّرة ١٠٠٪"
              sub="جميع النماذج والطلبات محمية بتشفير SSL 256-bit"
            />
          </div>
        )}

      </div>
    </section>
  );
}
