// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Category } from "@/types/shared";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const pages: unknown[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const res = await axios.get("/api/admin/categories", {
          params: { page, perPage: 100 },
          withCredentials: true,
        });
        const payload = res.data;
        const pageItems = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.categories)
            ? payload.categories
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
        pages.push(...pageItems);
        totalPages = Number(payload?.meta?.totalPages ?? payload?.meta?.total_pages ?? 1) || 1;
        page += 1;
      } while (page <= totalPages);

      type ApiCategory = {
        _id?: string;
        id?: string;
        name?: string;
        slug?: string;
        image?: string;
        is_active?: boolean;
      };

      const data = pages as ApiCategory[];

      setCategories(
        data.map((cat) => ({
          name: cat.name,
          _id: cat._id,
          id: cat.id ?? cat._id,
        })),
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  return { categories, loading, refresh: fetchCategories };
};
