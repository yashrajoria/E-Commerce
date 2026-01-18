"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserOrders } from "@/hooks/useOrders";
import Image from "next/image";

const getStatusIcon = (Status: string) => {
  switch (Status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "processing":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (Status: string) => {
  switch (Status) {
    case "paid":
      return "bg-green-500";
    case "shipped":
      return "bg-blue-500";
    case "processing":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export function OrderHistory() {
  const data = useUserOrders();
  const ordersData = data?.orders?.orders ?? [];

  // return;
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
          key={order.ID}
          className="bg-card border rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="font-semibold">{order.OrderNumber}</h3>
              <Badge className={getStatusColor(order.Status)}>
                {getStatusIcon(order.Status)}
                <span className="ml-1 capitalize">{order.Status}</span>
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-semibold">${order.Amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {/* {new Date(order.date).toLocaleDateString()} */}
                {new Date(order.CompletedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.OrderItems.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.Quantity} × ${item.Price}
                  </p>
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
