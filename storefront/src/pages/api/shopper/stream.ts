import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true,
  },
};

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

  try {
    let response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyPayload,
    });

    if (!response.ok && backendUrl !== "http://localhost:8080") {
      response = await fetch("http://localhost:8080/shopper/query/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyPayload,
      });
    }

    if (!response.body) {
      res.write("event: error\ndata: {\"error\": \"No stream body received\"}\n\n");
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
  } catch (err: any) {
    console.error("[shopper stream] Stream proxy error:", err);
    res.write(`event: error\ndata: {"error": "${err?.message || "Stream proxy error"}"}\n\n`);
    return res.end();
  }
}
