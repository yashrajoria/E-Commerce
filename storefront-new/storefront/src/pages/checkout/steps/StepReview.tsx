import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SLIDE_VARIANTS } from "../checkoutConstants";
import { formatGBP } from "../checkoutUtils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Package,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: string | number;
  name: string;
  images?: string[];
  price: number;
  quantity: number;
}

interface StepReviewProps {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  discountAmount: number;
  total: number;
  shippingMethod: string;
  promoCode: string;
  promoExpanded: boolean;
  promoError: string;
  direction: number;
  onPromoCodeChange: (code: string) => void;
  onPromoExpandChange: (expanded: boolean) => void;
  onApplyPromo: () => void;
}

export function StepReview({
  cart,
  subtotal,
  shipping,
  tax,
  discount,
  discountAmount,
  total,
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
      {/* ── Order items ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
            Order Summary
          </h2>
        </div>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                <Image
                  src={item.images?.[0] || "/icons8-image-100.png"}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 shrink-0">
                {formatGBP(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Promo code — expandable */}
        <div className="mt-6">
          <button
            onClick={() => onPromoExpandChange(!promoExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
            aria-expanded={promoExpanded}
          >
            <Tag className="h-4 w-4" />
            Have a promo code?
            {promoExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
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
                    className="h-10 rounded-xl"
                    aria-label="Promo code"
                  />
                  <Button
                    onClick={onApplyPromo}
                    variant="outline"
                    className="h-10 rounded-xl px-5 shrink-0"
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-sm text-rose-600 dark:text-rose-400 mt-2">
                    {promoError}
                  </p>
                )}
                {discount > 0 && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                    SAVE10 applied — 10% discount!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Pricing breakdown ── */}
        <Separator className="my-6" />
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>Subtotal</span>
            <span>{formatGBP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>
              Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
            </span>
            <span>{formatGBP(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>Tax</span>
            <span>{formatGBP(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 font-medium">
              <span>Discount</span>
              <span>-{formatGBP(discountAmount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg pt-1">
            <span className="text-neutral-900 dark:text-neutral-100">
              Total
            </span>
            <span className="text-gradient-premium">{formatGBP(total)}</span>
          </div>
        </div>
      </div>

      {/* ── Trust signals ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                256-bit SSL
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Encryption
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Free Returns
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Within 30 days
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Lock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Secure Payment
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Data never stored
              </p>
            </div>
          </div>
        </div>

        {/* Payment method logos */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {["Visa", "Mastercard", "Amex"].map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
