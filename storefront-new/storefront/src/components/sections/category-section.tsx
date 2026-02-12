"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading, error } = useCategories();

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 h-56 bg-muted/40 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400 tracking-wide uppercase mb-2 block">
              Browse
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Shop by Category
            </h2>
          </motion.div>

          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-full border-border/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full border-border/60"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Categories */}
        <div className="relative -mx-4 px-4">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <div className="relative w-44 h-56 rounded-2xl overflow-hidden premium-card border border-border/40">
                    {/* Full image background */}
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="11rem"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-lg glass flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-white text-sm leading-tight mb-0.5">
                        {category.name}
                      </h3>
                      <p className="text-white/70 text-xs">
                        {category.productCount}+ items
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Fade edge indicator on mobile */}
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
      </div>
    </section>
  );
}
