import { Dialog } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useCategory";
import { useProductForm } from "@/hooks/useProductForm";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import CategorySection from "./CategorySection";
import ProductInformation from "./ProductInformation";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  images: string[];
  description: string;
}

// interface EditProductDialogProps {
//   product: Product | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (product: Product) => void;
// }

const EditProductDialog = ({ product, open, onOpenChange }) => {
  console.log({ product });
  // console.log("sAVE", handleSave);
  const { categories } = useCategories();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const { updateSingleProduct, form } = useProductForm(
    () => {},
    () => {},
    [],
    null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                updateSingleProduct(product?._id, data)
              )}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Product Information */}
                <ProductInformation
                  type="edit"
                  form={form}
                  handleImageUpload={handleImageUpload}
                  uploadedImages={imageFiles}
                  removeImage={removeImage}
                  onOpenChange={onOpenChange}
                />
              </div>
            </form>
          </FormProvider>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default EditProductDialog;
