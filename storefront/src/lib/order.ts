import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";

/**
 * Order summary shape returned by the storefront orders endpoint.
 *
 * @remarks
 * Field list mirrors the current backend order payload; adjust it as needed
 * when that payload changes.
 */
interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: Array<{ product_id: string; quantity: number }>;
}

/**
 * Fetches all orders for the currently authenticated user.
 * Assumes the API Gateway routes this to the order-service and authentication is handled.
 *
 * @returns A promise resolving to the orders payload returned by the orders endpoint ({@link API_ROUTES}.ORDERS.ALL), typed as {@link Order}[].
 * @throws {@link Error} When the orders request fails (including 401/5xx responses).
 */
export const getOrders = async (): Promise<Order[]> => {
  // Calling /orders will typically return orders for the user attached to the JWT
  const response = await axiosInstance.get(API_ROUTES.ORDERS.ALL);
  return response.data;
};
