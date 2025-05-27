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
  SelectItem,
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

import { useProducts } from "@/hooks/useProducts";
import {
  ArrowUpDown,
  Filter,
  Package,
  Plus,
  Rows3,
  Search,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategory";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

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
  const { products, loading: productsLoading, meta } = useProducts(query);

  const totalPages = meta?.totalPages || 1;
  const isLoading = productsLoading || categoriesLoading;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setPerPage(parsedValue);
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardSidebar />

      <div className="flex-1">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-10 shadow-sm"
        >
          <div className="h-16 px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your product inventory
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={16} />
                <Link href="/products/add-product">Add Product</Link>
              </Button>
            </motion.div>
          </div>
        </motion.header>

        <main className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                    className={`transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <Rows3 size={18} />
                    ) : (
                      <Package size={18} />
                    )}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-accent/50 transition-all duration-300"
                  >
                    <Filter size={18} />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:bg-accent/50 transition-all duration-300"
                  >
                    <ArrowUpDown size={14} />
                    Sort
                  </Button>
                </motion.div>
                <Select onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-[140px] bg-background/50 border-border/50 hover:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder={`${perPage} per page`} />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="12">12 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <LoadingSpinner />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {viewMode === "grid" ? (
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {products.map((product, index) => (
                        <motion.div
                          key={product._id}
                          variants={itemVariants}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard
                            product={product}
                            categories={categories}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg">
                        <CardContent className="p-0 overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/50">
                                <TableHead className="font-semibold">
                                  Product
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Category
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Price
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Inventory
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {products.map((product, index) => (
                                <motion.tr
                                  key={product._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="border-border/30 hover:bg-accent/20 transition-colors duration-200"
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 overflow-hidden border border-border/30">
                                        <img
                                          src={
                                            product?.images?.[0] ||
                                            "/placeholder.svg"
                                          }
                                          alt={product?.name}
                                          className="h-full w-full object-contain"
                                        />
                                      </div>
                                      <div>
                                        <span className="font-medium text-foreground">
                                          {product?.name}
                                        </span>
                                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                          {product?.description}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary-foreground">
                                      {product.category}
                                    </span>
                                  </TableCell>
                                  <TableCell className="font-semibold">
                                    ${product.price?.toFixed(2)}
                                  </TableCell>
                                  <TableCell>{product.quantity}</TableCell>
                                  <TableCell>
                                    <span
                                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                                        product.quantity >= 1
                                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                      }`}
                                    >
                                      {product.quantity >= 1
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </span>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && products.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex justify-center mt-8"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={`transition-all duration-200 ${
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "hover:bg-accent/50"
                          }`}
                        />
                      </motion.div>
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3 && currentPage < totalPages - 1) {
                            pageNum = currentPage - 2 + i;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 4 + i;
                          }
                        }

                        return pageNum <= totalPages ? (
                          <PaginationItem key={pageNum}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <PaginationLink
                                isActive={currentPage === pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`transition-all duration-200 ${
                                  currentPage === pageNum
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                {pageNum}
                              </PaginationLink>
                            </motion.div>
                          </PaginationItem>
                        ) : null;
                      }
                    )}

                    <PaginationItem>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          className={`transition-all duration-200 ${
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "hover:bg-accent/50"
                          }`}
                        />
                      </motion.div>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}

            {!isLoading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first product"}
                </p>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Product
                </Button>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Products;
