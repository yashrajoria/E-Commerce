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
import type {
  Customer,
  CustomerFilter,
  CustomerSortKey,
} from "@/types/customers";
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

/** Props accepted by {@link CustomersTable}. */
interface CustomersTableProps {
  /** Customers for the current page slice. */
  customers: Customer[];
  /** Current search, role and sort state. */
  filter: CustomerFilter;
  /** Called with the column key when a sortable header is clicked. */
  onSort: (key: CustomerSortKey) => void;
  /** Called when a row is clicked, to open the detail dialog. */
  onCustomerClick: (customer: Customer) => void;
}

/** Badge colour classes for each customer role. */
export const ROLE_STYLE: Record<Customer["role"], string> = {
  admin: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  user: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

/** Human-readable role labels shown in badges and CSV exports. */
export const ROLE_LABEL: Record<Customer["role"], string> = {
  admin: "Staff",
  user: "Customer",
};

/** Props accepted by {@link SortIndicator}. */
interface SortIndicatorProps {
  /** Whether its column is the active sort column. */
  active: boolean;
  /** Direction of the active sort. */
  order: CustomerFilter["sortOrder"];
}

/** Renders the ascending/descending arrow for a sortable column, hidden until hover when inactive. */
const SortIndicator = ({ active, order }: SortIndicatorProps) => {
  if (active) {
    return order === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }
  return (
    <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
  );
};

/** Props accepted by {@link SortableHead}. */
interface SortableHeadProps {
  /** Column heading text. */
  label: string;
  /** Sort key this column maps to. */
  sortKey: CustomerSortKey;
  /** Current filter state, used to highlight the active sort column. */
  filter: CustomerFilter;
  /** Called with {@link SortableHeadProps.sortKey} when the heading is clicked. */
  onSort: (key: CustomerSortKey) => void;
  /** Extra classes applied to the header cell. */
  className?: string;
}

/** Renders a clickable table header that sorts the customer list by its column. */
const SortableHead = ({
  label,
  sortKey,
  filter,
  onSort,
  className,
}: SortableHeadProps) => (
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

/**
 * Derives up to two uppercase initials from a customer's name for use as an avatar fallback.
 *
 * @param name - Customer name to shorten, e.g. `"Jane Doe"` → `"JD"`.
 * @returns Up to two uppercase initials, or `"?"` when the name contains no letters.
 */
export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

/**
 * Renders the sortable customers table with role badges, join dates and a per-row actions menu.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CustomersTable
 *   customers={customers}
 *   filter={filter}
 *   onSort={handleSort}
 *   onCustomerClick={setSelectedCustomer}
 * />
 * ```
 */
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
                <span className="text-sm">
                  {formatDate(customer.createdAt)}
                </span>
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
                  <DropdownMenuItem
                    onClick={() => copy(customer.email, "Email")}
                  >
                    <Mail className="h-4 w-4" /> Copy email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => copy(customer.id, "User ID")}
                  >
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
