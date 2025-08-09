// src/hooks/useCategories.ts
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get(API_ROUTES.CATEGORIES.ALL);
  console.log(response);
  return response.data;
};

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // optional
    retry: 1, // optional
  });
}
