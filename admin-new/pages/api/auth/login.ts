import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { password: _password, ...sanitizedBody } =
      (req.body || {}) as Record<string, unknown>;
    console.debug("[login proxy] Request body (sanitized):", sanitizedBody);
    console.debug("[login proxy] Incoming cookies:", req.headers.cookie || "<none>");

    const response = await proxyRequest({
      req,
      targetPath: "/auth/login",
      sanitizeSetCookie: true,
    });

    console.debug("[login proxy] Backend response status:", response.status);
    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("Auth proxy error (login):", err);
    return res.status(500).json({ message: "Auth error" });
  }
}
