import { motion } from "framer-motion";
import { Eye, ZoomIn } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { resolveProductImageUrl } from "@ecommerce/shared";

/** Props accepted by {@link ProductImageGallery}. */
interface ProductImageGalleryProps {
  /**
   * Product image URLs; the first one is shown in the main preview.
   *
   * @defaultValue []
   */
  images: string[];
  /**
   * Index of the image to show in the main preview.
   *
   * @defaultValue 0
   */
  selectedImage?: number;
  /**
   * Called with the thumbnail index when the user picks another image.
   *
   * @param index - Index of the newly selected image.
   */
  onImageSelect?: (index: number) => void;
}

/**
 * Renders the product image preview with a thumbnail grid and active-image dots.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ProductImageGallery
 *   images={product.images}
 *   selectedImage={0}
 *   onImageSelect={setActiveImage}
 * />
 * ```
 */
const ProductImageGallery = ({
  images = [],
  selectedImage = 0,
  onImageSelect,
}: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState<number>(selectedImage);
  const [, setIsZoomed] = useState(false);

  useEffect(() => {
    setActiveImage(selectedImage);
  }, [selectedImage]);

  // Guard for empty images array
  const safeImage =
    images.length > 0
      ? resolveProductImageUrl(images[activeImage])
      : "/placeholder.svg";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border shadow-2xs"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={safeImage}
          alt="Product"
          className="w-full h-full object-cover"
          priority
          width={400}
          height={400}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsZoomed(true)}
              className="bg-background/90 text-foreground hover:bg-background shadow-xs border border-border"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </motion.div>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
            Premium
          </div>
        </div>
      </motion.div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveImage(index);
              onImageSelect?.(index); // Only call if callback provided
            }}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              activeImage === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-muted-foreground/40 bg-card"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image
              src={resolveProductImageUrl(image)}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          </motion.button>
        ))}
      </div>

      {/* Product Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span className="text-xs">1,250+ views</span>
        </div>

        <div className="flex items-center space-x-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeImage === index ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
