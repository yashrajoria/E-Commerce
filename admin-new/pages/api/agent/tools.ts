import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

const toolsTargets = ["bff/admin/agent/tools", "bff/agent/tools"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

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
      return res.status(error.response?.status || 500).json({
        success: false,
        message: "Failed to load AI tools",
        error: error.response?.data ?? error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected AI tools proxy error",
    });
  }
}
