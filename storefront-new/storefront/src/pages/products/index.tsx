"use client";

import { ProductCard } from "@/components/common/product-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SearchFilters } from "@/components/search/search-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { Filter, Grid, List, Search } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react"; // Imported useEffect
import type { Product } from "@/lib/types";

export default function SearchPage() {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const DEFAULT_MAX_PRICE = 500000;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([
    0,
    DEFAULT_MAX_PRICE,
  ]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [productCount, setProductCount] = useState(12);
  const { data: categories = [] } = useCategories();
  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined;
    const match = categories.find((c) => c.name === selectedCategory);
    return match?.id;
  }, [categories, selectedCategory]);
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  // Set page from URL query on initial load
  const [page, setPage] = useState(Number(router.query.page) || 1);

  // Debounce backend search calls to avoid one request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce slider-driven range updates to avoid many backend calls while dragging.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedPriceRange(priceRange);
    }, 350);

    return () => clearTimeout(timer);
  }, [priceRange]);

  const { data, isLoading, error } = useProducts(productCount, page, {
    categoryId: selectedCategoryId,
    minPrice: appliedPriceRange[0],
    maxPrice: appliedPriceRange[1],
    sortBy,
    search: debouncedSearchQuery.trim() || undefined,
    brands: selectedBrands.length ? selectedBrands : undefined,
    minRating: selectedRating ?? undefined,
    inStock: inStockOnly || undefined,
    onSale: onSaleOnly || undefined,
    freeShipping: freeShippingOnly || undefined,
  });
  const categoriesWithCounts = categories;
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = (data?.products ?? []).filter((product) => {
      const categoryName =
        typeof product.category === "string"
          ? product.category
          : (product.category?.name ?? "");

      const matchesQuery =
        query.length === 0 ||
        (product.name && product.name.toLowerCase().includes(query)) ||
        categoryName.toLowerCase().includes(query);

      const matchesCategoryFallback =
        !selectedCategoryId ||
        selectedCategory.length === 0 ||
        categoryName === selectedCategory;

      const productBrand = (product as Product & { brand?: string }).brand;
      const matchesBrand =
        selectedBrands.length === 0 ||
        (typeof productBrand === "string" && selectedBrands.includes(productBrand));

      const matchesRating =
        selectedRating === null || (product.rating ?? 0) >= selectedRating;

      const matchesInStock = !inStockOnly || product.inStock !== false;

      const matchesOnSale =
        !onSaleOnly ||
        (typeof product.originalPrice === "number" &&
          typeof product.price === "number" &&
          product.originalPrice > product.price);

      // Shipping eligibility is not exposed on product payload yet.
      const matchesFreeShipping = !freeShippingOnly;

      return (
        matchesQuery &&
        matchesCategoryFallback &&
        matchesBrand &&
        matchesRating &&
        matchesInStock &&
        matchesOnSale &&
        matchesFreeShipping
      );
    });

    if (sortBy === "rating") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return list;
  }, [
    data?.products,
    searchQuery,
    selectedCategoryId,
    selectedCategory,
    selectedBrands,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    freeShippingOnly,
    sortBy,
  ]);

  // If backend returns prices in minor units (pence/cents), detect and adjust
  // the UI price range to a sensible default based on loaded products.
  useEffect(() => {
    if (
      filteredProducts.length &&
      priceRange[0] === 0 &&
      priceRange[1] === DEFAULT_MAX_PRICE
    ) {
      const maxRaw = Math.max(...filteredProducts.map((p) => p.price ?? 0));
      const max = maxRaw > 1000 ? Math.ceil(maxRaw / 100) : Math.ceil(maxRaw);
      setPriceRange([0, Math.max(500, max)]);
    }
  }, [filteredProducts, priceRange, DEFAULT_MAX_PRICE]);

  const totalPages = data?.meta?.totalPages ?? 1;
  // Effect to update state if URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [router.query.page]);

  // Sync initial category filter from URL when navigating from category links.
  useEffect(() => {
    if (typeof router.query.categoryId === "string") {
      const matched = categories.find((category) => category.id === router.query.categoryId);
      if (matched) {
        setSelectedCategory(matched.name);
        return;
      }
    }

    if (typeof router.query.category === "string") {
      setSelectedCategory(router.query.category);
    }
  }, [router.query.category, router.query.categoryId, categories]);

  // Reset to first page when filters change.
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchQuery,
    selectedCategory,
    appliedPriceRange,
    sortBy,
    selectedBrands,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    freeShippingOnly,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, DEFAULT_MAX_PRICE]);
    setSortBy("relevance");
    setSelectedBrands([]);
    setSelectedRating(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setFreeShippingOnly(false);
  };

  const handlePageChange = (newPage: number) => {
    // Prevent going to page 0 or below or beyond total pages
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>ShopSwift | Products</title>
        <meta
          name="description"
          content="Browse our latest products, filter by category, and find the best deals."
        />
        <link rel="canonical" href={`${siteUrl}/products`} />
        <meta property="og:title" content="ShopSwift | Products" />
        <meta
          property="og:description"
          content="Browse our latest products, filter by category, and find the best deals."
        />
        <meta property="og:url" content={`${siteUrl}/products`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-full border-border/60 bg-muted/30 focus:bg-background"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden rounded-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full"
                onClick={() => setSearchQuery("")}
              >
                Search: &quot;{searchQuery}&quot; ×
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full"
                onClick={() => setSelectedCategory("")}
              >
                Category: {selectedCategory} ×
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < DEFAULT_MAX_PRICE) && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full"
                onClick={() => setPriceRange([0, DEFAULT_MAX_PRICE])}
              >
                Price: {formatGBP(priceRange[0])} - {formatGBP(priceRange[1])} ×
              </Badge>
            )}
          </div>

          {/* Results Info & Controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} results found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="flex items-center gap-3">
              <select
                value={productCount}
                onChange={(e) => setProductCount(Number(e.target.value))}
                className="border border-border/60 rounded-lg px-3 py-1.5 text-sm bg-background"
              >
                <option value="12">12</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-border/60 rounded-lg px-3 py-1.5 text-sm bg-background"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex border border-border/60 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 flex-shrink-0`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchFilters
              categories={categoriesWithCounts}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onSaleOnly={onSaleOnly}
              onOnSaleChange={setOnSaleOnly}
              freeShippingOnly={freeShippingOnly}
              onFreeShippingChange={setFreeShippingOnly}
              onClearAll={clearAllFilters}
            />
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p>Error loading products.</p>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse our categories
                </p>
              </motion.div>
            ) : (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {page > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {Array.from(
              {
                length:
                  Math.min(totalPages, page + 1) - Math.max(1, page - 1) + 1,
              },
              (_, index) => Math.max(1, page - 1) + index,
            ).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === page}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>

      <Footer />
    </div>
  );
}
