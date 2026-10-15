import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Check, ShoppingBag } from "lucide-react";
import type { ActionCard } from "./types";

/** Props accepted by {@link BundleCardRenderer}. */
export interface BundleCardRendererProps {
  /** Bundle payload produced by the shopper assistant, including items, prices and the coupon code. */
  card: ActionCard;
  /** Per-item selection state keyed by item id; an item counts as selected unless it is explicitly false. */
  checkedMap: Record<string, boolean>;
  /** Called with an item id to toggle that item's selection. */
  onToggleItem: (id: string) => void;
  /** Called when the user presses the add-all button; disabled while nothing is selected. */
  onAddBundle: () => void;
}

/**
 * Renders an assistant-generated bundle as an interactive card with a budget tracker, item checklist and live totals.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * Recomputes the subtotal, a proportionally scaled coupon discount and the share of the target budget used whenever the checklist changes; prices arrive as integer cents and are displayed in dollars.
 *
 * @example
 * ```tsx
 * <BundleCardRenderer
 *   card={actionCard}
 *   checkedMap={checkedItemsMap[message.id] || {}}
 *   onToggleItem={(itemId) => handleToggleItem(message.id, itemId)}
 *   onAddBundle={() => handleAddBundleToCart(message.id, actionCard)}
 * />
 * ```
 */
export const BundleCardRenderer: React.FC<BundleCardRendererProps> = ({
  card,
  checkedMap,
  onToggleItem,
  onAddBundle,
}) => {
  // Live recalculate subtotal and coupon discount based on checked items
  const {
    checkedItems,
    currentSubtotal,
    calculatedDiscount,
    finalTotal,
    percentBudgetUsed,
  } = useMemo(() => {
    const checked = card.items.filter((item) => checkedMap[item.id] !== false);
    const subtotal = checked.reduce((acc, it) => acc + it.price, 0);

    // Proportionate discount from original bundle discount ratio
    const discountRatio =
      card.original_price_cents > 0
        ? card.discount_cents / card.original_price_cents
        : 0.1;
    const discount = Math.round(subtotal * discountRatio);
    const total = Math.max(0, subtotal - discount);

    const budget = card.budget_cents || 30000;
    const percent = Math.min(100, Math.round((total / budget) * 100));

    return {
      checkedItems: checked,
      currentSubtotal: subtotal,
      calculatedDiscount: discount,
      finalTotal: total,
      percentBudgetUsed: percent,
    };
  }, [card, checkedMap]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3.5 w-full bg-linear-to-b from-card via-card to-muted/20 border border-violet-500/30 dark:border-violet-500/20 rounded-2xl p-4.5 shadow-md space-y-4"
    >
      {/* Title & Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            {card.theme
              ? `${card.theme.toUpperCase()} BUNDLE`
              : "CURATED BUNDLE"}
          </span>
          <h3 className="text-base font-bold text-foreground mt-1.5">
            {card.title}
          </h3>
        </div>

        {card.coupon_code && (
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-2.5 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              {card.coupon_code}
            </span>
          </div>
        )}
      </div>

      {/* Budget Bar */}
      <div className="bg-muted/50 rounded-xl p-3 border border-border/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Target Budget Tracker:</span>
          <span className="text-foreground font-bold">
            ${(finalTotal / 100).toFixed(2)} / $
            {(card.budget_cents / 100).toFixed(2)}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-300 ${
              percentBudgetUsed > 90
                ? "bg-amber-500"
                : "bg-linear-to-r from-violet-500 to-emerald-500"
            }`}
            style={{ width: `${percentBudgetUsed}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground flex justify-between">
          <span>{percentBudgetUsed}% of budget used</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Under budget by $
            {((card.budget_cents - finalTotal) / 100).toFixed(2)}
          </span>
        </p>
      </div>

      {/* Item Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-0.5">
          <span>
            Bundle Items ({checkedItems.length} of {card.items.length}{" "}
            selected):
          </span>
          <span className="text-[11px] text-violet-600 dark:text-violet-400">
            Click to toggle
          </span>
        </div>

        {card.items.map((item) => {
          const isChecked = checkedMap[item.id] !== false;
          const imageSrc = item.images?.[0] || "/icons8-image-100.png";

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                isChecked
                  ? "bg-card border-border hover:border-violet-500/40 shadow-2xs"
                  : "bg-muted/30 border-dashed border-border/60 opacity-50 hover:opacity-75"
              }`}
            >
              {/* Checkbox circle */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  isChecked
                    ? "bg-violet-600 text-white"
                    : "border border-border/80 bg-background"
                }`}
              >
                {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>

              {/* Item Thumbnail */}
              <div className="w-11 h-11 rounded-lg bg-muted/60 relative overflow-hidden border border-border/60 shrink-0">
                <Image
                  src={imageSrc}
                  alt={item.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground truncate">
                  {item.name}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.brand || "ShopSwift"} • {item.sku || "IN-STOCK"}
                </p>
              </div>

              {/* Item Price */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-foreground">
                  ${(item.price / 100).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Financial Summary */}
      <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal:</span>
          <span>${(currentSubtotal / 100).toFixed(2)}</span>
        </div>
        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Coupon Discount ({card.coupon_code}):</span>
            <span>-${(calculatedDiscount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-1 border-t border-border/40 font-bold text-sm text-foreground">
          <span>Bundle Total:</span>
          <span className="text-base text-violet-600 dark:text-violet-400">
            ${(finalTotal / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* 1-Click Add To Cart Action */}
      <button
        onClick={onAddBundle}
        disabled={checkedItems.length === 0}
        className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-violet-600 via-indigo-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingBag className="h-4 w-4" />
        Add All {checkedItems.length} Items to Cart ($
        {(finalTotal / 100).toFixed(2)})
      </button>
    </motion.div>
  );
};
