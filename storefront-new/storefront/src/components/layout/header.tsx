"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AccountDropdown } from "../common/account-dropdown";
import { CartDrawer } from "../common/cart-drawer";
import { LoginModal } from "../common/login-modal";
import { WishlistDrawer } from "../common/wishlist-drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MegaMenu } from "./mega-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useUser();
  const loggedIn = !!user;

  useEffect(() => setMounted(true), []);

  // Track scroll for glass header effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Compute total cart items (sum of quantities)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) return null;

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "glass border-b border-border/40 shadow-sm"
            : "bg-background/80 backdrop-blur-md border-b border-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-9 w-9 rounded-xl bg-linear-to-br from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-shadow duration-300">
                <span className="text-white font-bold text-sm tracking-tight">
                  S
                </span>
              </div>
              <span className="font-semibold text-xl tracking-tight text-gradient-premium">
                ShopSwift
              </span>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Search */}
              <div className="relative mr-2">
                <Input
                  placeholder="Search products..."
                  className="w-[260px] lg:w-[320px] pl-10 pr-4 h-10 rounded-full bg-muted/60 border-transparent focus:border-ring/30 focus:bg-background transition-all duration-300"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-muted/60 cursor-pointer transition-colors duration-200"
                onClick={() => setIsWishlistOpen(true)}
              >
                <Heart className="h-[18px] w-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-[10px] text-white font-medium flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-muted/60 cursor-pointer transition-colors duration-200"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-linear-to-r from-rose-600 to-amber-500 text-[10px] text-white font-medium flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* Account */}
              <div
                className="relative"
                onMouseEnter={() => loggedIn && setIsAccountOpen(true)}
                onMouseLeave={() => loggedIn && setIsAccountOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="h-10 rounded-full px-4 hover:bg-muted/60 cursor-pointer transition-colors duration-200 text-sm font-medium"
                  onClick={() => !loggedIn && setIsLoginOpen(true)}
                >
                  <User className="h-[18px] w-[18px] mr-2" />
                  {loggedIn ? "Account" : "Sign In"}
                </Button>
                {loggedIn && (
                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                  />
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-muted/60 transition-colors duration-200"
                onClick={toggleTheme}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-[18px] w-[18px]" />
                    ) : (
                      <Moon className="h-[18px] w-[18px]" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-linear-to-r from-rose-600 to-amber-500 text-[10px] text-white font-medium flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="absolute top-0 left-0 w-full glass p-4 md:hidden z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="w-full pl-10 pr-10 h-11 rounded-full"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <LoginModal
        isOpen={isLoginOpen}
        loggedIn={loggedIn}
        onClose={() => {
          setIsLoginOpen(false);
          setIsAccountOpen(false);
        }}
      />
    </>
  );
}

