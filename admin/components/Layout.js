import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  if (!session)
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full p-4">
          <button
            className="bg-white px-3 rounded-md"
            onClick={() => signIn("google")}
          >
            Login With Google
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-0 rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
