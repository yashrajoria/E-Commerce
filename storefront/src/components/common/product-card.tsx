"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { Heart, ShoppingBag, Package, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export interface ProductCardProps {
  product: Product;
  variant?: "grid" | "horizontal" | "compact" | "featured";
  /** Backward compatibility with previous viewMode prop */
  viewMode?: "grid" | "list";
  priority?: boolean;
}

export function ProductCard({
  product,
  variant,
  viewMode,
  priority = false,
}: ProductCardProps) {
  // Resolve variant between new `variant` and legacy `viewMode`
  const activeVariant: "grid" | "horizontal" | "compact" | "featured" =
    variant ?? (viewMode === "list" ? "horizontal" : "grid");

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const rawImage = product.images?.[0];
  const primaryImage =
    imageError || !rawImage || rawImage.includes("localhost:4566")
      ? "/icons8-image-100.png"
      : rawImage;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : (product.category?.name ?? "");

  const isWishlisted = hasWishlistItem(product.id);
  const isOutOfStock =
    product.quantity !== undefined
      ? product.quantity === 0
      : product.inStock === false;
  const isLowStock =
    !isOutOfStock &&
    typeof product.quantity === "number" &&
    product.quantity > 0 &&
    product.quantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...product, quantity: 1 });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
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

  // Only calculate discount if originalPrice is legitimately higher than price in data
  const hasLegitimateDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPercent = hasLegitimateDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) * 100,
      )
    : null;

  /* ──────────────────────────────────────────────
     1. HORIZONTAL (LIST) VARIANT
     ────────────────────────────────────────────── */
  if (activeVariant === "horizontal") {
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

  /* ──────────────────────────────────────────────
     2. COMPACT VARIANT (Mini slider / quick search)
     ────────────────────────────────────────────── */
  if (activeVariant === "compact") {
    return (
      <div className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 transition-colors">
        <Link
          href={`/products/${product.id}`}
          className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/30 shrink-0"
        >
          {primaryImage === "/icons8-image-100.png" ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <Package className="h-6 w-6 stroke-1" />
            </div>
          ) : (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {product.name}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-foreground font-mono">
              {formatGBP(product.price)}
            </span>
            {isOutOfStock && (
              <span className="text-[10px] text-destructive font-medium">Sold Out</span>
            )}
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label="Add to cart"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     3. FEATURED SPOTLIGHT VARIANT
     ────────────────────────────────────────────── */
  if (activeVariant === "featured") {
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

  /* ──────────────────────────────────────────────
     4. STANDARD GRID CARD (Canonical Default)
     ────────────────────────────────────────────── */
  return (
    <div className="group relative flex flex-col bg-card border border-border/80 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-2xs transition-all duration-200">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
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

            {isLowStock && (
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                Low stock
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
