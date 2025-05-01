import { Dialog } from "@/components/ui/dialog"; // Assuming ShadCN Dialog component is set up
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [storeName, setStoreName] = useState("");

  if (status === "loading") {
    return (
      <div className="bg-gray-100 w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-600">Loading...</h1>
        </div>
      </div>
    );
  }

  // If not logged in, show the login prompt
  if (!session) {
    return (
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 w-screen h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
          <img
            src="/background.webp"
            alt="E-commerce Illustration"
            className="w-32 mx-auto mb-6 rounded-full shadow-md"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to ShopSwift Admin!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please login to manage your store.
          </p>
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => signIn("google")}
            aria-label="Login with Google"
          >
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.57 1.22 8.94 3.24l6.64-6.64C34.33 2.53 29.44 0 24 0 14.75 0 7.16 5.48 3.95 13.39l7.72 5.99C13.2 12.58 18.13 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.63 24.35c0-1.52-.14-2.98-.41-4.41H24v8.37h12.74c-.55 2.79-2.14 5.14-4.55 6.71l7.21 5.6c4.21-3.89 6.64-9.64 6.64-16.27z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.67 28.65c-1.12-2.48-1.12-5.21 0-7.69L3.95 13.39c-3.89 7.77-3.89 16.96 0 24.73l7.72-5.99z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c5.44 0 10.33-1.79 14.21-4.86l-7.21-5.6c-2.07 1.39-4.66 2.21-7.01 2.21-5.87 0-10.8-3.08-13.33-7.88l-7.72 5.99C7.16 42.52 14.75 48 24 48z"
                />
              </svg>
              Login with Google
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Render the main layout if session is available
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="w-full max-w-7xl p-4">{children}</div>
      </div>

      {/* Modal for Store Name */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4">Enter Your Store Name</h1>
          <input
            type="text"
            placeholder="Store Name"
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-full hover:bg-blue-700 transition-all duration-300 ease-in-out"
            onClick={() => {
              if (storeName.trim()) {
                setShowModal(false);
              }
            }}
          >
            Save Store Name
          </button>
        </div>
      </Dialog>
    </div>
  );
}
