"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import BulkUpload from "@/components/products/BulkUpload";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBulkUpload } from "@/hooks/useBulkUpload";
import { useProductForm } from "@/hooks/useProductForm";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};
interface ImageItem {
  id: string;
  file: File;
  url: string;
}
const AddProduct = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      await axios
        .get("/api/categories", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setCategories(res.data.map((cat: Category) => cat.name));
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          toast.error("Failed to load categories");
        });
    };
    fetchCategories();
  }, []);
  const { form, onSubmitSingleProduct } = useProductForm(
    setImages,
    setImagePreview,
    setUploadedImage,
    images,
    imagePreview
  );
  const {
    handleFileUpload,
    handleBulkUpload,
    downloadSampleCSV,
    csvData,
    isBulk,
    bulkFile,
  } = useBulkUpload();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1">
        <header className="backdrop-blur-lg sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 border-b">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="rounded-full"
              >
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Add Products</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div className="mb-8" variants={fadeIn}>
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-500" />
                    Add New Products
                  </CardTitle>
                  <CardDescription>
                    Create single products or upload in bulk using a CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="single"
                    onValueChange={setActiveTab}
                    value={activeTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2 rounded-lg p-1">
                      <TabsTrigger
                        value="single"
                        className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                      >
                        Single Product
                      </TabsTrigger>
                      <TabsTrigger
                        value="bulk"
                        className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                      >
                        Bulk Upload
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-6 mt-4">
                      <ProductForm
                        form={form}
                        categories={categories}
                        images={images}
                        setImages={setImages}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                        onSubmitSingleProduct={onSubmitSingleProduct}
                      />
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-6 mt-4">
                      <BulkUpload
                        handleFileUpload={handleFileUpload}
                        handleBulkUpload={handleBulkUpload}
                        downloadSampleCSV={downloadSampleCSV}
                        isBulk={isBulk}
                        csvData={csvData}
                        bulkFile={bulkFile}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
