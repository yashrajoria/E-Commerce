import multiparty from "multiparty";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import mime from "mime-types";
dotenv.config();

//Function to upload image, understand this again
export default async function uploadImage(req, res) {
  try {
    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    console.log(files.file.length);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    const links = [];
    for (const file of files.file) {
      const ext = file.originalFilename.split(".").pop();
      const newFilename = Date.now() + "." + ext;
      const result = await cloudinary.uploader.upload(file.path, {
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      });
      const link = result.url;
      links.push(link);

      // console.log(result);
      // console.log('Link:', links);
    }

    // Send the response back to the client
    res.status(200).json({ links });
  } catch (error) {
    console.error("Error processing file upload:", error);
    res.status(500).json({ error: "Failed to process file upload." });
  }
}

export const config = {
  api: { bodyParser: false }, // This ensures the request body is not automatically parsed as JSON
};
