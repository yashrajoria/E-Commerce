import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerFilter } from "@/types/customers";
import { RotateCcw, Search } from "lucide-react";

interface CustomersFiltersProps {
  filter: CustomerFilter;
  onFilterChange: (filter: Partial<CustomerFilter>) => void;
}

export const CustomersFilters = ({
  filter,
  onFilterChange,
}: CustomersFiltersProps) => {
  const isFiltered = filter.search !== "" || filter.role !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or phone..."
          className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filter.role}
          onValueChange={(value) =>
            onFilterChange({ role: value as CustomerFilter["role"] })
          }
        >
          <SelectTrigger className="w-[190px] bg-white/[0.04] border-white/[0.08] rounded-xl h-9">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="glass-effect border-white/[0.08]">
            <SelectItem value="all">All accounts</SelectItem>
            <SelectItem value="user">Customers</SelectItem>
            <SelectItem value="admin">Staff (admin)</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ search: "", role: "all" })}
            className="gap-1.5 rounded-xl h-9 border-white/[0.08] hover:bg-white/[0.04] text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
