import type { NextApiRequest, NextApiResponse } from "next";
import { proxyAuthAction } from "@/lib/proxyAuthAction";

/**
 * Handles `GET` requests on the legacy `/api/auth/status` alias, proxying to the upstream `/auth/status` route.
 *
 * @deprecated Prefer `/api/admin/auth/status`.
 * @param req - The Next.js API request; the session cookies are forwarded upstream.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied response has been relayed.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  return proxyAuthAction("status", req, res);
}
