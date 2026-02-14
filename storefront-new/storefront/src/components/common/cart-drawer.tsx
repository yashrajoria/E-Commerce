"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  const handleUpdateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                    Shopping Bag
                  </h2>
                  <Badge
                    variant="secondary"
                    className="rounded-full text-xs font-medium"
                  >
                    {totalItems}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
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
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Your bag is empty
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Start adding items to see them here
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
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

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-border/50 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-xl font-bold">
                      {formatGBP(total)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping & taxes calculated at checkout
                  </p>
                  <Separator className="opacity-50" />
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/20"
                      size="lg"
                    >
                      <Link href="/checkout" onClick={onClose}>
                        Checkout
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      <Link
                        href="/cart"
                        onClick={onClose}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        View Bag
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
