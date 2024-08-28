import Nav from "@/components/Nav";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  if (!session)
    try {
      return (
        <div className="bg-gray-200 w-screen h-screen flex items-center">
          <div className="text-center w-full px-4 ">
            <div className="gap-5 flex flex-col">
              <h1 className="text-3xl text-white font-bold">
                Welcome to ShopSwift Admin!!
              </h1>
              <h4 className="text-xl text-white font-bold">
                Please login below to continue to admin page
              </h4>
            </div>
            <button
              className="bg-white px-4 py-4 rounded-md"
              onClick={() => signIn("google")}
            >
              Login With Google
            </button>
          </div>
        </div>
      );
    } catch (err) {
      "Failed to sign in", err;
    }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center p-4">
        <button
          onClick={() => {
            setShowNav(true);
          }}
        >
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
        <div className=" flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
