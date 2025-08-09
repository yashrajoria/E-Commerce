"use client";

import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero-section";

import { CategoriesSection } from "@/components/sections/category-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CollectionsSection } from "@/components/sections/collections-sections";

import { FloatingActionButton } from "@/components/layout/floating-action-button";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <CollectionsSection />
      <FloatingActionButton />
      <Footer />
    </main>
  );
}
