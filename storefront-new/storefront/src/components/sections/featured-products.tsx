"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, ArrowRight, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";

interface ProductRatingProps {
  rating: number;
  reviews: number;
}

export function ProductRating({ rating, reviews }: ProductRatingProps) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const clampedRating = Math.max(0, Math.min(5, safeRating));
  const fullStars = Math.floor(clampedRating);
  const hasHalf = clampedRating % 1 >= 0.25;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star
          key={`full-${i}`}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
        />
      ))}
      {hasHalf && (
        <StarHalf className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-3.5 w-3.5 text-muted-foreground/30"
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1.5">
        {safeRating.toFixed(1)} ({reviews ?? 0})
      </span>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts(4, 1, true);
  const products = data?.products ?? [];
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="bg-muted/40 rounded-2xl h-[380px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Unable to load featured products right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400 tracking-wide uppercase mb-2 block">
              Handpicked for You
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link href="/products">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground group"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const isWishlisted = hasWishlistItem(product.id);
            return (
              <motion.div
                key={product.id}
                className="group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="relative bg-card rounded-2xl border border-border/60 overflow-hidden premium-card">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                    <Image
                      src={product.images?.[0] || "/icons8-image-100.png"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Badges */}
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-rose-500/90 text-white text-[11px] font-medium px-2.5 py-0.5 backdrop-blur-sm border-0">
                        {product.badge}
                      </Badge>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-full glass shadow-md"
                        onClick={() =>
                          isWishlisted
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            isWishlisted
                              ? "fill-rose-500 text-rose-500"
                              : "text-foreground/70"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Add to Cart */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0"
                      initial={false}
                    >
                      <Button
                        size="sm"
                        className="w-full rounded-xl bg-foreground/90 hover:bg-foreground text-background backdrop-blur-sm h-9 text-[13px] font-medium"
                        onClick={() => addToCart({ ...product, quantity: 1 })}
                      >
                        <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        {product.category}
                      </span>
                      <ProductRating
                        rating={product.rating}
                        reviews={product.reviews}
                      />
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium text-[15px] line-clamp-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-semibold">
                        {formatGBP(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatGBP(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {typeof product.quantity === "number" && (
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          product.quantity > 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                        }`}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
