import axios from "axios";
import { Router } from "next/router";

async function handler(req, res) {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const response = await axios.post("http://localhost:8080/user/auth/login", {
    email: req.body.email,
    password: req.body.password,
  });

  console.log(response);

  if (response?.data?.message == "Login successful") {
    res.status(200).json({
      message: "Success",
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
}
export default handler;
