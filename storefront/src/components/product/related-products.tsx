"use client";

import React from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/product-card";

interface RelatedProductsProps {
  currentProductId: string;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const { data, isLoading, error } = useProducts(8, 1, true);
  const relatedProducts = (data?.products ?? [])
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (isLoading || error || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-border/60">
      <div className="mb-8">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
          Complete the Look
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          You Might Also Like
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
