import { ErrorState, TableSkeleton } from "@/components/admin/shared/DataStates";
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import ProductCard from "@/components/products/ProductCard";
import ProductsFilters from "@/components/products/ProductFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/shared/DataStates";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import StatsCard from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategory";
import { useAdminProducts } from "@/lib/hooks/useAdminData";
import type { Product } from "@/types/shared";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  DollarSign,
  Download,
  Edit,
  Package,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  // const query = { page: currentPage, limit: perPage, search: searchQuery }; // (unused)
  const { categories, loading: categoriesLoading } = useCategories();
  const {
    products,
    meta,
    error: productsError,
    isLoading: productsLoading,
    mutate,
  } = useAdminProducts(currentPage, perPage, searchQuery);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPages = (meta as any)?.totalPages || 1;
  const isLoading = productsLoading || categoriesLoading;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productsCount = (meta as any)?.total || 0;
  const productList = (Array.isArray(products) ? products : []) as Product[];

  // Client-side filters
  const handleToggleOutOfStock = () => setShowOutOfStock((s) => !s);
  const displayedProducts =
    productList.filter((p: Product) =>
      showOutOfStock ? true : (p.quantity || 0) > 0,
    ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };
  const handleEditProduct = (product: Product | null) => {
    void product;
    /* open edit modal */
  };

  return (
    <PageLayout
      title="Products"
      breadcrumbs={[{ label: "Products" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-border hover:bg-muted rounded-lg h-8 hidden sm:flex font-medium shadow-2xs"
          >
            <Download size={13} /> Export
          </Button>
          <Button
            size="sm"
            className="gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 shadow-2xs font-medium"
            asChild
          >
            <Link href="/products/add-product">
              <Plus size={13} /> Add Product
            </Link>
          </Button>
        </div>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Products"
          value={productsCount}
          icon={Package}
          trend={{ value: 5.2, label: "vs last month" }}
        />
        <StatsCard
          title="In Stock"
          value={
            productList.filter((p: Product) => (p.quantity || 0) > 0)
              ?.length || 0
          }
          icon={Package}
        />
        <StatsCard
          title="Out of Stock"
          value={
            productList.filter((p: Product) => (p.quantity || 0) <= 0)
              ?.length || 0
          }
          icon={AlertTriangle}
        />
        <StatsCard
          title="Categories"
          value={categories?.length || 0}
          icon={DollarSign}
        />
      </motion.section>

      {/* Filters */}
      <motion.section variants={pageItem}>
        <div className="bg-card border border-border shadow-2xs rounded-lg p-3">
          <ProductsFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            showOutOfStock={showOutOfStock}
            onToggleOutOfStock={handleToggleOutOfStock}
          />
        </div>
      </motion.section>

      {/* Product Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.section
            key="loading"
            variants={pageItem}
            className="flex items-center justify-center py-16"
          >
            {viewMode === "grid" ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass-effect rounded-xl p-4 space-y-3"
                  >
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full glass-effect rounded-xl overflow-hidden border border-white/[0.06]">
                <Table>
                  <TableSkeleton rows={8} cols={6} />
                </Table>
              </div>
            )}
          </motion.section>
        ) : productsError ? (
          <motion.section key="error" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <ErrorState message={productsError.message} onRetry={() => mutate()} />
            </div>
          </motion.section>
        ) : (products?.length || 0) === 0 ? (
          <motion.section key="empty" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <EmptyState
                title="No products found"
                description={
                  searchQuery
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first product"
                }
                action={
                  <Button asChild>
                    <Link href="/products/add-product">Add Product</Link>
                  </Button>
                }
              />
            </div>
          </motion.section>
        ) : viewMode === "grid" ? (
          <motion.section
            key="grid"
            variants={pageItem}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product: Product, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard
                  product={product}
                  categories={categories}
                  onEdit={handleEditProduct}
                />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.section key="list" variants={pageItem}>
            <Card className="bg-card border border-border shadow-2xs overflow-hidden">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Product
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Price
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stock
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedProducts.map((product: Product, index: number) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0]}
                                  width={100}
                                  alt={product.name || "Product image"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package
                                  size={16}
                                  className="text-muted-foreground"
                                />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-sm text-foreground">
                                {product.name}
                              </span>
                              <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs border-border bg-muted/50 font-normal"
                          >
                            {typeof product.category === "string"
                              ? product.category
                              : product.category?.name ?? "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-sm text-foreground">
                          £{product.price?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {product.quantity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              (product.quantity || 0) >= 1
                                ? "bg-primary/10 text-primary border-primary/20 font-medium"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium"
                            }
                          >
                            {(product.quantity || 0) >= 1
                              ? "In Stock"
                              : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
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
          </motion.section>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!isLoading && products.length > 0 && totalPages > 1 && (
        <motion.section variants={pageItem} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pn = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1)
                    pn = currentPage - 2 + i;
                  else if (currentPage >= totalPages - 1)
                    pn = totalPages - 4 + i;
                }
                return pn <= totalPages ? (
                  <PaginationItem key={pn}>
                    <PaginationLink
                      isActive={currentPage === pn}
                      onClick={() => handlePageChange(pn)}
                      className={`rounded-xl ${currentPage === pn ? "gradient-purple text-white border-0" : ""}`}
                    >
                      {pn}
                    </PaginationLink>
                  </PaginationItem>
                ) : null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={`rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.section>
      )}
    </PageLayout>
  );
};

export default Products;

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAuth } = await import("@/lib/ssrAuth");
  return requireAuth(ctx);
}
