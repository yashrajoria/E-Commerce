import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import type { Product } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface ProductsResponse {
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  products: Product[];
}

/**
 * Filter parameters forwarded to the catalog API by {@link useProducts}.
 */
export interface ProductFilters {
  /** Free-text search term. */
  search?: string;
  /** Category name filter. */
  category?: string;
  /** Category identifier filter (takes precedence over `category` on the API). */
  categoryId?: string;
  /** Minimum price in major currency units. */
  minPrice?: number;
  /** Maximum price in major currency units. */
  maxPrice?: number;
  /** Storefront sort key (`price-low`, `price-high`, `newest`, `rating`), mapped to an API sort value. */
  sortBy?: string;
  /** Restrict results to featured products; omitted entirely when `undefined`. */
  isFeatured?: boolean;
  /** Brand names to include (sent as repeated `brand` params). */
  brands?: string[];
  /** Minimum average rating. */
  minRating?: number;
  /** Restrict to in-stock products. */
  inStock?: boolean;
  /** Restrict to discounted products. */
  onSale?: boolean;
  /** Restrict to products with free shipping. */
  freeShipping?: boolean;
}

const mapSortForApi = (sortBy?: string) => {
  switch (sortBy) {
    case "price-low":
      return "price_asc";
    case "price-high":
      return "price_desc";
    case "newest":
      return "created_at_desc";
    case "rating":
      return "rating_desc";
    default:
      return undefined;
  }
};

const fetchProducts = async (
  productCount: number = 12,
  page: number = 1,
  filters?: ProductFilters,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(productCount),
  });

  // Only filter by featured when the caller explicitly asks.
  // Sending is_featured=false was excluding featured catalog items by default.
  if (typeof filters?.isFeatured === "boolean") {
    params.append("is_featured", String(filters.isFeatured));
  }

  const categoryId = filters?.categoryId?.trim();
  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (typeof filters?.minPrice === "number") {
    params.append("minPrice", String(filters.minPrice));
  }

  if (typeof filters?.maxPrice === "number") {
    params.append("maxPrice", String(filters.maxPrice));
  }

  const sort = mapSortForApi(filters?.sortBy);
  if (sort) {
    params.append("sort", sort);
  }

  const search = filters?.search?.trim();
  if (search) {
    params.append("search", search);
  }

  if (filters?.brands?.length) {
    for (const brand of filters.brands) {
      const value = brand.trim();
      if (value) params.append("brand", value);
    }
  }

  if (typeof filters?.minRating === "number") {
    params.append("minRating", String(filters.minRating));
  }

  if (typeof filters?.inStock === "boolean") {
    params.append("inStock", String(filters.inStock));
  }

  if (typeof filters?.onSale === "boolean") {
    params.append("onSale", String(filters.onSale));
  }

  if (typeof filters?.freeShipping === "boolean") {
    params.append("freeShipping", String(filters.freeShipping));
  }

  const response = await axiosInstance.get(
    `${API_ROUTES.PRODUCTS.ALL}?${params.toString()}`,
    { signal },
  );

  const data = response.data as {
    meta: ProductsResponse["meta"];
    products: Array<Product & { _id?: string }> | null;
  };
  const products = Array.isArray(data.products) ? data.products : [];
  return {
    meta: data.meta ?? {
      page,
      perPage: productCount,
      total: products.length,
      totalPages: 1,
    },
    products: products.map((product) => ({
      ...product,
      id: product.id ?? product._id ?? "",
    })),
  };
};

const fetchProductById = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<Product> => {
  const url = API_ROUTES.PRODUCTS.BY_ID(String(id));
  const response = await axiosInstance.get(url, { signal });
  const data = response.data as Product & { _id?: string };
  return {
    ...data,
    id: data.id ?? data._id ?? String(id),
  };
};

/**
 * React Query hook that loads a single product by id, disabled until an id is available.
 *
 * @param id - Product identifier (string or number); the query stays disabled for `undefined`, `null`, or empty values.
 * @param options - Optional configuration; `initialData` seeds the cache with an SSR-fetched product.
 * @returns The React Query result — `data` is the normalized {@link Product} once loaded, with `isLoading`/`error` surfacing request state.
 */
export function useProductById(
  id?: string | number,
  options?: { initialData?: Product },
) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: ({ signal }) => {
      if (id === undefined || id === null || String(id).length === 0) {
        return Promise.reject(new Error("Product id is required"));
      }
      return fetchProductById(id, signal);
    },
    enabled: id !== undefined && id !== null && String(id).length > 0,
    initialData: options?.initialData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * React Query hook that loads a page of products with optional filters.
 *
 * @remarks
 * The legacy boolean `isFeaturedOrFilters` argument is still accepted and is
 * normalized to `{ isFeatured }`. Previous page data is kept while a new page
 * loads ({@link keepPreviousData}), and 429 responses are not retried.
 *
 * @param productCount - Page size; defaults to 12 when omitted.
 * @param page - 1-based page number; defaults to 1 when omitted.
 * @param isFeaturedOrFilters - Either a boolean featured flag (legacy) or a {@link ProductFilters} object.
 * @param options - Optional configuration; `initialData` seeds the cache with an SSR-fetched page.
 * @returns The React Query result whose `data` holds `{ meta, products }` for the requested page.
 */
export function useProducts(
  productCount?: number,
  page?: number,
  isFeaturedOrFilters?: boolean | ProductFilters,
  options?: { initialData?: ProductsResponse },
) {
  const normalizedFilters: ProductFilters =
    typeof isFeaturedOrFilters === "boolean"
      ? { isFeatured: isFeaturedOrFilters }
      : (isFeaturedOrFilters ?? {});

  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", productCount ?? 12, page ?? 1, normalizedFilters],
    queryFn: ({ signal }) =>
      fetchProducts(productCount ?? 12, page ?? 1, normalizedFilters, signal),
    initialData: options?.initialData,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      // Do not retry if backend is rate-limiting.
      if (status === 429) return false;

      // Retry at most once for transient issues.
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
  });
}
