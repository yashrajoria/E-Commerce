"use client";

import React, { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";
import { getLucideIcon } from "@/lib/utils";

/** Props accepted by {@link CategoriesSection}. */
type CategoriesSectionProps = {
  /**
   * Layout hint: `"carousel"` renders the scroll-arrow buttons next to the header.
   *
   * @defaultValue "carousel"
   */
  layout?: "carousel" | "grid";
  /**
   * Case-insensitive substring matched against category names to narrow the list; empty shows all.
   *
   * @defaultValue ""
   */
  filter?: string;
};

/**
 * Renders the "Shop by Category" band with a horizontally scrollable row of category cards.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * Loads categories with `useCategories`, caps the list at ten entries (after applying `filter`), shows a skeleton row while loading, and renders nothing on error or when no category matches.
 *
 * @example
 * ```tsx
 * <CategoriesSection />
 * ```
 */
export function CategoriesSection({
  layout = "carousel",
  filter = "",
}: CategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading, error } = useCategories();

  const visibleCategories = categories
    .filter((category) =>
      filter
        ? category.name.toLowerCase().includes(filter.toLowerCase())
        : true,
    )
    .slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="shrink-0 h-44 w-40 rounded-xl bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || visibleCategories.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 border-b border-border/60 bg-muted/10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/categories"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mr-2"
            >
              All Categories
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {layout === "carousel" && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel or Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x"
        >
          {visibleCategories.map((category) => {
            const IconComponent = getLucideIcon(category.icon);

            return (
              <Link
                key={category.id}
                href={`/products?categoryId=${encodeURIComponent(category.id)}&category=${encodeURIComponent(category.name)}`}
                className="group shrink-0 w-44 sm:w-48 p-4 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all duration-200 snap-start flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-lg bg-muted/40 overflow-hidden mb-3 flex items-center justify-center">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-foreground capitalize group-hover:underline line-clamp-1">
                    {category.name.replace(/-/g, " ")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.productCount
                      ? `${category.productCount} items`
                      : "Explore"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
