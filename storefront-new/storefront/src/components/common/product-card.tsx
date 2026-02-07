"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);
  const primaryImage = product.images?.[0] || "/icons8-image-100.png";

  // Reusable handler to add the correct product to the cart
  const handleAddToCart = (e: React.MouseEvent) => {
    // Stop the click from propagating to parent elements (like a navigation link)
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
    });
  };
  const isWishlisted = hasWishlistItem(product.id);
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      return;
    }
    addToWishlist(product);
  };

  if (viewMode === "list") {
    // --- LIST VIEW ---
    return (
      <motion.div
        className="flex w-full bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        whileHover={{ y: -2 }}
      >
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 30vw, 12rem"
            className="object-cover"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
              {product.badge}
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {product.category}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            </div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {product.description || "A high-quality and valuable product."}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">
                {formatGBP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatGBP(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              {/* FIX: Corrected typo and added handler */}
              <Button size="sm" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- GRID VIEW (Default) ---
  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white">
              {product.badge}
            </Badge>
          )}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm"
              onClick={handleWishlistToggle}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {/* FIX: Added missing onClick handler */}
            <Button
              className="bg-white text-black hover:bg-gray-200"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold mb-3 line-clamp-2 h-12">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold">
                {formatGBP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatGBP(product.originalPrice)}
                </span>
              )}
            </div>
            {/* FIX: Corrected typo and added handler */}
            <Button size="sm" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
          {/* FIX: Changed logic to check for 'quantity' */}
          {typeof product.quantity === "number" && (
            <Badge
              variant={product.quantity > 0 ? "secondary" : "destructive"}
              className={
                product.quantity > 0
                  ? "mt-2 text-green-700 border-green-200 bg-green-50"
                  : "mt-2"
              }
            >
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
