import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

/** Shape of a product record as returned by `GET /api/admin/products/:id`. */
type ProductRecord = {
  /** Mongo document id of the product. */
  _id: string;
  /** Product name. */
  name: string;
  /** Category the product belongs to. */
  category: string;
  /** Unit price in major currency units. */
  price: number;
  /** Stock on hand. */
  quantity: number;
  /** Publication status, e.g. `"active"`. */
  status: string;
  /** Image URLs for the product. */
  images: string[];
  /** Marketing description. */
  description: string;
};

/**
 * Fetches a single product for the product detail and edit pages.
 *
 * @remarks
 * Fires whenever `productId` changes and aborts the in-flight request on
 * unmount. Despite the name, `product` is an array, because
 * `GET /api/admin/products/:id` returns the product as a single-element list.
 *
 * @param productId - Id of the product to load; an empty value skips the request.
 * @returns `{ product, loading }` where `product` is the loaded product records
 * (call sites unwrap the first element) and `loading` tracks the request lifecycle.
 */
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
