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
import {
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  Package,
  Wallet2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Customer, CustomerFilter } from "@/types/customers";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatCurrency } from "@/lib/utils";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  filter: CustomerFilter;
  onSort: (key: string) => void;
  onCustomerClick: (customerId: string) => void;
}

const getStatusStyle = (status: string) => {
  const styles = {
    active: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    inactive: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blocked: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return styles[status as keyof typeof styles] || styles.inactive;
};

const getStatusDot = (status: string) => {
  const styles = {
    active: "status-active",
    inactive: "status-pending",
    blocked: "status-error",
  };
  return styles[status as keyof typeof styles] || "status-inactive";
};

const CustomersTableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    ))}
  </div>
);

export const CustomersTable = ({
  customers,
  isLoading,
  filter,
  onSort,
  onCustomerClick,
}: CustomersTableProps) => {
  if (isLoading) {
    return <CustomersTableSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Customer</TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("totalOrders")}
          >
            Orders
            {filter.sortBy === "totalOrders" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("totalSpent")}
          >
            Total Spent
            {filter.sortBy === "totalSpent" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("lastOrder")}
          >
            Last Order
            {filter.sortBy === "lastOrder" && (
              <ArrowUpDown size={14} className="inline ml-1" />
            )}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer, index) => (
          <motion.tr
            key={customer._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="group cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => onCustomerClick(customer._id)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {customer.email}
                  </span>
                  {customer.phone && (
                    <span className="text-xs text-muted-foreground">
                      {customer.phone}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>{customer.stats.totalOrders}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Wallet2 className="h-4 w-4 text-primary" />
                <span>{formatCurrency(customer.stats.totalSpent)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(customer.stats.lastOrderDate)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`capitalize ${getStatusStyle(
                  customer.status
                )} flex items-center gap-1.5 w-fit`}
              >
                <span
                  className={`status-dot ${getStatusDot(customer.status)}`}
                ></span>
                {customer.status}
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
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Orders</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
};
