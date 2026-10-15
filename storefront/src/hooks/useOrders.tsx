import { useState, useEffect } from "react";
import { getOrders } from "@/lib/order"; // Import the API function
import { useUser } from "@/context/UserContext"; // To check if the user is loaded/logged in

/**
 * Order summary shape returned by the orders endpoint.
 */
interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: Array<{ product_id: string; quantity: number }>;
}

/**
 * State returned by {@link useUserOrders}.
 */
interface UseOrdersResult {
  /** Orders loaded for the signed-in user. */
  orders: Order[];
  /** Whether an order request is currently in flight. */
  loading: boolean;
  /** Human-readable error message when loading failed, otherwise `null`. */
  error: string | null;
  /** Re-triggers the next order fetch. */
  refetch: () => void;
}

/**
 * Loads the signed-in user's order history once the user context has resolved.
 *
 * @returns {@link UseOrdersResult} with the orders, a loading flag, an error message, and a `refetch` trigger.
 */
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
