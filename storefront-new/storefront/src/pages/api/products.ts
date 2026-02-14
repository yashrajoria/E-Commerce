import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Proxy API handler for /api/products
 * Forwards requests to backend at configured API base URL
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const apiBaseUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8080";
    const backendUrl = `${apiBaseUrl}/products${req.url?.replace("/api/products", "") || ""}`;

    // Filter out problematic headers that should not be forwarded
    const headersToForward = new Map(Object.entries(req.headers));
    headersToForward.delete("host");
    headersToForward.delete("connection");
    headersToForward.delete("content-length");
    headersToForward.delete("transfer-encoding");
    try {
      const host = new URL(apiBaseUrl).host;
      if (host) {
        headersToForward.set("host", host);
      }
    } catch {
      // If apiBaseUrl isn't a valid URL, skip host override
    }

    const headersObj: Record<string, string> = {};
    for (const [k, v] of headersToForward) {
      headersObj[k] = Array.isArray(v) ? v.join(",") : (v ?? "");
    }

    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: headersObj,
      body: ["GET", "HEAD", "OPTIONS"].includes(req.method || "")
        ? undefined
        : req.body
          ? typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body)
          : undefined,
    });

    res.status(backendRes.status);

    // Copy response headers (except hop-by-hop)
    backendRes.headers.forEach((value, name) => {
      if (
        ![
          "transfer-encoding",
          "connection",
          "content-encoding",
          "connection",
        ].includes(name.toLowerCase())
      ) {
        res.setHeader(name, value);
      }
    });

    const body = await backendRes.text();
    res.send(body);
  } catch (error) {
    console.error("[/api/products] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
