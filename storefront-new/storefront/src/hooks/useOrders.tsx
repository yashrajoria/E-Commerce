import { useState, useEffect } from "react";
import { getOrders } from "@/lib/order"; // Import the API function
import { useUser } from "@/context/UserContext"; // To check if the user is loaded/logged in

interface Order {
  ID: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: any[];
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

  const fetchOrders = async () => {
    if (!user || userLoading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
      setError("Could not load order history.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && !userLoading && user) {
      fetchOrders();
      setShouldFetch(false); // Only fetch once initially or when refetch is called
    }
  }, [user, userLoading, shouldFetch]);

  const refetch = () => setShouldFetch(true);

  // Return the state and refetch function
  return { orders, loading, error, refetch };
};
