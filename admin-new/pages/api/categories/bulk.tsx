import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL || "http://localhost:8080/";

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
    return res.status(400).json({ message: "Invalid payload: items array required" });
  }

  // Try backend bulk endpoint first
  try {
    const target = `${API_URL}categories/bulk`;
    const resp = await axios.post(target, { items }, {
      headers: { "Content-Type": "application/json", Cookie: cookie || "" },
      withCredentials: true,
    });
    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    // If bulk endpoint not available, fall back to creating items one by one
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const results: any[] = [];
      for (const it of items) {
        try {
          const r = await axios.post(`${API_URL}categories/`, it, {
            headers: { "Content-Type": "application/json", Cookie: cookie || "" },
            withCredentials: true,
          });
          results.push({ status: r.status, data: r.data });
        } catch (e: any) {
          results.push({ status: e?.response?.status || 500, error: e?.response?.data || e.message });
        }
      }
      return res.status(207).json({ results });
    }

    const status = err?.response?.status || 500;
    const data = err?.response?.data || { message: "Bulk upload failed" };
    return res.status(status).json(data);
  }
}
