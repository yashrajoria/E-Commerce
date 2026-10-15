import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SLIDE_VARIANTS } from "@/components/checkout/checkoutConstants";
import { formatGBP } from "@/components/checkout/checkoutUtils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Coins,
  Lock,
  Package,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/** Minimal cart line shape reviewed on the checkout step. */
interface CartItem {
  /** Product identifier. */
  id: string | number;
  /** Product display name. */
  name: string;
  /** Product image URLs; the first usable one is rendered. */
  images?: string[];
  /** Unit price in major currency units (GBP). */
  price: number;
  /** Number of units ordered. */
  quantity: number;
}

/** Props accepted by {@link StepReview}. */
interface StepReviewProps {
  /** Cart lines included in the order. */
  cart: CartItem[];
  /** Order subtotal in major currency units (GBP). */
  subtotal: number;
  /** Shipping cost in major currency units. */
  shipping: number;
  /** Estimated tax in major currency units. */
  tax: number;
  /** Relative discount multiplier applied to the subtotal. */
  discount: number;
  /** Absolute discount amount in major currency units. */
  discountAmount: number;
  /** Total before store credit; used to cap the credit amount, falling back to `total` when omitted. */
  grossTotal?: number;
  /** Final total to pay after discounts and store credit. */
  total: number;
  /** Customer's available store credit in minor units (pence); the credit panel renders only when positive. */
  storeCreditBalance?: number;
  /** Portion of store credit to apply in minor units (pence). */
  storeCreditAmount?: number;
  /** Whether the user has ticked "Apply credit to this order". */
  applyStoreCredit?: boolean;
  /**
   * Toggles the store-credit checkbox.
   *
   * @param apply - Whether store credit should be applied.
   */
  onApplyStoreCreditChange?: (apply: boolean) => void;
  /**
   * Sets the store-credit amount in minor units (pence).
   *
   * @param amount - Clamped credit amount.
   */
  onStoreCreditAmountChange?: (amount: number) => void;
  /** Selected delivery method id; only `"express"` changes the summary label. */
  shippingMethod: string;
  /** Current promo code input value. */
  promoCode: string;
  /** Whether the promo code field is expanded. */
  promoExpanded: boolean;
  /** Validation message for the promo code, if any. */
  promoError: string;
  /** Slide direction passed to the motion variants. */
  direction: number;
  /**
   * Updates the promo code input value.
   *
   * @param code - New code typed by the user.
   */
  onPromoCodeChange: (code: string) => void;
  /**
   * Expands or collapses the promo code field.
   *
   * @param expanded - Whether the field should be shown.
   */
  onPromoExpandChange: (expanded: boolean) => void;
  /** Validates and applies the entered promo code. */
  onApplyPromo: () => void;
}

/** Props accepted by {@link ReviewItemRow}. */
interface ReviewItemRowProps {
  /** Cart line to display in the review list. */
  item: CartItem;
}

/**
 * Renders a single cart line in the review step's order summary.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ReviewItemRow item={item} />
 * ```
 */
function ReviewItemRow({ item }: ReviewItemRowProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImage = item.images?.[0];
  const isLocalStack = rawImage?.includes("localhost:4566");
  const hasValidImage = rawImage && !isLocalStack && !imageFailed;

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border">
      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={item.name}
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Package className="h-5 w-5 text-muted-foreground/40" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-xs text-foreground truncate">
          {item.name}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Qty: {item.quantity}
        </p>
      </div>
      <p className="font-semibold text-xs text-foreground shrink-0">
        {formatGBP(item.price * item.quantity)}
      </p>
    </div>
  );
}

/**
 * Renders step 4 of the checkout wizard: order summary, promo code and store credit.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <StepReview
 *   cart={cart}
 *   subtotal={subtotal}
 *   shipping={shipping}
 *   tax={tax}
 *   discount={discount}
 *   discountAmount={discountAmount}
 *   grossTotal={grossTotal}
 *   total={total}
 *   storeCreditBalance={storeCreditBalance}
 *   storeCreditAmount={storeCreditAmount}
 *   applyStoreCredit={applyStoreCredit}
 *   onApplyStoreCreditChange={setApplyStoreCredit}
 *   onStoreCreditAmountChange={setStoreCreditAmount}
 *   shippingMethod={shippingMethod}
 *   promoCode={promoCode}
 *   promoExpanded={promoExpanded}
 *   promoError={promoError}
 *   direction={direction}
 *   onPromoCodeChange={setPromoCode}
 *   onPromoExpandChange={setPromoExpanded}
 *   onApplyPromo={applyPromo}
 * />
 * ```
 */
export function StepReview({
  cart,
  subtotal,
  shipping,
  tax,
  discount,
  discountAmount,
  grossTotal,
  total,
  storeCreditBalance,
  storeCreditAmount,
  applyStoreCredit,
  onApplyStoreCreditChange,
  onStoreCreditAmountChange,
  shippingMethod,
  promoCode,
  promoExpanded,
  promoError,
  direction,
  onPromoCodeChange,
  onPromoExpandChange,
  onApplyPromo,
}: StepReviewProps) {
  return (
    <motion.section
      key="step-4"
      custom={direction}
      variants={SLIDE_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-4"
      aria-label="Step 4: Review and Payment"
    >
      <div className="rounded-lg bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Order Summary
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review your bag before confirming the order.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {cart.map((item) => (
            <ReviewItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={() => onPromoExpandChange(!promoExpanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline transition-colors"
            aria-expanded={promoExpanded}
          >
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Have a promo code?</span>
            {promoExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <AnimatePresence>
            {promoExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => onPromoCodeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onApplyPromo();
                    }}
                    className="h-9 text-xs"
                    aria-label="Promo code"
                  />
                  <Button
                    onClick={onApplyPromo}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 shrink-0 text-xs"
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-xs text-destructive mt-2">{promoError}</p>
                )}
                {discount > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                    {promoCode.trim() || "Promo"} applied —{" "}
                    {formatGBP(discountAmount)} off
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Store Credit Option */}
          {typeof storeCreditBalance === "number" && storeCreditBalance > 0 && (
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">
                    ShopSwift Store Credit
                  </span>
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {formatGBP(storeCreditBalance / 100)} available
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                    checked={Boolean(applyStoreCredit)}
                    onChange={(e) =>
                      onApplyStoreCreditChange?.(e.target.checked)
                    }
                  />
                  <span className="text-foreground font-medium">
                    Apply credit to this order
                  </span>
                </label>
                {applyStoreCredit && onStoreCreditAmountChange && (
                  <button
                    type="button"
                    onClick={() => {
                      const maxUsable = Math.min(
                        storeCreditBalance,
                        Math.round((grossTotal ?? total) * 100),
                      );
                      onStoreCreditAmountChange(maxUsable);
                    }}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Use max
                  </button>
                )}
              </div>

              {applyStoreCredit && onStoreCreditAmountChange && (
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Amount: £
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={
                        Math.min(
                          storeCreditBalance,
                          Math.round((grossTotal ?? total) * 100),
                        ) / 100
                      }
                      value={((storeCreditAmount ?? 0) / 100).toFixed(2)}
                      onChange={(e) => {
                        const parsedPounds = parseFloat(e.target.value) || 0;
                        const parsedMinor = Math.round(parsedPounds * 100);
                        const maxUsable = Math.min(
                          storeCreditBalance,
                          Math.round((grossTotal ?? total) * 100),
                        );
                        onStoreCreditAmountChange(
                          Math.max(0, Math.min(maxUsable, parsedMinor)),
                        );
                      }}
                      className="h-8 text-xs font-medium w-32"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator className="my-5" />
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">
              {formatGBP(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>
              Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
            </span>
            <span className="font-medium text-foreground">
              {shipping === 0 ? "Free" : formatGBP(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Tax (8%)</span>
            <span className="font-medium text-foreground">
              {formatGBP(tax)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Discount</span>
              <span>-{formatGBP(discountAmount)}</span>
            </div>
          )}
          {Boolean(applyStoreCredit) &&
            typeof storeCreditAmount === "number" &&
            storeCreditAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3" /> Store Credit Applied
                </span>
                <span>-{formatGBP(storeCreditAmount / 100)}</span>
              </div>
            )}
          <Separator />
          <div className="flex justify-between font-semibold text-sm pt-1">
            <span className="text-foreground">Total to Pay</span>
            <span
              className={
                total <= 0 ? "text-emerald-600 font-bold" : "text-foreground"
              }
            >
              {total <= 0 ? "£0.00 (Fully Covered)" : formatGBP(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-surface border border-border p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                256-bit SSL
              </p>
              <p className="text-[11px] text-muted-foreground">
                Encrypted checkout
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Free Returns
              </p>
              <p className="text-[11px] text-muted-foreground">30-day window</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Secure Details
              </p>
              <p className="text-[11px] text-muted-foreground">Never stored</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
          {["Visa", "Mastercard", "Amex"].map((brand) => (
            <span
              key={brand}
              className="px-2.5 py-1 text-[11px] font-medium bg-muted text-muted-foreground rounded"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
