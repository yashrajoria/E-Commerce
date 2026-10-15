import { formatGBP } from "@/components/checkout/checkoutUtils";
import { motion } from "framer-motion";
import { ChevronRight, ChevronUp, Lock, ShoppingBag } from "lucide-react";

/** Props accepted by {@link CheckoutCTABar}. */
interface CheckoutCTABarProps {
  /** Total number of units in the cart, shown next to the bag icon. */
  itemCount: number;
  /** Order total in major currency units (GBP). */
  total: number;
  /** Disables the primary button and swaps its label for a spinner while the order is submitted. */
  isProcessing: boolean;
  /** Current wizard step; the last step swaps the chevron for a lock icon. */
  currentStep: number;
  /** Label of the primary action, e.g. `"Continue to Shipping"`. */
  ctaLabel: string;
  /** Primary action: advance a step or place the order on the review step. */
  onAction: () => void;
  /** Opens the mobile order summary sheet. */
  onShowSummary: () => void;
}

/**
 * Renders the sticky bottom action bar for the checkout wizard.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CheckoutCTABar
 *   itemCount={itemCount}
 *   total={total}
 *   isProcessing={isProcessing}
 *   currentStep={currentStep}
 *   ctaLabel={ctaLabel}
 *   onAction={currentStep === 4 ? completeOrder : goNext}
 *   onShowSummary={() => setShowMobileSummary(true)}
 * />
 * ```
 */
export function CheckoutCTABar({
  itemCount,
  total,
  isProcessing,
  currentStep,
  ctaLabel,
  onAction,
  onShowSummary,
}: CheckoutCTABarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={onShowSummary}
          className="flex items-center gap-2 h-11 px-3 rounded-md bg-muted text-xs font-medium text-foreground shrink-0 lg:hidden"
          aria-label="View order summary"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{itemCount}</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <ShoppingBag className="h-4 w-4" />
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-semibold text-foreground">
            {formatGBP(total)}
          </span>
        </div>

        <motion.button
          onClick={onAction}
          disabled={isProcessing}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs ${
            isProcessing
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
          }`}
          aria-label={ctaLabel}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
              />
              <span>Processing…</span>
            </>
          ) : (
            <>
              <span>{ctaLabel}</span>
              {currentStep < 4 && <ChevronRight className="h-4 w-4" />}
              {currentStep === 4 && <Lock className="h-4 w-4" />}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
