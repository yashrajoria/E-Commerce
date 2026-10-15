"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  ChevronRight,
  Home,
  User,
  Heart,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useUser } from "@/context/UserContext";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { getLucideIcon, trapFocus } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

/** Props accepted by {@link MegaMenu}. */
interface MegaMenuProps {
  /** Whether the slide-in panel is visible. */
  isOpen: boolean;
  /** Called when the user dismisses the menu through the close button, backdrop, a navigation link or the Escape key. */
  onClose: () => void;
  /** Called when a signed-out visitor chooses "Sign in to Account"; the menu closes before this runs. */
  onOpenLogin?: () => void;
}

/**
 * Renders the mobile slide-in navigation drawer with categories, account actions and a theme toggle.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * Fetches categories with `useCategories`, traps keyboard focus inside the panel while open, and restores focus to the previously active element on close.
 *
 * @example
 * ```tsx
 * <MegaMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   onOpenLogin={() => setIsLoginOpen(true)}
 * />
 * ```
 */
export function MegaMenu({ isOpen, onClose, onOpenLogin }: MegaMenuProps) {
  const { data: categories = [], isLoading, error } = useCategories();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    prevFocused.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(panelRef.current, e);
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r border-border z-50 shadow-xl md:hidden"
            initial={reduceMotion ? { x: 0 } : { x: -320 }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: -320 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <BrandLogo size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="p-3 border-b border-border/60">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-4 text-center">
                    ALL
                  </span>
                  <span>All Products</span>
                </Link>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto p-3">
                <p className="px-3 pt-2 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Shop by Category
                </p>

                {isLoading && (
                  <div className="space-y-2 px-3 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="h-11 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {error && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    Unable to load categories.
                  </p>
                )}

                {!isLoading &&
                  !error &&
                  categories.map((category) => {
                    const IconComponent = getLucideIcon(category.icon);

                    return (
                      <Link
                        key={category.id}
                        href={`/products?categoryId=${encodeURIComponent(category.id)}&category=${encodeURIComponent(category.name)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="relative w-8 h-8 rounded-md bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.productCount} products
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                      </Link>
                    );
                  })}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border space-y-2">
                {user ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs font-medium"
                  >
                    <Link href="/account" onClick={onClose}>
                      <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      Account Settings
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs font-medium"
                    onClick={() => {
                      onClose();
                      onOpenLogin?.();
                    }}
                  >
                    <LogIn className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Sign in to Account
                  </Button>
                )}

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href="/account?tab=wishlist" onClick={onClose}>
                    <Heart className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Saved Wishlist
                  </Link>
                </Button>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <span className="text-xs text-muted-foreground">
                    Appearance
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-3.5 w-3.5" /> Light
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5" /> Dark
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
