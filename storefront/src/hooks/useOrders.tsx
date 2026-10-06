import { useState, useEffect } from "react";
import { getOrders } from "@/lib/order"; // Import the API function
import { useUser } from "@/context/UserContext"; // To check if the user is loaded/logged in

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: Array<{ product_id: string; quantity: number }>;
}

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserOrders = (): UseOrdersResult => {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || userLoading) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        setError("Could not load order history.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (shouldFetch && !userLoading && user) {
      void fetchOrders();
      setShouldFetch(false); // Only fetch once initially or when refetch is called
    }
  }, [user, userLoading, shouldFetch]);

  const refetch = () => setShouldFetch(true);

  // Return the state and refetch function
  return { orders, loading, error, refetch };
};
