"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import React from "react";

interface SearchFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  maxPriceLimit?: number;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  availableBrands?: string[];
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  inStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  onSaleOnly: boolean;
  onOnSaleChange: (value: boolean) => void;
  freeShippingOnly: boolean;
  onFreeShippingChange: (value: boolean) => void;
  onClearAll: () => void;
}

export function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPriceLimit = 2000,
  selectedBrands,
  onBrandsChange,
  availableBrands = ["ShopSwift", "Apex", "Nova", "AudioCraft", "Orbit"],
  inStockOnly,
  onInStockChange,
  onSaleOnly,
  onOnSaleChange,
  freeShippingOnly,
  onFreeShippingChange,
  onClearAll,
}: SearchFiltersProps) {
  return (
    <div className="space-y-6 bg-card border border-border rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Reset
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategory === category.name}
                onCheckedChange={(checked) =>
                  onCategoryChange(checked ? category.name : "")
                }
              />
              <label
                htmlFor={category.id}
                className="text-xs text-foreground cursor-pointer flex-1 flex items-center justify-between"
              >
                <span className="capitalize">{category.name.replace(/-/g, " ")}</span>
                {category.productCount !== undefined && (
                  <span className="text-muted-foreground text-[11px]">
                    ({category.productCount})
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Price Range</h4>
          <span className="text-xs font-medium text-muted-foreground">
            {formatGBP(priceRange[0])} – {formatGBP(priceRange[1])}
          </span>
        </div>
        <div className="space-y-3 pt-1">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={maxPriceLimit}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Min: £0</span>
            <span>Max: {formatGBP(maxPriceLimit)}</span>
          </div>
        </div>
      </div>

      {availableBrands.length > 0 && (
        <>
          <Separator />
          {/* Brands */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Brands</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        onBrandsChange([...selectedBrands, brand]);
                        return;
                      }
                      onBrandsChange(selectedBrands.filter((b) => b !== brand));
                    }}
                  />
                  <label htmlFor={`brand-${brand}`} className="text-xs text-foreground cursor-pointer">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Availability */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Availability</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked === true)}
            />
            <label htmlFor="in-stock" className="text-xs text-foreground cursor-pointer">
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={onSaleOnly}
              onCheckedChange={(checked) => onOnSaleChange(checked === true)}
            />
            <label htmlFor="on-sale" className="text-xs text-foreground cursor-pointer">
              Special Offers & Sale
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="free-shipping"
              checked={freeShippingOnly}
              onCheckedChange={(checked) =>
                onFreeShippingChange(checked === true)
              }
            />
            <label htmlFor="free-shipping" className="text-xs text-foreground cursor-pointer">
              Free Delivery Eligible
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
