import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";

// Define the expected structure of an order (adjust as needed)
interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: any[];
}

/**
 * Fetches all orders for the currently authenticated user.
 * Assumes the API Gateway routes this to the order-service and authentication is handled.
 */
export const getOrders = async (): Promise<Order[]> => {
  // Calling /orders will typically return orders for the user attached to the JWT
  const response = await axiosInstance.get(API_ROUTES.ORDERS.ALL);
  return response.data;
};
