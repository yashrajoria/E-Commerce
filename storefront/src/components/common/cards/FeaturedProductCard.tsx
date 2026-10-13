"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { Check, Heart, Package, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ProductCardVariantProps } from "./types";

export function FeaturedProductCard({
  product,
  state,
  priority = false,
}: ProductCardVariantProps) {
  const {
    primaryImage,
    categoryName,
    isWishlisted,
    isOutOfStock,
    addedAnimation,
    hasLegitimateDiscount,
    discountPercent,
    handleAddToCart,
    handleWishlistToggle,
    setImageError,
  } = state;

  return (
    <div className="group relative flex flex-col md:flex-row bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 shadow-xs transition-all duration-300">
      <Link
        href={`/products/${product.id}`}
        className="relative w-full md:w-1/2 aspect-square md:aspect-auto min-h-[300px] md:min-h-[400px] bg-muted/20 overflow-hidden block"
      >
        {primaryImage === "/icons8-image-100.png" ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 p-8">
            <Package className="h-16 w-16 stroke-1 mb-2" />
            <span className="text-xs font-medium tracking-tight">ShopSwift Spotlight</span>
          </div>
        ) : (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority={priority}
          />
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-1 text-xs shadow-xs gap-1.5">
            <Sparkles className="h-3 w-3" />
            Featured Release
          </Badge>
          {discountPercent && (
            <Badge className="bg-accent text-accent-foreground font-semibold px-2 py-0.5 text-xs">
              Save {discountPercent}%
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.brand && (
                <span className="text-xs uppercase tracking-widest text-primary font-bold">
                  {product.brand}
                </span>
              )}
              {product.brand && categoryName && (
                <span className="text-muted-foreground/40 text-xs">·</span>
              )}
              {categoryName && (
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {categoryName}
                </span>
              )}
            </div>

            {!isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
            ) : (
              <span className="text-xs font-medium text-destructive">
                Out of Stock
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`} className="block">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h2>
          </Link>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-border/60 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              {formatGBP(product.price)}
            </span>
            {hasLegitimateDiscount && (
              <span className="text-sm text-muted-foreground line-through font-mono">
                {formatGBP(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground border-border/80"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-accent text-accent" : ""
                }`}
              />
            </Button>
            <Button
              size="lg"
              className="h-11 px-6 text-sm font-semibold gap-2 shadow-sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {addedAnimation ? (
                <>
                  <Check className="h-4 w-4 text-primary-foreground" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {isOutOfStock ? "Sold Out" : "Add to Cart"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

