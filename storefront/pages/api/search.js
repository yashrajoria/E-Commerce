import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  try {
    await mongooseConnect(); // Ensure connection is established

    if (req.method === "GET") {
      const query = req.query.q;

      // Validate query
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Invalid query parameter" });
      }

      // Perform the search
      const searchedProducts = await Product.find({
        title: { $regex: query, $options: "i" },
      });

      // Respond with the results
      res.status(200).json(searchedProducts);
    } else {
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
