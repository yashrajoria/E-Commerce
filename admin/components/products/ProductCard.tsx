import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { resolveProductImageUrl } from "@ecommerce/shared";
import type { Product, Category } from "@/types/shared";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onEdit?: (product: Product) => void;
}

const ProductCard = ({ product, categories, onEdit }: ProductCardProps) => {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "-";
    const category = categories?.find(
      (cat) => cat._id === categoryId || cat.id === categoryId,
    );
    return category?.name || categoryId;
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full"
    >
      <Card className="h-full bg-card border border-border shadow-2xs hover:shadow-xs transition-shadow duration-200 overflow-hidden group rounded-xl">
        <CardContent className="p-0">
          <div className="relative h-44 bg-muted/30 overflow-hidden border-b border-border">
            <motion.div variants={imageVariants} className="h-full w-full">
              <Image
                src={resolveProductImageUrl(product?.images?.[0])}
                alt={product?.name ?? ""}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="absolute top-2.5 left-2.5">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs text-foreground border border-border font-medium text-xs">
                {getCategoryName(
                  product.category_ids?.[0] ||
                    (typeof product.category === "string"
                      ? product.category
                      : product.category?.id ?? product.category?.name)
                )}
              </Badge>
            </div>

            <div className="absolute top-2.5 right-2.5">
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${
                  (product.quantity ?? 0) >= 1
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {(product.quantity ?? 0) >= 1 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {/* Edit Button */}
            <div
              className="absolute top-2.5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Button
                size="icon"
                variant="secondary"
                aria-label={`Edit ${product.name}`}
                title={`Edit ${product.name}`}
                className="h-7 w-7 bg-background text-foreground hover:bg-muted shadow-2xs border border-border"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(product);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="p-3.5">
            <h3
              className="font-semibold text-sm mb-1.5 line-clamp-1 text-foreground group-hover:text-primary transition-colors"
            >
              {product.name}
            </h3>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {product.description || "No description available"}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-foreground">
                £{product.price?.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Package className="h-3 w-3" />
                {product.quantity ?? 0} in stock
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3.5 pt-0">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 text-xs font-medium shadow-2xs transition-colors"
            disabled={(product.quantity ?? 0) < 1}
            asChild
          >
            <Link href={`/products/${product._id}/`}>
              {(product.quantity ?? 0) >= 1 ? "Manage Product" : "Out of Stock"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
