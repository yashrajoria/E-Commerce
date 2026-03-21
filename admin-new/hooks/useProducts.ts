import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

 
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
  const [meta, setMeta] = useState<{
    totalPages?: number;
    total?: number;
  }>({ totalPages: 1, total: 0 });

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(query.page),
          perPage: String(query.perPage),
        });

        const search = typeof query.search === "string" ? query.search.trim() : "";
        if (search) {
          params.set("search", search);
        }

        const res = await axios.get(
          `/api/products?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
            signal: controller.signal,
          },
        );
        if (!isActive) return;
        setProducts(res?.data?.products);
        setMeta(res?.data?.meta || { totalPages: 1, total: 0 });
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
          return;
        }
        if (!isActive) return;
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    const debounceMs = query.search ? 300 : 0;
    const timer = window.setTimeout(() => {
      void fetchProducts();
    }, debounceMs);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query.page, query.perPage, query.search]);

  return { products, loading, meta };
};
