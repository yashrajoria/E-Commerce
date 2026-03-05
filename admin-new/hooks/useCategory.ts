// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Category } from "@/types/shared";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories", {
          withCredentials: true,
        });

        type ApiCategory = {
          _id?: string;
          id?: string;
          name?: string;
          slug?: string;
          image?: string;
          is_active?: boolean;
        };

        const data = Array.isArray(res.data) ? (res.data as ApiCategory[]) : [];

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

    fetchCategories();
  }, []);

  return { categories, loading };
};
