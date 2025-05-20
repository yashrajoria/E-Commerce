import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        },
        withCredentials: true,
      }
    );

    // ✅ Forward the Set-Cookie header to the browser
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    res.status(response.status).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Auth proxy error:", error);
    res
      .status(error.response?.status || 500)
      .json({ message: error.response?.data?.message || "Server error" });
  }
}
