"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/product-card";
import Link from "next/link";

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts(8, 1, true);
  const products = data?.products ?? [];

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="bg-muted/40 rounded-xl h-[340px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 border-b border-border/60">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Top Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
          </div>

          <Button asChild variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold">
            <Link href="/products?sortBy=newest">
              View All Products
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
