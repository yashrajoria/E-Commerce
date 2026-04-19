// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Category } from "@/types/shared";

type CategoriesResult = {
  data: unknown;
};

let categoriesInFlight: Promise<CategoriesResult> | null = null;

const fetchCategoriesOnce = async (): Promise<CategoriesResult> => {
  if (!categoriesInFlight) {
    categoriesInFlight = axios
      .get("/bff/categories", {
        withCredentials: true,
      })
      .then((res) => ({ data: res.data }))
      .finally(() => {
        categoriesInFlight = null;
      });
  }

  return categoriesInFlight;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchCategories = async () => {
      try {
        const res = await fetchCategoriesOnce();

        type ApiCategory = {
          _id?: string;
          id?: string;
          name?: string;
          slug?: string;
          image?: string;
          is_active?: boolean;
        };

        const data = Array.isArray(res.data) ? (res.data as ApiCategory[]) : [];

        if (!isActive) return;

        setCategories(
          data.map((cat) => ({
            name: cat.name,
            _id: cat._id,
            id: cat.id ?? cat._id,
          })),
        );
      } catch (error) {
        if (!isActive) return;
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    void fetchCategories();

    return () => {
      isActive = false;
    };
  }, []);

  return { categories, loading };
};
