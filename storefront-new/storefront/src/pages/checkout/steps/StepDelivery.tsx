import { SHIPPING_OPTIONS, SLIDE_VARIANTS } from "../checkoutConstants";
import { formatGBP, getDeliveryDate } from "../checkoutUtils";
import { motion } from "framer-motion";
import { Check, Truck } from "lucide-react";

interface StepDeliveryProps {
  shippingMethod: string;
  direction: number;
  onSelectMethod: (id: string) => void;
}

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
      className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
      aria-label="Step 3: Delivery Method"
      data-step="3"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
              Delivery Method
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Choose how you&apos;d like to receive your order
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
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 min-h-[80px] ${
                  isSelected
                    ? "border-rose-500 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 shadow-md shadow-rose-500/10"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${opt.label} - ${opt.time} - ${formatGBP(opt.price)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-rose-500 bg-rose-500"
                          : "border-neutral-300 dark:border-neutral-600"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {opt.label}
                        </p>
                        {opt.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-full">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {opt.sub}
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                        Arrives by {getDeliveryDate(opt.days)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-neutral-900 dark:text-neutral-100 shrink-0 ml-4">
                    {formatGBP(opt.price)}
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
