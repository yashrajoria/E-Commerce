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
});

export function useProductForm(
  setImages: any,
  setImagePreview: any,
  setUploadedImage: any,
  images: any,
  imagePreview: any
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
    },
  });

  const onSubmitSingleProduct = async (
    data: z.infer<typeof singleProductSchema>
  ) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("category", JSON.stringify(data.category));
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("description", data.description || "");

      if (images && images.length > 0) {
        images.forEach((img: { file: File | null }) => {
          if (img?.file instanceof File) {
            formData.append("images", img.file);
          }
        });
      } else if (imagePreview instanceof File) {
        formData.append("images", imagePreview);
      }

      // Log contents properly
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
      setImages([]);
      setImagePreview(null);
      setUploadedImage(null);
      return res;
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Error creating product");
    }
  };

  return { form, onSubmitSingleProduct };
}
