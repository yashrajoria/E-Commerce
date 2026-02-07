"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images.length) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted" />
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <motion.div
          key={selectedImage}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={images[selectedImage]}
            alt="Product"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover cursor-zoom-in transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
          />
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Icon */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImage ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedImage
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedImage(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image}
                alt={`Product ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
