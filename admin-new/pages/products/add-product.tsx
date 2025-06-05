"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import BulkUpload from "@/components/products/BulkUpload";
import CategorySection from "@/components/products/CategorySection";
import ProductInformation from "@/components/products/ProductInformation";
import { Button } from "@/components/ui/button";
import { useBulkUpload } from "@/hooks/useBulkUpload";
import { useProductForm } from "@/hooks/useProductForm";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { FormProvider } from "react-hook-form";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // const [images, setImages] = useState<ImageItem[]>([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);

  const { form, onSubmitSingleProduct } = useProductForm(
    // setImages,
    setImagePreview,
    setUploadedImages,
    uploadedImages,
    imagePreview
  );

  const {
    handleFileUpload,
    handleBulkUpload,
    downloadSampleCSV,
    csvData,
    isBulk,
    bulkFile,
    setCsvData,
  } = useBulkUpload();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
      setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };
  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      // Revoke the object URL of the image being removed
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />

      <div className="flex-1">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10"
        >
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Back to Products
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">
                {mode === "single" ? "Add New Product" : "Bulk Add Products"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={mode === "single" ? "default" : "outline"}
                size="sm"
                className={mode === "single" ? "bg-white text-black" : ""}
                onClick={() => setMode("single")}
              >
                Single Product
              </Button>
              <Button
                variant={mode === "bulk" ? "default" : "outline"}
                size="sm"
                className={mode === "bulk" ? "bg-white text-black" : ""}
                onClick={() => setMode("bulk")}
              >
                Bulk Upload
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-6xl mx-auto"
          >
            {mode === "single" ? (
              // Single Product Form
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitSingleProduct)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Product Information */}
                    <ProductInformation
                      form={form}
                      handleImageUpload={handleImageUpload}
                      uploadedImages={uploadedImages}
                      removeImage={removeImage}
                    />

                    {/* Sidebar */}
                    <CategorySection
                      form={form}
                      isSubmitting={isSubmitting}
                      setUploadedImages={setUploadedImages}
                    />
                  </div>
                </form>
              </FormProvider>
            ) : (
              // Bulk Upload Interface
              <BulkUpload
                csvData={csvData}
                handleFileUpload={handleFileUpload}
                downloadSampleCSV={downloadSampleCSV}
                csvFile={csvFile}
                handleBulkUpload={handleBulkUpload}
                isSubmitting={isSubmitting}
                setCsvData={setCsvData}
                setCsvFile={setCsvFile}
              />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
