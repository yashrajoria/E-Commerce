"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatGBP } from "@/lib/utils";
import { RefreshCw, Sparkles } from "lucide-react";
import type { SubscriptionPlanOption } from "@/lib/types";

interface SubscriptionPurchaseSelectorProps {
  basePrice: number;
  selectedPlan: SubscriptionPlanOption;
  onChange: (plan: SubscriptionPlanOption) => void;
}

export const FREQUENCIES = [
  { value: "2_weeks", label: "Every 2 Weeks" },
  { value: "4_weeks", label: "Every 4 Weeks (Most Popular)" },
  { value: "8_weeks", label: "Every 8 Weeks" },
] as const;

export function SubscriptionPurchaseSelector({
  basePrice,
  selectedPlan,
  onChange,
}: SubscriptionPurchaseSelectorProps) {
  const discountPercent = 15;
  const subscriptionPrice = Number((basePrice * (1 - discountPercent / 100)).toFixed(2));
  const isSub = selectedPlan.isSubscription;

  return (
    <div className="space-y-3 pt-2">
      {/* Option 1: One-time Purchase */}
      <div
        onClick={() =>
          onChange({
            isSubscription: false,
            frequency: selectedPlan.frequency,
            discountPercent: 0,
          })
        }
        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
          !isSub
            ? "border-primary bg-primary/5 ring-1 ring-primary"
            : "border-border hover:border-border/80 bg-background"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
              !isSub ? "border-primary bg-primary" : "border-muted-foreground"
            }`}
          >
            {!isSub && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground block">One-time purchase</span>
            <span className="text-[11px] text-muted-foreground">Standard delivery without renewal</span>
          </div>
        </div>
        <span className="text-sm font-bold text-foreground">{formatGBP(basePrice)}</span>
      </div>

      {/* Option 2: Subscribe & Save (15% Off) */}
      <div
        onClick={() =>
          onChange({
            isSubscription: true,
            frequency: selectedPlan.frequency,
            discountPercent,
          })
        }
        className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
          isSub
            ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/30"
            : "border-border hover:border-border/80 bg-background"
        }`}
      >
        <div className="absolute -top-2.5 right-3">
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-xs">
            <Sparkles className="h-2.5 w-2.5 mr-1" /> Save 15% Forever
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSub ? "border-emerald-600 bg-emerald-600" : "border-muted-foreground"
              }`}
            >
              {isSub && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Subscribe & Replenish</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  (Save {formatGBP(basePrice - subscriptionPrice)})
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Auto-dispatched with free shipping. Pause or cancel anytime.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatGBP(subscriptionPrice)}
            </span>
            <span className="block text-[10px] text-muted-foreground line-through">
              {formatGBP(basePrice)}
            </span>
          </div>
        </div>

        {/* Frequency selector dropdown when subscription is active */}
        {isSub && (
          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin-reverse" />
              Delivery Frequency:
            </span>
            <select
              value={selectedPlan.frequency}
              onChange={(e) =>
                onChange({
                  isSubscription: true,
                  frequency: e.target.value as "2_weeks" | "4_weeks" | "8_weeks",
                  discountPercent,
                })
              }
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
