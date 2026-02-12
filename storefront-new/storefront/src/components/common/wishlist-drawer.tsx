"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, HeartOff, ShoppingBag, X } from "lucide-react";
import Image from "next/image";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[420px] max-w-[92vw] bg-background border-l border-border/50 z-50 shadow-2xl"
            initial={{ x: 440 }}
            animate={{ x: 0 }}
            exit={{ x: 440 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Wishlist
                  </h2>
                  <Badge
                    variant="secondary"
                    className="rounded-full text-xs font-medium"
                  >
                    {wishlist.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {wishlist.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearWishlist}
                      className="text-muted-foreground hover:text-destructive text-xs h-8 px-2"
                    >
                      Clear all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Heart className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Your wishlist is empty
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Save items you love for later
                    </p>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-xl bg-muted/30 border border-border/30"
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={item.images?.[0] || "/icons8-image-100.png"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-snug truncate">
                          {item.name}
                        </h3>
                        <p className="text-base font-semibold mt-1">
                          {formatGBP(item.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-full px-3"
                            onClick={() => {
                              addToCart({ ...item, quantity: 1 });
                              removeFromWishlist(item.id);
                            }}
                          >
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            Add to Bag
                          </Button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <HeartOff className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer — only show item count summary */}
              {wishlist.length > 0 && (
                <div className="px-5 py-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    {wishlist.length} saved{" "}
                    {wishlist.length === 1 ? "item" : "items"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
