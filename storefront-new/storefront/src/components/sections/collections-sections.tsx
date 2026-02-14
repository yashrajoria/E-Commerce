"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";

interface CollectionViewModel {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productCount: number;
  layout: "large" | "medium";
}

export function CollectionsSection() {
  const { data: productsData, isLoading, error } = useProducts(12, 1, false);
  const { data: categoriesData = [] } = useCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = productsData?.products ?? [];

  const collections = useMemo<CollectionViewModel[]>(() => {
    if (!products.length) return [];
    const grouped = new Map<string, number>();
    products.forEach((product) => {
      const key = product.category || "Other";
      grouped.set(key, (grouped.get(key) ?? 0) + 1);
    });

    const preferredOrder = categoriesData.map((c) => c.name);
    const orderedCategories = preferredOrder.length
      ? preferredOrder.filter((name) => grouped.has(name))
      : Array.from(grouped.keys());

    return orderedCategories.slice(0, 3).map((name, index) => {
      const count = grouped.get(name) ?? 0;
      const firstProduct = products.find((p) => p.category === name);
      const image = firstProduct?.images?.[0] || "/icons8-image-100.png";
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        title: name,
        subtitle: `Top picks in ${name}`,
        image,
        productCount: count,
        layout: index === 0 ? "large" : "medium",
      };
    });
  }, [products, categoriesData]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 lg:row-span-2 h-96 lg:h-[480px] bg-muted/40 rounded-2xl animate-pulse" />
            <div className="h-56 bg-muted/40 rounded-2xl animate-pulse" />
            <div className="h-56 bg-muted/40 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (error || collections.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 tracking-wide uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Curated for You
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Explore Collections
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Thoughtfully grouped selections designed around your lifestyle
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className={`group relative ${
                collection.layout === "large"
                  ? "lg:col-span-2 lg:row-span-2"
                  : ""
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <Link href={`/products?category=${collection.title}`}>
                <div
                  className={`relative overflow-hidden rounded-2xl cursor-pointer ${
                    collection.layout === "large"
                      ? "h-80 lg:h-full min-h-[320px]"
                      : "h-64"
                  }`}
                >
                  {/* Image */}
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes={
                      collection.layout === "large"
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 1024px) 100vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <span className="inline-block text-xs font-medium bg-white/15 text-white/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                      {collection.productCount} products
                    </span>
                    <h3
                      className={`font-bold text-white mb-1 ${
                        collection.layout === "large"
                          ? "text-2xl lg:text-3xl"
                          : "text-xl"
                      }`}
                    >
                      {collection.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      {collection.subtitle}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:gap-2.5 transition-all duration-300">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Violet hover wash */}
                  <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/10 transition-colors duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
