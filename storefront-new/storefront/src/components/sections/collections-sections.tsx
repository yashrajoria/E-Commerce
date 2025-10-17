"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collections } from "@/lib/data";

export function CollectionsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Curated Collections</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections designed for your
            lifestyle
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className={`group relative cursor-pointer ${
                collection.layout === "large"
                  ? "lg:col-span-2 lg:row-span-2"
                  : ""
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className={`relative overflow-hidden rounded-3xl ${
                  collection.layout === "large" ? "h-96 lg:h-full" : "h-80"
                }`}
              >
                {/* Background Image */}
                <motion.img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Glassmorphism Content */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                >
                  <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3
                      className={`font-bold text-white mb-2 ${
                        collection.layout === "large" ? "text-3xl" : "text-xl"
                      }`}
                    >
                      {collection.title}
                    </h3>
                    <p className="text-white/80 mb-4">{collection.subtitle}</p>

                    {/* Product Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">
                        {collection.products.length} products
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/20 p-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Hover Effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
