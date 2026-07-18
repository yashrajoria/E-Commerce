import type { NextApiRequest, NextApiResponse } from "next";

function hasAuthCookies(cookieHeader: string): boolean {
  return /(?:^|;\s*)(__session|refresh_token)=/i.test(cookieHeader);
}

/**
 * Basic CSRF defense for cookie-authenticated storefront APIs.
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
 * Require a session cookie jar before proxying user-scoped backend routes.
 * Authorization is still enforced by the API gateway JWT middleware.
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

export function withUserApi(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    if (!assertUserApiAccess(req, res)) {
      return;
    }
    return handler(req, res);
  };
}

/** Same-origin only — for guest-safe endpoints like promo validation. */
export function withSameOriginApi(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    if (!assertSameOrigin(req, res)) {
      return;
    }
    return handler(req, res);
  };
}
