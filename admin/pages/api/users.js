import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    if (req.method === "GET") {
      // Fetch all users
      const users = await User.find();
      res.json(users);
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err) {
    console.error("Error handling request", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
