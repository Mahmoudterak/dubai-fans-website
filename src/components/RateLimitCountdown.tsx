/**
 * RateLimitCountdown — عدّاد تنازلي واضح يظهر عند استقبال HTTP 429 من الـ API.
 *
 * الـ API يعيد جسم استجابة يحتوي على `retryAfter` (بالثواني). الخطاف
 * `useRateLimitCountdown` يقرأ هذه القيمة من الخطأ، يبدأ عدّاداً تنازلياً،
 * ويُعيد `isRateLimited` لتعطيل زر الإرسال حتى انتهاء العدّاد تلقائياً.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { TimerReset } from "lucide-react";

const DEFAULT_RETRY_AFTER = 60;

/** يقرأ retryAfter من خطأ ApiError عندما يكون الخطأ 429، وإلا يعيد null. */
export function getRateLimitRetryAfter(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const e = error as { status?: unknown; data?: unknown };
  if (e.status !== 429) return null;
  const data = e.data;
  const retry =
    data && typeof data === "object"
      ? (data as Record<string, unknown>).retryAfter
      : undefined;
  return typeof retry === "number" && Number.isFinite(retry) && retry > 0
    ? Math.ceil(retry)
    : DEFAULT_RETRY_AFTER;
}

export function useRateLimitCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const deadlineRef = useRef<number | null>(null);
  const active = secondsLeft > 0;

  useEffect(() => {
    if (!active) {
      deadlineRef.current = null;
      return undefined;
    }
    const id = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline == null) return;
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(id);
  }, [active]);

  const start = useCallback((seconds: number) => {
    deadlineRef.current = Date.now() + seconds * 1000;
    setSecondsLeft(seconds);
  }, []);

  /**
   * يعالج خطأ الطلب: إذا كان 429 يبدأ العدّاد ويعيد true،
   * وإلا يعيد false ليُعالَج الخطأ بالطريقة الاعتيادية.
   */
  const handleError = useCallback(
    (error: unknown): boolean => {
      const retry = getRateLimitRetryAfter(error);
      if (retry == null) return false;
      start(retry);
      return true;
    },
    [start],
  );

  return { secondsLeft, isRateLimited: active, handleError };
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}`;
}

export function RateLimitCountdown({ secondsLeft }: { secondsLeft: number }) {
  if (secondsLeft <= 0) return null;
  const minutes = secondsLeft >= 60;
  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center gap-3"
    >
      <TimerReset className="w-5 h-5 shrink-0 text-amber-600 animate-pulse" />
      <p className="flex-1 text-sm font-bold leading-relaxed">
        وصلت للحد الأقصى من الطلبات مؤقتاً — سيُعاد تفعيل الزر تلقائياً بعد:
      </p>
      <span
        dir="ltr"
        className="font-black text-lg tabular-nums text-amber-700 bg-white border border-amber-200 rounded-lg px-3 py-1 shrink-0"
      >
        {minutes ? formatSeconds(secondsLeft) : `${secondsLeft} ث`}
      </span>
    </div>
  );
}
