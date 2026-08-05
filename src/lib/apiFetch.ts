/**
 * Shared fetch wrapper for API calls.
 *
 * Always sends the `X-Requested-With: fetch` header, which the API server
 * requires as a CSRF defence on state-changing routes (cross-site HTML forms
 * cannot set custom headers). Using this wrapper everywhere prevents forms
 * from failing with "طلب غير مصرّح به — يُشترط X-Requested-With: fetch".
 *
 * Note: do NOT use this for direct uploads to signed storage URLs (GCS) —
 * those must only carry the headers included in the signature.
 */
export function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("X-Requested-With", "fetch");
  return fetch(input, { ...init, headers });
}
