"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
import { resolveProductImageUrl } from "@ecommerce/shared";
import React, { useState } from "react";
import type { ProductCardState } from "./types";

/**
 * Derives image, category, stock, discount, and action-handler state for a product card.
 *
 * @remarks
 * Client hook — combines local React state with the storefront cart and wishlist contexts.
 *
 * @param product - Product whose card state should be computed.
 * @returns A {@link ProductCardState} carrying the resolved image and category, wishlist/stock/discount flags, and the `handleAddToCart`, `handleWishlistToggle`, and `setImageError` callbacks.
 * @throws {@link Error} When called outside `CartProvider` or `WishlistProvider`, via the underlying `useCart`/`useWishlist` guards.
 */
export function useProductCardState(product: Product): ProductCardState {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const rawImage = resolveProductImageUrl(product.images?.[0]);
  const primaryImage =
    imageError || !rawImage ? "/icons8-image-100.png" : rawImage;

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

  const hasLegitimateDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPercent = hasLegitimateDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : null;

  return {
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
  };
}
