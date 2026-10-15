import type { NextApiRequest, NextApiResponse } from "next";

/** Route configuration enabling the body parser and allowing up to 60 seconds for the streaming proxy. */
export const config = {
  api: {
    bodyParser: true,
  },
  maxDuration: 60,
};

/**
 * Handles `POST /api/shopper/stream` — SSE proxy for the backend `/shopper/query/stream` endpoint.
 *
 * @remarks
 * Public, unauthenticated route. Responds with `Content-Type: text/event-stream; charset=utf-8` plus `Cache-Control: no-cache, no-transform`, `Connection: keep-alive` and `X-Accel-Buffering: no`, then forwards each upstream chunk with `res.write` until the stream ends. The backend base URL resolves from `API_BASE_URL`, then `NEXT_PUBLIC_API_BASE_URL`, then `http://localhost:8080`; the upstream fetch is aborted after 28 seconds and in development a non-OK upstream response is retried once against `http://localhost:8080`. Failures are reported inside the stream as an `event: error` frame (including a missing upstream body) rather than as HTTP error codes.
 *
 * @param req - The Next.js API request; must be a `POST` whose body is forwarded to the backend as JSON.
 * @param res - The Next.js API response; the SSE stream is written directly to it.
 * @returns A promise that resolves once the upstream stream has ended and the response is closed.
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

  const targetUrl = `${backendUrl.replace(/\/+$/, "")}/shopper/query/stream`;
  const bodyPayload =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const isDev =
    process.env.NODE_ENV !== "production" &&
    (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1"));

  try {
    let response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyPayload,
      signal: AbortSignal.timeout(28000),
    });

    if (!response.ok && isDev && backendUrl !== "http://localhost:8080") {
      response = await fetch("http://localhost:8080/shopper/query/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyPayload,
        signal: AbortSignal.timeout(5000),
      });
    }

    if (!response.body) {
      res.write('event: error\ndata: {"error": "No stream body received"}\n\n');
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    return res.end();
  } catch (err: unknown) {
    console.error("[shopper stream] Stream proxy error:", err);
    const isTimeout =
      err instanceof Error &&
      (err.name === "TimeoutError" || err.name === "AbortError");
    const msg = isTimeout
      ? "AI personal shopper service took too long to respond. Please try again."
      : err instanceof Error
        ? err.message
        : "Stream proxy error";
    res.write(`event: error\ndata: {"error": "${msg}"}\n\n`);
    return res.end();
  }
}
