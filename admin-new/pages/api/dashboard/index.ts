import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // The Gateway routes anything starting with /bff directly down to the BFF service.
    // The admin routes in the BFF require JWT authentication and AdminRole middleware.
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}bff/admin/dashboard`,
      {
        headers: {
          cookie: req.headers.cookie || "", // Pass cookies for JWT auth
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Dashboard proxy error:",
        error.response?.data || error.message
      );
      return res.status(error.response?.status || 500).json({
        success: false,
        error: error.response?.data || "Internal server error",
      });
    }

    console.error("Dashboard proxy unexpected error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
