"use client";

import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero-section";

import { CategoriesSection } from "@/components/sections/category-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CollectionsSection } from "@/components/sections/collections-sections";

import { FloatingActionButton } from "@/components/layout/floating-action-button";
import { Footer } from "@/components/layout/footer";
import Head from "next/head";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <>
      <Head>
        <title>Storefront | Home</title>
        <meta
          name="description"
          content="Discover top products with fast delivery, secure checkout, and great prices."
        />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content="Storefront" />
        <meta
          property="og:description"
          content="Discover top products with fast delivery, secure checkout, and great prices."
        />
        <meta property="og:url" content={siteUrl} />
      </Head>
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <CollectionsSection />
        <FloatingActionButton />
        <Footer />
      </main>
    </>
  );
}
