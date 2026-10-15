import * as React from "react";
import { cn } from "../lib/utils";

/** Props accepted by {@link PriceDisplay}. */
export interface PriceDisplayProps {
  /** Current price, in the same unit convention as {@link formatCurrency}. */
  amount: number;
  /** Pre-discount price; when greater than `amount` the original price is struck through. */
  originalAmount?: number;
  /**
   * ISO 4217 currency code used for formatting.
   *
   * @defaultValue "GBP"
   */
  currency?: string;
  /**
   * Text size and weight of the primary price.
   *
   * @defaultValue "default"
   */
  size?: "sm" | "default" | "lg" | "xl";
  /** Extra classes merged onto the inline price row. */
  className?: string;
  /**
   * Shows a percentage-off badge next to a discounted price.
   *
   * @defaultValue false
   */
  showSaleBadge?: boolean;
}

/**
 * Formats a numeric amount as localized currency, handling the mixed pence/pounds units used across ShopSwift.
 *
 * @remarks
 * The backend stores some amounts in pennies (Stripe, database columns) and others as decimals. Whole numbers
 * greater than `9999` are treated as minor units and divided by `100`; everything else is used as-is. Only
 * integer amounts can take the minor-unit branch, so decimal inputs are never scaled.
 *
 * @param amount - Value in major units (e.g. pounds), or in minor units (e.g. pence) when it is a whole number above `9999`.
 * @param currency - ISO 4217 currency code to format with; defaults to `"GBP"`.
 * @returns The amount as an `en-GB` currency string with exactly two fraction digits, e.g. `"£1,240.00"`.
 *
 * @example
 * ```ts
 * formatCurrency(1240); // "£1,240.00"
 * formatCurrency(124000); // "£1,240.00" (pence input, auto-scaled)
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = "GBP",
): string {
  // Check if amount is already in pence (integer > 1000 without decimal) or pounds
  // ShopSwift backend uses pennies for stripe/DB in some places and decimal in others
  const value =
    amount > 9999 && Number.isInteger(amount) ? amount / 100 : amount;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Renders a formatted price, with an optional struck-through original price and sale badge.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <PriceDisplay amount={2499} originalAmount={3299} size="lg" showSaleBadge />
 * ```
 */
export function PriceDisplay({
  amount,
  originalAmount,
  currency = "GBP",
  size = "default",
  className,
  showSaleBadge = false,
}: PriceDisplayProps) {
  const isSale = Boolean(originalAmount && originalAmount > amount);
  const discountPercent =
    isSale && originalAmount
      ? Math.round(((originalAmount - amount) / originalAmount) * 100)
      : 0;

  const sizeClasses = {
    sm: "text-xs font-semibold",
    default: "text-sm font-semibold",
    lg: "text-base sm:text-lg font-bold",
    xl: "text-xl sm:text-2xl font-bold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-2 font-mono tracking-tight",
        className,
      )}
    >
      <span className={cn(sizeClasses[size], "text-foreground")}>
        {formatCurrency(amount, currency)}
      </span>
      {isSale && originalAmount && (
        <span className="text-xs text-muted-foreground line-through font-normal">
          {formatCurrency(originalAmount, currency)}
        </span>
      )}
      {showSaleBadge && isSale && discountPercent > 0 && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent-foreground">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
