import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log(req.body, "REQ BODY");
  console.log(req.headers.cookie, "COOKIE");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}user/auth/verify-email`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      }
    );

    return res.status(response.status).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Auth proxy error:", error);
    return res
      .status(error.response?.status || 500)
      .json({ message: error.response?.data?.message || "Server error" });
  }
}
