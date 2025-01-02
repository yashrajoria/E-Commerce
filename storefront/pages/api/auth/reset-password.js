import { mongooseConnect } from "@/lib/mongoose";
import { StoreUsers } from "@/models/StoreUsers";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token, password, email } = req.body;

  if (!token || !password || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const user = await StoreUsers.findOne({ resetToken: token });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res
        .status(402)
        .json({ message: "Your Token is not valid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const passwordUpdate = await StoreUsers.updateOne(
      { resetToken: token },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }
    );

    if (passwordUpdate.acknowledged) {
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      throw new Error("Password update failed");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}
