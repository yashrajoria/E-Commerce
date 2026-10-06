import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer, CustomerFilter, CustomerSortKey } from "@/types/customers";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Copy,
  Eye,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface CustomersTableProps {
  customers: Customer[];
  filter: CustomerFilter;
  onSort: (key: CustomerSortKey) => void;
  onCustomerClick: (customer: Customer) => void;
}

export const ROLE_STYLE: Record<Customer["role"], string> = {
  admin: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  user: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

export const ROLE_LABEL: Record<Customer["role"], string> = {
  admin: "Staff",
  user: "Customer",
};

const SortIndicator = ({
  active,
  order,
}: {
  active: boolean;
  order: CustomerFilter["sortOrder"];
}) => {
  if (active) {
    return order === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }
  return <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />;
};

const SortableHead = ({
  label,
  sortKey,
  filter,
  onSort,
  className,
}: {
  label: string;
  sortKey: CustomerSortKey;
  filter: CustomerFilter;
  onSort: (key: CustomerSortKey) => void;
  className?: string;
}) => (
  <TableHead
    className={`text-xs uppercase tracking-wider text-muted-foreground ${className ?? ""}`}
  >
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
    >
      {label}
      <SortIndicator
        active={filter.sortBy === sortKey}
        order={filter.sortOrder}
      />
    </button>
  </TableHead>
);

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export const CustomersTable = ({
  customers,
  filter,
  onSort,
  onCustomerClick,
}: CustomersTableProps) => {
  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.04] group">
          <SortableHead
            label="Name"
            sortKey="name"
            filter={filter}
            onSort={onSort}
            className="w-[240px]"
          />
          <SortableHead
            label="Email"
            sortKey="email"
            filter={filter}
            onSort={onSort}
          />
          <SortableHead
            label="Role"
            sortKey="role"
            filter={filter}
            onSort={onSort}
          />
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
            Phone
          </TableHead>
          <SortableHead
            label="Joined"
            sortKey="createdAt"
            filter={filter}
            onSort={onSort}
          />
          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer, index) => (
          <motion.tr
            key={customer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index, 10) * 0.03 }}
            onClick={() => onCustomerClick(customer)}
            className="group cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="gradient-purple text-white text-xs font-semibold">
                    {initialsOf(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">{customer.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {customer.email}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`gap-1.5 w-fit capitalize ${ROLE_STYLE[customer.role]}`}
              >
                <span className="status-dot" />
                {ROLE_LABEL[customer.role]}
              </Badge>
            </TableCell>
            <TableCell className="tabular-nums text-muted-foreground">
              {customer.phone || (
                <span className="text-muted-foreground/40">—</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">{formatDate(customer.createdAt)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeDate(customer.createdAt)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-effect border-white/[0.08]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuLabel>{customer.name}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onCustomerClick(customer)}>
                    <Eye className="h-4 w-4" /> View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copy(customer.email, "Email")}>
                    <Mail className="h-4 w-4" /> Copy email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => copy(customer.id, "User ID")}>
                    <Copy className="h-4 w-4" /> Copy user ID
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
};
