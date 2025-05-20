import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategory";
import { useProducts } from "@/hooks/useProducts";
import {
  ArrowUpDown,
  Filter,
  Loader2Icon,
  Package,
  Plus,
  Rows3,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import Image from "next/image";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);

  const query = {
    page: currentPage,
    perPage: perPage,
    search: searchQuery,
  };

  const { categories, loading: categoriesLoading } = useCategories();
  type ProductsMeta = {
    totalPages: number;
    // add other properties if needed
  };

  const {
    products,
    loading: productsLoading,
    meta,
  } = useProducts(query) as {
    products: [
      {
        _id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        status: string;
        images: string[];
        description: string;
      }
    ];
    loading: boolean;
    meta: ProductsMeta;
  };

  // Calculate pagination
  const totalPages = meta?.totalPages || 1;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setPerPage(parsedValue);
    setCurrentPage(1); // Reset to first page on per page change
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Products</h1>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 bg-blue-400 hover:bg-blue-500 hover:scale-105 hover:transition-all duration-300 ease-in-out transform hover:rotate-3"
            >
              <Link
                href="/products/add-product"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Product
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className={viewMode === "grid" ? "bg-white/10" : ""}
                >
                  {viewMode === "grid" ? (
                    <Rows3 size={18} />
                  ) : (
                    <Package size={18} />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  // onClick={() => setViewMode("list")}
                  // className={viewMode === "list" ? "bg-white/10" : ""}
                >
                  <Filter size={18} />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpDown size={14} />
                  Sort
                </Button>
                {/* Per page selector */}
                <div className="ml-4 ">
                  <Select onValueChange={handlePerPageChange}>
                    <SelectTrigger className="w-[180px] glass-effect">
                      <SelectValue placeholder="Select Per Page" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectGroup>
                        <SelectLabel>Select Per Page</SelectLabel>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="400">400</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {productsLoading || categoriesLoading ? (
              <Loader2Icon />
            ) : (
              <>
                {/* Products Display */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        category={categories}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="glass-effect">
                    <CardContent className="p-0 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Inventory</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-white/10 overflow-hidden">
                                    <img
                                      src={product?.images[0]}
                                      alt={product?.name}
                                      width={40}
                                      height={40}
                                      // priority
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <span className="font-medium">
                                    {product?.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    product.quantity >= 1
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-amber-500/10 text-amber-500"
                                  }`}
                                >
                                  {product.quantity >= 1
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

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
                          let pageNum = i + 1;
                          if (totalPages > 5) {
                            if (
                              currentPage > 3 &&
                              currentPage < totalPages - 1
                            ) {
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
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1)
                            )
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
