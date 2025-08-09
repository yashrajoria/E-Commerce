import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// export interface Category {
//   id: string;
//   name: string;
//   icon: string;
//   image: string;
//   productCount: number;
// }

const fetchProducts = async (): Promise<[]> => {
  const response = await axiosInstance.get(API_ROUTES.PRODUCTS.ALL);
  console.log(response);
  return response.data;
};

export function useProducts() {
  return useQuery<[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // optional
    retry: 1, // optional
  });
}
