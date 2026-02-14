/**
 * Premium Add Product Page
 * Matches the glassmorphism design system used across the admin dashboard
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import ProductInformation from "@/components/products/ProductInformation";
import BulkUpload from "@/components/products/BulkUpload";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/hooks/useProductForm";
import { useBulkUpload } from "@/hooks/useBulkUpload";
import { FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { Package, FileSpreadsheet, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const AddProductPage = () => {
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const { form, onSubmitSingleProduct } = useProductForm(
    setImagePreview,
    setUploadedImages,
    uploadedImages,
    imagePreview,
  );

  const {
    csvData,
    handleFileUpload,
    validateBulkUpload,
    handleBulkUpload,
    isBulk,
    isValidating,
    isUploading,
    validationResult,
  } = useBulkUpload();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PageLayout
      title="Add Product"
      breadcrumbs={[
        { label: "Products", href: "/products" },
        { label: "Add Product" },
      ]}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8"
          asChild
        >
          <Link href="/products">
            <ArrowLeft size={13} />
            Back to Products
          </Link>
        </Button>
      }
    >
      {/* Mode Toggle */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-2xl p-1.5 inline-flex gap-1">
          <button
            onClick={() => setUploadMode("single")}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              uploadMode === "single"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {uploadMode === "single" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 gradient-purple rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Package size={14} />
              Single Product
            </span>
          </button>
          <button
            onClick={() => setUploadMode("bulk")}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              uploadMode === "bulk"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {uploadMode === "bulk" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 gradient-purple rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <FileSpreadsheet size={14} />
              Bulk Upload
            </span>
          </button>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section variants={pageItem}>
        {uploadMode === "single" ? (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitSingleProduct)}
              className="space-y-6"
            >
              <ProductInformation
                type="create"
                handleImageUpload={handleImageUpload}
                uploadedImages={uploadedImages}
                removeImage={removeImage}
              />

              {/* Submit Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-400" />
                    Fill in the details above to create your product
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-9"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={form.formState.isSubmitting}
                      className="gradient-purple text-white border-0 rounded-xl h-9 px-6 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
                    >
                      {form.formState.isSubmitting
                        ? "Creating..."
                        : "Create Product"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </form>
          </FormProvider>
        ) : (
          <BulkUpload
            csvData={csvData}
            handleFileUpload={handleFileUpload}
            validateBulkUpload={validateBulkUpload}
            confirmBulkUpload={handleBulkUpload}
            isBulk={isBulk}
            isValidating={isValidating}
            isUploading={isUploading}
            validationResult={validationResult}
          />
        )}
      </motion.section>
    </PageLayout>
  );
};

export default AddProductPage;
