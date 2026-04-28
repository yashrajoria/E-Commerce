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

type CategoryApiItem = Category & { _id?: string };

type CategoriesResponse =
  | CategoryApiItem[]
  | {
      categories?: CategoryApiItem[];
      data?: CategoryApiItem[];
      results?: CategoryApiItem[];
    };

const normalizeCategories = (payload: CategoriesResponse): Category[] => {
  const categories = Array.isArray(payload)
    ? payload
    : payload.categories ?? payload.data ?? payload.results ?? [];

  return categories.map((category) => ({
    ...category,
    id: category.id ?? category._id ?? "",
  }));
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get(API_ROUTES.CATEGORIES.ALL);
  return normalizeCategories(response.data as CategoriesResponse);
};

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // optional
    retry: 1, // optional
  });
}
