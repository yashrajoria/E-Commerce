import type { Product } from "@/lib/types";
import type React from "react";

/**
 * Layout variant rendered by {@link ProductCard}.
 *
 * @remarks
 * `"grid"` is the default tile, `"horizontal"` places a large image beside the details, `"compact"` is a dense single row, and `"featured"` is the two-column spotlight layout.
 */
export type ProductCardVariant = "grid" | "horizontal" | "compact" | "featured";

/** Props accepted by {@link ProductCard}. */
export interface ProductCardProps {
  /** Product to render. */
  product: Product;
  /**
   * Explicit card variant; when omitted, {@link ProductCard} falls back to `"grid"` (or `"horizontal"` when the legacy `viewMode` is `"list"`).
   */
  variant?: ProductCardVariant;
  /**
   * Backward compatibility with previous viewMode prop
   *
   * @remarks
   * Only consulted when `variant` is not provided.
   */
  viewMode?: "grid" | "list";
  /** Whether to prioritize the card's image load for above-the-fold placements. */
  priority?: boolean;
}

/** Derived display/behaviour state shared by every product card variant. */
export interface ProductCardState {
  /** Resolved image URL, or the shared placeholder when the product has no image or loading it failed. */
  primaryImage: string;
  /** Display name of the product's category; empty string when it cannot be resolved. */
  categoryName: string;
  /** Whether the product id is currently present in the wishlist context. */
  isWishlisted: boolean;
  /** Whether the product is out of stock, from `quantity === 0` when present, otherwise `inStock === false`. */
  isOutOfStock: boolean;
  /** Whether the product is in stock with a small remaining quantity (`<= 5`). */
  isLowStock: boolean;
  /** Whether the add-to-cart confirmation animation is currently showing. */
  addedAnimation: boolean;
  /** Whether `originalPrice` is set and greater than `price`. */
  hasLegitimateDiscount: boolean;
  /** Whole-number percentage saved, or `null` when there is no legitimate discount. */
  discountPercent: number | null;
  /** Prevents link navigation, adds one unit to the cart, and triggers the added animation; no-op when out of stock. */
  handleAddToCart: (e: React.MouseEvent) => void;
  /** Prevents link navigation, then adds or removes the product from the wishlist. */
  handleWishlistToggle: (e: React.MouseEvent) => void;
  /** Marks the product image as failed so the placeholder is shown instead. */
  setImageError: (value: boolean) => void;
}

/** Props accepted by each concrete product card variant (grid, horizontal, compact, featured). */
export interface ProductCardVariantProps {
  /** Product to render. */
  product: Product;
  /** Derived card state produced by {@link useProductCardState}. */
  state: ProductCardState;
  /**
   * Whether to prioritize the card's image load for above-the-fold placements.
   *
   * @remarks
   * Ignored by {@link CompactProductCard}.
   *
   * @defaultValue false
   */
  priority?: boolean;
}
