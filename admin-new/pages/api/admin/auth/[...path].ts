import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

const SUPPORTED_AUTH_PATHS = new Set([
  "login",
  "logout",
  "refresh",
  "register",
  "status",
  "verify-otp",
  "resend-otp",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const actionPath = segments.join("/");

  if (!actionPath || !SUPPORTED_AUTH_PATHS.has(actionPath)) {
    return res.status(404).json({ message: "Not found" });
  }

  const targetPath =
    actionPath === "verify-otp"
      ? "/auth/verify-email"
      : actionPath === "register"
        ? "/auth/register"
        : actionPath === "resend-otp"
          ? "/auth/resend-otp"
          : `/auth/${actionPath}`;

  try {
    const response = await proxyRequest({
      req,
      targetPath,
      sanitizeSetCookie: true,
      sanitizeRequestBody: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (error) {
    console.error(`[admin auth proxy] ${actionPath} failed`, error);
    return res.status(500).json({ message: "Auth proxy error" });
  }
}
