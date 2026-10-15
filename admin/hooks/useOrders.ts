import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type OrdersResult = {
  data: unknown;
};

const ordersInFlight = new Map<string, Promise<OrdersResult>>();

const fetchOrdersOnce = async (
  key: string,
  url: string,
): Promise<OrdersResult> => {
  const existing = ordersInFlight.get(key);
  if (existing) return existing;

  const promise = axios
    .get(url, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => ({ data: res.data }))
    .finally(() => {
      ordersInFlight.delete(key);
    });

  ordersInFlight.set(key, promise);
  return promise;
};

/** Query parameters accepted by {@link useOrders}. */
interface OrdersQuery {
  /** Load a single order by id instead of a page of orders. */
  orderId?: string;
  /** 1-based page number for list mode. */
  page?: number;
  /** Page size for list mode. */
  perPage?: number;
}

/** Paginated orders payload returned by `GET /api/admin/orders`. */
interface OrdersApiResponse {
  /** Orders on the requested page. */
  orders?: unknown[];
  /** Pagination metadata. */
  meta?: {
    total_pages: number;
    total: number;
    // Add other properties if needed
  };
}

/**
 * Loads a page of orders, or one order when `orderId` is given.
 *
 * @remarks
 * Concurrent calls for the same page/order share a single in-flight request
 * (`ordersInFlight`), so tab switches do not duplicate network traffic. A toast
 * is shown when loading fails.
 *
 * @param query - `orderId` for single-order mode, or `page`/`perPage` for list
 * mode; `page` defaults to 1 and `perPage` to 10.
 * @returns `{ orders, loading, meta }` where `meta` reports `total` and
 * `total_pages` and falls back to `{ total_pages: 1, total: 0 }`.
 */
export const useOrders = (query: OrdersQuery) => {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  interface Meta {
    total_pages: number;
    total: number; // Added total property
    // Add other properties if needed
  }
  const [meta, setMeta] = useState<Meta>({ total_pages: 1, total: 0 });

  const { orderId, page = 1, perPage = 10 } = query;

  useEffect(() => {
    let isActive = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (orderId) {
          const key = `order:${orderId}`;
          const res = await fetchOrdersOnce(
            key,
            `/api/admin/orders/${orderId}`,
          );
          if (!isActive) return;
          setOrders((res?.data as unknown[]) || []);
        } else {
          const url = `/api/admin/orders?page=${page}&limit=${perPage}`;
          const key = `orders:${page}:${perPage}`;
          const res = await fetchOrdersOnce(key, url);
          const payload: OrdersApiResponse | null =
            typeof res.data === "object" && res.data !== null
              ? (res.data as OrdersApiResponse)
              : null;
          if (!isActive) return;
          setOrders(payload?.orders || []);
          setMeta(payload?.meta ?? { total_pages: 1, total: 0 });
        }
      } catch (error) {
        if (!isActive) return;
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    void fetchOrders();

    return () => {
      isActive = false;
    };
  }, [orderId, page, perPage]);

  return { orders, loading, meta };
};
