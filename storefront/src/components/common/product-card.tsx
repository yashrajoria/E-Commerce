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

/**
 * Renders a product card in the resolved layout variant, delegating to one of the four card implementations.
 *
 * @remarks
 * Client Component — declares `"use client"`. Resolves the variant from `variant`, falling back to the legacy `viewMode`, then renders {@link GridProductCard}, {@link HorizontalProductCard}, {@link CompactProductCard}, or {@link FeaturedProductCard}.
 *
 * @example
 * ```tsx
 * <ProductCard product={product} variant="horizontal" priority />
 * ```
 */
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
        <GridProductCard product={product} state={state} priority={priority} />
      );
  }
}
