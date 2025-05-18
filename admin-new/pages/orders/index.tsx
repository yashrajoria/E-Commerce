"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ORDERS_PER_PAGE = 10;

// Status icons mapping
const statusIcons = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  processing: <RefreshCw className="h-4 w-4 text-blue-400" />,
  shipped: <Truck className="h-4 w-4 text-violet-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  cancelled: <XCircle className="h-4 w-4 text-rose-500" />,
};

// Status badge styling
const getStatusBadgeStyle = (status: string) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    shipped: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return styles[status as keyof typeof styles] || styles["pending"];
};

const Orders = () => {
  // Mock orders data - replace with actual API call
  const [orders, setOrders] = useState([
    {
      _id: "ord-001",
      orderNumber: "ORD-2023-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-15T10:30:00",
      total: 129.99,
      items: 3,
      status: "delivered",
      paymentMethod: "Credit Card",
      shippingAddress: "123 Main St, New York, NY 10001",
    },
    {
      _id: "ord-002",
      orderNumber: "ORD-2023-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-16T14:45:00",
      total: 79.5,
      items: 2,
      status: "shipped",
      paymentMethod: "PayPal",
      shippingAddress: "456 Oak Ave, San Francisco, CA 94102",
    },
    {
      _id: "ord-003",
      orderNumber: "ORD-2023-003",
      customer: {
        name: "Robert Johnson",
        email: "robert@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-17T09:15:00",
      total: 199.99,
      items: 4,
      status: "processing",
      paymentMethod: "Credit Card",
      shippingAddress: "789 Pine St, Chicago, IL 60601",
    },
    {
      _id: "ord-004",
      orderNumber: "ORD-2023-004",
      customer: {
        name: "Emily Davis",
        email: "emily@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-18T16:20:00",
      total: 49.99,
      items: 1,
      status: "pending",
      paymentMethod: "Credit Card",
      shippingAddress: "321 Maple Rd, Boston, MA 02108",
    },
    {
      _id: "ord-005",
      orderNumber: "ORD-2023-005",
      customer: {
        name: "Michael Wilson",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-19T11:10:00",
      total: 159.95,
      items: 3,
      status: "cancelled",
      paymentMethod: "PayPal",
      shippingAddress: "654 Cedar Ln, Seattle, WA 98101",
    },
    {
      _id: "ord-006",
      orderNumber: "ORD-2023-006",
      customer: {
        name: "Sarah Brown",
        email: "sarah@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-05-20T13:25:00",
      total: 89.99,
      items: 2,
      status: "delivered",
      paymentMethod: "Credit Card",
      shippingAddress: "987 Birch Dr, Austin, TX 78701",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
      setIsUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Filter and sort orders
  let filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  filteredOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    if (sortConfig.key === "total") {
      return sortConfig.direction === "asc"
        ? a.total - b.total
        : b.total - a.total;
    }

    if (sortConfig.key === "customer") {
      return sortConfig.direction === "asc"
        ? a.customer.name.localeCompare(b.customer.name)
        : b.customer.name.localeCompare(a.customer.name);
    }

    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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
          <div className="flex flex-col gap-8 max-w-7xl mx-auto ">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by number, customer name or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter size={18} />
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <Card className="glass-effect overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="w-[150px] cursor-pointer"
                        onClick={() => handleSort("orderNumber")}
                      >
                        Order #
                        {sortConfig.key === "orderNumber" && (
                          <ArrowUpDown size={14} className="inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("customer")}
                      >
                        Customer
                        {sortConfig.key === "customer" && (
                          <ArrowUpDown size={14} className="inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        Date
                        {sortConfig.key === "date" && (
                          <ArrowUpDown size={14} className="inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("total")}
                      >
                        Total
                        {sortConfig.key === "total" && (
                          <ArrowUpDown size={14} className="inline ml-1" />
                        )}
                      </TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="group transition-all duration-200 hover:bg-muted/30"
                      >
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 overflow-hidden">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {order.customer.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {order.customer.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(order.date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 px-2 py-1 capitalize transition-all duration-300 ${getStatusBadgeStyle(
                              order.status
                            )}`}
                          >
                            {statusIcons[order.status]}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsUpdateDialogOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                Contact Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                Print Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
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
                      // Logic for showing appropriate page numbers
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
                            onClick={() => handlePageChange(pageNum)}
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
                        handlePageChange(Math.min(totalPages, currentPage + 1))
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
          </div>
        </main>

        {/* Status Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md ">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status for order {selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select
                defaultValue={selectedOrder?.status}
                onValueChange={(value) =>
                  handleStatusUpdate(selectedOrder?._id, value)
                }
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
