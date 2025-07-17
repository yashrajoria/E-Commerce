"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Edit,
  ExternalLink,
  MoreVertical,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductImageGallery from "@/components/product-details/ProductImageGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/useProduct";
import { useProductForm } from "@/hooks/useProductForm";
import Head from "next/head";

// You can type this better based on your real product model
type Product = {
  _id: string;
  name: string;
  sku: string;
  category_ids: string;
  brand: string;
  description: string;
  images: string[];
  price: number;
  quantity: number;
  status: string;
};

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { product, loading: productLoading } = useProduct(id || "");

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setEditedProduct((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };
  const { updateSingleProduct, deleteSingleProduct } = useProductForm(
    () => {},
    () => {},
    [],
    null
  );

  console.log(editedProduct);
  const handleSave = async () => {
    if (!editedProduct?._id) {
      toast.error("Product ID missing.");
      return;
    }

    const { _id, ...updatePayload } = editedProduct;

    try {
      updateSingleProduct(_id, {
        ...updatePayload,
        category: [editedProduct.category_ids],
      });
      toast.success("Product updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
    toast.info("Changes cancelled");
  };
  const router = useRouter();
  const handleDelete = () => {
    console.log({ editedProduct });
    deleteSingleProduct(editedProduct?._id || "");
    toast.success("Product deleted successfully!");
    router.push("/products/");
  };

  const handleDuplicate = () => {
    toast.success("Product duplicated successfully!");
  };

  if (!id || id.trim() === "") {
    return <LoadingScreen message="Loading product..." />;
  }

  if (productLoading) {
    return <LoadingScreen message="Loading product data..." />;
  }

  if (!product) {
    return <LoadingScreen message="Product not found." />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5">
      <Head>
        <title>{editedProduct?.name}</title>
      </Head>
      <DashboardSidebar />
      <div className="flex-1 overflow-hidden">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl"
        >
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Products
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {editedProduct?.name}
                </h1>
                <p className="text-sm text-zinc-400">
                  SKU: {editedProduct?.sku || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge>{editedProduct?.status || "N/A"}</Badge>

              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Product
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-900 border-zinc-800"
                    >
                      <DropdownMenuItem onClick={handleDuplicate}>
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" /> View in Store
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </motion.header>

        <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductImageGallery images={editedProduct?.images || []} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProductInfo
                    product={editedProduct}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Selling Price</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editedProduct?.price}
                          onChange={(e) =>
                            handleInputChange(
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24 h-8 bg-zinc-800 border-zinc-700 text-white text-right"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          ${editedProduct?.price}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stock Quantity</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="1"
                          value={editedProduct?.quantity}
                          onChange={(e) =>
                            handleInputChange(
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-24 h-8 bg-zinc-800 border-zinc-700 text-white text-right"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {editedProduct?.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <Badge
                        className={
                          editedProduct?.quantity > 0
                            ? "bg-green-500 hover:bg-green-800"
                            : "bg-red-500"
                        }
                      >
                        {editedProduct?.quantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Value</span>
                      <span className="text-white font-semibold">
                        $
                        {(
                          editedProduct?.quantity * editedProduct?.price
                        ).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen text-white">
    {message}
  </div>
);

export default ProductDetails;
