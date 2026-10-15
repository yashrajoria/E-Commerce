import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withUserApi } from "@/lib/requireUserApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.path;
  const parts = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const subPath = parts.length > 0 ? `/${parts.join("/")}` : "";
  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/store-credit${subPath}`,
    });
    for (const [key, value] of Object.entries(proxied.headers)) {
      res.setHeader(key, value);
    }
    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user store credit proxy] ${subPath || "/"} failed`, error);
    return res.status(502).json({ error: "Store credit service unavailable" });
  }
}

/**
 * Handles all HTTP methods on `/api/user/store-credit/[[...path]]` — authenticated proxy to the backend `/store-credit/*`.
 *
 * @remarks
 * Wrapped by {@link withUserApi}: the request must be same-origin (for mutating methods) and carry an auth cookie (`__session` or `refresh_token`), otherwise `401`/`403` is returned before the proxy runs. Upstream timeouts surface as a `504` from {@link proxyRequest}; any other proxy failure returns `502` with a store-credit-specific error message.
 *
 * @param req - The Next.js API request; the catch-all `path` segments are appended to `/store-credit` and the query string is forwarded.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default withUserApi(handler);
