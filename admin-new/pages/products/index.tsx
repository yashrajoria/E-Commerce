import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductCard from "@/components/products/ProductCard";

import ProductsFilters from "@/components/products/ProductFilters";
import ProductsHeader from "@/components/products/ProductHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Package, Plus } from "lucide-react";
import Head from "next/head";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const query = {
    page: currentPage,
    perPage: perPage,
    search: searchQuery,
  };

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading, meta } = useProducts(query);
  console.log(products);
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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
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
  const productsCount = products?.length || 0;

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Head>
        <title>Products</title>
      </Head>
      <DashboardSidebar />

      <div className="flex-1">
        <ProductsHeader productsCount={productsCount} />
        <main className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 max-w-7xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <ProductsFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                perPage={perPage}
                onPerPageChange={handlePerPageChange}
              />
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
                            onEdit={handleEditProduct}
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
                                <TableHead className="font-semibold">
                                  Actions
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
                                          className="h-full w-full object-cover"
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
                                  <TableCell>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:bg-accent/50 transition-all duration-200"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
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

      {/* Edit Product Dialog */}
      {/* <EditProductDialog
        product={editingProduct}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
      /> */}
    </div>
  );
};

export default Products;
