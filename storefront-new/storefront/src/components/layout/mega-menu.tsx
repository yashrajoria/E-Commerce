"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { data: categories = [], isLoading, error } = useCategories();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-background border-r border-border/50 z-50 shadow-2xl md:hidden"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <Link
                  href="/"
                  onClick={onClose}
                  className="text-lg font-bold tracking-tight"
                >
                  <span className="text-gradient-premium">Luxe</span>
                  <span className="text-foreground/80">Store</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Home link */}
              <div className="px-3 py-2 border-b border-border/30">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Home</span>
                </Link>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto">
                <p className="px-5 pt-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Categories
                </p>

                {isLoading && (
                  <div className="px-5 space-y-3 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-muted/40 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {error && (
                  <p className="px-5 py-3 text-sm text-muted-foreground">
                    Unable to load categories.
                  </p>
                )}

                {!isLoading &&
                  !error &&
                  categories.map((category, index) => {
                    const IconComponent =
                      (
                        LucideIcons as unknown as Record<
                          string,
                          React.ComponentType<{ className?: string }>
                        >
                      )[category.icon] || LucideIcons.Package;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ x: -24, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <Link
                          href={`/products?category=${category.name}`}
                          onClick={onClose}
                          className="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {category.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {category.productCount} products
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                        </Link>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-border/50 space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Link href="/account" onClick={onClose}>
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
