"use client";

import React, { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from 'next/navigation'; // Removed for compatibility
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { CheckCircle, XCircle, Loader, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
// import Link from 'next/link'; // Removed for compatibility

// A simple component to show a loading spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <Loader className="animate-spin text-blue-500" size={64} />
    <p className="mt-4 text-lg text-gray-600">
      Verifying your payment, please wait...
    </p>
  </div>
);

// The main component that renders based on status
const PaymentSuccessContent = () => {
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState(null);

  // 1. Get the session_id from the URL query parameters using browser APIs
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);
  }, []);

  useEffect(() => {
    // Wait until sessionId is populated
    if (sessionId === null) {
      return;
    }

    if (!sessionId) {
      setStatus("error");
      setMessage("No payment session ID was found. Please contact support.");
      return;
    }

    // 2. Define the verification function
    const verifyPayment = async () => {
      try {
        // 3. Call your Go backend to verify the session
        // This is a NEW endpoint you will need to create in your payment-service
        const response = await axiosInstance.post(
          API_ROUTES.PAYMENT.VERIFY,
          { session_id: sessionId, payment_id: sessionId },
          { withCredentials: true } // Use if your Go backend needs cookies
        );

        if (response.data.status === "paid") {
          setStatus("success");
          setMessage(response.data.message || "Your payment was successful!");
        } else {
          setStatus("error");
          setMessage(response.data.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.error || "An error occurred during verification."
        );
      }
    };

    verifyPayment();
  }, [sessionId]); // Run this effect only when sessionId changes
  useEffect(() => {
    // Only clear the cart if the status is actually success
    if (status === "success") {
      clearCart();
    }
  }, [status]);

  // 4. Render UI based on the verification status
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <CheckCircle className="text-green-500" size={80} />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-2 text-lg text-gray-600">{message}</p>
        <p className="mt-2 text-gray-500">Your order is now being processed.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <ShoppingBag className="mr-2" size={20} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <XCircle className="text-red-500" size={80} />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Failed
        </h1>
        <p className="mt-2 text-lg text-gray-600">{message}</p>
        <p className="mt-2 text-gray-500">
          Please try again or contact support if the problem persists.
        </p>
        <Link
          href="/cart"
          className="mt-8 inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors"
        >
          Back to Cart
        </Link>
      </div>
    );
  }

  return null;
};

// Next.js page component
// We use <Suspense> because useSearchParams() requires it.
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* We can use Suspense as a good React practice for client components */}
        <Suspense fallback={<LoadingSpinner />}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
