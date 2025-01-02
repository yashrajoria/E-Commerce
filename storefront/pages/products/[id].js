import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import CartIcon from "@/components/icons/CartIcon";
import ProductBox from "@/components/ProductBox";
import ProductImages from "@/components/ProductImages";
import { Button } from "@/components/ui/button";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useContext, useState } from "react";

export default function ProductPage({ product, category }) {
  const { addProduct } = useContext(CartContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex + 5 < category.length) {
      setCurrentIndex((prev) => prev + 5);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 5 >= 0) {
      setCurrentIndex((prev) => prev - 5);
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12">
          {/* Product Images */}
          <div className="bg-white shadow-xl rounded-lg p-4 hover:shadow-2xl transition-shadow duration-300">
            <ProductImages images={product.images} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {product.title}
              </h2>
              <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="text-3xl font-semibold text-blue-700">
                ₹{product.price}
              </div>
              <Button
                onClick={() => addProduct(product._id)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <CartIcon />
                <span>Add to cart</span>
              </Button>
            </div>
          </div>
        </div>

        <h3 className="mt-10 text-3xl font-bold text-center p-4 text-gray-800">
          Related Products
        </h3>

        <div className="flex items-center justify-center space-x-4">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition-all duration-300"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}

          <div className="flex flex-grow flex-wrap gap-8 items-center justify-center">
            {category.slice(currentIndex, currentIndex + 5).map((c) => (
              <div key={c._id} className="w-full sm:w-1/2 lg:w-1/5">
                <ProductBox {...c} />
              </div>
            ))}
          </div>

          {currentIndex + 5 < category.length && (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition-all duration-300"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // Connect to MongoDB
  await mongooseConnect();

  // Extract product ID from query parameters
  const { id } = context.query;

  // Find the product by ID
  const product = await Product.findById(id);

  // Match the product's category with the `_id` field of the Category collection
  const category = await Product.aggregate([
    {
      $match: {
        category: product.category,
      },
    },
  ]);

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      category: JSON.parse(JSON.stringify(category)), // Pass category to props if needed
    },
  };
}
