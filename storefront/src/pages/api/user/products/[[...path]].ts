import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/**
 * Handles all HTTP methods on `/api/user/products/[[...path]]` — a public read proxy to the backend `/products/*`.
 *
 * @remarks
 * No auth cookie is required; the query string is forwarded unchanged. Upstream timeouts surface as a `504` from {@link proxyRequest}, and any other proxy failure returns `500`. The legacy `/api/products` path re-exports this handler.
 *
 * @param req - The Next.js API request; the catch-all `path` segments are appended to `/products`.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const productPath = segments.length > 0 ? `/${segments.join("/")}` : "";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/products${productPath}`,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user products proxy] ${productPath || "/"} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
