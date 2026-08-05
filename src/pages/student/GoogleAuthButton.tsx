/** "متابعة مع Google" button — full-page redirect to the OAuth flow. */
export function GoogleAuthButton({ label = "متابعة مع Google" }: { label?: string }) {
  return (
    <a
      href="/api/student/auth/google"
      className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm font-bold hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
    >
      <GoogleIcon />
      {label}
    </a>
  );
}

export function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.19 7.19 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.97 11.97 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

/** Maps ?error= codes from the OAuth callback to Arabic messages. */
export function googleErrorMessage(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "google_cancelled":        return "تم إلغاء تسجيل الدخول عبر Google";
    case "google_not_configured":   return "تسجيل الدخول عبر Google غير مفعّل حالياً";
    case "google_email_unverified": return "بريد حساب Google غير مُوثّق — استخدم حساباً آخر";
    case "google_bad_host":         return "تسجيل الدخول عبر Google غير متاح من هذا النطاق";
    case "google_redirect_unregistered":
      return "تسجيل الدخول عبر Google غير مفعّل على هذا النطاق — يرجى تسجيل رابط الاستدعاء في Google Console وإضافة النطاق إلى متغير GOOGLE_REGISTERED_DEV_HOSTS";
    case "session_required":        return "يرجى تسجيل الدخول أولاً قبل ربط حساب Google";
    default:                        return "تعذّر تسجيل الدخول عبر Google — حاول مجدداً";
  }
}
