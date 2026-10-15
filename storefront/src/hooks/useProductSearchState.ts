import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import type { SsrProductsResponse } from "@/lib/ssrProducts";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

/**
 * Default upper bound for the catalog price filter, used until product data
 * supplies a tighter `maxPriceLimit`.
 */
export const DEFAULT_MAX_PRICE = 500000;

/**
 * Options accepted by {@link useProductSearchState}.
 */
interface UseProductSearchStateOptions {
  /** SSR-fetched first page of the catalog, forwarded to React Query as `initialData`. */
  initialCatalog?: SsrProductsResponse | null;
}

/**
 * Client-side state manager for the product catalog page.
 *
 * @remarks
 * Owns search text, category, price range, brand/rating/availability toggles,
 * sort order, view mode, and page state. It hydrates `search`, `sortBy`,
 * `category`, `categoryId`, and `page` from the router query, debounces search
 * text and the price slider by 350 ms, and feeds the combined filters into
 * {@link useProducts} and {@link useCategories}.
 *
 * @param options - Optional initial catalog data passed through to {@link useProducts}; omit to run without an SSR-seeded first page.
 * @returns The catalog state: filter values with their setters, derived values (`filteredProducts`, `availableBrands`, `maxPriceLimit`, `totalPages`, `page`, `categories`), the underlying React Query result (`data`, `isLoading`, `error`), and the helpers `clearAllFilters` and `handlePageChange`.
 */
export function useProductSearchState({
  initialCatalog,
}: UseProductSearchStateOptions = {}) {
  const router = useRouter();
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

  const [page, setPage] = useState(Number(router.query.page) || 1);

  // Hydrate search + category from URL (header search, category links).
  useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query.search === "string") {
      setSearchQuery(router.query.search);
      setDebouncedSearchQuery(router.query.search);
    }
    if (typeof router.query.sortBy === "string") {
      setSortBy(router.query.sortBy);
    }
  }, [router.isReady, router.query.search, router.query.sortBy]);

  // Debounce backend search calls.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce price slider updates.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedPriceRange(priceRange);
    }, 350);

    return () => clearTimeout(timer);
  }, [priceRange]);

  const { data, isLoading, error } = useProducts(
    productCount,
    page,
    {
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
    },
    {
      initialData:
        page === 1 &&
        !debouncedSearchQuery &&
        !selectedCategoryId &&
        !selectedBrands.length &&
        selectedRating == null &&
        !inStockOnly &&
        !onSaleOnly &&
        !freeShippingOnly &&
        sortBy === "relevance"
          ? (initialCatalog ?? undefined)
          : undefined,
    },
  );

  const filteredProducts = useMemo(() => {
    const list = data?.products ?? [];
    if (sortBy === "rating") {
      return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return list;
  }, [data?.products, sortBy]);

  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    (data?.products ?? []).forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [data?.products]);

  const maxPriceLimit = useMemo(() => {
    const prods = data?.products ?? [];
    if (!prods.length) return 2000;
    const maxVal = Math.max(...prods.map((p) => p.price ?? 0));
    return Math.max(200, Math.ceil(maxVal * 1.1));
  }, [data?.products]);

  const totalPages = data?.meta?.totalPages ?? 1;

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [router.query.page]);

  useEffect(() => {
    if (typeof router.query.categoryId === "string") {
      const matched = categories.find(
        (category) => category.id === router.query.categoryId,
      );
      if (matched) {
        setSelectedCategory(matched.name);
        return;
      }
    }

    if (typeof router.query.category === "string") {
      setSelectedCategory(router.query.category);
    }
  }, [router.query.category, router.query.categoryId, categories]);

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

  return {
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
  };
}
