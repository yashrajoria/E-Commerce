import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const toolsTargets = ["bff/admin/agent/tools", "bff/agent/tools"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  if (!req.headers.cookie) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
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
      const status = error.response?.status;
      if (
        status === 502 ||
        status === 503 ||
        status === 504 ||
        !error.response
      ) {
        return res.status(200).json({
          success: true,
          data: { tools: [] },
          tools: [],
        });
      }
      console.error("[agent/tools] proxy failed", status);
      return res.status(status || 500).json({
        success: false,
        message: "Failed to load AI tools",
      });
    }

    return res.status(200).json({
      success: true,
      data: { tools: [] },
      tools: [],
    });
  }
}

/**
 * Proxies `GET /api/agent/tools` to the backend agent tool catalogue endpoints.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Tries `bff/admin/agent/tools` then `bff/agent/tools`, advancing only on `404`. If the backend is unreachable
 * (`502`/`503`/`504` or no response) or an unexpected error occurs, it answers `200` with an empty tool list so the UI
 * can still render.
 *
 * @param req - The Next.js API request. Must be a `GET`; no query parameters or body are read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the tool list or the empty fallback has been sent.
 */
export default withAdminApi(handler);
