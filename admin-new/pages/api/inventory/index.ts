import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const API_URL = getAdminApiBaseUrl();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page = "1", page_size = "20" } = req.query;
  const cookie = req.headers.cookie;

  try {
    // Admin list requires JWT + admin. Avoid trailing-slash redirects through the gateway.
    const apiRes = await axios.get(`${API_URL}bff/admin/inventory`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      params: {
        page: parseInt(page as string, 10) || 1,
        page_size: parseInt(page_size as string, 10) || 20,
      },
      withCredentials: true,
      maxRedirects: 0,
    });

    const inventory = apiRes?.data?.inventory || [];
    const meta = apiRes?.data?.meta || {};

    res.status(200).json({ inventory, meta });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching inventory:", error.response?.data || error.message);
      const status = error.response?.status || 500;
      return res.status(status).json({ error: "Failed to fetch inventory" });
    }
    console.error("Unexpected error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
}

export default withAdminApi(handler);
