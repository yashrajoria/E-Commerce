"use client";

import React, { useEffect, useState } from "react";
import { Flame, Zap, Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** Props accepted by {@link UrgencyPulseBadge}. */
interface UrgencyPulseBadgeProps {
  /**
   * Identifier used to seed a deterministic initial viewer count.
   *
   * @defaultValue "prod-default"
   */
  productId?: string;
  /** Remaining stock; values between 1 and 10 trigger the low-stock scarcity pill. */
  stock?: number;
  /**
   * Whether the product can be purchased; false (or `stock === 0`) renders the out-of-stock waitlist notice.
   *
   * @defaultValue true
   */
  inStock?: boolean;
  /**
   * Extra class names appended to the root element.
   *
   * @defaultValue ""
   */
  className?: string;
}

/**
 * Renders live social-proof and scarcity indicators for a product page.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * The viewer count is derived from a hash of `productId` and then fluctuates every 6.5 seconds between 2 and 14 to simulate live traffic.
 *
 * @example
 * ```tsx
 * <UrgencyPulseBadge
 *   productId={product.id}
 *   inStock={!isOutOfStock}
 *   stock={product.quantity}
 * />
 * ```
 */
export function UrgencyPulseBadge({
  productId = "prod-default",
  stock,
  inStock = true,
  className = "",
}: UrgencyPulseBadgeProps) {
  // Generate a deterministic initial viewer count based on product ID
  const initialViewers = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = (hash << 5) - hash + productId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 6) + 3; // between 3 and 8 viewers
  }, [productId]);

  const [liveViewers, setLiveViewers] = useState<number>(initialViewers);

  // Periodically fluctuate viewers slightly to reflect dynamic real-time traffic
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.max(2, Math.min(14, next));
      });
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const isLowStock = typeof stock === "number" && stock > 0 && stock <= 10;
  const isOutOfStock = inStock === false || stock === 0;

  if (isOutOfStock) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
        </span>
        Currently out of stock. Join waitlist to get notified.
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Live Social Proof Pill */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Users className="h-3 w-3" />
          <AnimatePresence mode="wait">
            <motion.span
              key={liveViewers}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
            >
              {liveViewers} people viewing now
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Live Scarcity Indicator */}
        {isLowStock ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold animate-pulse">
            <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
            Only {stock} left — 1 in active checkout
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
            <Flame className="h-3 w-3 fill-primary text-primary" />
            High demand item
          </div>
        )}
      </div>

      {/* Subtext Scarcity Ribbon */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
        <span>
          Orders dispatch within{" "}
          <strong className="text-foreground font-semibold">2 hours</strong>.
          Fast tracked courier delivery.
        </span>
      </div>
    </div>
  );
}
