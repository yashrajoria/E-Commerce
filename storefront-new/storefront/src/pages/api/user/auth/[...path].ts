import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

const SUPPORTED_AUTH_PATHS = new Set([
  "login",
  "logout",
  "refresh",
  "register",
  "status",
  "verify-email",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const actionPath = segments.join("/");

  if (!actionPath || !SUPPORTED_AUTH_PATHS.has(actionPath)) {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    // Refresh must hit the public BFF route — gateway `/auth/refresh` requires
    // a valid access JWT, which is already expired when refresh is needed.
    const targetPath =
      actionPath === "refresh" ? "/bff/auth/refresh" : `/auth/${actionPath}`;

    const proxied = await proxyRequest({
      req,
      targetPath,
      sanitizeSetCookie: true,
      sanitizeRequestBody: true,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user auth proxy] ${actionPath} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
