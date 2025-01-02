import Link from "next/link";
import { useState } from "react";
import AccountDropdown from "./AccountDropdown";
import { useSession } from "next-auth/react";

const NavBar = ({ mobileNavActive, cartProducts }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { data: session } = useSession();

  const handleOpenSignInModal = () => setIsSignInModalOpen(true);
  const handleOpenSignUpModal = () => setIsSignUpModalOpen(true);
  return (
    <nav
      className={`${
        mobileNavActive ? "block" : "hidden"
      } fixed top-0 bottom-0 left-0 right-0 p-16 md:static md:flex md:p-0 gap-4 md:gap-6 text-white`}
    >
      <Link href="/" className=" block py-2 md:py-0">
        Home
      </Link>
      <Link href="/products" className=" block py-2 md:py-0">
        All Products
      </Link>
      {/* <Link href="/categories" className=" block py-2 md:py-0">
        Categories
      </Link> */}
      <Link href="/cart" className=" block py-2 md:py-0">
        Cart ({cartProducts.length})
      </Link>
      <AccountDropdown
        isSignedIn={!!session}
        handleOpenSignInModal={handleOpenSignInModal}
        handleOpenSignUpModal={handleOpenSignUpModal}
      />
    </nav>
  );
};

export default NavBar;
