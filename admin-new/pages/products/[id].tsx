/**
 * Premium Product Detail Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import ProductImageGallery from "@/components/product-details/ProductImageGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/useProduct";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  Edit,
  Eye,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useProductForm } from "@/hooks/useProductForm";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { product, loading } = useProduct(id as string);
  const [isEditing, setIsEditing] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: any = Array.isArray(product) ? product[0] : product;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleInputChange = (_field: string, _value: any) => {
    // handle input changes for edit mode
  };

  if (loading) {
    return (
      <PageLayout
        title="Product Details"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Loading..." },
        ]}
      >
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (!p) {
    return (
      <PageLayout
        title="Product Not Found"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Not Found" },
        ]}
      >
        <motion.div
          variants={pageItem}
          className="glass-effect rounded-xl p-12 text-center"
        >
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="gradient-purple text-white border-0 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </motion.div>
      </PageLayout>
    );
  }

  const { deleteSingleProduct } = useProductForm(
    () => {},
    () => {},
    [],
    null,
  );

  const handleDelete = async () => {
    const ok = window.confirm(
      "Delete this product? This action cannot be undone.",
    );
    if (!ok) return;
    try {
      await deleteSingleProduct((p as any)._id || id);
      router.push("/products");
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <PageLayout
      title={p.name || "Product Details"}
      breadcrumbs={[
        { label: "Products", href: "/products" },
        { label: p.name || "Detail" },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit size={13} />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl h-8"
            onClick={handleDelete}
          >
            <Trash2 size={13} />
            Delete
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
          title="Price"
          value={`$${p.price?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="In Stock"
          value={p.quantity || 0}
          icon={Package}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Total Sales"
          value={p.totalSales || 0}
          icon={ShoppingCart}
          gradient="gradient-blue"
        />
        <StatsCard
          title="Views"
          value={p.views || "1,250"}
          icon={Eye}
          gradient="gradient-gold"
          glowClass="glow-gold"
        />
      </motion.section>

      {/* Main Content Grid */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <Card className="glass-effect border-white/[0.06] overflow-hidden">
            <CardContent className="p-4">
              <ProductImageGallery images={p.images || []} />
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status & Tags */}
          <Card className="glass-effect border-white/[0.06]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Product Details</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    p.quantity > 0
                      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                      : "bg-red-400/10 text-red-400 border-red-400/20"
                  }
                >
                  {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ProductInfo
                product={p}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Regular Price
                  </span>
                  <span className="text-lg font-bold text-gradient">
                    ${p.price?.toFixed(2)}
                  </span>
                </div>
                {p.compareAtPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Compare At
                    </span>
                    <span className="text-sm line-through text-muted-foreground">
                      ${p.compareAtPrice?.toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-400" /> Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity
                  </span>
                  <span className="text-lg font-bold">{p.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">SKU</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {p.sku || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  );
};

export default ProductDetailPage;

export async function getServerSideProps(ctx: any) {
  const { requireAuth } = await import("@/lib/ssrAuth");
  return requireAuth(ctx);
}
