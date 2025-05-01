import { useContext, useEffect } from "react";
import { motion } from "framer-motion";

import { CartContext } from "@/components/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";

export default function Home({ featuredProduct, recentProducts }) {
  const { cartProducts } = useContext(CartContext);

  useEffect(() => {
    console.log(cartProducts);
  }, [cartProducts]);

  return (
    <motion.div
      className="min-h-screen bg-shop-dark/95 text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar cartProducts={cartProducts} />

      <main className="pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <HeroSection products={recentProducts} />

        {/* Once styled properly, enable these: */}
        <div className="mt-12">
          <ProductSection title="New Arrivals" products={recentProducts} />
        </div>

        <div className="mt-12">
          <ProductSection title="Trending Now" products={featuredProduct} />
        </div>
      </main>
    </motion.div>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();

    const featuredProduct = await Product.find({}, null, {
      sort: { _id: -1 },
      limit: 5,
    }).lean();
    console.log({ Product });
    const recentProducts = await Product.find({}, null, {
      sort: { _id: -1 },
      limit: 10,
    }).lean();
    console.log(featuredProduct);
    return {
      props: {
        featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
        recentProducts: JSON.parse(JSON.stringify(recentProducts)),
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        featuredProduct: [],
        recentProducts: [],
      },
    };
  }
}
