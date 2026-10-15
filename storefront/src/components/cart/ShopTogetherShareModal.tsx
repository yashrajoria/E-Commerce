"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Copy,
  Check,
  X,
  Share2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatGBP } from "@/lib/utils";
import type { CartItem } from "@/context/CartContext";

/** Props accepted by {@link ShopTogetherShareModal}. */
interface ShopTogetherShareModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Closes the modal (close button or backdrop tap). */
  onClose: () => void;
  /** Cart lines encoded into the shareable link. */
  cart: CartItem[];
  /** Cart total in major currency units (GBP), quoted in the share text. */
  total: number;
}

/**
 * Renders the "Shop Together" modal that turns the current cart into a shareable link.
 *
 * @remarks
 * Client Component — declares `"use client"`. Encodes a minimal cart payload into a base64 `sharedCart` query
 * parameter on `/cart` and offers copy-to-clipboard, native share and WhatsApp shortcuts.
 *
 * @example
 * ```tsx
 * <ShopTogetherShareModal
 *   isOpen={isShopTogetherOpen}
 *   onClose={() => setIsShopTogetherOpen(false)}
 *   cart={cartItems}
 *   total={total}
 * />
 * ```
 */
export function ShopTogetherShareModal({
  isOpen,
  onClose,
  cart,
  total,
}: ShopTogetherShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Encode cart items into shareable base64 string
  const shareableUrl = React.useMemo(() => {
    if (typeof window === "undefined" || cart.length === 0) return "";
    try {
      const minimalPayload = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images?.slice(0, 1) || [],
        subscription: item.subscription,
      }));
      const encoded = encodeURIComponent(
        btoa(unescape(encodeURIComponent(JSON.stringify(minimalPayload)))),
      );
      return `${window.location.origin}/cart?sharedCart=${encoded}`;
    } catch {
      return `${window.location.origin}/cart`;
    }
  }, [cart]);

  const handleCopy = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast.success("Shared cart link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareNative = async () => {
    if (navigator.share && shareableUrl) {
      try {
        await navigator.share({
          title: "Shop Together on ShopSwift",
          text: `Check out the items I curated in our ShopSwift shopping cart (${cart.length} items - ${formatGBP(total)}):`,
          url: shareableUrl,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  Shop Together
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-primary/5 text-primary border-primary/20"
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Collaborative Cart
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Share this cart session with friends or family to co-curate
                  items
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Summary Banner */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {cart.length} unique {cart.length === 1 ? "item" : "items"}
                </span>
              </div>
              <span className="font-bold text-foreground">
                {formatGBP(total)}
              </span>
            </div>

            {/* Share Link Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Shareable Cart Session Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 text-foreground font-mono truncate focus:outline-hidden"
                />
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="text-xs font-semibold gap-1.5 shrink-0"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </div>
            </div>

            {/* Social Share Shortcuts */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Quick share via:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareNative}
                  className="text-xs font-semibold gap-1.5 justify-center"
                >
                  <Share2 className="h-3.5 w-3.5" /> Direct Share / SMS
                </Button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out our ShopSwift shared shopping bag: ${shareableUrl}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted transition-colors text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />{" "}
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Instructions list */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">How it works:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>
                  Anyone opening this link can view and load your curated items
                  with 1 click.
                </li>
                <li>They can add additional items from the catalog.</li>
                <li>
                  Either person can proceed to checkout or split the order!
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
