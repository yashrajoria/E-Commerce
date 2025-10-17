import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async (
  productCount: number = 12,
  page: number = 1,
  isFeatured: boolean = false
): Promise<[]> => {
  const response = await axiosInstance.get(
    API_ROUTES.PRODUCTS.ALL +
      `?page=${page}&perPage=${productCount}&is_featured=${isFeatured}`
  );

  return response.data;
};

export function useProducts(
  productCount?: number,
  page?: number,
  isFeatured?: boolean
) {
  return useQuery<[]>({
    queryKey: ["products", productCount ?? 12, page ?? 1, isFeatured],
    queryFn: () => fetchProducts(productCount ?? 12, page ?? 1, isFeatured),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
