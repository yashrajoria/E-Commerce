import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import uploadFiles from "./useUpload";
import type React from "react";

/** Validation schema for the single-product form (name, category, price, quantity, description, images, brand, sku, is_featured). */
const singleProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),

  quantity: z
    .number({
      required_error: "quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("quantity must be a positive number"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  is_featured: z.boolean().optional(),
});

/** An image staged for upload: the file plus an optional preview/URL once uploaded. */
export type UploadedImage = {
  file: File | null;
  url?: string;
  name?: string;
  preview?: string;
};

/**
 * Builds the react-hook-form instance and submit helpers for the product forms.
 *
 * @remarks
 * New files are uploaded through {@link uploadFiles} and sent to the API as an
 * `image_urls` JSON array; the form and the image-preview state are reset after
 * a successful create. Failures surface as toasts rather than thrown errors.
 *
 * @param setImagePreview - Setter for the legacy single-image preview state.
 * @param setUploadedImages - Setter for the multi-image list state.
 * @param images - Currently staged multi-image list, uploaded on create/update.
 * @param imagePreview - Currently staged single-image preview, uploaded when no list is present.
 * @param initialData - Partial values merged into the form defaults (used by the edit flow).
 * @returns The react-hook-form instance plus `onSubmitSingleProduct`,
 * `updateSingleProduct`, `deleteSingleProduct` and `isSubmitting`.
 */
export function useProductForm(
  setImagePreview: React.Dispatch<React.SetStateAction<File | null>>,
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  images: UploadedImage[],
  imagePreview: File | null,
  initialData?: Partial<z.infer<typeof singleProductSchema>>,
) {
  const form = useForm<z.infer<typeof singleProductSchema>>({
    resolver: zodResolver(singleProductSchema),
    defaultValues: {
      name: "",
      category: [],
      price: 0,
      quantity: 0,
      description: "",
      images: [],
      brand: "",
      sku: "",
      is_featured: false,
      ...initialData,
    },
  });

  const onSubmitSingleProduct = async (
    data: z.infer<typeof singleProductSchema>,
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", JSON.stringify(data.category));
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("description", data.description || "");
      if (data.brand) formData.append("brand", data.brand);
      if (data.sku) formData.append("sku", data.sku);
      if (typeof data.is_featured !== "undefined")
        formData.append("is_featured", String(data.is_featured));

      // If files are provided, try presign+upload flow and send image URLs instead
      if (images && images.length > 0) {
        const files = images
          .map((img: unknown) =>
            img && typeof img === "object"
              ? (img as Record<string, unknown>).file
              : undefined,
          )
          .filter((f: unknown): f is File => f instanceof File);
        if (files.length > 0) {
          const urls = await uploadFiles(files, data.sku);
          formData.append("image_urls", JSON.stringify(urls));
        }
      } else if (imagePreview instanceof File) {
        const urls = await uploadFiles([imagePreview], data.sku);
        formData.append("image_urls", JSON.stringify(urls));
      }

      const res = await axios.post("/api/admin/products", formData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product.");
      }

      form.reset();
      setImagePreview(null);
      setUploadedImages([]);
      return res;
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Error creating product");
    }
  };

  const updateSingleProduct = async (
    productId: string,
    data: z.infer<typeof singleProductSchema>,
  ) => {
    try {
      const id =
        typeof productId === "string"
          ? productId
          : (productId as { _id?: string })?._id || "";

      // If there are new files in images, upload them first and include image_urls
      const files = images
        ? images
            .map((img: { file?: unknown }) => img.file)
            .filter((f: unknown): f is File => f instanceof File)
        : [];

      const payload: Record<string, unknown> = { ...data };

      if (files.length > 0) {
        const urls = await uploadFiles(files, data.sku);
        (payload as Record<string, unknown>)["image_urls"] = urls;
      }

      const res = await axios.put(`/api/admin/products/${id}`, payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };
  const deleteSingleProduct = async (productId: string) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };
  return {
    form,
    onSubmitSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
    isSubmitting: form.formState.isSubmitting,
  };
}
