import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page = "1", page_size = "20" } = req.query;
  const cookie = req.headers.cookie;

  try {
    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}users`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        params: {
          page: parseInt(page as string, 10) || 1,
          page_size: parseInt(page_size as string, 10) || 20,
        },
        withCredentials: true,
      },
    );

    const users = apiRes?.data?.users || [];
    const meta = apiRes?.data?.meta || {};

    res.status(200).json({ users, meta });
  } catch (error: any) {
    console.error("Error fetching customers:", error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    res.status(status).json({ error: "Failed to fetch customers" });
  }
}
