import { StoreUsers } from "@/models/StoreUsers";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { mongooseConnect } from "@/lib/mongoose";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL_ADDRESS,
    pass: process.env.SMTP_PASSWORD,
  },
});
export default async function (req, res, next) {
  if (req.method === "POST") {
    await mongooseConnect();

    const { email } = req.body;
    const user = await StoreUsers.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expirationTime = Date.now() + 3600000;

    // Save token and expiry in the database
    user.resetToken = resetToken;
    user.resetTokenExpiry = expirationTime;
    await user.save();

    const resetLink = `${process.env.PUBLIC_URL}reset-password?token=${resetToken}&email=${email}`;

    await transporter.sendMail({
      from: "no-reply@example.com",
      to: email,
      subject: "Password Reset",
      text: `Please click on the following link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset link sent successfully" });
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
