import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { getResponseInfo } from "@/lib/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Safe log for endpoint call
  console.debug('verify-otp called', { body: sanitizeForLog(req.body), cookiePresent: !!req.headers.cookie });

  try {
    const response = await proxyRequest({
      req,
      targetPath: "/auth/verify-email",
      sanitizeSetCookie: true,
    });

    console.debug('[verify-otp] backend response', { status: response.status });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (error: unknown) {
    console.error("OTP verification error:", error);
    const { status, data } = getResponseInfo(error);
    return res.status(status || 500).json({ message: data ?? "OTP verification failed" });
  }
}

function sanitizeForLog(body: unknown) {
  if (!body || typeof body !== "object") return body;
  try {
    const copy = { ...(body as Record<string, unknown>) };
    if ("password" in copy) copy.password = "***REDACTED***";
    if ("code" in copy) copy.code = "***REDACTED***";
    return copy;
  } catch {
    return "<unserializable>";
  }
}
