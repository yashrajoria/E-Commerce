import bcrypt from "bcrypt";
import { mongooseConnect } from "@/lib/mongoose";
import { StoreUsers } from "@/models/StoreUsers";

async function handler(req, res) {
  try {
    await mongooseConnect();
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const createUser = await StoreUsers.create({
      full_name: name,
      email: email,
      password: hashedPassword,
      user_id: generateRandomUserId(),
      address: {},
    });
    res.status(201).json({ createUser });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
}

// Helper function to generate a random user_id
function generateRandomUserId() {
  return Math.random().toString(36).substr(2, 9); // Example function to generate a random string
}

export default handler;
