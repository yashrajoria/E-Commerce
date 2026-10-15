import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/** Whitelisted auth actions proxied by this catch-all route. */
const SUPPORTED_AUTH_PATHS = new Set([
  "login",
  "logout",
  "refresh",
  "register",
  "guest",
  "status",
  "verify-email",
  "resend-verification",
]);

/**
 * Handles all HTTP methods on `/api/user/auth/<action>` — a public proxy for the storefront's authentication flows.
 *
 * @remarks
 * Public route: these endpoints issue and renew the session, so no auth cookie is required. Only actions listed in {@link SUPPORTED_AUTH_PATHS} are proxied; anything else yields `404`. Requests are forwarded to `/auth/<action>` on the API gateway, except `refresh`, which targets the public `/bff/auth/refresh` route because gateway `/auth/refresh` would require an access JWT that is already expired. `sanitizeSetCookie` rewrites proxied `Set-Cookie` headers (Domain removed, `Path=/` enforced) and `sanitizeRequestBody` strips client-supplied `role` fields from the body.
 *
 * @param req - The Next.js API request; the catch-all `path` segment selects the auth action to proxy.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const actionPath = segments.join("/");

  if (!actionPath || !SUPPORTED_AUTH_PATHS.has(actionPath)) {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    // Refresh must hit the public BFF route — gateway `/auth/refresh` requires
    // a valid access JWT, which is already expired when refresh is needed.
    const targetPath =
      actionPath === "refresh" ? "/bff/auth/refresh" : `/auth/${actionPath}`;

    const proxied = await proxyRequest({
      req,
      targetPath,
      sanitizeSetCookie: true,
      sanitizeRequestBody: true,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user auth proxy] ${actionPath} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
