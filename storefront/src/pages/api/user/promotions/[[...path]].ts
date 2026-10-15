import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { assertSameOrigin, assertUserApiAccess } from "@/lib/requireUserApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const isValidate =
    req.method === "POST" &&
    segments.length === 1 &&
    segments[0] === "validate";

  if (isValidate) {
    if (!assertSameOrigin(req, res)) return;
  } else if (!assertUserApiAccess(req, res)) {
    return;
  }

  let targetPath = "/coupons";
  if (isValidate) {
    targetPath = "/coupons/validate";
  } else if (segments.length > 0) {
    targetPath = `/coupons/${segments.map(encodeURIComponent).join("/")}`;
  }

  try {
    const proxied = await proxyRequest({
      req,
      targetPath,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user promotions proxy] ${targetPath} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handles all HTTP methods on `/api/user/promotions/<path>` — proxies coupon requests to the backend `/coupons/*`.
 *
 * @remarks
 * `POST /api/user/promotions/validate` is guest-safe: it only requires a same-origin request and proxies to `/coupons/validate`. Every other path requires a same-origin request plus an auth cookie and proxies to `/coupons/<encoded segments>` (or `/coupons` when no sub-path is given). Upstream timeouts surface as a `504` from {@link proxyRequest}; any other proxy failure returns `500`.
 *
 * @param req - The Next.js API request; the method and the catch-all `path` segments decide the upstream coupon endpoint.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default handler;
