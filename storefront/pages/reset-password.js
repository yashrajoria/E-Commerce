import Header from "@/components/Header";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";

const ResetPassword = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token: token,
        password: password,
        email: email,
      });
      setMessage("Your password has been reset successfully.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (e) {
      setError(
        e.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Header />

        <title>Reset Password</title>
        <meta
          name="description"
          content="Reset your password securely using the reset link provided to your email."
        />

        <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Reset Your Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Display success or error messages */}
          {message && (
            <p className="mt-4 text-green-600 text-center">{message}</p>
          )}
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
