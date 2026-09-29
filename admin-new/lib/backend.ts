/**
 * Centralised backend URL helpers.
 * Uses NEXT_PUBLIC_NEW_API_URL (canonical) with NEXT_PUBLIC_API_BASE_URL
 * as a backwards-compatible alias. Always returns a trailing-slash URL
 * so `${base}auth/login` style joins are safe.
 */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_NEW_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080/";
  return raw.replace(/\/+$/, "") + "/";
}

export function backendUrl(path: string): string {
  return getBackendBaseUrl() + path.replace(/^\/+/, "");
}
