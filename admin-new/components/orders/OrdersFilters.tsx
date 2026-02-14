import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { OrdersFilter } from "@/types/orders";

interface OrdersFiltersProps {
  filter: OrdersFilter;
  onFilterChange: (filter: Partial<OrdersFilter>) => void;
}

export const OrdersFilters = ({
  filter,
  onFilterChange,
}: OrdersFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by number, customer name or email..."
          className="pl-9"
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filter.status}
          onValueChange={(value) =>
            onFilterChange({ status: value as OrdersFilter["status"] })
          }
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
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Additional filters</span>
        </Button>
      </div>
    </div>
  );
};
