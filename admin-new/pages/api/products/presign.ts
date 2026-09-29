import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { backendUrl } from "@/lib/backend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sku = (req.query.sku as string) || undefined;
    const cookie = req.headers.cookie || "";

    const url = sku
      ? backendUrl(`products/presign?sku=${encodeURIComponent(sku)}`)
      : backendUrl("products/presign");

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Presign proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Server error" });
  }
}
