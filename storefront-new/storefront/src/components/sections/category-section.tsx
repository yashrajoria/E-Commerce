"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";

type CategoriesSectionProps = {
  layout?: "carousel" | "grid";
  filter?: string;
};

export function CategoriesSection({
  layout = "carousel",
  filter = "",
}: CategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading, error } = useCategories();

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (isLoading) {
      import Link from "next/link";
    return (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="shrink-0 w-44 h-56 bg-muted/40 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase()),
  );

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
                    {filtered.map((category, index) => {
              size="icon"
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full border-border/60"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
                      return (
                        <motion.div
                          key={category.id}
                          className="shrink-0 group cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.04, duration: 0.36 }}
                        >
                          <Link
                            href={`/products?category=${encodeURIComponent(
                              category.name,
                            )}`}
                            className="block"
                          >
                            <div className="relative w-44 h-56 rounded-2xl overflow-hidden premium-card border border-border/40">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                              <div className="absolute top-3 right-3 h-8 w-8 rounded-lg glass flex items-center justify-center">
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-semibold text-white text-sm leading-tight mb-0.5">
                                  {category.name}
                                </h3>
                                <p className="text-white/70 text-xs">{category.productCount}+ items</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((category, index) => {
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
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.36 }}
                  >
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden premium-card border border-border/40">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 h-8 w-8 rounded-lg glass flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
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
          )}

          {/* Fade edge indicator on mobile */}
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
      </div>
    </section>
  );
}
