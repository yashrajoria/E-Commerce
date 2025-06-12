import { useCategories } from "@/hooks/useCategory";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, FileText, Image, Package, Upload, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelectCombobox } from "./MultiSelectCombobox";

const ProductInformation = ({
  type,
  // form,
  handleImageUpload,
  uploadedImages,
  removeImage,
  // onOpenChange,
}) => {
  const form = useFormContext();
  const { categories } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  const isEdit = type === "edit";

  const FormBody = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="lg:col-span-2 space-y-6 gap-4"
    >
      {/* Product Information Section */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
          <CardHeader className="relative">
            <div className="flex justify-between items-start gap-3">
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Product Information
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter the basic details for your product
                  </CardDescription>
                </div>
              </div>

              {/* Right Side (Buttons) */}
              <div className="flex items-center gap-2">
                <Button type="submit" className="bg-blue-500 text-white">
                  Create Product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium">
                    <Package className="h-4 w-4 text-blue-500" />
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 dark:border-gray-700 dark:focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter a compelling product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product features, benefits, and what makes it special..."
                      className="min-h-[120px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-700 dark:focus:border-purple-500 resize-none transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground">
                    A detailed description helps customers understand your
                    product better
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Price (USD)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="h-12 pl-8 border-gray-200 focus:border-green-400 focus:ring-green-400/20 dark:border-gray-700 dark:focus:border-green-500 transition-all duration-200"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseFloat(value)
                            );
                          }}
                        />
                      </div>
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
                    <FormLabel className="flex items-center gap-2 font-medium">
                      <Package className="h-4 w-4 text-orange-500" />
                      Quantity in Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-12 border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 dark:border-gray-700 dark:focus:border-orange-500 transition-all duration-200"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? "" : parseInt(value, 10)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <MultiSelectCombobox
                form={form}
                name="category"
                categories={categories}
              />
              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-2 items-center">
                      <CircleCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <FormLabel className="text-zinc-300 w-full">
                        Status
                      </FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectItem
                          value="active"
                          className="hover:bg-zinc-700"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="hover:bg-zinc-700"
                        >
                          Inactive
                        </SelectItem>
                        <SelectItem value="draft" className="hover:bg-zinc-700">
                          Draft
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Product Images Section */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    Product Images
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Upload high-quality images to showcase your product
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                {uploadedImages.length}/5 images
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadedImages.length >= 5}
                />
                <div
                  className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 
                  ${
                    uploadedImages.length >= 5
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-50 dark:border-gray-700 dark:bg-gray-900/30"
                      : "border-purple-300 hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer dark:border-purple-700 dark:hover:border-purple-600 dark:hover:bg-purple-950/30"
                  }
                `}
                >
                  <motion.div
                    whileHover={
                      uploadedImages.length < 5 ? { scale: 1.05 } : {}
                    }
                    whileTap={uploadedImages.length < 5 ? { scale: 0.95 } : {}}
                    className="space-y-3"
                  >
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto">
                      <Upload
                        className={`h-8 w-8 ${
                          uploadedImages.length >= 5
                            ? "text-gray-400"
                            : "text-purple-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          uploadedImages.length >= 5
                            ? "text-gray-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {uploadedImages.length >= 5
                          ? "Maximum images reached"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Image Grid */}
              <AnimatePresence>
                {uploadedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-lg border border-white/50 bg-white/50 dark:border-gray-800 dark:bg-gray-900/50">
                      {uploadedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <img
                              src={image.url}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={() => removeImage(index)}
                          >
                            <X size={14} />
                          </Button>
                          <div className="absolute bottom-2 left-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white/90 text-gray-700"
                            >
                              {index + 1}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {uploadedImages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No images uploaded yet. Add some images to showcase your
                    product.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  return isEdit ? (
    // <Dialog open onOpenChange={onOpenChange}>
    <Dialog open>
      <DialogContent className="w-full max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{FormBody}</div>
      </DialogContent>
    </Dialog>
  ) : (
    FormBody
  );
};

export default ProductInformation;
