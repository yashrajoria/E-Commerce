import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";

/** Route configuration — keeps the default body parser enabled so the query payload arrives as `req.body`. */
export const config = {
  api: {
    bodyParser: true,
  },
};

const streamTargets = [
  "bff/admin/agent/query/stream",
  "bff/agent/query/stream",
  "agent/query/stream",
];

/**
 * Streams the AI agent query response as Server-Sent Events at `POST /api/agent/stream`.
 *
 * @remarks
 * Opens the backend stream from `bff/admin/agent/query/stream`, `bff/agent/query/stream`, or `agent/query/stream`
 * (first reachable target wins), then pipes every chunk to the client with `res.write` so events are flushed as they
 * arrive. Responds with `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform`,
 * `Connection: keep-alive`, and `X-Accel-Buffering: no`. When no upstream stream can be opened it emits a single
 * `error` Server-Sent Event and ends the response. Not wrapped in `withAdminApi`; it enforces its own cookie check.
 *
 * @param req - The Next.js API request; requires an authenticated cookie header, and `req.body` is forwarded verbatim to the upstream stream.
 * @param res - The Next.js API response, written to incrementally and ended once the upstream stream completes.
 * @returns A promise that resolves once the upstream stream has been drained and the response ended.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  if (!req.headers.cookie) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  const API_URL = getAdminApiBaseUrl();
  const bodyPayload =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  let streamRes: Response | null = null;

  for (const target of streamTargets) {
    try {
      const response = await fetch(`${API_URL}${target}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        body: bodyPayload,
      });

      if (response.ok && response.body) {
        streamRes = response;
        break;
      }
    } catch {
      // try next target
    }
  }

  if (!streamRes || !streamRes.body) {
    res.write(
      'event: error\ndata: {"error": "Unable to connect to agent stream"}\n\n',
    );
    return res.end();
  }

  const reader = streamRes.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }
  } catch (err: unknown) {
    console.error("[agent/stream] reading stream chunk failed", err);
  }

  return res.end();
}
