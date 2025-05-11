import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Minus, Plus, RotateCw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type Product = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  images: string[];
  price: number;
  description: string;
};

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  products: Product[];
  categories: string[];
}
// Define the product schema for form validation
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  description: z.string().optional(),
});

const ProductEditModal = ({
  isOpen,
  onClose,
  product,
  categories,
}: ProductEditModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants for the modal content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for the image cards
  const imageCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Set up form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      description: product?.description || "",
    },
  });

  // Handle image upload
  const handleAddImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (!product) return;
    console.log(data);
    setIsLoading(true);

    try {
      const updatedProduct = {
        ...product,
        ...data,
        images,
      };
      console.log({ updatedProduct });
      // onSave(updatedProduct);
      toast.success("Product updated successfully!");
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full glass-effect">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit Product
            </DialogTitle>
          </div>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
            >
              Product Details
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
              value="images"
            >
              Image
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              <TabsContent value="details" className="m-0 ">
                <div className="px-6 pb-6 ">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter product name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className=" glass-effect">
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <div className="flex items-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-r-none"
                                  onClick={() => {
                                    const newValue = Math.max(
                                      0,
                                      field.value - 1
                                    );
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Minus size={16} />
                                </Button>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="rounded-none text-center"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-l-none"
                                  onClick={() => {
                                    const newValue = field.value + 1;
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter product description"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-4 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          //   disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">
                                <RotateCw size={16} />
                              </span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
          <TabsContent value="images" className="m-0">
            <div className="px-6 pb-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Add New Image</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Plus size={16} className="mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL or upload an image
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Product Images</h3>

                {product?.images.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-2">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No images added yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add images using the form above
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {product?.images.map((image, index) => (
                        <motion.div
                          key={`${image}-${index}`}
                          variants={imageCardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
                        >
                          <img
                            src={image || "/no-image.png"}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <RotateCw size={16} />
                      </span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
