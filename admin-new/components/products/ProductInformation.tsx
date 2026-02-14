import { useCategories } from "@/hooks/useCategory";
import { AnimatePresence, motion } from "framer-motion";
import {
  DollarSign,
  FileText,
  Image as ImageIcon,
  Package,
  Hash,
  Upload,
  X,
  Layers,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelectCombobox } from "./MultiSelectCombobox";
import Image from "next/image";

type ProductInformationProps = {
  type?: string;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadedImages?: any[];
  removeImage?: (index: number) => void;
};

const ProductInformation: React.FC<ProductInformationProps> = ({
  type,
  handleImageUpload,
  uploadedImages = [],
  removeImage,
}) => {
  const form = useFormContext();
  const { categories } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const isEdit = type === "edit";

  const FormBody = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Product Details Section ── */}
      <motion.div variants={itemVariants}>
        <div className="glass-effect rounded-2xl overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Product Details
                </h3>
                <p className="text-xs text-muted-foreground">
                  Basic information about your product
                </p>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6 space-y-5">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-purple-400" />
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product name"
                      className="h-11 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:ring-purple-500/10 rounded-xl transition-all duration-200 placeholder:text-muted-foreground/50"
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
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your product in detail..."
                      rows={4}
                      className="resize-none bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:ring-purple-500/10 rounded-xl transition-all duration-200 placeholder:text-muted-foreground/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      Price
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="h-11 pl-8 bg-white/[0.03] border-white/[0.08] focus:border-emerald-500/50 focus:ring-emerald-500/10 rounded-xl transition-all duration-200 placeholder:text-muted-foreground/50"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseFloat(value),
                            );
                          }}
                        />
                      </div>
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
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-amber-400" />
                      Quantity in Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-11 bg-white/[0.03] border-white/[0.08] focus:border-amber-500/50 focus:ring-amber-500/10 rounded-xl transition-all duration-200 placeholder:text-muted-foreground/50"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? "" : parseInt(value, 10),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    Categories
                  </FormLabel>
                  <FormControl>
                    <MultiSelectCombobox
                      value={
                        Array.isArray(field.value)
                          ? field.value
                          : field.value
                            ? [field.value]
                            : []
                      }
                      onChange={field.onChange}
                      categories={categories}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Product Images Section ── */}
      <motion.div variants={itemVariants}>
        <div className="glass-effect rounded-2xl overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Product Images
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Upload up to 5 high-quality images
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/[0.06] text-muted-foreground border-white/[0.08] text-xs font-mono"
              >
                {uploadedImages.length} / 5
              </Badge>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6 space-y-5">
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
                  border border-dashed rounded-xl p-8 text-center transition-all duration-300
                  ${
                    uploadedImages.length >= 5
                      ? "border-white/[0.04] bg-white/[0.01] cursor-not-allowed opacity-40"
                      : "border-white/[0.08] hover:border-purple-500/30 hover:bg-purple-500/[0.02] cursor-pointer"
                  }
                `}
              >
                <motion.div
                  whileHover={uploadedImages.length < 5 ? { scale: 1.02 } : {}}
                  className="space-y-3"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto">
                    <Upload
                      className={`h-5 w-5 ${
                        uploadedImages.length >= 5
                          ? "text-muted-foreground/30"
                          : "text-purple-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        uploadedImages.length >= 5
                          ? "text-muted-foreground/30"
                          : "text-foreground"
                      }`}
                    >
                      {uploadedImages.length >= 5
                        ? "Maximum images reached"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {uploadedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group/img"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] ring-1 ring-white/[0.04]">
                          <Image
                            src={image.preview || image.url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                            width={200}
                            height={200}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full opacity-0 group-hover/img:opacity-100 transition-all duration-200 shadow-lg"
                          onClick={() => removeImage?.(index)}
                        >
                          <X size={12} />
                        </Button>
                        <div className="absolute bottom-1.5 left-1.5">
                          <span className="text-[10px] font-mono bg-black/60 text-white/80 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {index + 1}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {uploadedImages.length === 0 && (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">
                  No images uploaded yet
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return isEdit ? (
    <Dialog open>
      <DialogContent className="w-full max-w-3xl sm:max-w-3xl glass-effect-strong border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit Product</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{FormBody}</div>
      </DialogContent>
    </Dialog>
  ) : (
    FormBody
  );
};

export default ProductInformation;
