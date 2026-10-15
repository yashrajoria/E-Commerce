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

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Missing mutation ID" });
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
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        `[agent/mutations/${id}/confirm] proxy failed`,
        error.response?.status,
      );
      return res.status(error.response?.status || 500).json(
        error.response?.data || {
          success: false,
          message: "Mutation confirmation failed",
        },
      );
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Proxies `POST /api/agent/mutations/[id]/confirm` to the backend `POST agent/mutations/{id}/confirm` endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Forwards the JSON body and the incoming cookies, with a 15 second upstream timeout.
 *
 * @param req - The Next.js API request; `req.query.id` is the mutation ID and `req.body` is the confirmation payload.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the upstream status and body have been relayed to the client.
 */
export default withAdminApi(handler);
