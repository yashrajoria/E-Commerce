import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductSection = ({ title, products }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  console.log({ products });
  console.log(title);
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold relative inline-block gradient-text">
            {title}
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-shop-purple to-shop-blue"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.title}
              price={product.price}
              image={product.images}
              description={product.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;
