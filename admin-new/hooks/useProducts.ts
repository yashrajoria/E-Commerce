// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProducts = (query: any) => {
  const [products, setProducts] = useState<
    {
      _id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
      status: string;
      images: string[];
      description: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/products?page=${query.page}&perPage=${query.perPage}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setProducts(res?.data?.products);
        setMeta(res?.data?.meta);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query.page, query.perPage, query.search]);

  return { products, loading, meta };
};
