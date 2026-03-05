import type { NextApiRequest, NextApiResponse } from "next";

import axios, { type AxiosRequestConfig } from "axios";
import { getResponseInfo } from "@/lib/error";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

const parseForm = (req: NextApiRequest): Promise<{ fields: Record<string, unknown>; files: Record<string, unknown> }> => {
  const form = formidable({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const extractSessionCookie = (req: NextApiRequest): string => {
  const sessionCookie = req.headers.cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("__session="));
  return sessionCookie?.trim() || "";
};

const proxyRequest = async (config: AxiosRequestConfig, cookie?: string) => {
  try {
    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        Cookie: cookie || "",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Proxy request failed:", error);
    throw error;
  }
};

async function handleCreateProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields, files } = await parseForm(req);

    const getFieldString = (key: string) => {
      const val = fields[key];
      if (Array.isArray(val) && val.length > 0) return String(val[0]);
      if (typeof val === "string") return val;
      return undefined;
    };

    // Extract fields safely
    const name = getFieldString("name");
    const rawCategory = getFieldString("category");
    const category = rawCategory ? JSON.parse(rawCategory) : [];
    const price = parseFloat(getFieldString("price") || "0");
    const quantity = parseInt(getFieldString("quantity") || "0");
    const description = getFieldString("description") || "";
    const brand = getFieldString("brand") || "";
    const sku = getFieldString("sku") || "";
    // is_featured may come as string 'true'/'false' or '1'/'0'
    const rawIsFeatured = getFieldString("is_featured");
    const is_featured =
      rawIsFeatured === undefined
        ? undefined
        : /^(1|true|TRUE|True)$/.test(String(rawIsFeatured));

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
    if (brand) formData.append("brand", brand);
    if (sku) formData.append("sku", sku);
    if (typeof is_featured !== "undefined")
      formData.append("is_featured", String(is_featured));

    // Handle image files
    const rawImages = (files as Record<string, unknown>)?.images;
    const imagesArray = Array.isArray(rawImages) ? rawImages : rawImages ? [rawImages] : [];
    for (const img of imagesArray) {
      if (img && typeof img === "object" && "filepath" in (img as Record<string, unknown>)) {
        const fileObj = img as Record<string, unknown>;
        const filepath = String(fileObj.filepath);
        try {
          const buffer = await fs.promises.readFile(filepath);
          formData.append("images", buffer, {
            filename: String(fileObj.originalFilename ?? "image.jpg"),
            contentType: String(fileObj.mimetype ?? "image/jpeg"),
          });
        } catch (e) {
          console.warn("Could not read file:", filepath, e);
        }
      }
    }

    // If frontend uploaded images via presign and sent URLs, include them
    const rawImageUrls = getFieldString("image_urls");
    if (rawImageUrls) {
      try {
        // rawImageUrls may already be a JSON string
        const urls =
          typeof rawImageUrls === "string"
            ? rawImageUrls
            : JSON.stringify(rawImageUrls);
        formData.append("image_urls", urls);
      } catch (e) {
        console.warn("Invalid image_urls format", e);
      }
    }

    // Forward __session cookie
    const sessionCookie = extractSessionCookie(req);

    // Submit to Go backend
    const response = await axios.post(`${API_URL}products`, formData, {
      headers: {
        ...formData.getHeaders(),
        Cookie: sessionCookie,
      },
      withCredentials: true,
    });

    return res.status(response.status).json({
      message: "Product created successfully",
      product: response.data,
    });
  } catch (uploadErr: unknown) {
    // Normalize error using helper
    const { data } = getResponseInfo(uploadErr);
    const msg = typeof data === "string" ? data : uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
    console.log("Upload failed:", msg);
    return res.status(500).json({ message: "Error uploading product" });
  }
}
async function handleGetProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookie = extractSessionCookie(req);

    const query = req.query;
    const page = query.page || 1;
    const perPage = query.perPage || 10;
    const response = await axios.get(`${API_URL}products`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      params: {
        page,
        perPage,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
}

async function handleBulkUpload(req: NextApiRequest, res: NextApiResponse) {
  const { files } = await parseForm(req);
  const rawFile = (files as Record<string, unknown>)?.file;
  const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
  if (!file || typeof file !== "object" || !("filepath" in (file as Record<string, unknown>)))
    return res.status(400).json({ message: "No file uploaded" });

  const fileStream = fs.createReadStream(String((file as Record<string, unknown>).filepath));
  const formData = new FormData();
  formData.append("file", fileStream, file.originalFilename || "upload.csv");

  const autoCreate = req.query.auto_create_categories ?? "true";
  const cookie = extractSessionCookie(req);
  const response = await proxyRequest(
    {
      url: `${API_URL}products/bulk?auto_create_categories=${autoCreate}`,
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
    
  } catch (error: unknown) {
    console.error("API error:", error);
    // Attempt to extract status/message safely
    const { status, data } = getResponseInfo(error);
    const message = typeof data === "object" && data !== null && "message" in (data as { message?: unknown })
      ? (data as { message?: string }).message
      : undefined;
    return res.status(status || 500).json({ message: message || "Server error" });
  }
}
