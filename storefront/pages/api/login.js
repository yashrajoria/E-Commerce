import bcrypt from "bcrypt";
import { mongooseConnect } from "@/lib/mongoose";
import { StoreUsers } from "@/models/StoreUsers";

async function handler(req, res) {
  try {
    await mongooseConnect();
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user exists
    const user = await StoreUsers.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({ user });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
}

export default handler;
