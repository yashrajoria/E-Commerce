"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Printer,
  X,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatGBP } from "@/lib/utils";
import Link from "next/link";
import type { ReturnSubmitResponse } from "@/pages/api/user/returns/submit";

/** Props accepted by {@link ReturnExchangeModal}. */
interface ReturnExchangeModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Closes the modal and resets the wizard to step 1. */
  onClose: () => void;
  /** Order being returned, or `null` when nothing is selected. */
  order: {
    /** Order identifier. */
    id: string;
    /** Human-readable order number; falls back to a prefix of `id`. */
    order_number?: string;
    /** Order total in major currency units, used when line items are missing. */
    total?: number;
    /** Alternative total field used when `total` is absent. */
    total_amount?: number;
    /** Line items available to return. */
    items?: Array<{
      /** Line-item identifier. */
      id?: string;
      /** Product identifier. */
      product_id?: string;
      /** Product display name; preferred over `name`. */
      product_name?: string;
      /** Fallback product display name. */
      name?: string;
      /** Unit price in major currency units (GBP). */
      price: number;
      /** Number of units in the order. */
      quantity: number;
      /** Optional product image URL. */
      image?: string;
    }>;
  } | null;
}

const REASONS = [
  "Wrong Size or Fit",
  "Item Defective or Damaged",
  "Different from Picture / Website",
  "Arrived Too Late",
  "Changed My Mind",
];

/**
 * Renders the three-step return and exchange flow for a recent order.
 *
 * @remarks
 * Client Component — declares `"use client"`. Posts the selected item, reason and resolution type to
 * `/api/user/returns/submit`; `instant_exchange` issues an immediate store-credit voucher with a £5 bonus, while
 * `standard_refund` registers a refund against the original payment method.
 *
 * @example
 * ```tsx
 * <ReturnExchangeModal
 *   isOpen={!!selectedOrderForReturn}
 *   order={selectedOrderForReturn}
 *   onClose={() => setSelectedOrderForReturn(null)}
 * />
 * ```
 */
export function ReturnExchangeModal({
  isOpen,
  onClose,
  order,
}: ReturnExchangeModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<string>(REASONS[0]);
  const [resolutionType, setResolutionType] = useState<
    "instant_exchange" | "standard_refund"
  >("instant_exchange");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnSubmitResponse | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const items =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            id: "item-default",
            product_name: "Order Items Package",
            name: "Order Items Package",
            price: order.total || order.total_amount || 49.99,
            quantity: 1,
          },
        ];

  const currentItem = items[selectedItemIndex] || items[0];
  const itemPrice = currentItem.price || 49.99;
  const itemName =
    currentItem.product_name || currentItem.name || "Product Item";
  const orderNumber = order.order_number || `ORD-${order.id.slice(0, 8)}`;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/returns/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber,
          productName: itemName,
          amount: itemPrice,
          reason: selectedReason,
          resolutionType,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      const data: ReturnSubmitResponse = await res.json();
      setResult(data);
      setStep(3);
      toast.success(
        resolutionType === "instant_exchange"
          ? "Instant exchange issued with +£5 bonus credit!"
          : "Return registered successfully!",
      );
    } catch {
      toast.error("Failed to process return. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Coupon code copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAndClose = () => {
    setStep(1);
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  Instant Return & Exchange
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-primary/5 text-primary border-primary/20"
                  >
                    Order #{orderNumber}
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Step {step} of 3 —{" "}
                  {step === 1
                    ? "Select Item & Reason"
                    : step === 2
                      ? "Choose Resolution"
                      : "Confirmation"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAndClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    1. Select item to return:
                  </label>
                  <div className="space-y-2">
                    {items.map((item, idx) => {
                      const isSelected = selectedItemIndex === idx;
                      return (
                        <div
                          key={item.id || idx}
                          onClick={() => setSelectedItemIndex(idx)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-border/80 bg-background"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-foreground">
                              {item.product_name || item.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {formatGBP(item.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    2. Reason for return / exchange:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedReason(r)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                          selectedReason === r
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-border/80 text-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold gap-1.5"
                  >
                    Continue to Resolution{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <p className="text-xs text-muted-foreground">
                  How would you like to resolve this return for{" "}
                  <strong className="text-foreground">{itemName}</strong> (
                  {formatGBP(itemPrice)})?
                </p>

                {/* Resolution Choice Cards */}
                <div className="space-y-3">
                  {/* Option 1: Instant Exchange + £5 Bonus */}
                  <div
                    onClick={() => setResolutionType("instant_exchange")}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      resolutionType === "instant_exchange"
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] font-bold">
                        <Sparkles className="h-3 w-3 mr-1" /> +£5 Bonus Credit
                      </Badge>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Instant Exchange Credit (+£5 Bonus)
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive an immediate store credit voucher worth{" "}
                          <strong className="text-foreground">
                            {formatGBP(itemPrice + 5)}
                          </strong>{" "}
                          to use on any item right now! No waiting for carrier
                          transit.
                        </p>
                        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Code generated immediately upon submit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Standard Refund */}
                  <div
                    onClick={() => setResolutionType("standard_refund")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      resolutionType === "standard_refund"
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                        <RotateCcw className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Standard Refund
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Refund{" "}
                          <strong className="text-foreground">
                            {formatGBP(itemPrice)}
                          </strong>{" "}
                          back to your original payment method. Funds arrive in
                          3–5 business days after carrier drop-off.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="text-xs font-semibold gap-1.5"
                  >
                    {loading ? (
                      "Processing..."
                    ) : resolutionType === "instant_exchange" ? (
                      <>
                        Confirm Instant Exchange & Get £{itemPrice + 5}{" "}
                        <Sparkles className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      "Confirm Standard Return"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && result && (
              <div className="space-y-5 text-center py-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {result.resolutionType === "instant_exchange"
                      ? "Instant Exchange Approved!"
                      : "Return Registered Successfully"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Return Reference:{" "}
                    <strong className="text-foreground">
                      {result.returnNumber}
                    </strong>
                  </p>
                </div>

                {/* Instant Exchange Voucher Card */}
                {result.resolutionType === "instant_exchange" &&
                  result.exchangeCouponCode && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Store Credit Voucher Ready
                        </span>
                        <Badge className="bg-emerald-600 text-white font-bold text-xs">
                          Value:{" "}
                          {formatGBP(result.totalCreditAmount ?? itemPrice + 5)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border">
                        <span className="font-mono font-bold text-sm text-foreground tracking-wider flex-1">
                          {result.exchangeCouponCode}
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyCoupon(result.exchangeCouponCode!)}
                          className="h-7 text-xs gap-1 font-semibold"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copied ? "Copied" : "Copy Code"}
                        </Button>
                      </div>

                      <p className="text-[11px] text-muted-foreground">
                        Includes your{" "}
                        <strong className="text-foreground">
                          £5.00 bonus credit
                        </strong>
                        . Automatically applies at checkout!
                      </p>
                    </div>
                  )}

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.info("Generating return slip & label...");
                      window.print();
                    }}
                    className="text-xs gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Prepaid Return
                    Label
                  </Button>

                  {result.resolutionType === "instant_exchange" && (
                    <Button
                      asChild
                      className="text-xs font-semibold gap-1.5"
                      onClick={resetAndClose}
                    >
                      <Link href="/products">
                        Shop With Credit Now{" "}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
