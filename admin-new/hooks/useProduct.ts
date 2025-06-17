// hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProduct = (productId: string) => {
  console.log({ productId });
  const [product, setProduct] = useState<
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
  //   const [meta, setMeta] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log({ res });
        setProduct(res?.data);
        // console.log("META", res.data.meta);
        // setMeta(res?.data?.meta);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading };
};
