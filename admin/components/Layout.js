import Nav from "@/components/Nav";
import axios from "axios"; // Use axios to make API requests
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Dialog } from "./ui/dialog";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [isStoreNameSet, setIsStoreNameSet] = useState(false);

  // Fetch store name status when user logs in
  useEffect(() => {
    // if (session) {
    // console.log(session);
    fetchStoreName();
    // }
  }, []);

  const fetchStoreName = async () => {
    try {
      const response = await axios.get("/api/store-name");
      if (response.data.storeName) {
        setIsStoreNameSet(true);
      } else {
        setIsStoreNameSet(false);
        setShowModal(true); // Open the modal if store name is not set
      }
    } catch (error) {
      console.error("Error fetching store name:", error);
    }
  };

  const handleStoreNameSubmit = async () => {
    if (storeName.trim() === "") return;

    try {
      await axios.post("/api/store-name", { storeName });
      setIsStoreNameSet(true);
      setShowModal(false); // Close the modal after submission
    } catch (error) {
      console.error("Error saving store name:", error);
    }
  };

  // Display a loading state while session status is loading
  if (status === "loading") {
    return (
      <div className="bg-gray-200 w-screen h-screen flex items-center">
        <div className="text-center w-full px-4">
          <h1 className="text-3xl text-white font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  // Show login prompt if no session
  if (!session) {
    return (
      <div className="bg-gray-100 w-screen h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <img
            src="/background.webp"
            alt="E-commerce Illustration"
            className="w-32 mx-auto mb-6"
          />
          <h1 className="text-3xl text-gray-800 font-bold mb-4">
            Welcome to ShopSwift Admin!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please login to access the admin dashboard and manage your store.
          </p>
          <button
            className="bg-purple-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
            onClick={() => signIn("google")}
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

  // Render the main layout if store name is set
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center">
          <Logo />
        </div>
      </div>
      <div className="bg-bgGray min-h-screen flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">{children}</div>
      </div>
      {/* Render modal if store name is not set */}
      {!isStoreNameSet && (
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)} // Ensure modal can be closed
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Enter Your Store Name</h1>
            <input
              type="text"
              placeholder="Store Name"
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold w-full"
              onClick={handleStoreNameSubmit}
            >
              Save Store Name
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
