/**
 * reCAPTCHA Enterprise — invisible, score-based verification.
 * Site key is public; safe to embed in source.
 */
const SITE_KEY = "6LdKiG8tAAAAACi2_6d-Pyz-AuOirAqXFTNFCykf";

// Merge with RecaptchaWidget.tsx declaration by adding execute here
// TypeScript merges interface Window declarations across files
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, opts: { action: string }) => Promise<string>;
        render: (container: HTMLElement, params: {
          sitekey: string; action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void; hl?: string;
        }) => number;
        reset: (widgetId?: number) => void;
      };
    };
  }
}

/**
 * Execute reCAPTCHA Enterprise invisibly and return a fresh token.
 * Returns null when the script hasn't loaded (local dev without key).
 * Tokens are valid for ~2 minutes — call once per user action.
 */
export async function executeRecaptchaEnterprise(action: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.grecaptcha?.enterprise) {
      resolve(null);
      return;
    }
    window.grecaptcha.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha.enterprise.execute(SITE_KEY, { action });
        resolve(token);
      } catch {
        resolve(null);
      }
    });
  });
}
