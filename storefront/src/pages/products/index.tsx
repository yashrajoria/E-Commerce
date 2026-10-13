import { ProductCard } from "@/components/common/product-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CatalogPagination } from "@/components/search/CatalogPagination";
import { SearchFilters } from "@/components/search/search-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_MAX_PRICE,
  useProductSearchState,
} from "@/hooks/useProductSearchState";
import { fetchProductsSsr, type SsrProductsResponse } from "@/lib/ssrProducts";
import { formatGBP } from "@/lib/utils";
import { motion } from "framer-motion";
import { Filter, Grid, List, Search } from "lucide-react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

type SearchPageProps = {
  initialCatalog: SsrProductsResponse | null;
};

export default function SearchPage({ initialCatalog }: SearchPageProps) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedBrands,
    setSelectedBrands,
    selectedRating,
    setSelectedRating,
    inStockOnly,
    setInStockOnly,
    onSaleOnly,
    setOnSaleOnly,
    freeShippingOnly,
    setFreeShippingOnly,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    productCount,
    setProductCount,
    categories,
    filteredProducts,
    availableBrands,
    maxPriceLimit,
    totalPages,
    page,
    data,
    isLoading,
    error,
    clearAllFilters,
    handlePageChange,
  } = useProductSearchState({ initialCatalog });

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
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, brands, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-lg border-border/80 bg-background"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden rounded-lg h-10 text-xs font-semibold"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-md text-xs font-medium"
                onClick={() => setSearchQuery("")}
              >
                Search: &quot;{searchQuery}&quot; ×
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-md text-xs font-medium"
                onClick={() => setSelectedCategory("")}
              >
                Category: {selectedCategory} ×
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < DEFAULT_MAX_PRICE) && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-md text-xs font-medium"
                onClick={() => setPriceRange([0, DEFAULT_MAX_PRICE])}
              >
                Price: {formatGBP(priceRange[0])} - {formatGBP(priceRange[1])} ×
              </Badge>
            )}
          </div>

          {/* Results Info & Controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data?.meta?.total ?? filteredProducts.length} products found
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
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPriceLimit={maxPriceLimit}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              availableBrands={availableBrands}
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
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {Array.from({
                  length: productCount > 12 ? 12 : productCount,
                }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border/60 overflow-hidden"
                  >
                    <div className="aspect-square bg-muted/40 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-1/3 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                      <div className="h-5 w-1/4 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 rounded-2xl border border-border/60 bg-card/50">
                <h3 className="text-xl font-semibold mb-2">
                  Couldn’t load products
                </h3>
                <p className="text-muted-foreground mb-6">
                  Something went wrong. Please try again.
                </p>
                <Button onClick={() => router.reload()} className="rounded-lg">
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse our categories
                </p>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="rounded-lg"
                >
                  Clear filters
                </Button>
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

        <CatalogPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (
  ctx,
) => {
  const page = Number(ctx.query.page) || 1;
  const initialCatalog = await fetchProductsSsr({
    page: page > 0 ? page : 1,
    perPage: 12,
  });

  return {
    props: {
      initialCatalog,
    },
  };
};
