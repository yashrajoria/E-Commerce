import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

const getSessionTargets = (sessionId: string) => [
  `bff/admin/agent/session/${encodeURIComponent(sessionId)}`,
  `bff/agent/session/${encodeURIComponent(sessionId)}`,
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { session_id } = req.query;

  if (typeof session_id !== "string" || !session_id.trim()) {
    return res.status(400).json({ success: false, message: "Invalid session id" });
  }

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
        if (axios.isAxiosError(lastError) && lastError.response?.status === 404) {
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
        if (axios.isAxiosError(lastError) && lastError.response?.status === 404) {
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

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404 && req.method === "GET") {
        return res.status(200).json({
          success: true,
          session_id,
          messages: [],
          history: [],
        });
      }

      if (error.response?.status === 404 && req.method === "DELETE") {
        return res.status(200).json({
          success: true,
          session_id,
          cleared: true,
        });
      }

      return res.status(error.response?.status || 500).json({
        success: false,
        message: "Session operation failed",
        error: error.response?.data ?? error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected session proxy error",
    });
  }
}
