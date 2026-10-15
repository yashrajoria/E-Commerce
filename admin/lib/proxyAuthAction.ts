import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/** Paths of the actions proxied by {@link proxyAuthAction}, keyed by the public action name. */
const ACTION_TARGET: Record<string, string> = {
  login: "/auth/login",
  logout: "/auth/logout",
  // Gateway mounts /auth/refresh behind JWTMiddleware, so expired access
  // tokens cannot refresh there. Public BFF refresh only needs refresh_token.
  refresh: "/bff/auth/refresh",
  status: "/auth/status",
  "verify-otp": "/auth/verify-email",
  "resend-otp": "/auth/resend-otp",
};

const SUPPORTED = new Set(Object.keys(ACTION_TARGET));

/**
 * Checks whether an auth action has a configured backend target.
 *
 * @param action - Action name from the request URL, e.g. `"login"` or `"logout"`.
 * @returns `true` when {@link proxyAuthAction} can proxy the action, `false` otherwise.
 */
export function isSupportedAuthAction(action: string): boolean {
  return SUPPORTED.has(action);
}

/**
 * Proxies one auth action to its backend endpoint and forwards the response.
 *
 * @remarks
 * Single auth proxy used by `/api/admin/auth/*` and the legacy `/api/auth/*`
 * aliases. Set-Cookie headers and request bodies are sanitized by
 * `proxyRequest` before they are forwarded.
 *
 * @param action - Action name; must be a key of the internal action-to-path map.
 * @param req - The incoming Next.js API request.
 * @param res - The Next.js API response; receives the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export async function proxyAuthAction(
  action: string,
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const targetPath = ACTION_TARGET[action];
  if (!targetPath) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  try {
    const response = await proxyRequest({
      req,
      targetPath,
      sanitizeSetCookie: true,
      sanitizeRequestBody: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    res.status(response.status).send(response.body);
  } catch (error) {
    console.error(`[admin auth proxy] ${action} failed`, error);
    res.status(500).json({ message: "Auth proxy error" });
  }
}
