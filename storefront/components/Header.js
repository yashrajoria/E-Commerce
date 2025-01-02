import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import Link from "next/link";
import { useContext, useState } from "react";

import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const handleOpenSignInModal = () => setIsSignInModalOpen(true);
  const handleOpenSignUpModal = () => setIsSignUpModalOpen(true);

  return (
    <div className="flex justify-between items-center p-5 bg-green-600">
      <Link href="/" className="text-white text-xl font-bold relative z-10">
        ShopSwift
      </Link>
      <div className="flex-grow mx-10">
        <SearchBar />
      </div>{" "}
      <div className="flex gap-4 ">
        <NavBar mobileNavActive={mobileNavActive} cartProducts={cartProducts} />
      </div>
      <button
        onClick={() => setMobileNavActive((prev) => !prev)}
        className="bg-transparent w-8 h-8 border-0 text-white cursor-pointer relative z-10 md:hidden"
      >
        <BarsIcon />
      </button>
    </div>
  );
}
