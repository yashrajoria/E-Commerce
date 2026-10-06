import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type ProductRecord = {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  images: string[];
  description: string;
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setProduct([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/products/${productId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          signal: controller.signal,
        });
        if (!ignore) {
          setProduct(res?.data);
        }
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) return;
        console.error("Error fetching products:", error);
        if (!ignore) {
          toast.error("Failed to load products");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [productId]);

  return { product, loading };
};
