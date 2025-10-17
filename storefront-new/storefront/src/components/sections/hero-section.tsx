"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export function HeroSection() {
  const { data: productsData = [], isLoading, error } = useProducts(3, 6, true);
  const products = Array.isArray(productsData)
    ? productsData
    : productsData?.products || [];

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Super Sale: Up to 70% Off
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Everything
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                You Need
              </span>
              in One Place
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Discover millions of products from trusted brands. Fast delivery,
              secure payments, and unbeatable prices await you.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Browse Categories
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-8 pt-8">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "Secure Payment" },
                { icon: Zap, text: "Fast Delivery" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 text-muted-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="h-5 w-5" />
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Floating Product Cards */}
          <motion.div
            className="relative h-[600px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Cards */}
            {products.length > 0 && (
              <div>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    className="absolute bg-background/80 backdrop-blur-lg rounded-2xl p-4 border shadow-lg"
                    style={{
                      top: `${index * 120}px`,
                      left: `${(index % 2) * 150}px`,
                    }}
                    initial={{ opacity: 0, y: 50, rotate: -10 }}
                    animate={{
                      opacity: 1,
                      y: [0, -10, 0],
                    }}
                    transition={{
                      delay: index * 0.2,
                      duration: 0.8,
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotate: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-medium text-sm">{product.title}</h3>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Central Gradient Orb */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
