/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserOrders } from "@/hooks/useOrders";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";

const getStatusIcon = (Status: string) => {
  switch (Status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (Status: string) => {
  switch (Status) {
    case "delivered":
      return "bg-green-500";
    case "paid":
      return "bg-green-500";
    case "shipped":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export function OrderHistory({ orders: ordersProp }: { orders?: any }) {
  const data = useUserOrders();
  // Source orders: prefer prop, fallback to hook data
  const source = ordersProp ?? data;
  const sourceOrders = source?.orders ?? [];

  const ordersData = sourceOrders.map((o: any) => {
    // Normalize different API shapes into expected shape
    const items = (o.OrderItems || o.items || []).map((it: any) => ({
      product_id: it.ProductID || it.product_id,
      quantity: it.Quantity ?? it.quantity ?? 0,
      price: it.Price != null ? it.Price / 100 : (it.price ?? 0),
    }));

    const total = o.Amount != null ? o.Amount / 100 : (o.total ?? 0);

    return {
      id: o.ID ?? o.id ?? o.OrderNumber,
      orderNumber: o.OrderNumber ?? o.id ?? o.ID,
      status: (o.Status || o.status || "").toLowerCase(),
      total,
      date: o.CompletedAt ?? o.CreatedAt ?? o.date,
      items,
    };
  });

  // Collect unique product ids from orders and fetch their details
  const productIds: string[] = Array.from(
    new Set(
      ordersData.flatMap((o: any) =>
        (o.items || []).map((it: any) => String(it.product_id)).filter(Boolean),
      ),
    ),
  );

  const productQueries = useQueries({
    queries: productIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: async () => {
        const res = await axiosInstance.get(
          API_ROUTES.PRODUCTS.BY_ID(String(id)),
        );
        const d = res.data as any;
        return { ...d, id: d.id ?? d._id ?? String(id) };
      },
      enabled: Boolean(id),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const productMap: Record<string, string> = {};
  productIds.forEach((id, i) => {
    const d = productQueries[i]?.data as any;
    if (d) productMap[id] = d.name ?? d.title ?? "";
  });
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Button variant="outline">Download All</Button>
      </div>

      {ordersData.map((order: any, index: number) => (
        <motion.div
          key={order.id ?? index}
          className="bg-card border rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="font-semibold">{order.orderNumber || order.id}</h3>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-semibold">${(order.total || 0).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {order.date ? new Date(order.date).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                  {String(item.product_id).slice(0, 6)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {productMap[item.product_id] ||
                      `Product ID: ${item.product_id}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {order.status === "delivered" && (
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              )}
            </div>
            {order.status === "shipped" && (
              <Button variant="outline" size="sm">
                Track Package
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
