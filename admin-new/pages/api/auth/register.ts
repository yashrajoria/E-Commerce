import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.debug("register called", {
    body: sanitizeForLog(req.body),
    cookiePresent: !!req.headers.cookie,
  });

  const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;
  if (!API_URL) {
    return res.status(500).json({ message: "NEXT_PUBLIC_NEW_API_URL is not configured" });
  }

  try {
    const modifiedReq = {
      ...req,
      body:
        typeof req.body === "string"
          ? JSON.stringify({ ...JSON.parse(req.body), role: "admin" })
          : { ...req.body, role: "admin" },
    };

    const response = await proxyRequest({
      req: modifiedReq as unknown as NextApiRequest,
      targetPath: "/bff/admin/users",
      sanitizeSetCookie: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    console.debug("[register] backend response", { status: response.status });
    console.debug("[register] backend response body", { body: response });
    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("Register proxy error:", err);
    return res.status(500).json({ message: "Registration failed" });
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
