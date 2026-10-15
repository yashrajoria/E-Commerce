"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { Check, Heart, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ProductCardVariantProps } from "./types";

/**
 * Renders the grid-tile product card with image, status badges, pricing, and hover quick-add.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <GridProductCard product={product} state={state} priority={priority} />
 * ```
 */
export function GridProductCard({
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
    <div className="group relative flex flex-col bg-card border border-border/80 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-2xs transition-all duration-200">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
        <Link
          href={`/products/${product.id}`}
          className="relative block h-full w-full"
        >
          {primaryImage === "/icons8-image-100.png" ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/35 p-4">
              <Package className="h-12 w-12 stroke-1 mb-2" />
              <span className="text-[11px] font-medium tracking-tight text-muted-foreground/60">
                ShopSwift
              </span>
            </div>
          ) : (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-104"
              onError={() => setImageError(true)}
              priority={priority}
            />
          )}
        </Link>

        {/* Status / Discount Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && (
            <Badge
              variant="default"
              className="text-[10px] h-5 px-1.5 font-bold bg-accent text-accent-foreground shadow-2xs border-0"
            >
              -{discountPercent}%
            </Badge>
          )}
          {product.badge && (
            <Badge
              variant="secondary"
              className="text-[10px] h-5 px-1.5 font-medium border-border/80"
            >
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background border border-border/60 text-muted-foreground hover:text-foreground shadow-2xs transition-all backdrop-blur-xs"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              isWishlisted ? "fill-accent text-accent" : ""
            }`}
          />
        </Button>

        {/* Quick Add overlay button on hover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            className="w-full h-8 text-xs font-semibold shadow-xs gap-1.5"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {addedAnimation ? (
              <>
                <Check className="h-3 w-3 text-primary-foreground" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-3 w-3" />
                {isOutOfStock ? "Sold Out" : "Quick Add"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {product.brand && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate">
                  {product.brand}
                </span>
              )}
              {product.brand && categoryName && (
                <span className="text-muted-foreground/40 text-[9px]">·</span>
              )}
              {categoryName && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium truncate">
                  {categoryName}
                </span>
              )}
            </div>

            {isLowStock ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                </span>
                Low stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                In Demand
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Stock Status */}
        <div className="flex items-baseline justify-between pt-2.5 mt-2.5 border-t border-border/50">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatGBP(product.price)}
            </span>
            {hasLegitimateDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatGBP(product.originalPrice)}
              </span>
            )}
          </div>

          {isOutOfStock && (
            <span className="text-[11px] font-semibold text-destructive uppercase tracking-tight">
              Sold out
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
