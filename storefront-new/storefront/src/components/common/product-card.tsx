"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  const primaryImage = product.images?.[0] || "/icons8-image-100.png";
  const isWishlisted = hasWishlistItem(product.id);
  const isOutOfStock = product.quantity !== undefined && product.quantity === 0;

  const safeRating = Number.isFinite(product.rating) ? product.rating : 0;
  const clampedRating = Math.max(0, Math.min(5, safeRating));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...product, quantity: 1 });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Discount percentage
  const discountPercent =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  if (viewMode === "list") {
    return (
      <motion.div
        className="flex w-full bg-card border border-border/60 rounded-xl overflow-hidden premium-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href={`/products/${product.id}`}
          className="relative w-48 h-48 flex-shrink-0 block"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 30vw, 12rem"
            className="object-cover"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 z-10 bg-rose-500/90 text-white text-[11px] border-0">
              {product.badge}
            </Badge>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {product.category}
            </span>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-[15px] mt-1 line-clamp-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-0.5 mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(clampedRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/25"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1.5">
                ({product.reviews ?? 0})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                {formatGBP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatGBP(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
              </Button>
              <Button
                size="sm"
                className="rounded-full h-9 px-4 text-[13px]"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                {isOutOfStock ? "Sold Out" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden premium-card">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Link href={`/products/${product.id}`} className="block h-full">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <Badge className="bg-rose-500/90 text-white text-[11px] font-medium px-2.5 py-0.5 border-0 backdrop-blur-sm">
                {product.badge}
              </Badge>
            )}
            {discountPercent && (
              <Badge className="bg-emerald-500/90 text-white text-[11px] font-medium px-2.5 py-0.5 border-0 backdrop-blur-sm">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-md"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-foreground/70"
              }`}
            />
          </Button>

          {/* Quick Add */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full rounded-xl bg-foreground/90 hover:bg-foreground text-background backdrop-blur-sm h-9 text-[13px] font-medium"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">
                {clampedRating.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({product.reviews ?? 0})
              </span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-[15px] line-clamp-2 h-11 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-lg font-semibold">
              {formatGBP(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatGBP(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
