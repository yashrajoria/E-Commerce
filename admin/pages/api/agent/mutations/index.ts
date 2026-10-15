import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
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

/**
 * Proxies `GET /api/agent/mutations` to the backend `GET agent/mutations/pending` endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Returns the list of pending agent mutations using the incoming cookies, with a 10 second upstream timeout.
 *
 * @param req - The Next.js API request. Must be a `GET`; no query parameters or body are read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the pending mutations payload has been sent.
 */
export default withAdminApi(handler);
