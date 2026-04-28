// src/hooks/useCategories.ts
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
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
      typeof item.totalProductCount === "number" && Number.isFinite(item.totalProductCount)
        ? item.totalProductCount
        : typeof item.directProductCount === "number" && Number.isFinite(item.directProductCount)
          ? item.directProductCount
          : typeof item.productCount === "number" && Number.isFinite(item.productCount)
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
  const response = await axiosInstance.get(API_ROUTES.CATEGORIES.ALL, {
    signal,
  });

  // Backend payload shape can vary (array, wrapped object, or null).
  // Normalize to a safe array so category consumers can always map/filter.
  if (Array.isArray(response.data)) {
    return flattenCategoryTree(response.data as RawCategory[]);
  }

  if (Array.isArray(response.data?.data)) {
    return flattenCategoryTree(response.data.data as RawCategory[]);
  }

  return [];
};

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
