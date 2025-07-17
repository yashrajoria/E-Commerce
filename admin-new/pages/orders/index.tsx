"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/types/orders";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const router = useRouter();
  const limit = ORDERS_PER_PAGE;
  // const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState({
    search: "",
    status: "all" as OrderStatus | "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc" as "asc" | "desc",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const query = {
    page: currentPage,
    perPage: limit,
    // search: searchQuery,
  };

  const { orders, meta, loading: isLoading } = useOrders(query);

  // return;
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsUpdateDialogOpen(true);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1);
  };

  const totalPages = meta?.total_pages;
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Orders</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-400 hover:bg-blue-500 transition-all">
                {orders.length} Orders
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Search and Filter Controls */}
            <OrdersFilters
              filter={filter}
              onFilterChange={handleFilterChange}
            />

            {/* Orders Table */}
            <Card className="glass-effect overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <OrdersTable
                  orders={orders}
                  isLoading={isLoading}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onStatusUpdate={handleStatusUpdate}
                  onRowClick={(id) => router.push(`/orders/${id}`)}
                />
              </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3 && currentPage < totalPages - 1) {
                            pageNum = currentPage - 2 + i;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 4 + i;
                          }
                        }

                        return pageNum <= totalPages ? (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className="transition-all duration-200 hover:scale-105"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ) : null;
                      }
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>

        {/* Status Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status for order {selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select
                defaultValue={selectedOrder?.status}
                onValueChange={(value: OrderStatus) => {
                  if (!selectedOrder) return;

                  try {
                    // Optimistic update
                    setOrders((prev) =>
                      prev.map((order) =>
                        order._id === selectedOrder._id
                          ? { ...order, status: value }
                          : order
                      )
                    );

                    toast.success(`Order status updated to ${value}`);
                    setIsUpdateDialogOpen(false);
                  } catch (error) {
                    console.error("Error updating order status:", error);
                    toast.error("Failed to update order status");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;
