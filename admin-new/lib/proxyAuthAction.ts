import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

const ACTION_TARGET: Record<string, string> = {
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  status: "/auth/status",
  "verify-otp": "/auth/verify-email",
  "resend-otp": "/auth/resend-otp",
};

const SUPPORTED = new Set(Object.keys(ACTION_TARGET));

export function isSupportedAuthAction(action: string): boolean {
  return SUPPORTED.has(action);
}

/** Single auth proxy used by /api/admin/auth/* and legacy /api/auth/* aliases. */
export async function proxyAuthAction(
  action: string,
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const targetPath = ACTION_TARGET[action];
  if (!targetPath) {
    res.status(404).json({ message: "Not found" });
    return;
  }

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

    res.status(response.status).send(response.body);
  } catch (error) {
    console.error(`[admin auth proxy] ${action} failed`, error);
    res.status(500).json({ message: "Auth proxy error" });
  }
}
