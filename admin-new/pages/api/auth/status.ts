import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.debug("[status proxy] Incoming cookies:", req.headers.cookie || "<none>");

    const response = await proxyRequest({
      req,
      targetPath: "/auth/status",
      sanitizeSetCookie: true,
    });

    console.debug("[status proxy] Backend response status:", response.status);
    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("Auth proxy error (status):", err);
    return res.status(500).json({ message: "Auth status error" });
  }
}
