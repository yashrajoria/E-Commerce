"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Sparkles, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatGBP } from "@/lib/utils";
import type {
  VisualSearchResultItem,
  VisualSearchResponse,
} from "@/pages/api/products/visual-search";

/** Props accepted by {@link VisualSearchModal}. */
interface VisualSearchModalProps {
  /** Whether the modal is visible; the component returns null when false. */
  isOpen: boolean;
  /** Called to dismiss the modal from the backdrop, the close button, a matching product link or the footer button. */
  onClose: () => void;
}

/** Curated aesthetic presets users can search by when they do not upload a photo. */
const PRESETS = [
  {
    id: "minimalist-home",
    label: "Nordic Living",
    icon: "🛋️",
    thumb:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80",
  },
  {
    id: "tech-desk",
    label: "Tech Workspace",
    icon: "💻",
    thumb:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  },
  {
    id: "urban-athleisure",
    label: "Urban Athleisure",
    icon: "👟",
    thumb:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
  },
  {
    id: "luxury-watch",
    label: "Classic Watches",
    icon: "⌚",
    thumb:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80",
  },
];

/**
 * Renders the visual "Shop the Look" modal that matches products from an uploaded photo or a style preset.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * POSTs to `/api/products/visual-search` with either a `presetId` or a base64 image, runs the default preset search the first time it opens, and adds matched products to the cart through `useCart`; failed requests fall back to a toast and curated matches.
 *
 * @example
 * ```tsx
 * <VisualSearchModal
 *   isOpen={isVisualSearchOpen}
 *   onClose={() => setIsVisualSearchOpen(false)}
 * />
 * ```
 */
export function VisualSearchModal({ isOpen, onClose }: VisualSearchModalProps) {
  const [selectedPreset, setSelectedPreset] =
    useState<string>("minimalist-home");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<VisualSearchResponse | null>(
    null,
  );
  const { addToCart } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const executeVisualSearch = async (
    presetId?: string,
    imageBase64?: string,
    imageName?: string,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/visual-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presetId,
          imageData: imageBase64,
          imageName,
        }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data: VisualSearchResponse = await res.json();
      setSearchData(data);
    } catch {
      toast.error(
        "Visual search encountered an issue. Showing curated matches.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    setUploadedImage(null);
    executeVisualSearch(presetId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      setSelectedPreset("");
      executeVisualSearch(undefined, result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = (item: VisualSearchResultItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images?.length ? item.images : ["/placeholder.svg"],
      category:
        typeof item.category === "string"
          ? item.category
          : item.category?.name || "General",
      rating: item.rating ?? 5,
      reviews: item.reviews ?? 10,
      quantity: 1,
    });
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    toast.success(`Added ${item.name} to bag!`);
  };

  // Run default search on first open if empty
  React.useEffect(() => {
    if (isOpen && !searchData && !loading) {
      executeVisualSearch(selectedPreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Visual Search & Shop the Look
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/5 text-primary border-primary/20"
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> AI Vision
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload any photo or pick an inspiration style to find instant
                  visual matches
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Input Options: Preset buttons + Upload zone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Drop / Upload Zone */}
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-center bg-muted/20 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  aria-label="Upload photo to search"
                />
                {uploadedImage ? (
                  <div className="relative h-24 w-full rounded-lg overflow-hidden">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded search visual"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium">
                      Click to change
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-foreground">
                      Upload or Drop Photo
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      JPG, PNG, WebP
                    </span>
                  </>
                )}
              </div>

              {/* Style Presets */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <span className="text-xs font-medium text-muted-foreground mb-2">
                  Or choose curated aesthetic look:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESETS.map((preset) => {
                    const isSelected =
                      selectedPreset === preset.id && !uploadedImage;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetClick(preset.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-start gap-1 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-border hover:border-border/80 bg-background text-foreground"
                        }`}
                      >
                        <span className="text-base">{preset.icon}</span>
                        <span className="text-xs font-semibold truncate w-full">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Analysis Attributes Bar */}
            {searchData?.detectedAttributes && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Detected Aesthetic:
                  </span>
                  <span className="font-semibold text-foreground">
                    {searchData.detectedAttributes.aesthetic}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground mr-1">Palette:</span>
                  {searchData.detectedAttributes.colorPalette.map(
                    (col, idx) => (
                      <span
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs inline-block"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Matched Products ({searchData?.results.length ?? 0})
                </h3>
                {loading && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" /> Analyzing
                    aesthetics...
                  </span>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-48 rounded-xl bg-muted/50 animate-pulse border border-border/50"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {searchData?.results.map((product) => {
                    const isAdded = addedItemIds[product.id];
                    const imgUrl = product.images?.[0] || "/placeholder.svg";

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col justify-between p-3 rounded-xl border border-border bg-background hover:shadow-md hover:border-primary/40 transition-all"
                      >
                        <div className="relative h-36 w-full rounded-lg overflow-hidden bg-muted/30 mb-2">
                          <Image
                            src={imgUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Similarity badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 shadow-xs">
                              {product.similarity}% Match
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link
                            href={`/products/${product.id}`}
                            onClick={onClose}
                            className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-bold text-foreground">
                              {formatGBP(product.price)}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                              {product.matchReasons?.[0] || "Style fit"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 flex gap-2">
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs font-medium"
                            onClick={() => handleAddToCart(product)}
                            disabled={isAdded}
                          >
                            {isAdded ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" /> Added
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Add
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Tip: Drag any Pinterest or Instagram screenshot right into the
              upload box!
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
