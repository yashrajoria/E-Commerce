import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { assertSameOrigin, assertUserApiAccess } from "@/lib/requireUserApi";

/**
 * Storefront promotions proxy.
 * - POST /api/user/promotions/validate → public validate (guests allowed)
 * - GET  /api/user/promotions/:code   → authenticated lookup
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const isValidate =
    req.method === "POST" && segments.length === 1 && segments[0] === "validate";

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

export default handler;
