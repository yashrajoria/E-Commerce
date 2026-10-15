import { FC } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { Product } from "@/types/shared";

/** Props accepted by {@link ProductInfo}. */
interface ProductInfoProps {
  /** Product being displayed; falsy values render placeholder dashes. */
  product?: Product | null;
  /** Switches the fields between editable inputs and read-only text. */
  isEditing?: boolean;
  /**
   * Called with the changed field name and its new value while editing.
   *
   * @param field - Key of the product field that changed.
   * @param value - New value for that field.
   */
  handleInputChange?: (field: keyof Product, value: unknown) => void;
}

/**
 * Renders the product name, category, brand, SKU and description fields,
 * toggling between editable inputs and read-only text.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ProductInfo
 *   product={product}
 *   isEditing={isEditing}
 *   handleInputChange={handleInputChange}
 * />
 * ```
 */
const ProductInfo: FC<ProductInfoProps> = ({
  product,
  isEditing,
  handleInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Name */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Product Name</Label>
        {isEditing ? (
          <Input
            type="text"
            value={product?.name ?? ""}
            onChange={(e) => handleInputChange?.("name", e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white"
          />
        ) : (
          <p className="text-white font-medium">{product?.name || "-"}</p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Category</Label>
        {isEditing ? (
          <Input
            type="text"
            value={
              Array.isArray(product?.category_ids)
                ? product?.category_ids.join(", ")
                : (product?.category_ids ?? "")
            }
            onChange={(e) =>
              handleInputChange?.("category_ids", e.target.value)
            }
            className="w-full bg-zinc-800 border-zinc-700 text-white"
          />
        ) : (
          <p className="text-white font-medium">
            {product?.category_ids && product.category_ids.length
              ? product.category_ids.join(", ")
              : "-"}
          </p>
        )}
      </div>

      {/* Brand */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Brand</Label>
        <p className="text-white font-medium">{product?.brand || "-"}</p>
      </div>

      {/* SKU */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">SKU</Label>
        <p className="text-white font-medium">{product?.sku || "-"}</p>
      </div>

      {/* Description - full width */}
      <div className="md:col-span-2 flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Description</Label>
        {isEditing ? (
          <Textarea
            value={product?.description ?? ""}
            onChange={(e) => handleInputChange?.("description", e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white h-32 resize-none"
          />
        ) : (
          <p className="text-zinc-300 mt-1">{product?.description || "-"}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
