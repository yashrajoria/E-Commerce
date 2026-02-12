import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { CustomerFilter } from "@/types/customers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomersFiltersProps {
  filter: CustomerFilter;
  onFilterChange: (filter: Partial<CustomerFilter>) => void;
}

export const CustomersFilters = ({
  filter,
  onFilterChange,
}: CustomersFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          className="pl-9"
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filter.status}
          onValueChange={(value) =>
            onFilterChange({ status: value as CustomerFilter["status"] })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Sort options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onFilterChange({
                  sortBy: "name",
                  sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              Name{" "}
              {filter.sortBy === "name" &&
                (filter.sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onFilterChange({
                  sortBy: "totalOrders",
                  sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              Total Orders{" "}
              {filter.sortBy === "totalOrders" &&
                (filter.sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onFilterChange({
                  sortBy: "totalSpent",
                  sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              Total Spent{" "}
              {filter.sortBy === "totalSpent" &&
                (filter.sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onFilterChange({
                  sortBy: "lastOrder",
                  sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              Last Order{" "}
              {filter.sortBy === "lastOrder" &&
                (filter.sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onFilterChange({
                  sortBy: "joinedDate",
                  sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
                })
              }
            >
              Join Date{" "}
              {filter.sortBy === "joinedDate" &&
                (filter.sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
          <span className="sr-only">More filters</span>
        </Button>
      </div>
    </div>
  );
};
