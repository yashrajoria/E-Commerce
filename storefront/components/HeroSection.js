import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// const products = [
//   {
//     id: 1,
//     name: "Samsung Galaxy S8",
//     image: "/lovable-uploads/e736d711-cb8a-4fd3-b8fa-dc2ebb4800b2.png",
//     description:
//       "The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.",
//   },
//   {
//     id: 2,
//     name: "Samsung Galaxy S10",
//     image: "/placeholder.svg",
//     description:
//       "Experience the next generation of mobile technology with the Galaxy S10. Featuring a dynamic AMOLED display, multiple camera system, and all-day battery life.",
//   },
//   {
//     id: 3,
//     name: "iPhone 13 Pro",
//     image: "/placeholder.svg",
//     description:
//       "The iPhone 13 Pro raises the bar with its ProMotion display, advanced camera system for stunning photos and cinematic videos, and exceptional battery life.",
//   },
// ];

const HeroSection = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  console.log(products[currentIndex].images[0]);

  return (
    <motion.div
      className="relative min-h-screen pt-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] bg-glow-gradient opacity-20 animate-pulse-glow"></div>
      </div>

      <div className="container mx-auto px-4 pt-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-20">
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            key={`${products[currentIndex].id}-image`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative w-64 h-64 md:w-96 md:h-96"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-shop-purple/20 to-shop-blue/20 rounded-full blur-3xl -z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
              <img
                src={products[currentIndex].images[0]}
                alt={products[currentIndex].name}
                className="object-contain w-full h-full"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            key={`${products[currentIndex].id}-text`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {products[currentIndex].name}
            </motion.h2>

            <motion.p
              className="text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {products[currentIndex].description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button className="bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium px-8 py-6">
                Shop Now
              </Button>

              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {products.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? "bg-shop-purple w-6" : "bg-white/30"
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
