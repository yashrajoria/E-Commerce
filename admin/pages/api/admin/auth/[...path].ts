import type { NextApiRequest, NextApiResponse } from "next";
import { isSupportedAuthAction, proxyAuthAction } from "@/lib/proxyAuthAction";

/**
 * Handles `/api/admin/auth/*` requests, forwarding supported auth actions to the backend auth gateway.
 *
 * @remarks
 * The catch-all `path` segment selects the action while the incoming HTTP method, query string and body are preserved. Supported actions: `login` (`/auth/login`), `logout` (`/auth/logout`), `refresh` (`/bff/auth/refresh`), `status` (`/auth/status`), `verify-otp` (`/auth/verify-email`) and `resend-otp` (`/auth/resend-otp`). Unknown or missing actions return `404`; top-level `role` fields are stripped from JSON bodies and `Set-Cookie` headers are sanitized by {@link proxyAuthAction}.
 *
 * @param req - The Next.js API request; `req.query.path` holds the auth action segments.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied response has been relayed.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const actionPath = segments.join("/");

  if (!actionPath || !isSupportedAuthAction(actionPath)) {
    return res.status(404).json({ message: "Not found" });
  }

  return proxyAuthAction(actionPath, req, res);
}
