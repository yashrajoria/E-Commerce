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
      process.env.NEXT_PUBLIC_SIGNUP_URL as string,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const statusCode = response.status;
    console.log({ statusCode });
    if (statusCode == 409) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Forward the Set-Cookie header to the browser
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    // ✅ Send response only once
    return res.status(statusCode).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Auth proxy error:", error);
    return res
      .status(error.response?.status || 500)
      .json({ message: error.response?.data?.message || "Server error" });
  }
}
