"use client";

import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ProductCardVariantProps } from "./types";

export function CompactProductCard({
  product,
  state,
}: ProductCardVariantProps) {
  const { primaryImage, isOutOfStock, handleAddToCart, setImageError } = state;

  return (
    <div className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 transition-colors">
      <Link
        href={`/products/${product.id}`}
        className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/30 shrink-0"
      >
        {primaryImage === "/icons8-image-100.png" ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <Package className="h-6 w-6 stroke-1" />
          </div>
        ) : (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.id}`}>
          <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {product.name}
          </h4>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold text-foreground font-mono">
            {formatGBP(product.price)}
          </span>
          {isOutOfStock && (
            <span className="text-[10px] text-destructive font-medium">Sold Out</span>
          )}
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        aria-label="Add to cart"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

