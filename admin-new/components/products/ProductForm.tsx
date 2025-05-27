import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { MultiSelectCombobox } from "./MultiSelectCombobox";
import ProductImageUpload from "./ProductImageUpload";

// Define the props for ProductForm
interface ProductFormProps {
  form: UseFormReturn<FieldValues>;
  categories: [];
  images: [];
  setImages: (images: []) => void;

  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  uploadedImage: string | null;
  setUploadedImage: (url: string | null) => void;
  onSubmitSingleProduct: (data: FieldValues) => void;
}
export default function ProductForm({
  form,
  categories,
  images,
  setImages,
  imagePreview,
  setImagePreview,
  uploadedImage,
  setUploadedImage,
  onSubmitSingleProduct,
}: ProductFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitSingleProduct)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      className="bg-white dark:bg-gray-950"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories MultiSelect */}
            <MultiSelectCombobox
              form={form}
              name="category" // this should match the field name used in RHF
              categories={categories} // categories expected to be array of strings
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-white dark:bg-gray-950"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-white dark:bg-gray-950"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[120px] bg-white dark:bg-gray-950"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Right Section: Image */}
          <ProductImageUpload
            images={images}
            setImages={setImages}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
        </div>
        <Separator className="my-6" />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
