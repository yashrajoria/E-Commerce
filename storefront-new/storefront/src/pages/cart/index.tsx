"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart: cartItems, updateQuantity, removeFromCart } = useCart();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const router = useRouter();

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo("SAVE10");
      setPromoMessage("Promo code applied successfully!");
    } else {
      setAppliedPromo(null);
      setPromoMessage("Invalid promo code. Please try again.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Head>
          <title>Storefront | Cart</title>
          <meta
            name="description"
            content="Review items in your cart and proceed to checkout."
          />
          <link rel="canonical" href={`${siteUrl}/cart`} />
          <meta property="og:title" content="Storefront | Cart" />
          <meta
            property="og:description"
            content="Review items in your cart and proceed to checkout."
          />
          <meta property="og:url" content={`${siteUrl}/cart`} />
        </Head>
        <Header />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Storefront | Cart</title>
        <meta
          name="description"
          content="Review items in your cart and proceed to checkout."
        />
        <link rel="canonical" href={`${siteUrl}/cart`} />
        <meta property="og:title" content="Storefront | Cart" />
        <meta
          property="og:description"
          content="Review items in your cart and proceed to checkout."
        />
        <meta property="og:url" content={`${siteUrl}/cart`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Badge>{cartItems.length} items</Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-4 p-6 bg-card border rounded-lg"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.images?.[0] || "/icons8-image-100.png"}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.category}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{formatGBP(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatGBP(item.originalPrice)}
                        </span>
                      )}
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">
                        {formatGBP(item.price * item.quantity)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-card border rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="mb-6">
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-sm ${
                        appliedPromo ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatGBP(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatGBP(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center">
                      Shipping
                      {shipping === 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          FREE
                        </Badge>
                      )}
                    </span>
                    <span>{formatGBP(shipping)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatGBP(tax)}</span>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>{formatGBP(total)}</span>
                </div>

                {shipping > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-lg p-3 mb-6">
                    <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">
                        Add {formatGBP(50 - subtotal)} more for free shipping!
                      </span>
                    </div>
                  </div>
                )}

                <Link href="/checkout" passHref>
                  <Button
                    size="lg"
                    className="w-full mb-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/20"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
