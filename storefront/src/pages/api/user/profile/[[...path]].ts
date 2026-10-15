import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withUserApi } from "@/lib/requireUserApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const profilePath =
    segments.length > 0 ? `/${segments.join("/")}` : "/profile";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/users${profilePath}`,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user profile proxy] ${profilePath} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handles all HTTP methods on `/api/user/profile/[[...path]]` — an authenticated proxy to the backend `/users/*`.
 *
 * @remarks
 * Wrapped by {@link withUserApi}: the request must be same-origin (for mutating methods) and carry an auth cookie (`__session` or `refresh_token`), otherwise `401`/`403` is returned before the proxy runs. The catch-all segments are appended to `/users`, defaulting to `/users/profile` when the request has no sub-path. Upstream timeouts surface as a `504` from {@link proxyRequest}; any other proxy failure returns `500`.
 *
 * @param req - The Next.js API request; the catch-all `path` segments select the upstream `/users/*` resource.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default withUserApi(handler);
