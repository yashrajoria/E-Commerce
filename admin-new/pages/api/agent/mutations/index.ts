import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const API_URL = getAdminApiBaseUrl();

  try {
    const response = await axios.get(`${API_URL}agent/mutations/pending`, {
      headers: {
        Cookie: req.headers.cookie || "",
      },
      withCredentials: true,
      timeout: 10000,
    });

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("[agent/mutations] fetch failed", error.response?.status);
      return res.status(error.response?.status || 500).json({
        success: false,
        message: "Failed to fetch pending mutations",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default withAdminApi(handler);
