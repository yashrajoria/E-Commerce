import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Missing mutation ID" });
  }

  const API_URL = getAdminApiBaseUrl();

  try {
    const response = await axios.post(
      `${API_URL}agent/mutations/${id}/confirm`,
      req.body,
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
      console.error(`[agent/mutations/${id}/confirm] proxy failed`, error.response?.status);
      return res.status(error.response?.status || 500).json(
        error.response?.data || {
          success: false,
          message: "Mutation confirmation failed",
        }
      );
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default withAdminApi(handler);
