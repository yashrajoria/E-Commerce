import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  category: string;
  category_ids?: string[];
  price: number;
  quantity: number;
  status: string;
  images: string[];
  description: string;
}

interface Category {
  _id: string;
  id?: string;
  name: string;
}

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onEdit?: (product: Product) => void;
}

const ProductCard = ({ product, categories, onEdit }: ProductCardProps) => {
  const getCategoryName = (categoryId: string) => {
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
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
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
      <Card className="h-full bg-card/50 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-accent/20 to-accent/10 overflow-hidden">
            <motion.div variants={imageVariants} className="h-full w-full">
              <Image
                src={product?.images?.[0] || "/placeholder.svg"}
                alt={product?.name}
                className="h-full w-full object-cover transition-transform duration-300"
              />
            </motion.div>

            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white text-black">
                {getCategoryName(product.category_ids?.[0] || product.category)}
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              <Badge
                variant={product.quantity >= 1 ? "default" : "destructive"}
                className={`text-xs font-medium ${
                  product.quantity >= 1
                    ? "bg-emerald-500/90 text-white border-emerald-600/20"
                    : "bg-amber-500/90 text-white border-amber-600/20"
                }`}
              >
                {product.quantity >= 1 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {/* Edit Button - appears on hover */}
            <motion.div
              className="absolute top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(product);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </div>

          <div className="p-4">
            <motion.h3
              className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200"
              layoutId={`title-${product._id}`}
            >
              {product.name}
            </motion.h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description || "No description available"}
            </p>

            <div className="flex items-center justify-between mb-3">
              <motion.div
                className="text-2xl font-bold text-primary"
                whileHover={{ scale: 1.05 }}
              >
                ${product.price?.toFixed(2)}
              </motion.div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.quantity} left
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="w-full flex gap-2">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                disabled={product.quantity < 1}
              >
                {product.quantity >= 1 ? (
                  <Link href={`/products/${product._id}/`}>View Details</Link>
                ) : (
                  "Out of Stock"
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {/* <Button
                size="icon"
                variant="outline"
                className="hover:bg-accent/50 transition-all duration-300"
                onClick={() => onEdit?.(product)}
              >
                <Edit className="h-4 w-4" />
              </Button> */}
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
