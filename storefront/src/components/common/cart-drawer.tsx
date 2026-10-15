"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatGBP, trapFocus } from "@/lib/utils";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  Package,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { SubscriptionPlanOption } from "@/lib/types";
import { ShopTogetherShareModal } from "../cart/ShopTogetherShareModal";

/** Props accepted by {@link CartDrawer}. */
interface CartDrawerProps {
  /** Whether the drawer panel is rendered. */
  isOpen: boolean;
  /** Called when the user dismisses the drawer via backdrop click, Escape key, close button, or a navigation action. */
  onClose: () => void;
}

/** Props accepted by {@link CartItemRow}. */
interface CartItemRowProps {
  /** Line item to display, including subscription metadata when present. */
  item: {
    /** Unique product/line identifier passed back to the cart actions. */
    id: string | number;
    /** Product name shown above the price. */
    name: string;
    /** Unit price in GBP major units. */
    price: number;
    /** Number of units currently in the cart. */
    quantity: number;
    /** Product image URLs; the first entry is used as the thumbnail. */
    images?: string[];
    /** Subscription plan details when the line was added as a subscription. */
    subscription?: SubscriptionPlanOption;
  };
  /** Called with the line id and the desired quantity when the stepper changes. */
  onUpdateQuantity: (id: string | number, qty: number) => void;
  /** Called with the line id when the remove button is pressed. */
  onRemove: (id: string | number) => void;
}

/**
 * Renders a single cart line with thumbnail, quantity stepper, and remove action.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 */
function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImage = item.images?.[0];
  const isLocalStack = rawImage?.includes("localhost:4566");
  const hasValidImage = rawImage && !isLocalStack && !imageFailed;

  return (
    <motion.div
      className="flex gap-4 p-3 rounded-lg bg-surface border border-border"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
    >
      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Package className="h-6 w-6 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-snug line-clamp-1">
          {item.name}
        </h3>
        {item.subscription?.isSubscription && (
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">
            <RefreshCw className="h-2.5 w-2.5" />
            Renews {item.subscription.frequency.replace("_", " ")} (-15%)
          </span>
        )}
        <p className="text-sm font-semibold mt-1">{formatGBP(item.price)}</p>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center border border-border rounded-md bg-background">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Renders the slide-over shopping bag with line items, quantity controls, subtotal, and checkout actions.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
 * ```
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isShopTogetherOpen, setIsShopTogetherOpen] = useState(false);

  const handleUpdateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusedRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    previousFocusedRef.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab") {
        trapFocus(panelRef.current, e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className="fixed top-0 right-0 h-full w-[420px] max-w-[92vw] bg-background border-l border-border z-50 shadow-2xl flex flex-col"
            initial={reduceMotion ? { x: 0 } : { x: 440 }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: 0 } : { x: 440 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold tracking-tight">
                  Shopping Bag
                </h2>
                <Badge variant="secondary" className="text-xs font-medium">
                  {totalItems}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
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
                  className="h-8 w-8"
                  aria-label="Close cart drawer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <p className="text-foreground font-medium text-sm">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-6">
                    Explore our collection and add your essentials.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/products" onClick={onClose}>
                      Explore catalog
                    </Link>
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-surface/50 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-lg font-semibold tracking-tight">
                    {formatGBP(total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes and shipping calculated at checkout.
                </p>
                <Separator />
                <div className="space-y-2 pt-1">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout" onClick={onClose}>
                      Checkout
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                    >
                      <Link href="/cart" onClick={onClose}>
                        View bag
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsShopTogetherOpen(true)}
                      className="h-9 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Shop Together
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      <ShopTogetherShareModal
        isOpen={isShopTogetherOpen}
        onClose={() => setIsShopTogetherOpen(false)}
        cart={cart}
        total={total}
      />
    </AnimatePresence>
  );
}
