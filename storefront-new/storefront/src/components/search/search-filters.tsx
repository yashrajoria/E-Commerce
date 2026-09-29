"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface SearchFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  // Optional advanced filters. Sections render only when their handlers are
  // provided, so pages with simpler filtering don't show dead controls.
  selectedBrands?: string[];
  onBrandsChange?: (brands: string[]) => void;
  selectedRating?: number | null;
  onRatingChange?: (rating: number | null) => void;
  inStockOnly?: boolean;
  onInStockChange?: (value: boolean) => void;
  onSaleOnly?: boolean;
  onOnSaleChange?: (value: boolean) => void;
  freeShippingOnly?: boolean;
  onFreeShippingChange?: (value: boolean) => void;
  onClearAll?: () => void;
}

export function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandsChange,
  selectedRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onSaleOnly,
  onOnSaleChange,
  freeShippingOnly,
  onFreeShippingChange,
  onClearAll,
}: SearchFiltersProps) {
  const brands = [
    "SuperStore",
    "TechPro",
    "StyleMax",
    "HomeComfort",
    "SportsFit",
  ];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <motion.div
      className="space-y-6 bg-card border rounded-lg p-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {onClearAll && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
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
                className="text-sm cursor-pointer flex-1 flex items-center justify-between"
              >
                {category.name}
                <span className="text-muted-foreground text-xs">
                  ({category.productCount})
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatGBP(priceRange[0])}</span>
            <span>{formatGBP(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Brands (opt-in) */}
      {onBrandsChange && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Brands</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={(selectedBrands ?? []).includes(brand)}
                    onCheckedChange={(checked) => {
                      const current = selectedBrands ?? [];
                      if (checked === true) {
                        onBrandsChange([...current, brand]);
                        return;
                      }
                      onBrandsChange(current.filter((b) => b !== brand));
                    }}
                  />
                  <label htmlFor={brand} className="text-sm cursor-pointer">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Rating (opt-in) */}
      {onRatingChange && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Customer Rating</h4>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === rating}
                    onCheckedChange={(checked) =>
                      onRatingChange(checked === true ? rating : null)
                    }
                  />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center space-x-1"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {/* Availability (opt-in — renders rows only for provided handlers) */}
      {(onInStockChange || onOnSaleChange || onFreeShippingChange) && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Availability</h4>
            <div className="space-y-2">
              {onInStockChange && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={inStockOnly ?? false}
                    onCheckedChange={(checked) =>
                      onInStockChange(checked === true)
                    }
                  />
                  <label htmlFor="in-stock" className="text-sm cursor-pointer">
                    In Stock
                  </label>
                </div>
              )}
              {onOnSaleChange && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={onSaleOnly ?? false}
                    onCheckedChange={(checked) =>
                      onOnSaleChange(checked === true)
                    }
                  />
                  <label htmlFor="on-sale" className="text-sm cursor-pointer">
                    On Sale
                  </label>
                </div>
              )}
              {onFreeShippingChange && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="free-shipping"
                    checked={freeShippingOnly ?? false}
                    onCheckedChange={(checked) =>
                      onFreeShippingChange(checked === true)
                    }
                  />
                  <label
                    htmlFor="free-shipping"
                    className="text-sm cursor-pointer"
                  >
                    Free Shipping
                  </label>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
