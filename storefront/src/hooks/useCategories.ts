// src/hooks/useCategories.ts
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/**
 * Normalized storefront category consumed by catalog filters and the
 * categories page.
 */
export interface Category {
  /** Unique category identifier. */
  id: string;
  /** Display name of the category. */
  name: string;
  /** Lucide icon name, defaulting to `"Package"` when the API omits it. */
  icon: string;
  /** Image URL, defaulting to the local placeholder when the API omits it. */
  image: string;
  /** Product count for the category (total/products/direct, whichever the API provides). */
  productCount: number;
}

type RawCategory = {
  id?: string;
  _id?: string;
  name?: string;
  icon?: string;
  image?: string;
  productCount?: number;
  directProductCount?: number;
  totalProductCount?: number;
  children?: RawCategory[];
};

const normalizeCategory = (item: RawCategory): Category | null => {
  const id = String(item.id ?? item._id ?? "");
  const name = String(item.name ?? "").trim();
  if (!id || !name) return null;

  return {
    id,
    name,
    icon: item.icon ?? "Package",
    image: item.image ?? "/icons8-image-100.png",
    productCount:
      typeof item.totalProductCount === "number" &&
      Number.isFinite(item.totalProductCount)
        ? item.totalProductCount
        : typeof item.directProductCount === "number" &&
            Number.isFinite(item.directProductCount)
          ? item.directProductCount
          : typeof item.productCount === "number" &&
              Number.isFinite(item.productCount)
            ? item.productCount
            : 0,
  };
};

const flattenCategoryTree = (items: RawCategory[]): Category[] => {
  const out: Category[] = [];
  const seen = new Set<string>();

  const walk = (nodes: RawCategory[]) => {
    nodes.forEach((node) => {
      const normalized = normalizeCategory(node);
      if (normalized && !seen.has(normalized.id)) {
        seen.add(normalized.id);
        out.push(normalized);
      }

      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children);
      }
    });
  };

  walk(items);
  return out;
};

const fetchCategories = async (signal?: AbortSignal): Promise<Category[]> => {
  const categories: RawCategory[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await axiosInstance.get(API_ROUTES.CATEGORIES.ALL, {
      params: { page, perPage: 100 },
      signal,
    });
    const payload = response.data;
    const pageItems = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.categories)
        ? payload.categories
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
    categories.push(...(pageItems as RawCategory[]));
    totalPages =
      Number(payload?.meta?.totalPages ?? payload?.meta?.total_pages ?? 1) || 1;
    page += 1;
  } while (page <= totalPages);

  return flattenCategoryTree(categories);
};

/**
 * React Query hook that loads the full category tree from the catalog API.
 *
 * @remarks
 * Pages through the catalog categories endpoint ({@link API_ROUTES}.CATEGORIES.ALL, 100 per page), normalizes each
 * entry, and flattens the tree into a deduplicated {@link Category} list.
 * Results stay fresh for 15 minutes; rate-limited (429) responses are not retried.
 *
 * @returns The React Query result — `data` holds the flattened categories and `isLoading`/`error` surface request state.
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      if (status === 429) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
  });
}
