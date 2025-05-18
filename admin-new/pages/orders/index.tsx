"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { filterOrders } from "@/lib/orders";
import { Order, OrderStatus } from "@/types/orders";
import { toast } from "sonner";

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, fetch from your API
        // const response = await fetch("/api/orders");
        // const data = await response.json();

        setOrders([
          // Your mock data here
          {
            _id: "ord-001",
            orderNumber: "ORD-2023-001",
            customer: {
              name: "Yash Rajoria",
              email: "john@example.com",
              avatar: "/placeholder.svg",
            },
            date: "2023-05-15T10:30:00",
            total: 129.99,
            items: 3,
            status: "delivered" as OrderStatus,
            paymentMethod: "Credit Card",
            shippingAddress: "123 Main St, New York, NY 10001",
          },
          // ... more orders
        ]);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string) => {
    const order = orders.find((o) => o._id === orderId);
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

  // Apply filters and sorting
  const filteredOrders = filterOrders(orders, filter, sortConfig);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

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
                {filteredOrders.length} Orders
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
                  orders={paginatedOrders}
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
                Change the status for order {selectedOrder?.orderNumber}
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

                    // In a real app, make the API call here
                    // await fetch(`/api/orders/${selectedOrder._id}`, {
                    //   method: "PATCH",
                    //   body: JSON.stringify({ status: value }),
                    // });

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
