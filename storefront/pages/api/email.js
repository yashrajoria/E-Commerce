import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL_ADDRESS,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL_ADDRESS,
      to: to,
      subject: subject,
      text: body,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", info });
  } catch (e) {
    console.error("Error sending email:", e);
    return res
      .status(500)
      .json({ message: "Failed to send email", error: e.message });
  }
}
