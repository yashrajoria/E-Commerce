import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

const queryTargets = ["agent/query"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    let response;
    let lastError: unknown = null;

    for (const target of queryTargets) {
      try {
        response = await axios.post(`${API_URL}${target}`, req.body, {
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          withCredentials: true,
          timeout: 28000,
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
        message: "AI agent request failed",
        error: error.response?.data ?? error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected AI proxy error",
    });
  }
}
