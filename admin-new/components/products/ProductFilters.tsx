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

interface ProductsFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  perPage: number;
  onPerPageChange: (value: string) => void;
  showOutOfStock: boolean;
  onToggleOutOfStock: () => void;
}

const ProductsFilters = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  perPage,
  onPerPageChange,
}: // showOutOfStock,
// onToggleOutOfStock,
ProductsFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-zinc-900/30 via-zinc-800/30 to-zinc-900/30 rounded-2xl border border-zinc-800/50 backdrop-blur-sm"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search products by name, description, or SKU..."
          className="pl-9 bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex gap-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onViewModeChange(viewMode === "grid" ? "list" : "grid")
            }
            className={`transition-all duration-300 bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 ${
              viewMode === "grid"
                ? "text-blue-400 border-blue-500/50"
                : "text-zinc-400"
            }`}
          >
            {viewMode === "grid" ? <Rows3 size={18} /> : <Package size={18} />}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {/* <Button
            variant="outline"
            size="icon"
            onClick={onToggleOutOfStock}
            className={`transition-all duration-300 bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 ${
              showOutOfStock
                ? "text-emerald-400 border-emerald-500/50"
                : "text-zinc-400"
            }`}
          >
            {showOutOfStock ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button> */}
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="icon"
                className="bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-300"
              >
                <Filter size={18} />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700 text-white">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem className="hover:bg-zinc-800">
              Electronics
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Clothing
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Books
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Home & Garden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-300"
              >
                <ArrowUpDown size={14} />
                Sort
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700 text-white">
            <DropdownMenuItem className="hover:bg-zinc-800">
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Name Z-A
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Price Low-High
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Price High-Low
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-800">
              Recently Added
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select onValueChange={onPerPageChange}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-zinc-700 text-white hover:border-blue-500/50 transition-all duration-300">
            <SelectValue placeholder={`${perPage} per page`} />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700 text-white">
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default ProductsFilters;
