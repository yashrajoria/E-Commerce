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

export interface ProductFilters {
  search?: string;
  category?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  isFeatured?: boolean;
  brands?: string[];
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
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

  // include is_featured param so the API can filter when requested
  params.append("is_featured", String(Boolean(filters?.isFeatured)));

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

  const response = await axiosInstance.get(
    `${API_ROUTES.PRODUCTS.ALL}?${params.toString()}`,
    { signal },
  );

  const data = response.data as {
    meta: ProductsResponse["meta"];
    products: Array<Product & { _id?: string }>;
  };
  return {
    meta: data.meta,
    products: data.products.map((product) => ({
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

export function useProductById(id?: string | number) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: ({ signal }) => {
      if (id === undefined || id === null || String(id).length === 0) {
        return Promise.reject(new Error("Product id is required"));
      }
      return fetchProductById(id, signal);
    },
    enabled: id !== undefined && id !== null && String(id).length > 0, // ✅
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useProducts(
  productCount?: number,
  page?: number,
  isFeaturedOrFilters?: boolean | ProductFilters,
) {
  const normalizedFilters: ProductFilters =
    typeof isFeaturedOrFilters === "boolean"
      ? { isFeatured: isFeaturedOrFilters }
      : (isFeaturedOrFilters ?? {});

  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", productCount ?? 12, page ?? 1, normalizedFilters],
    queryFn: ({ signal }) =>
      fetchProducts(productCount ?? 12, page ?? 1, normalizedFilters, signal),
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
