import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import formidable from "formidable";
import FormData from "form-data";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};
// Helper to parse JSON body when bodyParser is disabled
async function parseJSONBody(req: NextApiRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST" && req.query.isBulk === "1") {
    // Parse incoming form data
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ message: "Error parsing form data" });
      }

      try {
        const file = files.file?.[0];
        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Read the file as a stream
        const fileStream = fs.createReadStream(file.filepath);

        // Create form data for proxying
        const formData = new FormData();
        formData.append(
          "file",
          fileStream,
          file.originalFilename || "upload.csv"
        );

        // Extract token from cookie
        const cookie = req.headers.cookie
          ?.split(";")
          .find((c) => c.trim().startsWith("token="));

        // Make the proxy request to your backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_NEW_API_URL}products/bulk`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Cookie: cookie || "",
            },
            withCredentials: true,
          }
        );

        return res.status(response.status).json(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Proxy error:", error);
        return res
          .status(error.response?.status || 500)
          .json({ message: error.response?.data?.message || "Server error" });
      }
    });
  } else if (req.method === "POST") {
    // console.log("REQ", req);
    const jsonBody = await parseJSONBody(req); // manually parse since bodyParser is disabled
    console.log(jsonBody);

    // Handle normal product creation
    // Extract token from cookie
    const cookie = req.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("token="));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}products` as string,
        jsonBody,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
          },
          withCredentials: true,
        }
      );

      return res.status(response.status).json(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error) {
      console.error("Auth proxy error:", error);
      return res
        .status(error.response?.status || 500)
        .json({ message: error.response?.data?.message || "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      const cookie = req.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}products/`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
          },
          withCredentials: true,
        }
      );
      return res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
