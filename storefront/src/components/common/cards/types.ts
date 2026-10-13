import type { Product } from "@/lib/types";
import type React from "react";

export type ProductCardVariant = "grid" | "horizontal" | "compact" | "featured";

export interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  /** Backward compatibility with previous viewMode prop */
  viewMode?: "grid" | "list";
  priority?: boolean;
}

export interface ProductCardState {
  primaryImage: string;
  categoryName: string;
  isWishlisted: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  addedAnimation: boolean;
  hasLegitimateDiscount: boolean;
  discountPercent: number | null;
  handleAddToCart: (e: React.MouseEvent) => void;
  handleWishlistToggle: (e: React.MouseEvent) => void;
  setImageError: (value: boolean) => void;
}

export interface ProductCardVariantProps {
  product: Product;
  state: ProductCardState;
  priority?: boolean;
}

