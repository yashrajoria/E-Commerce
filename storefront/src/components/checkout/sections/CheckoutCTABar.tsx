import { formatGBP } from "@/components/checkout/checkoutUtils";
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
