"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";

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
          <motion.div className="fixed inset-0 bg-black/50 z-50 md:hidden" />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r z-50 md:hidden"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Categories</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && (
                  <p className="p-4 text-sm text-muted-foreground">
                    Loading categories...
                  </p>
                )}
                {error && (
                  <p className="p-4 text-sm text-muted-foreground">
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
                        className="group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center p-4 hover:bg-muted/50 cursor-pointer group">
                          <div className="relative mr-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                sizes="48px"
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.productCount} products
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <Button className="w-full" variant="outline">
                  View All Categories
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
