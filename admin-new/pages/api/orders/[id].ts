import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const cookie = req.headers.cookie || "";

  try {
    const apiRes = await axios.get(
      `${getAdminApiBaseUrl()}bff/admin/orders/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      }
    );

    return res.status(200).json(apiRes.data);
  } catch (error: unknown) {
    console.error("Error fetching order:", error);
    const { status } = getResponseInfo(error);
    return res.status(status || 500).json({
      message: "Failed to fetch order",
    });
  }
}
