/**
 * Premium Products List Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import EmptyState from "@/components/ui/empty-state";
import ProductCard from "@/components/products/ProductCard";
import ProductsFilters from "@/components/products/ProductFilters";
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
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategory";
import { useProducts } from "@/hooks/useProducts";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  Package,
  Plus,
  DollarSign,
  AlertTriangle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);

  const query = { page: currentPage, perPage, search: searchQuery };
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading, meta } = useProducts(query);
  const totalPages = meta?.totalPages || 1;
  const isLoading = productsLoading || categoriesLoading;
  const productsCount = meta?.total || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleEditProduct = (_product: any) => {
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
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
          >
            <Download size={13} /> Export
          </Button>
          <Button
            size="sm"
            className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
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
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="In Stock"
          value={
            products.filter((p: { quantity: number }) => p.quantity > 0).length
          }
          icon={Package}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Out of Stock"
          value={
            products.filter((p: { quantity: number }) => p.quantity <= 0).length
          }
          icon={AlertTriangle}
          gradient="gradient-rose"
        />
        <StatsCard
          title="Categories"
          value={categories?.length || 0}
          icon={DollarSign}
          gradient="gradient-blue"
        />
      </motion.section>

      {/* Filters */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <ProductsFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
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
            <LoadingSpinner />
          </motion.section>
        ) : products.length === 0 ? (
          <motion.section key="empty" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <EmptyState
                icon={Package}
                title="No products found"
                description={
                  searchQuery
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first product"
                }
                actionLabel="Add Product"
                onAction={() => {}}
              />
            </div>
          </motion.section>
        ) : viewMode === "grid" ? (
          <motion.section
            key="grid"
            variants={pageItem}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product: { _id: string }, index: number) => (
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
            <Card className="glass-effect overflow-hidden border-white/[0.06]">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.04]">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Product
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Category
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Price
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stock
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(
                      (
                        product: {
                          _id: string;
                          images?: string[];
                          name: string;
                          description?: string;
                          category: string;
                          price: number;
                          quantity: number;
                        },
                        index: number,
                      ) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-white/[0.04] overflow-hidden flex items-center justify-center">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
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
                                <span className="font-medium text-sm">
                                  {product.name}
                                </span>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs border-white/[0.08]"
                            >
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            ${product.price?.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.quantity}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                product.quantity >= 1
                                  ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                                  : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                              }
                            >
                              {product.quantity >= 1
                                ? "In Stock"
                                : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white/[0.06] rounded-lg"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ),
                    )}
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
