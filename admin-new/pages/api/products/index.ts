import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import formidable, { IncomingForm } from "formidable";
import FormData from "form-data";
import axios, { type AxiosRequestConfig } from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_URL = process.env.NEW_API_URL; // Use server-side environment variable

const parseForm = (
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ fields: any; files: any }> => {
  const form = formidable({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const extractTokenFromCookie = (req: NextApiRequest): string | undefined => {
  const cookie = req.headers.cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("token="));
  return cookie;
};

const proxyRequest = async (config: AxiosRequestConfig, cookie?: string) => {
  try {
    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        Authorization: cookie ? `Bearer ${cookie}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Proxy request failed:", error);
    throw new Error("Failed to fetch data from the server.");
  }
};

async function handleCreateProduct(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    try {
      // Extract fields
      const name = fields.name?.[0];
      const category = JSON.parse(fields.category?.[0] || "[]");
      const price = parseFloat(fields.price?.[0] || "0");
      const quantity = parseInt(fields.quantity?.[0] || "0");
      const description = fields.description?.[0] || "";

      if (!name || !category.length || isNaN(price)) {
        return res.status(400).json({ message: "Missing or invalid fields" });
      }

      // Prepare multipart form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", JSON.stringify(category));
      formData.append("price", price.toString());
      formData.append("quantity", quantity.toString());
      formData.append("description", description);

      // Handle image files
      const rawImages = files.images;
      const imagesArray = Array.isArray(rawImages) ? rawImages : [rawImages];
      for (const img of imagesArray) {
        if (img?.filepath) {
          try {
            const buffer = await fs.promises.readFile(img.filepath);
            formData.append("images", buffer, {
              filename: img.originalFilename || "image.jpg",
              contentType: img.mimetype || "image/jpeg",
            });
          } catch (e) {
            console.warn("Could not read file:", img.filepath, e);
          }
        }
      }

      // Forward token cookie
      const tokenCookie =
        req.headers.cookie
          ?.split(";")
          .find((c) => c.trim().startsWith("token=")) || "";

      // Submit to Go backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}products`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Cookie: tokenCookie,
          },
          withCredentials: true,
        },
      );

      return res.status(response.status).json({
        message: "Product created successfully",
        product: response.data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (uploadErr: any) {
      console.error(
        "Upload failed:",
        uploadErr?.response?.data || uploadErr.message,
      );
      return res.status(500).json({ message: "Error uploading product" });
    }
  });
}
async function handleGetProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookie = req.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("token="));

    const query = req.query;
    const page = query.page || 1;
    const perPage = query.perPage || 10;
    const response = await axios.get(`http://localhost:8080/products`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie || "",
      },
      params: {
        page,
        perPage,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
}

async function handleBulkUpload(req: NextApiRequest, res: NextApiResponse) {
  const { files } = await parseForm(req);
  const file = files.file?.[0];
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const fileStream = fs.createReadStream(file.filepath);
  const formData = new FormData();
  formData.append("file", fileStream, file.originalFilename || "upload.csv");

  const cookie = extractTokenFromCookie(req);
  const response = await proxyRequest(
    {
      url: `${API_URL}products/bulk`,
      method: "POST",
      data: formData,
      headers: formData.getHeaders(),
    },
    cookie,
  );

  res.status(response.status).json(response.data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST" && req.query.isBulk === "1") {
      return await handleBulkUpload(req, res);
    } else if (req.method === "POST") {
      return await handleCreateProduct(req, res);
    } else if (req.method === "GET") {
      return await handleGetProducts(req, res);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API error:", error);
    return res.status(error?.response?.status || 500).json({
      message: error?.response?.data?.message || "Server error",
    });
  }
}
