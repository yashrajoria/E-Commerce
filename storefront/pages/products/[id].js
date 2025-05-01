import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";
import Navbar from "@/components/Navbar";
import ProductImages from "@/components/ProductImages";
import RelatedProducts from "@/components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext } from "react";
// import { toast } from "sonner";

export default function ProductPage({ product, category }) {
  const { addProduct } = useContext(CartContext);

  const handleAddToCart = (productId) => {
    addProduct(productId);
    // toast.success("Product added to cart!");
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-gradient-to-b from-shop-darker to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    href="/"
                    className="text-shop-gray hover:text-shop-purple transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-shop-gray">/</span>
                    <Link
                      href="/products"
                      className="text-shop-gray hover:text-shop-purple transition-colors"
                    >
                      Products
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-shop-gray">/</span>
                    <span className="text-shop-purple truncate max-w-[200px]">
                      {product.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12">
            {/* Product Images */}
            <motion.div
              className="glass-card rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImages images={product.images} />
            </motion.div>

            {/* Product Details */}
            <motion.div
              className="flex flex-col justify-between text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <motion.h1
                  className="text-3xl md:text-4xl font-display font-bold mb-2 gradient-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {product.title}
                </motion.h1>
                {/* 
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-shop-purple"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-shop-gray text-sm">(24 reviews)</span>
                </div> */}

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-shop-gray text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.properties &&
                  Object.entries(product.properties).length > 0 && (
                    <div className="border-t border-white/10 pt-6 mb-6">
                      <h3 className="text-xl font-semibold mb-3">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.properties).map(
                          ([key, value]) => (
                            <div key={key} className="flex">
                              <div className="w-1/2 font-medium text-shop-gray">
                                {key}:
                              </div>
                              <div className="w-1/2 text-white">{value}</div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-display font-semibold text-shop-purple">
                    ₹{product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xl text-shop-gray line-through">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>

                <motion.div
                  className="flex space-x-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleAddToCart(product._id)}
                    className="button-glow bg-gradient-to-r from-shop-purple to-shop-blue text-white px-6 py-3 font-semibold text-lg"
                    size="lg"
                  >
                    <CartIcon />
                    <span className="ml-2">Add to Cart</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={category} onAddToCart={handleAddToCart} />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  const category = await Product.aggregate([
    { $match: { category: product.category } },
  ]);

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      category: JSON.parse(JSON.stringify(category)),
    },
  };
}
