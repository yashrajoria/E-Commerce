import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Calendar, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Order, SortConfig } from "@/types/orders";
import { statusIcons, getStatusBadgeStyle } from "@/lib/orders";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  onStatusUpdate: (orderId: string) => void;
  onRowClick: (orderId: string) => void;
}

const OrdersTableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
);

export const OrdersTable = ({
  orders,
  isLoading,
  sortConfig,
  onSort,
  onStatusUpdate,
  onRowClick,
}: OrdersTableProps) => {
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

  if (isLoading) {
    return <OrdersTableSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[150px] cursor-pointer"
            onClick={() => onSort("orderNumber")}
          >
            Order #
            {sortConfig.key === "orderNumber" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("customer")}
          >
            Customer
            {sortConfig.key === "customer" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("date")}>
            Date
            {sortConfig.key === "date" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("total")}>
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
        {orders.map((order, index) => (
          <motion.tr
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="group cursor-pointer hover:bg-muted/50"
            onClick={() => onRowClick(order._id)}
          >
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 overflow-hidden">
                  <Avatar>
                    <AvatarImage src={order.customer.avatar} />
                    <AvatarFallback>
                      {order.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{order.customer.name}</span>
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
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(order._id);
                    }}
                  >
                    Update Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                  <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
};
