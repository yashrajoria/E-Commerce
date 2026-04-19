"use client";

import { ErrorState, TableSkeleton } from "@/components/admin/shared/DataStates";
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
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
import { EmptyState } from "@/components/admin/shared/DataStates";
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
import StatsCard from "@/components/ui/stats-card";
import { useAdminOrders } from "@/lib/hooks/useAdminData";
import type { Order, OrderStatus } from "@/types/shared";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const router = useRouter();
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

  const { orders, meta, error: ordersError, isLoading, mutate } = useAdminOrders(currentPage, ORDERS_PER_PAGE, filter.status !== "all" ? filter.status : undefined);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleStatusUpdate = (orderId: string) => {
    const order = orders.find((o: Order) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsUpdateDialogOpen(true);
    }
  };

  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1);
  };

  const totalPages = meta?.total_pages || 1;

  return (
    <PageLayout
      title="Orders"
      breadcrumbs={[{ label: "Orders" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
          >
            <Download size={13} /> Export
          </Button>
          <Button
            size="sm"
            className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
          >
            <Calendar size={13} /> This Month
          </Button>
        </div>
      }
    >
      {/* ── KPI Stats ── */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Orders"
          value={meta?.total || orders.length}
          icon={ShoppingCart}
          trend={{ value: 12.5, label: "vs last month" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Pending"
          value={orders.filter((o: Order) => o.status === "pending").length}
          icon={Clock}
          gradient="gradient-amber"
          glowClass="glow-gold"
          subtitle="Awaiting processing"
        />
        <StatsCard
          title="Shipped"
          value={orders.filter((o: Order) => o.status === "shipped").length}
          icon={Truck}
          gradient="gradient-blue"
          subtitle="In transit"
        />
        <StatsCard
          title="Delivered"
          value={orders.filter((o: Order) => o.status === "delivered").length}
          icon={CheckCircle}
          trend={{ value: 8.3, label: "vs last month" }}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
      </motion.section>

      {/* ── Filters ── */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <OrdersFilters filter={filter} onFilterChange={handleFilterChange} />
        </div>
      </motion.section>

      {/* ── Orders Table ── */}
      <motion.section variants={pageItem}>
        {isLoading ? (
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : ordersError ? (
          <div className="glass-effect rounded-xl">
            <ErrorState message={ordersError.message} onRetry={() => mutate()} />
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-effect rounded-xl">
            <EmptyState
              title="No orders found"
              description="Orders will appear here once customers start placing them."
            />
          </div>
        ) : (
          <Card className="glass-effect overflow-hidden border-white/[0.06]">
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
        )}
      </motion.section>

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <motion.section variants={pageItem} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1)
                    pageNum = currentPage - 2 + i;
                  else if (currentPage >= totalPages - 1)
                    pageNum = totalPages - 4 + i;
                }
                return pageNum <= totalPages ? (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`rounded-xl ${currentPage === pageNum ? "gradient-purple text-white border-0" : ""}`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ) : null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={`rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.section>
      )}

      {/* ── Status Update Dialog ── */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md glass-effect-strong border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order{" "}
              {selectedOrder?.order_number || selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              defaultValue={selectedOrder?.status}
              onValueChange={(value: OrderStatus) => {
                toast.success(`Order status updated to ${value}`);
                setIsUpdateDialogOpen(false);
              }}
            >
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] rounded-xl">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/[0.08]">
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
              className="rounded-xl border-white/[0.08]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Orders;
