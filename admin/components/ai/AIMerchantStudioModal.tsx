"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Check,
  X,
  TrendingUp,
  Tag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/** Props accepted by {@link AIMerchantStudioModal}. */
interface AIMerchantStudioModalProps {
  /** Whether the studio modal is visible. */
  isOpen: boolean;
  /** Called when the user dismisses the modal without applying. */
  onClose: () => void;
  /**
   * Draft product name pre-filled into the prompt input.
   *
   * @defaultValue ""
   */
  initialName?: string;
  /**
   * Called with the generated copy when the merchant applies it to the form.
   *
   * @param data - Generated product copy and pricing.
   */
  onApply: (data: {
    /** Generated product name. */
    name: string;
    /** Markdown-formatted product description. */
    description: string;
    /** Recommended price in major currency units. */
    price?: number;
    /** Suggested brand name. */
    brand?: string;
  }) => void;
}

/**
 * Renders the AI Merchant Studio modal that turns a draft product name and
 * brand tone into generated copy, pricing, tags and an SEO snippet.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <AIMerchantStudioModal
 *   isOpen={studioOpen}
 *   onClose={() => setStudioOpen(false)}
 *   initialName={form.name}
 *   onApply={(data) => applyStudioCopy(data)}
 * />
 * ```
 */
export function AIMerchantStudioModal({
  isOpen,
  onClose,
  initialName = "",
  onApply,
}: AIMerchantStudioModalProps) {
  const [draftName, setDraftName] = useState(
    initialName || "Ceramic Table Lamp",
  );
  const [tone, setTone] = useState<"luxury" | "minimalist" | "energetic">(
    "luxury",
  );
  const [loading, setLoading] = useState(false);

  const [generatedOutput, setGeneratedOutput] = useState<{
    name: string;
    description: string;
    suggestedPrice: number;
    brand: string;
    tags: string[];
    seoMeta: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI LLM agent generating tailored copy & SEO based on merchant prompt
    setTimeout(() => {
      const cleanTitle = draftName.trim() || "Modern Essential";
      let title = `${cleanTitle} — Handcrafted Studio Edition`;
      let brand = "Lumina Atelier";
      let price = 89.0;
      let tags = ["#homedecor", "#minimalist", "#artisan", "#nordicstyle"];

      if (tone === "minimalist") {
        title = `Nordic ${cleanTitle} (Matte Finish)`;
        brand = "Nordic Form";
        price = 79.0;
        tags = [
          "#minimalism",
          "#scandinaviandesign",
          "#warminterior",
          "#organic",
        ];
      } else if (tone === "energetic") {
        title = `Pro Edition ${cleanTitle} — Ultimate Performance`;
        brand = "AeroTech";
        price = 119.0;
        tags = ["#performance", "#proseries", "#highquality", "#everydaycarry"];
      }

      const description = `**Crafted for discerning spaces and modern lifestyles.**

Designed with an unwavering focus on texture and proportion, this piece blends understated elegance with robust day-to-day durability. 

### Key Highlights & Specifications:
* **Artisanal Craftsmanship:** Individually finished with non-toxic, sustainable matte coatings.
* **Ergonomic & Compact Silhouette:** Seamlessly complements any contemporary room, desk, or shelf arrangement.
* **Energy-Efficient Architecture:** Engineered for maximum lifespan with zero compromise on aesthetic appeal.
* **ShopSwift Quality Guarantee:** Backed by our 30-day hassle-free returns and dedicated customer care.

*Includes all required mounting accessories and multilingual care guide.*`;

      const seoMeta = `Shop the ${title}. Handcrafted with sustainable materials, modern silhouette, and free UK courier dispatch.`;

      setGeneratedOutput({
        name: title,
        description,
        suggestedPrice: price,
        brand,
        tags,
        seoMeta,
      });
      setLoading(false);
      toast.success("AI Studio copy & SEO package generated!");
    }, 1200);
  };

  const handleApply = () => {
    if (!generatedOutput) return;
    onApply({
      name: generatedOutput.name,
      description: generatedOutput.description,
      price: generatedOutput.suggestedPrice,
      brand: generatedOutput.brand,
    });
    toast.success("Applied AI Studio copy directly to product form!");
    onClose();
  };

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
          className="relative w-full max-w-3xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  AI Merchant Studio
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-purple-500/5 text-purple-600 border-purple-500/20"
                  >
                    Copilot &amp; SEO
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Transform raw product notes into high-converting descriptions,
                  SEO meta, and smart pricing
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

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="sm:col-span-1 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Product Draft Name
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Wireless desk charger"
                  className="w-full text-xs bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Brand Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) =>
                    setTone(
                      e.target.value as "luxury" | "minimalist" | "energetic",
                    )
                  }
                  className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2 text-foreground focus:outline-hidden"
                >
                  <option value="luxury">Luxury / Artisan</option>
                  <option value="minimalist">Scandi Minimalist</option>
                  <option value="energetic">High Performance</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full h-9 text-xs font-semibold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />{" "}
                      Drafting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3.5 w-3.5" /> Generate Studio Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Output Preview */}
            {generatedOutput && (
              <div className="space-y-4">
                {/* Title & Brand Row */}
                <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Generated Product Title
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      Brand: {generatedOutput.brand}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {generatedOutput.name}
                  </h3>
                </div>

                {/* Pricing & Tag Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">
                        Recommended Price
                      </span>
                      <span className="text-base font-bold text-foreground">
                        £{generatedOutput.suggestedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +18% Estimated Margin
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-background flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Auto-Generated Tags
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {generatedOutput.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Product Description (Markdown Formatted)
                  </span>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-xs text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                    {generatedOutput.description}
                  </div>
                </div>

                {/* SEO Snippet */}
                <div className="p-3.5 rounded-xl border border-border bg-background space-y-1 text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Search className="h-3 w-3" /> Google Search Snippet Preview
                  </span>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold truncate">
                    {generatedOutput.name} | ShopSwift
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {generatedOutput.seoMeta}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Discard
            </Button>
            {generatedOutput && (
              <Button
                onClick={handleApply}
                size="sm"
                className="text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-3.5 w-3.5" /> Apply All to Product Form
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
