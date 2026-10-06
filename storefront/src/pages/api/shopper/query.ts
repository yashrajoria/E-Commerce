import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const backendUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080";

  const targetUrl = `${backendUrl.replace(/\/+$/, "")}/shopper/query`;
  const bodyPayload =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyPayload,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.warn(`[shopper proxy] Failed to reach ${targetUrl}, trying fallback to localhost:8080`, error);
    try {
      const fbResponse = await fetch("http://localhost:8080/shopper/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyPayload,
      });
      const data = await fbResponse.json();
      return res.status(fbResponse.status).json(data);
    } catch (fallbackErr) {
      console.error("[shopper proxy] Fallback to localhost:8080 failed as well", fallbackErr);
      return res.status(500).json({ error: "AI personal shopper service unreachable" });
    }
  }
}
