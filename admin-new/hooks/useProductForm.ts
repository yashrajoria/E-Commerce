/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Define form schema for single product
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

export function useProductForm(
  setImagePreview: any,
  setUploadedImages: any,
  images: any,
  imagePreview: any,
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

      if (images && images.length > 0) {
        images.forEach((img: any) => {
          if (img.file instanceof File) {
            formData.append("images", img.file);
          }
        });
      } else if (imagePreview instanceof File) {
        formData.append("images", imagePreview);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axios.post("/api/products", formData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product.");
      }

      form.reset();
      setImagePreview(null);
      setUploadedImages(null);
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
      // console.log({ data });
      console.log({ productId });
      const id = (productId as any)._id || productId;
      console.log(id);
      const res = await axios.put(`/api/products/${productId}`, data, {
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
      console.log({ productId });
      const res = await axios.delete(`/api/products/${productId}`, {
        withCredentials: true,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
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
