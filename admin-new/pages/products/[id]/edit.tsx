import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import ProductInformation from "@/components/products/ProductInformation";
import { useProduct } from "@/hooks/useProduct";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";
import { useProductForm } from "@/hooks/useProductForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { product, loading } = useProduct(id as string);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<File | null>(null);

  // prepare initialData for form when product is loaded
  const initialData = product
    ? {
        name: (product as any).name,
        category: (product as any).category || [],
        price: (product as any).price || 0,
        quantity: (product as any).quantity || 0,
        description: (product as any).description || "",
        images: (product as any).images || [],
        brand: (product as any).brand || "",
        sku: (product as any).sku || "",
        is_featured: (product as any).is_featured || false,
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
    if (product && (product as any).images) {
      setUploadedImages(
        (product as any).images.map((url: string) => ({
          file: null,
          url,
          preview: url,
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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
    await updateSingleProduct(id as string, data as any);
    router.push(`/products/${id}`);
  });

  return (
    <PageLayout
      title="Edit Product"
      breadcrumbs={[
        { label: "Products", href: "/products" },
        { label: "Edit" },
      ]}
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
              uploadedImages={uploadedImages}
              removeImage={(i) =>
                setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))
              }
            />

            <div className="glass-effect rounded-2xl p-4">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mr-2 px-4 py-2 rounded-xl border border-white/[0.06]"
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
    </PageLayout>
  );
}

export async function getServerSideProps(ctx: any) {
  const { requireAuth } = await import("@/lib/ssrAuth");
  return requireAuth(ctx);
}
