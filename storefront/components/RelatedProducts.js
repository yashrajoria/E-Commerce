import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RelatedProducts = ({ products, onAddToCart }) => {
  const [expandedProduct, setExpandedProduct] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleExpand = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  const handleNext = () => {
    if (currentIndex + 5 < products.length) {
      setCurrentIndex((prev) => prev + 5);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 5 >= 0) {
      setCurrentIndex((prev) => prev - 5);
    }
  };

  const displayedProducts = products.slice(currentIndex, currentIndex + 5);

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <motion.h3
          className="text-3xl font-bold text-white gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Related Products
        </motion.h3>

        {products.length > 5 && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-white bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex + 5 >= products.length}
              className="text-white bg-white/10 hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <AnimatePresence>
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product._id}
              className="product-card group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative p-4 pb-0 overflow-hidden">
                {/* Product image with background glow */}
                <Link href={`/products/${product._id}`}>
                  <div className="relative aspect-square flex items-center justify-center overflow-hidden mb-4 rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-shop-purple/10 to-shop-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      className="object-contain w-full h-full z-10 p-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                </Link>

                {/* Product info */}
                <div className="px-2">
                  <Link href={`/products/${product._id}`} className="block">
                    <h3 className="font-display font-medium text-white text-lg mb-1 truncate hover:text-shop-purple transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-shop-purple font-bold mb-3">
                    ₹{product.price}
                  </p>

                  <div className="mb-3">
                    <button
                      onClick={() => toggleExpand(product._id)}
                      className="flex items-center text-xs text-shop-gray hover:text-white transition-colors"
                    >
                      {expandedProduct === product._id ? (
                        <>
                          Hide details{" "}
                          <ChevronDown className="h-3 w-3 ml-1 transform rotate-180 transition-transform" />
                        </>
                      ) : (
                        <>
                          Show details{" "}
                          <ChevronDown className="h-3 w-3 ml-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedProduct === product._id && (
                        <motion.p
                          className="text-xs text-shop-gray mt-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {product.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Add to cart button */}
                  <Button
                    className="w-full bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium mt-2"
                    onClick={() => onAddToCart(product._id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RelatedProducts;
