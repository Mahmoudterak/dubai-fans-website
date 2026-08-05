/**
 * Consent Manager — Dubai Fans
 *
 * reCAPTCHA Enterprise is classified as STRICTLY NECESSARY under GDPR
 * Article 6(1)(f) — legitimate interest (fraud prevention & form security).
 * It loads unconditionally from index.html.
 *
 * Analytics (GA4) and Marketing (Meta Pixel) are OPTIONAL and gated here.
 * Set GA_ID / META_PIXEL_ID to real values to activate them.
 * While both IDs are empty strings, HAS_ANALYTICS and HAS_MARKETING are false,
 * so no optional trackers are injected and the banner/policy reflect this accurately.
 */

export const CONSENT_KEY    = "df_cookie_consent";
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

// ── Optional tracker IDs ─────────────────────────────────────────────────────
// Set to a real ID string to activate; leave as "" to keep disabled.
const GA_ID         = "";   // e.g. "G-XXXXXXXXXX"
const META_PIXEL_ID = "";   // e.g. "000000000000000"

/** True when Google Analytics is configured and should be offered as an option */
export const HAS_ANALYTICS = Boolean(GA_ID);
/** True when Meta Pixel is configured and should be offered as an option */
export const HAS_MARKETING = Boolean(META_PIXEL_ID);

// ── Types ────────────────────────────────────────────────────────────────────

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
  /** Unix timestamp (ms) after which this record expires and the banner re-appears */
  expiresAt: number;
};

// ── Storage ──────────────────────────────────────────────────────────────────

/** Read saved consent. Returns null if not yet decided or record has expired. */
export function getConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as ConsentState;
    if (!state.expiresAt || Date.now() > state.expiresAt) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

/** Persist consent with 1-year expiry and immediately apply it. */
export function saveConsent(opts: {
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
}): void {
  const full: ConsentState = {
    necessary: true,
    ...opts,
    // If a tracker category is not configured, always store false regardless of choice
    analytics: HAS_ANALYTICS ? opts.analytics : false,
    marketing: HAS_MARKETING ? opts.marketing : false,
    expiresAt: Date.now() + CONSENT_TTL_MS,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
  applyConsent(full);
}

// ── Apply ─────────────────────────────────────────────────────────────────────

/**
 * Apply consent state: inject approved trackers and remove revoked ones.
 * Safe to call multiple times — script insertion is idempotent.
 * Call on app boot (re-applies saved choices) and after every consent change.
 */
export function applyConsent(consent?: ConsentState | null): void {
  const c = consent ?? getConsent();
  if (!c?.decided) return;

  if (HAS_ANALYTICS) {
    c.analytics ? loadGoogleAnalytics() : removeGoogleAnalytics();
  }
  if (HAS_MARKETING) {
    c.marketing ? loadMetaPixel() : removeMetaPixel();
  }
}

// ── Google Analytics 4 ───────────────────────────────────────────────────────

function loadGoogleAnalytics(): void {
  if (!GA_ID || document.getElementById("df-ga-script")) return;
  const s = document.createElement("script");
  s.id    = "df-ga-script";
  s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag(...args: unknown[]) { w.dataLayer!.push(args); };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });
}

function removeGoogleAnalytics(): void {
  document.getElementById("df-ga-script")?.remove();
  document.cookie.split(";").forEach(c => {
    const name = c.split("=")[0].trim();
    if (name.startsWith("_ga")) {
      const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = `${name}=; ${expire}; domain=.mtuaefans.com`;
      document.cookie = `${name}=; ${expire}`;
    }
  });
}

// ── Meta Pixel ───────────────────────────────────────────────────────────────

function loadMetaPixel(): void {
  if (!META_PIXEL_ID || document.getElementById("df-fbq-script")) return;
  const s = document.createElement("script");
  s.id    = "df-fbq-script";
  s.async = true;
  s.src   = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  const w = window as Window & { fbq?: (...a: unknown[]) => void; _fbq?: unknown };
  if (typeof w.fbq === "function") {
    w.fbq("init", META_PIXEL_ID);
    w.fbq("track", "PageView");
  }
}

function removeMetaPixel(): void {
  document.getElementById("df-fbq-script")?.remove();
  ["_fbp", "_fbc"].forEach(name => {
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = `${name}=; ${expire}; domain=.mtuaefans.com`;
    document.cookie = `${name}=; ${expire}`;
  });
}
