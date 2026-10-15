import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const getSessionTargets = (sessionId: string) => [
  `bff/admin/agent/session/${encodeURIComponent(sessionId)}`,
  `bff/agent/session/${encodeURIComponent(sessionId)}`,
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (typeof session_id !== "string" || !session_id.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid session id" });
  }

  if (!req.headers.cookie) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  const API_URL = getAdminApiBaseUrl();

  try {
    if (req.method === "GET") {
      let response;
      let lastError: unknown = null;

      for (const target of getSessionTargets(session_id)) {
        try {
          response = await axios.get(`${API_URL}${target}`, {
            headers: {
              Cookie: req.headers.cookie || "",
            },
            withCredentials: true,
            timeout: 20000,
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
        if (
          axios.isAxiosError(lastError) &&
          lastError.response?.status === 404
        ) {
          return res.status(200).json({
            success: true,
            session_id,
            messages: [],
            history: [],
          });
        }
        throw lastError;
      }

      return res.status(response.status).json(response.data);
    }

    if (req.method === "DELETE") {
      let response;
      let lastError: unknown = null;

      for (const target of getSessionTargets(session_id)) {
        try {
          response = await axios.delete(`${API_URL}${target}`, {
            headers: {
              Cookie: req.headers.cookie || "",
            },
            withCredentials: true,
            timeout: 20000,
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
        if (
          axios.isAxiosError(lastError) &&
          lastError.response?.status === 404
        ) {
          return res.status(200).json({
            success: true,
            session_id,
            cleared: true,
          });
        }
        throw lastError;
      }

      return res.status(response.status).json(response.data);
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const isUnreachable =
        status === 404 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        !error.response;

      if (isUnreachable && req.method === "GET") {
        return res.status(200).json({
          success: true,
          session_id,
          messages: [],
          history: [],
        });
      }

      if (isUnreachable && req.method === "DELETE") {
        return res.status(200).json({
          success: true,
          session_id,
          cleared: true,
        });
      }

      console.error("[agent/session] proxy failed", status);
      return res.status(status || 500).json({
        success: false,
        message: "Session operation failed",
      });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        session_id,
        messages: [],
        history: [],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected session proxy error",
    });
  }
}

/**
 * Proxies `GET` and `DELETE /api/agent/session/[session_id]` to the backend agent session endpoints.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Tries `bff/admin/agent/session/{id}` then `bff/agent/session/{id}`; `GET` returns the stored messages/history and
 * `DELETE` clears the session. When the backend reports the session as missing or unreachable
 * (`404`/`502`/`503`/`504` or no response) both methods answer `200` with an empty session instead of failing.
 *
 * @param req - The Next.js API request; `req.query.session_id` identifies the session.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the session payload or the empty fallback has been sent.
 */
export default withAdminApi(handler);
