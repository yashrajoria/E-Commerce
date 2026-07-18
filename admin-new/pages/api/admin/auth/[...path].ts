import type { NextApiRequest, NextApiResponse } from "next";
import {
  isSupportedAuthAction,
  proxyAuthAction,
} from "@/lib/proxyAuthAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const actionPath = segments.join("/");

  if (!actionPath || !isSupportedAuthAction(actionPath)) {
    return res.status(404).json({ message: "Not found" });
  }

  return proxyAuthAction(actionPath, req, res);
}
