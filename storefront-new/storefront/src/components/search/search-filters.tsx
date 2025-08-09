"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/types";

interface SearchFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
}

export function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
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
        <Button variant="ghost" size="sm">
          Clear All
        </Button>
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
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h4 className="font-medium mb-3">Brands</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
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

      <Separator />

      {/* Availability */}
      <div>
        <h4 className="font-medium mb-3">Availability</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="on-sale" />
            <label htmlFor="on-sale" className="text-sm cursor-pointer">
              On Sale
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="free-shipping" />
            <label htmlFor="free-shipping" className="text-sm cursor-pointer">
              Free Shipping
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
