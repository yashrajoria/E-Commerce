"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";
import { getLucideIcon } from "@/lib/utils";

type CategoriesSectionProps = {
  layout?: "carousel" | "grid";
  filter?: string;
};

const featuredCategoryIds = [
  "5e91a564-bd4d-4f7f-a1b8-b4dca117c04a",
  "9bc6de24-8dca-4bc7-b16a-2e2e2c2f3a21",
  "2ddfa8df-beb9-4e7f-bb43-e8dd8fe9b7c0",
  "fefcad24-ec1f-4ff0-8a7a-9ab8f6d4f100",
  "6f57e02c-3674-4d41-a996-82f58dc1d9dd",
];

export function CategoriesSection({
  layout = "carousel",
  filter = "",
}: CategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading, error } = useCategories();

  const visibleCategories = featuredCategoryIds
    .map((id) => categories.find((category) => category.id === id))
    .filter((category): category is (typeof categories)[number] => Boolean(category))
    .filter((category) => category.name.toLowerCase().includes(filter.toLowerCase()));

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
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="shrink-0 h-56 w-44 rounded-2xl bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  if (visibleCategories.length === 0) {
    return (
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
              Browse categories
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight lg:text-3xl">
              No categories match this view
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try clearing the filter or explore the full catalog of products.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/categories">
                <Button className="rounded-full">
                  View all categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-2 block text-sm font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
              Browse
            </span>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Jump straight into the collection that fits your mood, with clear counts and fast product filters.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <Link href="/categories" className="hidden md:inline-flex">
              <Button variant="ghost" className="rounded-full px-4">
                View all categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="hidden gap-2 md:flex">
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
        </div>

        <div className="relative">
          {layout === "carousel" ? (
            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
            >
              {visibleCategories.map((category, index) => {
                const IconComponent = getLucideIcon(category.icon);

                return (
                  <motion.div
                    key={category.id}
                    className="shrink-0 group cursor-pointer snap-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.36 }}
                  >
                    <Link
                      href={`/products?categoryId=${encodeURIComponent(category.id)}&category=${encodeURIComponent(category.name)}`}
                      className="block"
                    >
                      <div className="premium-card relative h-56 w-44 overflow-hidden rounded-2xl border border-border/40">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg glass">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="mb-0.5 text-sm font-semibold leading-tight text-white">
                            {category.name}
                          </h3>
                          <p className="text-xs text-white/70">
                            {category.productCount}+ items
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {visibleCategories.map((category, index) => {
                const IconComponent = getLucideIcon(category.icon);

                return (
                  <motion.div
                    key={category.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.36 }}
                  >
                    <Link
                      href={`/products?categoryId=${encodeURIComponent(category.id)}&category=${encodeURIComponent(category.name)}`}
                      className="block"
                    >
                      <div className="premium-card relative h-44 w-full overflow-hidden rounded-2xl border border-border/40">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg glass">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="mb-0.5 text-sm font-semibold leading-tight text-white">
                            {category.name}
                          </h3>
                          <p className="text-xs text-white/70">
                            {category.productCount}+ items
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-12 bg-linear-to-l from-background to-transparent md:hidden" />
        </div>
      </div>
    </section>
  );
}
