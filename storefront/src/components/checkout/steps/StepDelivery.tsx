import {
  SHIPPING_OPTIONS,
  SLIDE_VARIANTS,
} from "@/components/checkout/checkoutConstants";
import {
  formatGBP,
  getDeliveryDate,
} from "@/components/checkout/checkoutUtils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Truck } from "lucide-react";

/** Props accepted by {@link StepDelivery}. */
interface StepDeliveryProps {
  /** Currently selected delivery method id, e.g. `"standard"` or `"express"`. */
  shippingMethod: string;
  /** Slide direction passed to the motion variants. */
  direction: number;
  /**
   * Selects a new delivery method.
   *
   * @param id - Id of the chosen option in {@link SHIPPING_OPTIONS}.
   */
  onSelectMethod: (id: string) => void;
}

/**
 * Renders step 3 of the checkout wizard: the delivery method picker.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <StepDelivery shippingMethod={shippingMethod} direction={direction} onSelectMethod={setShippingMethod} />
 * ```
 */
export function StepDelivery({
  shippingMethod,
  direction,
  onSelectMethod,
}: StepDeliveryProps) {
  return (
    <motion.section
      key="step-3"
      custom={direction}
      variants={SLIDE_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="rounded-lg bg-surface border border-border"
      aria-label="Step 3: Delivery Method"
      data-step="3"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Delivery Method
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred shipping timeline.
            </p>
          </div>
        </div>

        <div
          className="space-y-3"
          role="radiogroup"
          aria-label="Delivery options"
        >
          {SHIPPING_OPTIONS.map((opt) => {
            const isSelected = shippingMethod === opt.id;
            return (
              <motion.button
                key={opt.id}
                onClick={() => onSelectMethod(opt.id)}
                whileTap={{ scale: 0.99 }}
                className={`w-full text-left rounded-lg border p-4 transition-colors ${
                  isSelected
                    ? "border-foreground bg-muted/40 shadow-xs"
                    : "border-border hover:border-foreground/40 bg-background"
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${opt.label} - ${opt.time} - ${formatGBP(opt.price)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">
                          {opt.label}
                        </p>
                        {opt.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 font-normal"
                          >
                            {opt.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opt.sub}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        Estimated arrival: {getDeliveryDate(opt.days)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-foreground shrink-0 ml-4">
                    {opt.price === 0 ? "Free" : formatGBP(opt.price)}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
