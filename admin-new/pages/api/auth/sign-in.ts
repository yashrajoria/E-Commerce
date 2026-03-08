import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_AUTH_URL as string,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      },
    );

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    console.error("🔴 Auth proxy error:", error);
    const { status, data } = getResponseInfo(error);
    const message = typeof data === "object" && data !== null && "message" in data
      ? (data as { message?: string }).message
      : "Server error";
    return res.status(status || 500).json({ message });
  }
}
