import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { getBackendBaseUrl } from "@ecommerce/shared";

type AdminUser = {
  id?: string;
  email?: string;
  role?: string;
};

type GuardOk = { ok: true; user: AdminUser | null };
type GuardDeny = { ok: false };

const STATUS_CACHE_TTL_MS = 5_000;
const statusCache = new Map<
  string,
  { expiresAt: number; user: AdminUser | null; role: string }
>();

function cookieFingerprint(cookieHeader: string): string {
  return createHash("sha256").update(cookieHeader).digest("hex").slice(0, 32);
}

function hasAuthCookies(cookieHeader: string): boolean {
  return /(?:^|;\s*)(__session|refresh_token)=/i.test(cookieHeader);
}

/**
 * Block cross-site mutating requests (basic CSRF defense for cookie sessions).
 * Safe methods are allowed without Origin (e.g. top-level navigations / SSR).
 */
export function assertSameOrigin(
  req: NextApiRequest,
  res: NextApiResponse,
): boolean {
  const method = (req.method || "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const host = req.headers.host;
  if (!host) {
    res.status(400).json({ message: "Missing host" });
    return false;
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const allowed = (value: string | undefined) => {
    if (!value) return false;
    try {
      return new URL(value).host === host;
    } catch {
      return false;
    }
  };

  // Prefer Origin; fall back to Referer for older clients.
  if (origin) {
    if (!allowed(origin)) {
      res.status(403).json({ message: "Cross-origin request blocked" });
      return false;
    }
    return true;
  }

  if (referer) {
    if (!allowed(referer)) {
      res.status(403).json({ message: "Cross-origin request blocked" });
      return false;
    }
    return true;
  }

  // No Origin/Referer on a state-changing request — reject.
  res.status(403).json({ message: "Missing origin" });
  return false;
}

async function fetchAdminStatus(
  cookieHeader: string,
  res: NextApiResponse,
): Promise<{ role: string; user: AdminUser | null }> {
  const key = cookieFingerprint(cookieHeader);
  const cached = statusCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return { role: cached.role, user: cached.user };
  }

  const base = getBackendBaseUrl();

  const callStatus = (cookies: string) =>
    fetch(`${base}/auth/status`, {
      method: "GET",
      headers: { Cookie: cookies, Accept: "application/json" },
    });

  let response = await callStatus(cookieHeader);

  // Access may be expired — rotate via public refresh, forward new cookies.
  if (response.status === 401 || response.status === 403) {
    const refreshRes = await fetch(`${base}/bff/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const setCookies =
      typeof refreshRes.headers.getSetCookie === "function"
        ? refreshRes.headers.getSetCookie()
        : [];
    if (setCookies.length > 0) {
      res.setHeader("Set-Cookie", setCookies);
    }

    if (!refreshRes.ok) {
      statusCache.set(key, {
        expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
        user: null,
        role: "",
      });
      return { role: "", user: null };
    }

    // Merge refreshed cookies into the jar for the status retry.
    let nextCookie = cookieHeader;
    for (const raw of setCookies) {
      const first = raw.split(";")[0]?.trim();
      if (!first || !first.includes("=")) continue;
      const eq = first.indexOf("=");
      const name = first.slice(0, eq);
      const value = first.slice(eq + 1);
      const re = new RegExp(`(?:^|;\\s*)${name}=[^;]*`, "i");
      if (re.test(nextCookie)) {
        nextCookie = nextCookie.replace(re, (m) =>
          m.startsWith(";") ? `; ${name}=${value}` : `${name}=${value}`,
        );
      } else {
        nextCookie = `${nextCookie}; ${name}=${value}`;
      }
    }

    response = await callStatus(nextCookie);
    // Gateway silent-refresh on status may also emit cookies.
    const statusCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];
    if (statusCookies.length > 0) {
      const existing = res.getHeader("Set-Cookie");
      const merged = [
        ...(Array.isArray(existing)
          ? existing.map(String)
          : existing
            ? [String(existing)]
            : []),
        ...statusCookies,
      ];
      res.setHeader("Set-Cookie", merged);
    }
  }

  if (!response.ok) {
    statusCache.set(key, {
      expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
      user: null,
      role: "",
    });
    return { role: "", user: null };
  }

  const data = (await response.json()) as Record<string, unknown>;
  const nested =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : null;

  const role = String(
    (typeof nested?.role === "string" && nested.role) ||
      (typeof data.role === "string" && data.role) ||
      "",
  ).toLowerCase();

  const user: AdminUser | null =
    nested || data.id || data.email
      ? {
          id:
            (typeof nested?.id === "string" && nested.id) ||
            (typeof data.id === "string" && data.id) ||
            undefined,
          email:
            (typeof nested?.email === "string" && nested.email) ||
            (typeof data.email === "string" && data.email) ||
            undefined,
          role: role || undefined,
        }
      : null;

  statusCache.set(key, {
    expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
    user,
    role,
  });

  return { role, user };
}

/**
 * Enforce same-origin (mutating) + real admin session before proxying.
 * Returns true when the request may proceed.
 */
export async function assertAdminApiAccess(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<boolean> {
  if (!assertSameOrigin(req, res)) {
    return false;
  }

  const cookieHeader = req.headers.cookie?.trim() || "";
  if (!cookieHeader || !hasAuthCookies(cookieHeader)) {
    res.status(401).json({ message: "Authentication required" });
    return false;
  }

  try {
    const { role, user } = await fetchAdminStatus(cookieHeader, res);
    if (role !== "admin") {
      res.status(403).json({
        message: "Admin role required",
        error: "Forbidden",
      });
      return false;
    }
    // Stash for handlers that want identity without a second status call.
    (req as NextApiRequest & { adminUser?: AdminUser | null }).adminUser = user;
    return true;
  } catch (error) {
    console.error("[assertAdminApiAccess] status check failed", error);
    res.status(401).json({ message: "Authentication required" });
    return false;
  }
}

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => unknown | Promise<unknown>;

/** Wrap a Next API handler with admin authn/authz + CSRF origin checks. */
export function withAdminApi(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    if (!(await assertAdminApiAccess(req, res))) {
      return;
    }
    return handler(req, res);
  };
}
