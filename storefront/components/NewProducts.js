import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export default function NewProducts({ products }) {
  const { addProduct } = useContext(CartContext);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const toggleExpand = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  return (
    <div className="p-6 bg-neutral-900">
      <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        New Arrivals
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products?.map(({ _id, title, description, price, images }) => (
          <div
            key={_id}
            className="relative bg-neutral-800 shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Image & Toggle Button */}
            <button
              onClick={() => toggleExpand(_id)}
              className="block w-full text-left"
            >
              <div className="relative w-full h-[300px] bg-neutral-700 flex items-center justify-center">
                <img
                  src={images?.[0]}
                  alt={title}
                  className="object-contain w-full h-full p-4 transition-transform duration-300"
                />
              </div>
            </button>

            {/* Title & Cart Button */}
            <div className="flex justify-between items-center p-4">
              <div>
                <Link
                  href={`/products/${_id}`}
                  className="text-white font-semibold text-lg hover:text-blue-400 transition"
                  aria-label={`Go to ${title}`}
                >
                  {title}
                </Link>
                <div className="text-blue-300 text-sm">₹{price}</div>
              </div>
              <Button
                className="text-blue-400 bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-300"
                onClick={() => addProduct(_id)}
                aria-label={`Add ${title} to cart`}
              >
                <ShoppingCart />
              </Button>
            </div>

            {/* Expandable Description Section */}
            <motion.div
              initial={false}
              animate={{
                height: expandedProduct === _id ? "auto" : 0,
                opacity: expandedProduct === _id ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden px-4 text-gray-300"
            >
              <p className="text-sm py-3">{description}</p>
            </motion.div>

            {/* Toggle Icon - Positioned Separately */}
            <div className="flex justify-center p-3">
              <button
                onClick={() => toggleExpand(_id)}
                className="p-2 text-gray-400 hover:text-blue-400 transition"
              >
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    expandedProduct === _id ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
