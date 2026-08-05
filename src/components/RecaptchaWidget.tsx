import { useEffect, useRef } from "react";

const SITE_KEY = "6LdKiG8tAAAAACi2_6d-Pyz-AuOirAqXFTNFCykf";
const ENTERPRISE_SCRIPT_BASE = "https://www.google.com/recaptcha/enterprise.js";

interface RecaptchaWidgetProps {
  onVerified: (token: string) => void;
  onExpired?: () => void;
  className?: string;
  action?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, opts: { action: string }) => Promise<string>;
        render: (
          container: HTMLElement,
          params: {
            sitekey: string;
            action?: string;
            callback?: (token: string) => void;
            "expired-callback"?: () => void;
            hl?: string;
          }
        ) => number;
        reset: (widgetId?: number) => void;
      };
    };
  }
}

/** Loads the reCAPTCHA Enterprise script once per page.
 *  Reuses any existing enterprise.js variant (e.g. ?render=KEY from index.html). */
function loadEnterpriseScript(): Promise<void> {
  return new Promise((resolve) => {
    // Check if any enterprise.js script is already present (with or without query params)
    const existing = document.querySelector(`script[src^="${ENTERPRISE_SCRIPT_BASE}"]`);
    if (existing || window.grecaptcha?.enterprise) {
      // Script already present — poll until grecaptcha.enterprise is ready
      const wait = setInterval(() => {
        if (window.grecaptcha?.enterprise) {
          clearInterval(wait);
          resolve();
        }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.src = ENTERPRISE_SCRIPT_BASE;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function RecaptchaWidget({
  onVerified,
  onExpired,
  className = "",
  action = "LOGIN",
}: RecaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadEnterpriseScript().then(() => {
      if (cancelled || !containerRef.current) return;

      window.grecaptcha.enterprise.ready(() => {
        if (cancelled || !containerRef.current) return;
        // Avoid double-render on React StrictMode re-mount
        if (containerRef.current.childElementCount > 0) return;

        widgetIdRef.current = window.grecaptcha.enterprise.render(
          containerRef.current,
          {
            sitekey: SITE_KEY,
            action,
            hl: "ar",
            callback: (token: string) => onVerified(token),
            "expired-callback": () => {
              onExpired?.();
            },
          }
        );
      });
    });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex justify-end ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
