import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const API_URL = getAdminApiBaseUrl();

  try {
    const response = await axios.post(
      `${API_URL}agent/watchdog/scan`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
        timeout: 15000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("[agent/watchdog/scan] trigger failed", error.response?.status);
      return res.status(error.response?.status || 500).json({
        success: false,
        message: "Watchdog scan failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default withAdminApi(handler);
