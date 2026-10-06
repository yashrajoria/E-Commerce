import { getBackendBaseUrl } from "@ecommerce/shared";

/** Server-side backend base with trailing slash. Prefer API_BASE_URL (non-public). */
export function getAdminApiBaseUrl(): string {
  return `${getBackendBaseUrl()}/`;
}
