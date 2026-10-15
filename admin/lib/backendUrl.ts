import { getBackendBaseUrl } from "@ecommerce/shared";

/**
 * Resolves the server-side backend base URL with a trailing slash.
 *
 * @remarks
 * Prefer the non-public `API_BASE_URL`; `getBackendBaseUrl` falls back to the
 * public URL variables and to a localhost default. Call this only from
 * server-side code (API routes, `getServerSideProps`) so the internal URL is
 * not bundled into client code.
 *
 * @returns The backend base URL ending in `/`, e.g. `"http://backend:4000/"`.
 */
export function getAdminApiBaseUrl(): string {
  return `${getBackendBaseUrl()}/`;
}
