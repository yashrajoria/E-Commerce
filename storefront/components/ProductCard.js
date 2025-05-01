import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import Link from "next/link";

const ProductCard = ({ id, name, price, image, description }) => {
  console.log(id);
  console.log({ name });
  const [expanded, setExpanded] = useState(false);
  const { addProduct } = useContext(CartContext);

  // console.log(image[0]);
  return (
    <motion.div
      className="product-card group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative p-4 pb-0 overflow-hidden">
        {/* Product image with background glow */}
        <div className="relative aspect-square flex items-center justify-center overflow-hidden mb-4 rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-shop-purple/10 to-shop-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <motion.img
            src={image[0]}
            alt={name}
            className="object-contain w-full h-full z-10 p-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>

        {/* Product info */}
        <div className="px-2">
          <Link href={`/products/${id}`}>
            <h3 className="font-display font-medium text-white text-lg mb-1 truncate">
              {name}
            </h3>
          </Link>
          <p className="text-shop-purple font-bold mb-3">{price}</p>

          {description && (
            <div className="mb-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-xs text-shop-gray hover:text-white transition-colors"
              >
                {expanded ? (
                  <>
                    Hide details <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    Show details <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </button>

              {expanded && (
                <motion.p
                  className="text-xs text-shop-gray mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {description}
                </motion.p>
              )}
            </div>
          )}

          {/* Add to cart button */}
          <Button
            onClick={() => addProduct(id)}
            className="w-full bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium mt-2"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
