"use client";

import Head from "next/head";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoriesSection } from "@/components/sections/category-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Grid, List } from "lucide-react";

export default function CategoriesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [filter, setFilter] = useState("");
  const [layout, setLayout] = useState<"grid" | "carousel">("grid");

  return (
    <>
      <Head>
        <title>Categories | ShopSwift</title>
        <meta name="description" content="Browse product categories." />
        <link rel="canonical" href={`${siteUrl}/categories`} />
        <meta property="og:title" content="Categories | ShopSwift" />
        <meta property="og:description" content="Browse product categories." />
        <meta property="og:url" content={`${siteUrl}/categories`} />
      </Head>

      <main className="min-h-screen">
        <Header />

        <section className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Input
              placeholder="Search categories..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xl"
            />

            <div className="flex items-center gap-2">
              <Button
                variant={layout === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayout("grid")}
                aria-pressed={layout === "grid"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === "carousel" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayout("carousel")}
                aria-pressed={layout === "carousel"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <CategoriesSection layout={layout} filter={filter} />

        <Footer />
      </main>
    </>
  );
}
