"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { Check, Heart, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ProductCardVariantProps } from "./types";

export function HorizontalProductCard({
  product,
  state,
  priority = false,
}: ProductCardVariantProps) {
  const {
    primaryImage,
    categoryName,
    isWishlisted,
    isOutOfStock,
    isLowStock,
    addedAnimation,
    hasLegitimateDiscount,
    discountPercent,
    handleAddToCart,
    handleWishlistToggle,
    setImageError,
  } = state;

  return (
    <div className="group relative flex flex-col sm:flex-row w-full bg-card border border-border/80 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-xs transition-all duration-200">
      <Link
        href={`/products/${product.id}`}
        className="relative w-full sm:w-52 h-48 sm:h-auto aspect-square sm:aspect-auto bg-muted/30 shrink-0 block overflow-hidden"
      >
        {primaryImage === "/icons8-image-100.png" ? (
          <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-muted-foreground/40 p-4">
            <Package className="h-10 w-10 stroke-1 mb-1.5" />
            <span className="text-[11px] font-medium tracking-tight">ShopSwift</span>
          </div>
        ) : (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 13rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority={priority}
          />
        )}

        {discountPercent && (
          <Badge
            variant="default"
            className="absolute top-3 left-3 z-10 text-[10px] bg-accent text-accent-foreground font-semibold px-2 py-0.5 shadow-2xs"
          >
            Save {discountPercent}%
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {product.brand && (
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {product.brand}
                </span>
              )}
              {product.brand && categoryName && (
                <span className="text-muted-foreground/40 text-[10px]">·</span>
              )}
              {categoryName && (
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground/80 font-medium">
                  {categoryName}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <span className="text-[11px] font-semibold text-destructive uppercase tracking-wide">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Only {product.quantity} left
              </span>
            ) : null}
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-base sm:text-lg mt-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground font-mono">
              {formatGBP(product.price)}
            </span>
            {hasLegitimateDiscount && (
              <span className="text-xs text-muted-foreground line-through font-mono">
                {formatGBP(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? "fill-accent text-accent" : ""
                }`}
              />
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-2xs"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {addedAnimation ? (
                <>
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5 mr-1" />
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

