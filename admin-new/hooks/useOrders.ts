// hooks/useOrders.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOrders = (query: any) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});

  const { orderId, page = 1, perPage = 10 } = query;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (orderId) {
          const res = await axios.get(`/api/orders/${orderId}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          setOrders(res?.data);
        } else {
          const res = await axios.get(
            `/api/orders?page=${page}&limit=${perPage}`,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          setOrders(res?.data?.orders || []);
          setMeta(res?.data?.meta || {});
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId, page, perPage]);

  return { orders, loading, meta };
};
