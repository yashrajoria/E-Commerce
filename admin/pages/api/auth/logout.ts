import type { NextApiRequest, NextApiResponse } from "next";
import { proxyAuthAction } from "@/lib/proxyAuthAction";

/** @deprecated Prefer /api/admin/auth/logout */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return proxyAuthAction("logout", req, res);
}
