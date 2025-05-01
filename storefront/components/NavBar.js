import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import AccountDropdown from "./AccountDropdown";
import Link from "next/link";
const Navbar = ({ cartProducts }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed w-full top-0 z-50 py-4 px-6 bg-shop-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/">
                <span className="text-2xl font-display font-bold gradient-text">
                  ShopSwift
                </span>
              </Link>
            </motion.div>

            <div className="flex-1 mx-8 relative">
              <div
                className={`relative transition-all duration-300 ${
                  searchFocused ? "scale-105" : ""
                }`}
              >
                <Input
                  placeholder="Search for products..."
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10 h-11 transition-all duration-300 ${
                    searchFocused ? "ring-2 ring-shop-purple/50" : ""
                  }`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-white/10"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-shop-purple text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartProducts?.length}
                    </span>
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium"
                  onClick={() => setAuthOpen(true)}
                >
                  Sign In
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
      <AccountDropdown open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Navbar;
