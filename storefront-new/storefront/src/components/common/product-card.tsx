"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div
        className="flex bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              {product.badge}
            </Badge>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
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

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              High-quality product with excellent features and great value for
              money.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white">
              {product.badge}
            </Badge>
          )}

          <motion.div
            className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm"
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
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <Button className="bg-white text-black hover:bg-gray-100">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>
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

          <h3 className="font-semibold mb-3 line-clamp-2">{product.name}</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Button size="sm">Add to Cart</Button>
          </div>

          {!product.inStock && (
            <Badge variant="destructive" className="mt-2">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
