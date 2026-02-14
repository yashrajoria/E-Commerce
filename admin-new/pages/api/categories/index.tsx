import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const cookieHeader = req.headers.cookie;
      const cookie = cookieHeader
        ? cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("__session=") || c.startsWith("token="))
        : undefined;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}categories/`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
          },
          withCredentials: true,
        },
      );
      return res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    try {
      const cookieHeader = req.headers.cookie;
      const cookie = cookieHeader
        ? cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("__session=") || c.startsWith("token="))
        : undefined;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}categories/`,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
          },
          withCredentials: true,
        },
      );
      return res.status(response.status).json(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error creating category:", err);
      return res
        .status(err?.response?.status || 500)
        .json({ message: "Error creating category" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
