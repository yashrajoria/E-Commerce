import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import type { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface ProductsResponse {
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  products: Product[];
}

const fetchProducts = async (
  productCount: number = 12,
  page: number = 1,
  isFeatured: boolean = false,
): Promise<ProductsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(productCount),
  });
  // include is_featured param so the API can filter when requested
  params.append("is_featured", String(isFeatured));

  const response = await axiosInstance.get(
    `${API_ROUTES.PRODUCTS.ALL}?${params.toString()}`,
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

const fetchProductById = async (id: string | number): Promise<Product> => {
  const url = API_ROUTES.PRODUCTS.BY_ID(String(id));
  const response = await axiosInstance.get(url);
  const data = response.data as Product & { _id?: string };
  return {
    ...data,
    id: data.id ?? data._id ?? String(id),
  };
};

export function useProductById(id?: string | number) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => {
      if (id === undefined || id === null || String(id).length === 0) {
        return Promise.reject(new Error("Product id is required"));
      }
      return fetchProductById(id);
    },
    enabled: id !== undefined && id !== null && String(id).length > 0, // ✅
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useProducts(
  productCount?: number,
  page?: number,
  isFeatured?: boolean,
) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", productCount ?? 12, page ?? 1, isFeatured],
    queryFn: () => fetchProducts(productCount ?? 12, page ?? 1, isFeatured),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
