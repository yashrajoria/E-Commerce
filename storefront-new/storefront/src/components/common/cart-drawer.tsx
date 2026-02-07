"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBagIcon,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // FIX: Make sure to destructure updateQuantity from your hook
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                  Shopping Cart
                  <Badge className="ml-2">{cart.length}</Badge>
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border bg-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.images?.[0] || "/icons8-image-100.png"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-lg font-semibold">
                        {formatGBP(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* FIX: Moved onClick to the Button and call updateQuantity */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      {/* FIX: Moved onClick to the Button and use the correct item */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => addToCart({ ...item, quantity: 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold">{formatGBP(total)}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cart" className="flex items-center">
                      <ShoppingBagIcon className="mr-2 h-4 w-4" />
                      View Cart
                    </Link>
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
