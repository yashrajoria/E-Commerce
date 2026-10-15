import type { NextApiRequest, NextApiResponse } from "next";

/** Route configuration allowing up to 30 seconds for the shopper query proxy. */
export const config = {
  maxDuration: 30,
};

/**
 * Handles `POST /api/shopper/query` — proxies the AI personal shopper query to the backend `/shopper/query` endpoint.
 *
 * @remarks
 * Public, unauthenticated route. The backend base URL resolves from `API_BASE_URL`, then `NEXT_PUBLIC_API_BASE_URL`, then `http://localhost:8080`. The upstream call is aborted after 25 seconds; in development a failed call is retried once against `http://localhost:8080` before giving up. When the service cannot be reached the route replies `504` with a customer-friendly error instead of propagating the failure.
 *
 * @param req - The Next.js API request; must be a `POST` whose body is forwarded to the backend as JSON.
 * @param res - The Next.js API response; mirrors the upstream status code and JSON body.
 * @returns A promise that resolves once the response has been sent.
 */
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

  const isDev =
    process.env.NODE_ENV !== "production" &&
    (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1"));

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyPayload,
      signal: AbortSignal.timeout(25000),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (isDev && targetUrl !== "http://localhost:8080/shopper/query") {
      console.warn(
        `[shopper proxy] Failed to reach ${targetUrl}, trying local fallback`,
        error,
      );
      try {
        const fbResponse = await fetch("http://localhost:8080/shopper/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyPayload,
          signal: AbortSignal.timeout(5000),
        });
        const data = await fbResponse.json();
        return res.status(fbResponse.status).json(data);
      } catch (fallbackErr) {
        console.error(
          "[shopper proxy] Fallback to localhost:8080 failed",
          fallbackErr,
        );
      }
    }

    console.error(`[shopper proxy] Failed to reach ${targetUrl}:`, error);
    return res.status(504).json({
      error:
        "AI personal shopper service is temporarily unavailable or taking too long to respond. Please try again shortly.",
    });
  }
}
