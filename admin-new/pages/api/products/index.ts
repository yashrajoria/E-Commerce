import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("BULK", req?.query?.isBulk);
  if (req.method === "POST") {
    // return res.status(405).json({ message: "Method not allowed" });
    if (req?.query?.isBulk === "1") {
      try {
        console.log(req.body, "BODY");
        // console.log(req.headers, "HEADERS");
        console.log(req.query, "QUERY");
        console.log(req.method, "METHOD");
        console.log(req.url, "URL");
        console.log(req.headers.cookie, "COOKIE");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_NEW_API_URL}products/bulk`,
          req.body,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Cookie: req.headers.cookie || "",
            },
          }
        );

        res.status(response.status).json(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Auth proxy error:", error);
        res
          .status(error.response?.status || 500)
          .json({ message: error.response?.data?.message || "Server error" });
      }
    }
    console.log("REQ", req.body);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_AUTH_URL as string,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(response.status).json(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Auth proxy error:", error);
      res
        .status(error.response?.status || 500)
        .json({ message: error.response?.data?.message || "Server error" });
    }
  }

  if (req.method === "GET") {
    try {
      console.log("COOKIE", req.headers.cookie);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}products/`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
        }
      );

      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ message: "Error fetching products" });
    }
  }
}
