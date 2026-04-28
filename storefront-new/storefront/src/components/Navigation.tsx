import React from "react";
import Link from "next/link";
import {
  CartIcon,
  WishlistIcon,
  SearchIcon,
  MenuIcon,
} from "@ecommerce/shared/src/components/icons";
import { StorefrontLogo } from "./storefront-logo";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between gap-4 px-4 py-3"
      >
        {/* Logo */}
        <StorefrontLogo appName="ShopSwift" size="md" showText={true} />

        {/* Desktop Menu */}
        <ul
          role="menubar"
          aria-label="Primary menu"
          className="hidden md:flex gap-6 list-none"
        >
          <li role="none">
            <Link
              href="/categories"
              role="menuitem"
              className="text-foreground hover:text-primary transition-colors"
            >
              Categories
            </Link>
          </li>
          <li role="none">
            <Link
              href="/products"
              role="menuitem"
              className="text-foreground hover:text-primary transition-colors"
            >
              Products
            </Link>
          </li>
          <li role="none">
            <Link
              href="/account"
              role="menuitem"
              className="text-foreground hover:text-primary transition-colors"
            >
              Account
            </Link>
          </li>
        </ul>

        {/* Icons / Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Search products"
            className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground transition-colors"
          >
            <SearchIcon size={20} />
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground transition-colors"
          >
            <WishlistIcon size={20} />
          </Link>
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground transition-colors relative"
          >
            <CartIcon size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center text-white">
              0
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground transition-colors"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-white/[0.04] md:hidden">
            <ul
              role="menubar"
              aria-label="Primary menu mobile"
              className="flex flex-col gap-3 list-none p-4"
            >
              <li role="none">
                <Link
                  href="/categories"
                  role="menuitem"
                  className="text-foreground hover:text-primary transition-colors block"
                >
                  Categories
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/products"
                  role="menuitem"
                  className="text-foreground hover:text-primary transition-colors block"
                >
                  Products
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/account"
                  role="menuitem"
                  className="text-foreground hover:text-primary transition-colors block"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
