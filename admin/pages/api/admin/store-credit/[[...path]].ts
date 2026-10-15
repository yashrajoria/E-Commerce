import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

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
    console.error(`[admin store credit proxy] ${subPath || "/"} failed`, error);
    return res.status(502).json({ error: "Store credit service unavailable" });
  }
}

/**
 * Handles any HTTP method on `/api/admin/store-credit/*`, proxying to the upstream `/store-credit{path}` route.
 *
 * @remarks
 * The optional catch-all `path` segments are appended to the upstream path (for example `/api/admin/store-credit/balance` proxies to `/store-credit/balance`); the incoming method, query string and body are forwarded, upstream responses are relayed verbatim (including their status) and errors thrown while proxying surface as `502`. Wrapped with {@link withAdminApi}: requests must pass a same-origin check and carry a valid admin session.
 *
 * @param req - The Next.js API request; `req.query.path` selects the upstream sub-path.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the upstream response has been sent.
 */
export default withAdminApi(handler);
