import { motion } from "framer-motion";
import { Eye, ZoomIn } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  selectedImage?: number;
  onImageSelect?: (index: number) => void;
}

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
    images.length > 0 ? images[activeImage] : "/placeholder.jpg"; // Optional fallback image

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={safeImage}
          alt="Product"
          className="w-full h-full object-cover"
          priority
          width={100}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsZoomed(true)}
              className="bg-white/90 text-black hover:bg-white"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </motion.div>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              activeImage === index
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-zinc-700 hover:border-zinc-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
              width={100}
            />
          </motion.button>
        ))}
      </div>

      {/* Product Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">1,250+ views</span>
        </div>

        <div className="flex items-center space-x-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeImage === index ? "bg-blue-500" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
