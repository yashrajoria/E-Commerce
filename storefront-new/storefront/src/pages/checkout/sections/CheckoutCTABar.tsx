import { formatGBP } from "../checkoutUtils";
import { motion } from "framer-motion";
import { ChevronRight, ChevronUp, Lock, ShoppingBag } from "lucide-react";

interface Props {
  itemCount: number;
  total: number;
  isProcessing: boolean;
  currentStep: number;
  ctaLabel: string;
  onAction: () => void;
  onShowSummary: () => void;
}

export function CheckoutCTABar({
  itemCount,
  total,
  isProcessing,
  currentStep,
  ctaLabel,
  onAction,
  onShowSummary,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Mobile summary toggle */}
        <button
          onClick={onShowSummary}
          className="flex items-center gap-2 min-h-12 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0 lg:hidden"
          aria-label="View order summary"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{itemCount}</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>

        {/* Total on desktop */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 shrink-0">
          <ShoppingBag className="h-4 w-4" />
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">
            {formatGBP(total)}
          </span>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={onAction}
          disabled={isProcessing}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 h-13 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
            isProcessing
              ? "bg-neutral-400 cursor-not-allowed"
              : "bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 active:scale-[0.98]"
          }`}
          aria-label={ctaLabel}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing…
            </>
          ) : (
            <>
              {ctaLabel}
              {currentStep < 4 && <ChevronRight className="h-5 w-5" />}
              {currentStep === 4 && <Lock className="h-4 w-4" />}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
