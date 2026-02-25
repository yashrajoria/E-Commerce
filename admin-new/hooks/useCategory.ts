// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories", {
          withCredentials: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCategories(
          res.data.map((cat: any) => ({
            name: cat.name,
            _id: cat._id,
            id: cat._id,
            slug: cat.slug,
            image: cat.image,
            is_active: cat.is_active,
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
