import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    console.error("🔴 Auth proxy error:", error);
    const status =
      typeof error === "object" && error !== null && "response" in error
        ? (error as any).response?.status
        : 500;
    const message =
      typeof error === "object" && error !== null && "response" in error
        ? (error as any).response?.data?.message
        : "Server error";
    return res.status(status || 500).json({ message });
  }
}
