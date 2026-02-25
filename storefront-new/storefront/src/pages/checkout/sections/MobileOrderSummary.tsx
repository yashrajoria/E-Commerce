import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/context/CartContext";
import { formatGBP } from "../checkoutUtils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  discountAmount: number;
  total: number;
}

export function MobileOrderSummary({
  isOpen,
  onClose,
  cart,
  itemCount,
  subtotal,
  shipping,
  tax,
  discount,
  discountAmount,
  total,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600 mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Your Order ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                  aria-label="Close order summary"
                >
                  <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                      <Image
                        src={item.images?.[0] || "/icons8-image-100.png"}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 shrink-0">
                      {formatGBP(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatGBP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Shipping</span>
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
                  <span className="text-gradient-premium">
                    {formatGBP(total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
