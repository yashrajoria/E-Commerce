"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import React from "react";

/** Props accepted by {@link SearchFilters}. */
interface SearchFiltersProps {
  /** Categories rendered in the category checkbox list. */
  categories: Category[];
  /** Name of the active category filter; empty string means no category filter. */
  selectedCategory: string;
  /** Called with the category name when checked, or an empty string when unchecked. */
  onCategoryChange: (category: string) => void;
  /** Current `[min, max]` bounds of the price slider. */
  priceRange: number[];
  /** Called with the next `[min, max]` bounds while the user drags the slider. */
  onPriceRangeChange: (range: number[]) => void;
  /**
   * Upper bound of the price slider.
   *
   * @defaultValue 2000
   */
  maxPriceLimit?: number;
  /** Brand names currently checked. */
  selectedBrands: string[];
  /** Called with the complete next list of checked brands. */
  onBrandsChange: (brands: string[]) => void;
  /**
   * Brands rendered in the brand list; the section is hidden when empty.
   *
   * @defaultValue ["ShopSwift", "Apex", "Nova", "AudioCraft", "Orbit"]
   */
  availableBrands?: string[];
  /** Minimum-rating filter owned by the parent; the current markup renders no rating controls. */
  selectedRating: number | null;
  /** Updates the minimum-rating filter; currently not triggered by the rendered controls. */
  onRatingChange: (rating: number | null) => void;
  /** Whether the "In Stock Only" toggle is on. */
  inStockOnly: boolean;
  /** Called with the next value of the "In Stock Only" toggle. */
  onInStockChange: (value: boolean) => void;
  /** Whether the "Special Offers & Sale" toggle is on. */
  onSaleOnly: boolean;
  /** Called with the next value of the "Special Offers & Sale" toggle. */
  onOnSaleChange: (value: boolean) => void;
  /** Whether the "Free Delivery Eligible" toggle is on. */
  freeShippingOnly: boolean;
  /** Called with the next value of the "Free Delivery Eligible" toggle. */
  onFreeShippingChange: (value: boolean) => void;
  /** Called when the user presses Reset to clear every filter. */
  onClearAll: () => void;
}

/**
 * Renders the catalog filter sidebar with category, price, brand and availability controls.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * All filter state lives in the parent: each control reports through its `on*Change` callback, and prices are displayed through `formatGBP`.
 *
 * @example
 * ```tsx
 * <SearchFilters
 *   categories={categories}
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={setSelectedCategory}
 *   priceRange={priceRange}
 *   onPriceRangeChange={setPriceRange}
 *   selectedBrands={selectedBrands}
 *   onBrandsChange={setSelectedBrands}
 *   selectedRating={selectedRating}
 *   onRatingChange={setSelectedRating}
 *   inStockOnly={inStockOnly}
 *   onInStockChange={setInStockOnly}
 *   onSaleOnly={onSaleOnly}
 *   onOnSaleChange={setOnSaleOnly}
 *   freeShippingOnly={freeShippingOnly}
 *   onFreeShippingChange={setFreeShippingOnly}
 *   onClearAll={clearAllFilters}
 * />
 * ```
 */
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
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
          Filters
        </h3>
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
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
          Categories
        </h4>
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
                <span className="capitalize">
                  {category.name.replace(/-/g, " ")}
                </span>
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
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Price Range
          </h4>
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
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Brands
            </h4>
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
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-xs text-foreground cursor-pointer"
                  >
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
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
          Availability
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked === true)}
            />
            <label
              htmlFor="in-stock"
              className="text-xs text-foreground cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={onSaleOnly}
              onCheckedChange={(checked) => onOnSaleChange(checked === true)}
            />
            <label
              htmlFor="on-sale"
              className="text-xs text-foreground cursor-pointer"
            >
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
            <label
              htmlFor="free-shipping"
              className="text-xs text-foreground cursor-pointer"
            >
              Free Delivery Eligible
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
