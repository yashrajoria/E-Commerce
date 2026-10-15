import type { Product } from "@/types/shared";
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import ProductInformation from "@/components/products/ProductInformation";
import { useProduct } from "@/hooks/useProduct";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";
import { useProductForm } from "@/hooks/useProductForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIMerchantStudioModal } from "@/components/ai/AIMerchantStudioModal";
import { motion } from "framer-motion";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { product, loading } = useProduct(id as string);
  const [uploadedImages, setUploadedImages] = useState<
    { file: File | null; preview?: string; url?: string }[]
  >([]);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);

  // prepare initialData for form when product is loaded
  const p = product as Product | undefined;
  const initialData = p
    ? {
        name: p.name,
        category: p.category_ids || [],
        price: p.price || 0,
        quantity: p.quantity || 0,
        description: p.description || "",
        images: p.images || [],
        brand: p.brand || "",
        sku: p.sku || "",
        is_featured:
          (p && (p as { is_featured?: boolean }).is_featured) || false,
      }
    : undefined;

  const { form, updateSingleProduct } = useProductForm(
    setImagePreview,
    setUploadedImages,
    uploadedImages,
    imagePreview,
    initialData,
  );

  useEffect(() => {
    if (p && p.images) {
      setUploadedImages(
        p.images.map((url: string) => ({
          file: null,
          url,
          preview: url,
        })),
      );
    }
  }, [p]);

  if (loading) {
    return (
      <PageLayout
        title="Edit Product"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Loading..." },
        ]}
      >
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    await updateSingleProduct(id as string, data);
    router.push(`/products/${id}`);
  });

  const handleApplyAIStudio = (data: {
    name: string;
    description: string;
    price?: number;
    brand?: string;
  }) => {
    form.setValue("name", data.name, { shouldValidate: true });
    form.setValue("description", data.description, { shouldValidate: true });
    if (data.price) form.setValue("price", data.price, { shouldValidate: true });
    if (data.brand) form.setValue("brand", data.brand, { shouldValidate: true });
  };

  return (
    <PageLayout
      title="Edit Product"
      breadcrumbs={[
        { label: "Products", href: "/products" },
        { label: "Edit" },
      ]}
      headerActions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAIStudioOpen(true)}
          className="gap-2 text-xs border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-xl h-8 font-semibold"
        >
          <Sparkles size={13} />
          AI Studio Magic
        </Button>
      }
    >
      <motion.section variants={pageItem} className="space-y-6">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductInformation
              type="edit"
              handleImageUpload={(e) => {
                const files = e.target.files;
                if (!files) return;
                const newImages = Array.from(files).map((f) => ({
                  file: f,
                  preview: URL.createObjectURL(f),
                }));
                setUploadedImages((prev) => [...prev, ...newImages]);
              }}
              uploadedImages={uploadedImages as unknown as import("@ecommerce/shared/src/types/common").UploadedImage[]}
              removeImage={(i) =>
                setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))
              }
            />

            <div className="glass-effect rounded-2xl p-4">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mr-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gradient-purple text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </motion.section>

      <AIMerchantStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        initialName={form.watch("name")}
        onApply={handleApplyAIStudio}
      />
    </PageLayout>
  );
}

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAuth } = await import("@/lib/ssrAuth");
  return requireAuth(ctx);
}
