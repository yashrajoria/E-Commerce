"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";

export function WishlistItems() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const wishlistItems = wishlist;
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <Badge>{wishlistItems.length} items</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-card border rounded-lg overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.images?.[0] || "/icons8-image-100.png"}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={() => removeFromWishlist(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              {item.badge && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{formatGBP(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatGBP(item.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.category}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {wishlistItems.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-8">
            Save items you love for later by clicking the heart icon
          </p>
          <Button>Continue Shopping</Button>
        </div>
      )}
    </motion.div>
  );
}
