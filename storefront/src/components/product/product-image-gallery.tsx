"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Package, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt?: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  const validImages = images.length ? images : ["/icons8-image-100.png"];
  const currentRaw = validImages[selectedImage] || "/icons8-image-100.png";
  const hasError = imageErrorMap[selectedImage] || currentRaw.includes("localhost:4566") || currentRaw === "/icons8-image-100.png";

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Showcase Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-card border border-border flex items-center justify-center">
        {hasError ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground/40 p-12 text-center select-none">
            <Package className="h-20 w-20 stroke-1 mb-3" />
            <span className="text-sm font-semibold text-foreground tracking-tight">ShopSwift Product</span>
            <span className="text-xs text-muted-foreground mt-1">Official Catalog Photo</span>
          </div>
        ) : (
          <button
            type="button"
            className="absolute inset-0 p-0 m-0 border-0 bg-transparent cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-pressed={isZoomed}
            aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
          >
            <Image
              src={currentRaw}
              alt={alt ? `${alt} ${selectedImage + 1}` : `Product image ${selectedImage + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              onError={() => setImageErrorMap((prev) => ({ ...prev, [selectedImage]: true }))}
              priority
            />
          </button>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && !hasError && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-background/80 hover:bg-background border border-border/60 shadow-xs"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-background/80 hover:bg-background border border-border/60 shadow-xs"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Action */}
        {!hasError && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-background/80 hover:bg-background border border-border/60 shadow-xs"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label="Toggle zoom"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Dot Indicators */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-background/80 px-2 py-1 rounded-full border border-border/50">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                  index === selectedImage ? "bg-foreground" : "bg-muted-foreground/40"
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex space-x-2.5 overflow-x-auto pb-1">
          {validImages.map((image, index) => {
            const isThumbError = imageErrorMap[index] || image.includes("localhost:4566") || image === "/icons8-image-100.png";
            return (
              <button
                key={index}
                type="button"
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer bg-muted/20 flex items-center justify-center ${
                  index === selectedImage
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                {isThumbError ? (
                  <Package className="h-6 w-6 text-muted-foreground/40" />
                ) : (
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={() => setImageErrorMap((prev) => ({ ...prev, [index]: true }))}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
