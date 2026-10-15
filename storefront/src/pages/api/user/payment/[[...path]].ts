import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withUserApi } from "@/lib/requireUserApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const paymentPath = segments.length > 0 ? `/${segments.join("/")}` : "";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/payment${paymentPath}`,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user payment proxy] ${paymentPath || "/"} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handles all HTTP methods on `/api/user/payment/[[...path]]` — an authenticated proxy to the backend `/payment/*`.
 *
 * @remarks
 * Wrapped by {@link withUserApi}: the request must be same-origin (for mutating methods) and carry an auth cookie (`__session` or `refresh_token`), otherwise `401`/`403` is returned before the proxy runs. Upstream timeouts surface as a `504` from {@link proxyRequest}; any other proxy failure returns `500`.
 *
 * @param req - The Next.js API request; the catch-all `path` segments are appended to `/payment` and the query string is forwarded.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default withUserApi(handler);
