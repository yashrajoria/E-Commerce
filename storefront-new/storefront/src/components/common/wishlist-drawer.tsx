"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";
import { HeartOff, ShoppingBagIcon, X } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Cart Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background/95 backdrop-blur-xl border-l z-50"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  Wishlist
                  <Badge className="ml-2">{wishlist.length}</Badge>
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {wishlist.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Your wishlist is empty.
                  </p>
                ) : (
                  wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border bg-card"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-lg font-semibold">${item.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-destructive"
                      >
                        <HeartOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart({ ...item, quantity: 1 })}
                      >
                        Add to Cart
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Items:</span>
                  <span className="text-2xl font-bold">{wishlist.length}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Link href="/cart">
                      <div className="flex items-center justify-center space-x-2">
                        <ShoppingBagIcon className="mr-2 h-4 w-4" />
                        <span className="text-sm">View Cart</span>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={clearWishlist}>
                    Clear Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
