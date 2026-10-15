import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
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
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "[agent/watchdog/scan] trigger failed",
        error.response?.status,
      );
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

/**
 * Triggers a backend agent watchdog scan at `POST /api/agent/watchdog/scan`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Sends an empty JSON body to the upstream `POST agent/watchdog/scan` endpoint with the incoming cookies and a
 * 15 second timeout.
 *
 * @param req - The Next.js API request. Must be a `POST`; the request body is not read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the scan result has been relayed to the client.
 */
export default withAdminApi(handler);
