import { mongooseConnect } from "@/lib/mongoose";
import axios from "axios";
import { isAdminRequest } from "./auth/[...nextauth]";
export default async function uploadFile(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "POST") {
    const { data } = req.body;
    console.log(data);
    try {
      // Make sure to use the full URL for the axios request
      const response = await axios.post(`/api/products`, data);
      res.status(200).json({
        message: "File uploaded successfully",
        response: response.data,
      });
    } catch (error) {
      console.error("Error uploading file:", error.message);
      res
        .status(500)
        .json({ message: "File upload failed", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
