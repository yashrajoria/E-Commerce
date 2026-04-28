import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  try {
    const maskKeys = [
      "password",
      "confirmPassword",
      "passwordConfirm",
      "pass",
      "token",
      "code",
    ];
    if (Array.isArray(body)) {
      return body.map((item) => sanitizeBody(item));
    }

    const result = { ...(body as Record<string, unknown>) };
    for (const key of Object.keys(result)) {
      const value = result[key];
      if (maskKeys.includes(key)) {
        result[key] = "***REDACTED***";
      } else if (typeof value === "object") {
        result[key] = sanitizeBody(value);
      }
    }

    return result;
  } catch {
    return "<unserializable>";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pathParam = req.query.path;
  if (!pathParam) return res.status(400).json({ message: "Missing path" });

  const segments = Array.isArray(pathParam) ? pathParam : [pathParam];
  const targetPath = segments.join("/");

  try {
    console.debug("[BFF proxy] Incoming request", {
      method: req.method,
      targetPath,
      query: req.query,
      cookiePresent: !!req.headers.cookie,
    });
    console.debug("[BFF proxy] Sanitized request body:", sanitizeBody(req.body));

    const response = await proxyRequest({
      req,
      targetPath: `/bff/${targetPath}`,
      sanitizeSetCookie: true,
    });

    console.debug("[BFF proxy] Backend response status:", response.status);
    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("BFF proxy error:", err);
    return res.status(500).json({ message: "BFF proxy error" });
  }
}
