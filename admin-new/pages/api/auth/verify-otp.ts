import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log(req.body, "REQ BODY");
  console.log(req.headers.cookie, "COOKIE");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}auth/verify-email`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      },
    );

    return res.status(response.status).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.status
          : 500;
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data
          : "OTP verification failed";
      return res.status(status || 500).json({ message });
  }
}
