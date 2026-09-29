import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/**
 * Same-origin proxy for BFF routes (e.g. /api/bff/auth/resend-verification).
 * Forwards to the backend gateway so HttpOnly session cookies stay intact.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pathParam = req.query.path;
  if (!pathParam) return res.status(400).json({ message: "Missing path" });

  const segments = Array.isArray(pathParam) ? pathParam : [pathParam];
  const targetPath = segments.join("/");

  try {
    const response = await proxyRequest({
      req,
      targetPath: `/bff/${targetPath}`,
      sanitizeSetCookie: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("BFF proxy error:", err);
    return res.status(500).json({ message: "BFF proxy error" });
  }
}
