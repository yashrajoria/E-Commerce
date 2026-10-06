"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserOrders } from "@/hooks/useOrders";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import { formatGBP } from "@/lib/utils";
import type { AxiosError } from "axios";

type RawRecord = Record<string, unknown>;

type OrdersHookData = {
  orders?: {
    orders?: unknown[];
  };
};

interface NormalizedItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface NormalizedOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  date?: string | null;
  items: NormalizedItem[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "pending":
    case "pending_payment":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-green-500";
    case "shipped":
      return "bg-blue-500";
    case "pending":
    case "pending_payment":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

function safeString(v: unknown) {
  return v == null ? "" : String(v);
}

function safeNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function OrderHistory({ orders: ordersProp }: { orders?: unknown }) {
  const data = useUserOrders();

  let rawOrders: RawRecord[] = [];
  if (Array.isArray(ordersProp)) {
    rawOrders = ordersProp.filter(
      (item): item is RawRecord => Boolean(item && typeof item === "object"),
    );
  } else if (data) {
    const hookData = data as OrdersHookData;
    const nested = hookData?.orders?.orders;
    if (Array.isArray(nested)) {
      rawOrders = nested.filter(
        (item): item is RawRecord => Boolean(item && typeof item === "object"),
      );
    }
  }

  const ordersData: NormalizedOrder[] = rawOrders.map((o) => {
    const itemsRaw = (o["OrderItems"] ?? o["items"]) as unknown;
    const items: NormalizedItem[] = Array.isArray(itemsRaw)
      ? (itemsRaw as unknown[]).map((it) => {
          const item = it as RawRecord;
          const product_id = safeString(
            item["ProductID"] ?? item["product_id"],
          );
          const quantity = safeNumber(
            item["Quantity"] ?? item["quantity"] ?? 0,
          );
          const hasCents = Object.prototype.hasOwnProperty.call(item, "Price");
          const price = hasCents
            ? safeNumber(item["Price"]) / 100
            : safeNumber(item["price"] ?? 0);
          return { product_id, quantity, price };
        })
      : [];

    const total = Object.prototype.hasOwnProperty.call(o, "Amount")
      ? safeNumber(o["Amount"]) / 100
      : safeNumber(o["total"] ?? 0);

    const status = safeString(o["Status"] ?? o["status"]).toLowerCase();

    return {
      id: safeString(o["ID"] ?? o["id"] ?? o["OrderNumber"]),
      orderNumber: safeString(o["OrderNumber"] ?? o["id"] ?? o["ID"]),
      status,
      total,
      date:
        safeString(o["CompletedAt"] ?? o["CreatedAt"] ?? o["date"]) ||
        undefined,
      items,
    };
  });

  const productIds = Array.from(
    new Set(
      ordersData.flatMap((o) =>
        o.items.map((it) => it.product_id).filter(Boolean),
      ),
    ),
  );

  const productQueries = useQueries({
    queries: productIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: async (): Promise<RawRecord> => {
        const res = await axiosInstance.get(
          API_ROUTES.PRODUCTS.BY_ID(String(id)),
        );
        const d = res.data as RawRecord;
        return { ...d, id: safeString(d?.id ?? d?._id ?? id) };
      },
      enabled: Boolean(id),
      staleTime: 5 * 60 * 1000,
      retry: (failureCount: number, error: unknown) => {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 429) return false;
        return failureCount < 2;
      },
    })),
  });

  const productMap: Record<string, string> = {};
  productIds.forEach((id, i) => {
    const d = productQueries[i]?.data as RawRecord | undefined;
    if (d) productMap[id] = safeString(d["name"] ?? d["title"] ?? "");
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

      {ordersData.map((order, index) => (
        <motion.div
          key={order.id || index}
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
                <span className="ml-1 capitalize">
                  {order.status.replace("_", " ")}
                </span>
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatGBP(order.total)}</p>
              <p className="text-sm text-muted-foreground">
                {order.date ? new Date(order.date).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item, itemIndex) => (
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
                  <p className="font-medium">{formatGBP(item.price)}</p>
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
