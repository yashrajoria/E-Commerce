"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Bell, Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountDropdown } from "../common/account-dropwdown";
import { CartDrawer } from "../common/cart-drawer";
import { LoginModal } from "../common/login-modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MegaMenu } from "./mega-menu";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistDrawer } from "../common/wishlist-drawer";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // const [loggedIn, setLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // console.log(loggedIn);
  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, loading } = useUser(); // NEW
  const loggedIn = !!user; // Derived status

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b "
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <Link href="/" className="hover:underline">
                  SuperStore
                </Link>
              </span>
            </motion.div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                <Input
                  placeholder="Search products, brands and more..."
                  className="w-full pl-10 pr-4 h-10 bg-muted/50 text-white placeholder-white border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                />

                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted/50 cursor-pointer"
                onClick={() => setIsWishlistOpen(true)}
              >
                <Heart className="h-5 w-5 " />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlist.length}
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted/50 cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cart.length}
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  loggedIn
                    ? setIsAccountOpen(!isAccountOpen)
                    : setIsLoginOpen(true)
                }
              >
                <User className="h-4 w-4 mr-2" />
                {loggedIn ? "My Account" : "Login"}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <motion.div
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </motion.div>
              </Button>
              {loggedIn && (
                <AccountDropdown
                  isOpen={isAccountOpen}
                  onClose={() => setIsAccountOpen(false)}
                  // setLoggedIn={setLoggedIn}
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <motion.div
            className="md:hidden pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0"
              />
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        // setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        onClose={() => {
          setIsLoginOpen(false);
          // Close account dropdown if it was open when login modal was triggered
          setIsAccountOpen(false);
        }}
      />
    </>
  );
}
