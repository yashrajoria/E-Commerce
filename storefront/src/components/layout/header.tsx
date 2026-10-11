"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AccountDropdown } from "../common/account-dropdown";
import { CartDrawer } from "../common/cart-drawer";
import { LoginModal } from "../common/login-modal";
import { WishlistDrawer } from "../common/wishlist-drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BrandLogo } from "./brand-logo";
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
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Shop", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/products?sortBy=newest" },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <BrandLogo size="md" />
            <div className="h-9 w-24 rounded-lg bg-muted/40 animate-pulse" aria-hidden />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-2xs"
            : "bg-background/90 backdrop-blur-md border-b border-border/60"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo & Main Nav */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <BrandLogo size="md" />

              <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/products"
                      ? router.pathname === "/products" && !router.query.sortBy
                      : router.asPath === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-foreground font-semibold bg-muted/60"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Search (Desktop lg+) */}
            <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md items-center mx-4">
              <div className="relative w-full">
                <Search
                  aria-hidden
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                />
                <Input
                  aria-label="Search products"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-9 pr-10 h-9 text-sm bg-muted/40 border-border/70 hover:border-border focus:bg-background focus:border-ring transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border/80 rounded select-none pointer-events-none">
                    ↵
                  </kbd>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Search Toggle (Mobile & Tablet) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search products"
                className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Wishlist (Desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  wishlist.length > 0
                    ? `Wishlist, ${wishlist.length} items`
                    : "Open wishlist"
                }
                aria-haspopup="dialog"
                className="hidden md:inline-flex relative h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsWishlistOpen(true)}
              >
                <Heart className="h-[18px] w-[18px]" aria-hidden />
                {wishlist.length > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center leading-none shadow-2xs"
                    >
                      {wishlist.length}
                    </span>
                    <span className="sr-only" aria-live="polite">
                      {wishlist.length} items in wishlist
                    </span>
                  </>
                )}
              </Button>

              {/* Cart (All screens) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  cartItemCount > 0
                    ? `Shopping Cart, ${cartItemCount} items`
                    : "Shopping Cart is empty"
                }
                aria-haspopup="dialog"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
                {cartItemCount > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none shadow-2xs"
                    >
                      {cartItemCount}
                    </span>
                    <span className="sr-only" aria-live="polite">
                      {cartItemCount} items in cart
                    </span>
                  </>
                )}
              </Button>

              {/* Account Dropdown or Sign In (Desktop only) */}
              <div className="hidden md:block relative">
                {loggedIn ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-haspopup="menu"
                    aria-expanded={isAccountOpen}
                    className="h-9 px-2.5 gap-2 text-sm font-medium text-foreground hover:bg-muted/60"
                    onClick={() => setIsAccountOpen((open) => !open)}
                  >
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span className="text-xs font-semibold">Account</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Sign in
                  </Button>
                )}

                {loggedIn && (
                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                  />
                )}
              </div>

              {/* Theme Toggle (Desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="hidden md:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={toggleTheme}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" aria-hidden />
                    ) : (
                      <Moon className="h-4 w-4" aria-hidden />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>

              {/* Mobile Menu Toggle (Mobile & Tablet) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Search Input Dropdown (Mobile & Tablet) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="pb-3 pt-1 lg:hidden"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-9 pr-9 h-10 text-sm bg-muted/40"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <MegaMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />
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
