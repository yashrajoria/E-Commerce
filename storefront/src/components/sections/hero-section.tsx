"use client";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { formatGBP } from "@/lib/utils";
import { resolveProductImageUrl } from "@ecommerce/shared";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Renders the storefront homepage hero with editorial copy and a featured-release spotlight card.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * Loads three featured products through `useProducts(3, 1, true)` and promotes the first to the spotlight, falling back to placeholder artwork and default copy when no image or product is available.
 *
 * @example
 * ```tsx
 * <HeroSection />
 * ```
 */
export function HeroSection() {
  const { data } = useProducts(3, 1, true);
  const products = data?.products ?? [];
  const featuredProduct = products[0];
  const [imageError, setImageError] = useState(false);

  const rawFeaturedImage = resolveProductImageUrl(featuredProduct?.images?.[0]);
  const heroImage =
    imageError || !rawFeaturedImage
      ? "/icons8-image-100.png"
      : rawFeaturedImage;

  return (
    <section className="relative border-b border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted text-foreground text-xs font-semibold tracking-wide uppercase">
              <span>Spring / Summer 2026 Collection</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
                Curated Design for Modern Everyday Living.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Discover exceptional essentials crafted with intention. From
                precision electronics to timeless apparel, find what elevates
                your day.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="h-11 px-6 text-sm font-semibold"
              >
                <Link href="/products">
                  Shop All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-6 text-sm font-semibold"
              >
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>

            {/* Value Propositions */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-foreground shrink-0" />
                <span>Free UK shipping over £50</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-foreground shrink-0" />
                <span>Direct 2-year warranty</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Hassle-free 30-day returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden group">
              <div className="flex items-center justify-between pb-4 border-b border-border/50 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Featured Release
                </span>
                <span className="text-muted-foreground">In Stock</span>
              </div>

              {/* Showcase Image */}
              <div className="relative aspect-4/3 w-full my-6 bg-muted/30 rounded-xl overflow-hidden flex items-center justify-center">
                {heroImage === "/icons8-image-100.png" ? (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/40 p-8 text-center">
                    <Package className="h-16 w-16 stroke-1 mb-3" />
                    <span className="text-sm font-medium text-foreground">
                      {featuredProduct?.name || "Curated Daily Essentials"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      ShopSwift Catalog
                    </span>
                  </div>
                ) : (
                  <Image
                    src={heroImage}
                    alt={featuredProduct?.name || "Featured release"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                    onError={() => setImageError(true)}
                    priority
                  />
                )}
              </div>

              {/* Spotlight Product Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {featuredProduct?.name ||
                        "Studio Sound Over-Ear Headphones"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {typeof featuredProduct?.category === "string"
                        ? featuredProduct.category
                        : featuredProduct?.category?.name || "Electronics"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-foreground">
                      {featuredProduct
                        ? formatGBP(featuredProduct.price)
                        : "£149.00"}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="secondary"
                  className="w-full h-10 text-xs font-semibold"
                >
                  <Link
                    href={
                      featuredProduct
                        ? `/products/${featuredProduct.id}`
                        : "/products"
                    }
                  >
                    View Product Details
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
