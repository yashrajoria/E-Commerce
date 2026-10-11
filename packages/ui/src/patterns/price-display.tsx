import * as React from "react";
import { cn } from "../lib/utils";

export interface PriceDisplayProps {
  amount: number;
  originalAmount?: number;
  currency?: string;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  showSaleBadge?: boolean;
}

export function formatCurrency(amount: number, currency: string = "GBP"): string {
  // Check if amount is already in pence (integer > 1000 without decimal) or pounds
  // ShopSwift backend uses pennies for stripe/DB in some places and decimal in others
  const value = amount > 9999 && Number.isInteger(amount) ? amount / 100 : amount;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PriceDisplay({
  amount,
  originalAmount,
  currency = "GBP",
  size = "default",
  className,
  showSaleBadge = false,
}: PriceDisplayProps) {
  const isSale = Boolean(originalAmount && originalAmount > amount);
  const discountPercent = isSale && originalAmount
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-xs font-semibold",
    default: "text-sm font-semibold",
    lg: "text-base sm:text-lg font-bold",
    xl: "text-xl sm:text-2xl font-bold",
  };

  return (
    <div className={cn("inline-flex items-baseline gap-2 font-mono tracking-tight", className)}>
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
