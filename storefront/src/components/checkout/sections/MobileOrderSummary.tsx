import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/context/CartContext";
import { formatGBP } from "@/components/checkout/checkoutUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Package, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

function MobileSummaryItem({ item }: { item: CartItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImage = item.images?.[0];
  const isLocalStack = rawImage?.includes("localhost:4566");
  const hasValidImage = rawImage && !isLocalStack && !imageFailed;

  return (
    <div className="flex items-center gap-3">
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
        <p className="text-xs font-medium truncate text-foreground">
          {item.name}
        </p>
        <p className="text-[11px] text-muted-foreground">
          Qty: {item.quantity}
        </p>
      </div>
      <p className="text-xs font-semibold text-foreground shrink-0">
        {formatGBP(item.price * item.quantity)}
      </p>
    </div>
  );
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl border-t border-border shadow-2xl max-h-[80vh] overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h3>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label="Close order summary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <MobileSummaryItem key={item.id} item={item} />
                ))}
              </div>

              <Separator className="mb-4" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatGBP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">{shipping === 0 ? "Free" : formatGBP(shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-medium text-foreground">{formatGBP(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-{formatGBP(discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-sm pt-1">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatGBP(total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
