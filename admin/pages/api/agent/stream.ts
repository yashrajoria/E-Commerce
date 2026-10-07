import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!req.headers.cookie) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const API_URL = getAdminApiBaseUrl();
  const bodyPayload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

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
    res.write("event: error\ndata: {\"error\": \"Unable to connect to agent stream\"}\n\n");
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
