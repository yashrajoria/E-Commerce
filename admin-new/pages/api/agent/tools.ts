import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";

const toolsTargets = ["bff/admin/agent/tools", "bff/agent/tools"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!req.headers.cookie) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const API_URL = getAdminApiBaseUrl();

  try {
    let response;
    let lastError: unknown = null;

    for (const target of toolsTargets) {
      try {
        response = await axios.get(`${API_URL}${target}`, {
          headers: {
            Cookie: req.headers.cookie || "",
          },
          withCredentials: true,
          timeout: 15000,
        });
        break;
      } catch (error) {
        lastError = error;
        if (!axios.isAxiosError(error) || error.response?.status !== 404) {
          throw error;
        }
      }
    }

    if (!response) {
      throw lastError;
    }

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("[agent/tools] proxy failed", error.response?.status);
      return res.status(error.response?.status || 500).json({
        success: false,
        message: "Failed to load AI tools",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected AI tools proxy error",
    });
  }
}
