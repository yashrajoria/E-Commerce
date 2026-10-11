"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Package, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@ecommerce/shared";
import Image from "next/image";
import Link from "next/link";

function WishlistItemCard({
  item,
  index,
  onRemove,
  onAddToCart,
}: {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images?: string[];
    category?: string | { name: string };
    badge?: string;
  };
  index: number;
  onRemove: (id: string) => void;
  onAddToCart: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImage = item.images?.[0];
  const isLocalStack = rawImage?.includes("localhost:4566");
  const hasValidImage = rawImage && !isLocalStack && !imageFailed;
  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "GBP";
  const locale = process.env.NEXT_PUBLIC_LOCALE ?? "en-GB";
  const categoryName = typeof item.category === "string" ? item.category : item.category?.name;

  return (
    <motion.div
      key={item.id}
      className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      <div className="relative aspect-4/3 bg-muted overflow-hidden flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground/40" />
        )}
        <button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-xs border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from wishlist"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        {item.badge && (
          <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] py-0 px-1.5 font-normal">
            {item.badge}
          </Badge>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
          {categoryName && (
            <p className="text-xs text-muted-foreground mt-0.5">{categoryName}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-sm">
              {formatCurrency(item.price, { currency, locale })}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(item.originalPrice, { currency, locale })}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border">
          <Button size="sm" className="w-full text-xs" onClick={onAddToCart}>
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Add to Bag
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function WishlistItems() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlistItems = wishlist;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Wishlist ({wishlistItems.length})
        </h2>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-border bg-surface">
          <Heart className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-semibold mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Items you mark with a heart will be saved here.
          </p>
          <Button asChild size="sm">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item, index) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              index={index}
              onRemove={removeFromWishlist}
              onAddToCart={() => {
                addToCart({
                  ...item,
                  quantity: 1,
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
