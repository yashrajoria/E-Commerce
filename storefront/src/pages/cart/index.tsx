import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Truck,
  Package,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatGBP } from "@/lib/utils";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { toast } from "sonner";
import { ShopTogetherShareModal } from "@/components/cart/ShopTogetherShareModal";

function CartItemRow({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    images?: string[];
    category?: string | { name: string };
    badge?: string;
  };
  index: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImage = item.images?.[0];
  const isLocalStack = rawImage?.includes("localhost:4566");
  const hasValidImage = rawImage && !isLocalStack && !imageFailed;
  const categoryName = typeof item.category === "string" ? item.category : item.category?.name;

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-surface border border-border rounded-lg"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted shrink-0 flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base leading-snug">{item.name}</h3>
        {categoryName && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {categoryName}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-sm">
            {formatGBP(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatGBP(item.originalPrice)}
            </span>
          )}
          {item.badge && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
              {item.badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
        <div className="flex items-center border border-border rounded-md bg-background">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-xs font-semibold">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-right min-w-[70px]">
          <p className="font-semibold text-sm">
            {formatGBP(item.price * item.quantity)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart: cartItems, updateQuantity, removeFromCart, addToCart, isHydrated } = useCart();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoOk, setPromoOk] = useState(false);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [sharedCartItems, setSharedCartItems] = useState<CartItem[] | null>(null);
  const [isShopTogetherOpen, setIsShopTogetherOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const rawParam = router.query.sharedCart;
    const param = Array.isArray(rawParam) ? rawParam[0] : rawParam;
    if (param) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(param)))));
        if (Array.isArray(decoded) && decoded.length > 0) {
          setSharedCartItems(decoded);
        }
      } catch {
        // ignore decoding errors
      }
    }
  }, [router.query.sharedCart]);

  const handleMergeSharedCart = () => {
    if (!sharedCartItems) return;
    sharedCartItems.forEach((item) => {
      addToCart({
        id: String(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        images: item.images || ["/placeholder.svg"],
        subscription: item.subscription,
      });
    });
    toast.success(`Loaded ${sharedCartItems.length} shared items into your bag!`);
    setSharedCartItems(null);
    router.replace("/cart", undefined, { shallow: true });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const applyPromoCode = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoOk(false);
      setPromoMessage("Please enter a valid promo code");
      return;
    }

    setApplyingPromo(true);
    setPromoMessage(null);
    try {
      const res = await axios.post(
        API_ROUTES.PROMOTIONS.VALIDATE,
        { code, cart_total: subtotal },
        { withCredentials: true },
      );
      const { valid, discount_amount, message } = res.data ?? {};
      if (valid) {
        setAppliedPromo(code.toUpperCase());
        setDiscountAmount(Number(discount_amount) || 0);
        setPromoOk(true);
        setPromoMessage(message || "Promo code applied successfully.");
      } else {
        setAppliedPromo(null);
        setDiscountAmount(0);
        setPromoOk(false);
        setPromoMessage(message || "Invalid or expired promo code.");
      }
    } catch (err: unknown) {
      setAppliedPromo(null);
      setDiscountAmount(0);
      setPromoOk(false);
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      const apiError = axios.isAxiosError(err)
        ? err.response?.data?.error || err.response?.data?.message
        : undefined;
      setPromoMessage(
        status === 401
          ? "Unable to validate promo code right now."
          : String(apiError || "Failed to validate promo code."),
      );
    } finally {
      setApplyingPromo(false);
    }
  };

  const discount = appliedPromo ? discountAmount : 0;
  // Free delivery threshold: £50
  const freeShippingThreshold = 50;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : 4.99;
  const tax = Math.max(0, subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Head>
          <title>Shopping Cart | ShopSwift</title>
          <meta
            name="description"
            content="Review items in your cart and proceed to checkout."
          />
          <link rel="canonical" href={`${siteUrl}/cart`} />
        </Head>
        <Header />
        <main className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-border border-t-foreground animate-spin" />
            <h1 className="text-base font-medium">Loading your shopping bag</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Restoring your active items...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Head>
          <title>Shopping Cart | ShopSwift</title>
          <meta
            name="description"
            content="Review items in your cart and proceed to checkout."
          />
          <link rel="canonical" href={`${siteUrl}/cart`} />
        </Head>
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center max-w-md mx-auto py-12 px-6 border border-border rounded-lg bg-surface">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight mb-2">
              {sharedCartItems ? "Shared Bag Received!" : "Your shopping bag is empty"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {sharedCartItems
                ? `Your friend shared ${sharedCartItems.length} items with you. Click below to load them into your shopping bag!`
                : "You haven't added any items to your bag yet."}
            </p>
            {sharedCartItems ? (
              <Button onClick={handleMergeSharedCart} size="default" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> Load Shared Items ({sharedCartItems.length})
              </Button>
            ) : (
              <Button asChild size="default">
                <Link href="/products">Explore the collection</Link>
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Shopping Bag ({cartItems.length}) | ShopSwift</title>
        <meta
          name="description"
          content="Review items in your cart and proceed to checkout."
        />
        <link rel="canonical" href={`${siteUrl}/cart`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Shopping Bag</h1>
          <Badge variant="secondary" className="text-xs font-medium">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {cartItems.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {sharedCartItems && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Friend Shared Shopping Bag ({sharedCartItems.length} items)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Someone invited you to shop together! Click below to merge these items into your bag.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleMergeSharedCart}
                className="text-xs font-semibold gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Load into My Bag
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSharedCartItems(null)}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, index) => (
              <CartItemRow
                key={item.id}
                item={item}
                index={index}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-base font-semibold tracking-tight">
                Order Summary
              </h2>

              {/* Promo code */}
              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 shrink-0"
                    onClick={() => void applyPromoCode()}
                    disabled={applyingPromo}
                  >
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    Apply
                  </Button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-xs mt-2 ${
                      promoOk ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Free delivery bar */}
              <div className="p-3.5 rounded-md bg-muted/50 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground mb-1">
                  <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                  {isFreeShipping ? (
                    <span>Free standard shipping unlocked</span>
                  ) : (
                    <span>
                      Add {formatGBP(remainingForFreeShipping)} more for free delivery
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <Separator />

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{formatGBP(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedPromo})</span>
                    <span className="font-medium">-{formatGBP(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Shipping</span>
                  <span className="font-medium text-foreground">
                    {shipping === 0 ? "Free" : formatGBP(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax (8%)</span>
                  <span className="font-medium text-foreground">{formatGBP(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold tracking-tight">
                  {formatGBP(total)}
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm" className="h-10 text-xs font-semibold">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsShopTogetherOpen(true)}
                    className="h-10 text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Users className="h-3.5 w-3.5" /> Shop Together
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShopTogetherShareModal
        isOpen={isShopTogetherOpen}
        onClose={() => setIsShopTogetherOpen(false)}
        cart={cartItems}
        total={total}
      />

      <Footer />
    </div>
  );
}
