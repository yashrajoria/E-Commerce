import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const queryTargets = [
  "bff/admin/agent/query",
  "bff/agent/query",
  "agent/query",
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
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
      console.error("[agent/query] proxy failed", error.response?.status);
      return res.status(error.response?.status || 500).json({
        success: false,
        message: "AI agent request failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected AI proxy error",
    });
  }
}

/**
 * Proxies `POST /api/agent/query` to the backend AI agent query endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Requires an authenticated cookie header and tries `bff/admin/agent/query`, then `bff/agent/query`, then `agent/query`,
 * advancing only while the previous target answers `404`. The JSON body is forwarded with a 28 second timeout.
 *
 * @param req - The Next.js API request; `req.body` is the agent query payload forwarded upstream.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the agent response has been relayed to the client.
 */
export default withAdminApi(handler);
