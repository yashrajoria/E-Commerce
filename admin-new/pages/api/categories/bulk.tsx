import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { getResponseInfo } from "@/lib/error";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const API_URL =
    process.env.NEXT_PUBLIC_NEW_API_URL || "http://localhost:8080/";

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookieHeader = req.headers.cookie;
  const cookie = cookieHeader
    ? cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("__session=") || c.startsWith("token="))
    : undefined;

  const items = req.body?.items;
  if (!Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "Invalid payload: items array required" });
  }

  // Try backend bulk endpoint first
  try {
    const target = `${API_URL}categories/bulk`;
    const resp = await axios.post(
      target,
      { items },
      {
        headers: { "Content-Type": "application/json", Cookie: cookie || "" },
        withCredentials: true,
      },
    );
    return res.status(resp.status).json(resp.data);
  } catch (err: unknown) {
    // If bulk endpoint not available, fall back to creating items one by one
    const { status: respStatus } = getResponseInfo(err);
    if (respStatus === 404 || respStatus === 405) {
      const results: Array<{ status: number; data?: unknown; error?: unknown }> = [];
      for (const it of items) {
        try {
          const r = await axios.post(`${API_URL}categories/`, it, {
            headers: {
              "Content-Type": "application/json",
              Cookie: cookie || "",
            },
            withCredentials: true,
          });
          results.push({ status: r.status, data: r.data });
        } catch (e: unknown) {
          const { status: s, data: errData } = getResponseInfo(e);
          results.push({ status: s ?? 500, error: errData ?? (e instanceof Error ? e.message : String(e)) });
        }
      }
      return res.status(207).json({ results });
    }

    const { status, data } = getResponseInfo(err);
    return res.status(status ?? 500).json(data ?? { message: "Bulk upload failed" });
  }
}
