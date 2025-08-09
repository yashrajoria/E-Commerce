"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredProducts } from "@/lib/data";
import { useCart } from "@/context/CartContext";

export function FeaturedProducts() {
  const { addToCart } = useCart();
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hand-picked products with the best reviews and unbeatable prices
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className={`group relative ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm h-full">
                {/* Product Image */}
                <div
                  className={`relative ${
                    index === 0 ? "h-80" : "h-64"
                  } overflow-hidden`}
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Badge */}
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      {product.badge}
                    </Badge>
                  )}

                  {/* Quick Actions */}
                  <motion.div
                    className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 0 }}
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
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size={index === 0 ? "default" : "sm"}
                      onClick={() =>
                        addToCart({
                          ...product,
                          quantity: 1,
                        })
                      }
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Add to Cart
                    </Button>
                  </div>

                  {!product.inStock && (
                    <Badge variant="destructive" className="mt-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
