import type { NextApiRequest, NextApiResponse } from "next";

function hasAuthCookies(cookieHeader: string): boolean {
  return /(?:^|;\s*)(__session|refresh_token)=/i.test(cookieHeader);
}

/**
 * Basic CSRF defense for cookie-authenticated storefront APIs: state-changing
 * requests must carry an `Origin` or `Referer` header whose host matches the request host.
 *
 * @param req - The Next.js API request being guarded.
 * @param res - The Next.js API response, used to send 400/403 when the check fails.
 * @returns `true` when the request is same-origin (or a safe method); otherwise `false` after responding with an error.
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
    res.status(400).json({ error: "Missing host" });
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

  if (origin) {
    if (!allowed(origin)) {
      res.status(403).json({ error: "Cross-origin request blocked" });
      return false;
    }
    return true;
  }

  if (referer) {
    if (!allowed(referer)) {
      res.status(403).json({ error: "Cross-origin request blocked" });
      return false;
    }
    return true;
  }

  res.status(403).json({ error: "Missing origin" });
  return false;
}

/**
 * Requires a same-origin request carrying a session cookie jar before proxying
 * user-scoped backend routes. Authorization is still enforced by the API
 * gateway JWT middleware.
 *
 * @param req - The Next.js API request being guarded.
 * @param res - The Next.js API response, used to send 401/403 when the check fails.
 * @returns `true` when the request is same-origin and carries `__session` or `refresh_token` cookies; otherwise `false` after responding with an error.
 */
export function assertUserApiAccess(
  req: NextApiRequest,
  res: NextApiResponse,
): boolean {
  if (!assertSameOrigin(req, res)) {
    return false;
  }

  const cookieHeader = req.headers.cookie?.trim() || "";
  if (!cookieHeader || !hasAuthCookies(cookieHeader)) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }

  return true;
}

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => unknown | Promise<unknown>;

/**
 * Wraps an API handler so it only runs for authenticated, same-origin requests.
 *
 * @param handler - The route handler to protect.
 * @returns An async handler that replies with 401/403 and skips `handler` when {@link assertUserApiAccess} fails.
 */
export function withUserApi(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    if (!assertUserApiAccess(req, res)) {
      return;
    }
    return handler(req, res);
  };
}

/**
 * Wraps an API handler so it only runs for same-origin requests — for
 * guest-safe endpoints like promo validation.
 *
 * @param handler - The route handler to protect.
 * @returns An async handler that replies with 403 and skips `handler` when {@link assertSameOrigin} fails.
 */
export function withSameOriginApi(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    if (!assertSameOrigin(req, res)) {
      return;
    }
    return handler(req, res);
  };
}
