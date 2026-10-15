import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowUpDown, Filter, Package, Rows3, Search } from "lucide-react";

/** Props accepted by {@link ProductsFilters}. */
interface ProductsFiltersProps {
  /** Controlled search term. */
  searchQuery: string;
  /** Called with the change event when the user types in the search box. */
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Current layout of the product list. */
  viewMode: "grid" | "list";
  /** Called with the next layout when the view toggle is pressed. */
  onViewModeChange: (mode: "grid" | "list") => void;
  /** Page size currently selected in the per-page dropdown. */
  perPage: number;
  /** Called with the chosen page size as a string. */
  onPerPageChange: (value: string) => void;
  /** Accepted for the filters API but not read by the current markup. */
  showOutOfStock: boolean;
  /** Accepted for the filters API but not wired to a control in the current markup. */
  onToggleOutOfStock: () => void;
}

/**
 * Renders the product search box, grid/list view toggle, filter and sort dropdowns and the per-page selector.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ProductsFilters
 *   searchQuery={searchQuery}
 *   onSearchChange={handleSearchChange}
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 *   perPage={perPage}
 *   onPerPageChange={handlePerPageChange}
 *   showOutOfStock={showOutOfStock}
 *   onToggleOutOfStock={handleToggleOutOfStock}
 * />
 * ```
 */
const ProductsFilters = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  perPage,
  onPerPageChange,
}: ProductsFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="flex flex-col sm:flex-row gap-3 p-3 bg-card rounded-xl border border-border shadow-2xs"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name, description, or SKU..."
          className="pl-9 h-9 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary/50 text-sm rounded-lg"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onViewModeChange(viewMode === "grid" ? "list" : "grid")
          }
          aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
          title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
          className={`h-9 w-9 rounded-lg border-border transition-colors ${
            viewMode === "grid"
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {viewMode === "grid" ? <Rows3 size={16} /> : <Package size={16} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open product filters"
              title="Open product filters"
              className="h-9 w-9 rounded-lg border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Filter size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground shadow-md">
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Category
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Electronics
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Clothing
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Books
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Home & Garden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="Sort products"
              title="Sort products"
              className="h-9 gap-1.5 border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground text-xs font-medium rounded-lg px-2.5"
            >
              <ArrowUpDown size={13} />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground shadow-md">
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Name Z-A
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Price Low-High
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Price High-Low
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-xs">
              Recently Added
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select onValueChange={onPerPageChange}>
          <SelectTrigger className="h-9 w-[130px] bg-background border-border text-foreground text-xs rounded-lg">
            <SelectValue placeholder={`${perPage} per page`} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground shadow-md">
            <SelectItem value="12" className="text-xs">
              12 per page
            </SelectItem>
            <SelectItem value="20" className="text-xs">
              20 per page
            </SelectItem>
            <SelectItem value="50" className="text-xs">
              50 per page
            </SelectItem>
            <SelectItem value="100" className="text-xs">
              100 per page
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default ProductsFilters;
