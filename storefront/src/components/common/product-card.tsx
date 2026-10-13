"use client";

import React from "react";
import {
  CompactProductCard,
  FeaturedProductCard,
  GridProductCard,
  HorizontalProductCard,
  useProductCardState,
  type ProductCardProps,
} from "./cards";

export type { ProductCardProps };

export function ProductCard({
  product,
  variant,
  viewMode,
  priority = false,
}: ProductCardProps) {
  // Resolve variant between `variant` and legacy `viewMode`
  const activeVariant =
    variant ?? (viewMode === "list" ? "horizontal" : "grid");

  const state = useProductCardState(product);

  switch (activeVariant) {
    case "horizontal":
      return (
        <HorizontalProductCard
          product={product}
          state={state}
          priority={priority}
        />
      );
    case "compact":
      return (
        <CompactProductCard
          product={product}
          state={state}
          priority={priority}
        />
      );
    case "featured":
      return (
        <FeaturedProductCard
          product={product}
          state={state}
          priority={priority}
        />
      );
    case "grid":
    default:
      return (
        <GridProductCard
          product={product}
          state={state}
          priority={priority}
        />
      );
  }
}
