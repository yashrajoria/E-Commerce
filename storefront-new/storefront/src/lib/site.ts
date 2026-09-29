/** Central site URL helper (no localhost leak in prod builds). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Central backend base URL helper with safe trailing-slash handling. */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:8080";
  return raw.replace(/\/+$/, "");
}
