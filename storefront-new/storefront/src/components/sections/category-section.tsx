"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const { data: categories = [], isLoading, error } = useCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ y }}>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground">
              Explore our wide range of product categories
            </p>
          </motion.div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => {
            const IconComponent =
              (
                LucideIcons as unknown as Record<
                  string,
                  React.ComponentType<{ className?: string }>
                >
              )[category.icon] || LucideIcons.Package;

            return (
              <motion.div
                key={category.id}
                className="flex-shrink-0 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative w-32 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border">
                  {/* Category Image */}
                  <div className="relative w-full h-24">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 8rem"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Icon */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {category.productCount}+ items
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300"
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
