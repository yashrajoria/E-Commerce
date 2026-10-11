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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
    case "paid":
      return (
        <Badge variant="secondary" className="gap-1 text-[11px] font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="h-3 w-3" />
          <span className="capitalize">{status.replace("_", " ")}</span>
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="secondary" className="gap-1 text-[11px] font-normal text-foreground bg-muted border border-border">
          <Truck className="h-3 w-3" />
          <span className="capitalize">{status.replace("_", " ")}</span>
        </Badge>
      );
    case "pending":
    case "pending_payment":
      return (
        <Badge variant="secondary" className="gap-1 text-[11px] font-normal text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Clock className="h-3 w-3" />
          <span className="capitalize">{status.replace("_", " ")}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1 text-[11px] font-normal text-muted-foreground bg-muted border border-border">
          <Package className="h-3 w-3" />
          <span className="capitalize">{status.replace("_", " ")}</span>
        </Badge>
      );
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Order History ({ordersData.length})
        </h2>
      </div>

      {ordersData.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <Package className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No orders yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            When you place an order, it will appear here.
          </p>
        </div>
      ) : (
        ordersData.map((order, index) => (
          <motion.div
            key={order.id || index}
            className="bg-surface border border-border rounded-lg p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-border gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-sm text-foreground">
                  Order #{order.orderNumber || order.id}
                </h3>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  {order.date ? new Date(order.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </span>
                <span className="font-semibold text-foreground">
                  {formatGBP(order.total)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-foreground truncate">
                      {productMap[item.product_id] ||
                        `Item #${item.product_id}`}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-xs text-foreground">
                      {formatGBP(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View Details
              </Button>
              {order.status === "shipped" && (
                <Button size="sm" className="h-8 text-xs">
                  Track Package
                </Button>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
