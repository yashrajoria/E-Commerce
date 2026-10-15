"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  Package,
  PauseCircle,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SubscriptionItem {
  id: string;
  productName: string;
  image: string;
  frequency: "2_weeks" | "4_weeks" | "8_weeks";
  price: number;
  originalPrice: number;
  status: "active" | "paused";
  nextDispatchDate: string;
}

const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: "sub-101",
    productName: "Signature Dark Roast Espresso Beans (1kg)",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80",
    frequency: "4_weeks",
    price: 24.65,
    originalPrice: 29.0,
    status: "active",
    nextDispatchDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  },
  {
    id: "sub-102",
    productName: "Organic Botanical Hydrating Face Cleanser",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    frequency: "8_weeks",
    price: 18.7,
    originalPrice: 22.0,
    status: "active",
    nextDispatchDate: new Date(Date.now() + 28 * 86400000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  },
];

export function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);

  const togglePause = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        const nextStatus = sub.status === "active" ? "paused" : "active";
        toast.info(
          nextStatus === "paused"
            ? `Paused subscription for ${sub.productName}`
            : `Resumed subscription for ${sub.productName}!`
        );
        return { ...sub, status: nextStatus };
      })
    );
  };

  const handleFrequencyChange = (id: string, newFreq: "2_weeks" | "4_weeks" | "8_weeks") => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, frequency: newFreq } : sub))
    );
    toast.success("Delivery frequency updated!");
  };

  const handleSkipNext = (id: string) => {
    const nextDate = new Date(Date.now() + 35 * 86400000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, nextDispatchDate: nextDate } : sub))
    );
    toast.info("Skipped next dispatch. Next delivery pushed by 1 cycle.");
  };

  const handleCancel = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    toast.success("Subscription cancelled successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Subscribe & Save Member Perks Active
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enjoying 15% guaranteed recurring discount, free tracked express shipping, and flexible skip/pause controls.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 font-bold shrink-0">
          VIP Replenishment Tier
        </Badge>
      </div>

      {/* Subscription Cards List */}
      {subscriptions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl">
          <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-foreground">No Active Subscriptions</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            You don&apos;t have any active product subscriptions yet. Look for the &quot;Subscribe &amp; Save 15%&quot; toggle on any product page.
          </p>
          <Button asChild size="sm" className="text-xs font-semibold gap-1">
            <Link href="/products">
              Explore Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const isPaused = sub.status === "paused";
            return (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted/40 shrink-0 border border-border">
                      <Image
                        src={sub.image}
                        alt={sub.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {sub.productName}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold ${
                            isPaused
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}
                        >
                          {isPaused ? "Paused" : "Active"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Next Dispatch: <strong className="text-foreground">{sub.nextDispatchDate}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                      <span className="text-base font-bold text-foreground">
                        {formatGBP(sub.price)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatGBP(sub.originalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Saved 15% on each renewal
                    </span>
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Cadence:</span>
                    <select
                      value={sub.frequency}
                      onChange={(e) =>
                        handleFrequencyChange(
                          sub.id,
                          e.target.value as "2_weeks" | "4_weeks" | "8_weeks"
                        )
                      }
                      className="bg-background border border-border rounded-md px-2 py-1 text-xs font-medium text-foreground focus:outline-hidden"
                    >
                      <option value="2_weeks">Every 2 Weeks</option>
                      <option value="4_weeks">Every 4 Weeks</option>
                      <option value="8_weeks">Every 8 Weeks</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSkipNext(sub.id)}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Skip Next Dispatch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePause(sub.id)}
                      className="h-8 text-xs gap-1"
                    >
                      {isPaused ? (
                        <>
                          <PlayCircle className="h-3.5 w-3.5 text-emerald-600" /> Resume
                        </>
                      ) : (
                        <>
                          <PauseCircle className="h-3.5 w-3.5 text-amber-600" /> Pause
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(sub.id)}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
