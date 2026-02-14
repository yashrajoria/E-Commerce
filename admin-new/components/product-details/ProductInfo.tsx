/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProductInfoProps {
  product?: unknown;
  isEditing?: boolean;
  handleInputChange?: (field: string, value: unknown) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isEditing,
  handleInputChange,
}) => {
  console.log(product);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Name */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Product Name</Label>
        {isEditing ? (
          <Input
            type="text"
            value={(product as any)?.name}
            onChange={(e) => handleInputChange?.("name", e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white"
          />
        ) : (
          <p className="text-white font-medium">
            {(product as any)?.name || "-"}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Category</Label>
        {isEditing ? (
          <Input
            type="text"
            value={(product as any)?.category_ids}
            onChange={(e) => handleInputChange?.("category", e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white"
          />
        ) : (
          <p className="text-white font-medium">
            {(product as any)?.category_ids || "-"}
          </p>
        )}
      </div>

      {/* Brand */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Brand</Label>
        <p className="text-white font-medium">
          {(product as any)?.brand || "-"}
        </p>
      </div>

      {/* SKU */}
      <div className="flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">SKU</Label>
        <p className="text-white font-medium">{(product as any)?.sku || "-"}</p>
      </div>

      {/* Description - full width */}
      <div className="md:col-span-2 flex flex-col space-y-1">
        <Label className="text-sm text-zinc-400">Description</Label>
        {isEditing ? (
          <Textarea
            value={(product as any)?.description}
            onChange={(e) => handleInputChange?.("description", e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white h-32 resize-none"
          />
        ) : (
          <p className="text-zinc-300 mt-1">
            {(product as any)?.description || "-"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
