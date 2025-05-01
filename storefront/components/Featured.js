"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Featured({ product }) {
  const items = Array.isArray(product) ? product : product.items || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
      {/* Left Button */}
      <Button
        onClick={handlePrevious}
        className="absolute left-6 z-10 bg-gray-900/80 hover:bg-gray-700 rounded-full p-3"
      >
        <ChevronLeft size={32} />
      </Button>

      {/* Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {items.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <motion.div
              key={item._id || item.title}
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.9,
                x: isActive ? 0 : 50,
                filter: isActive ? "blur(0px)" : "blur(4px)",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute w-full flex flex-row items-center justify-center transition-all text-center ${
                isActive ? "z-10" : "z-0"
              }`}
            >
              <Link href={`/products/${item._id}`} className="relative">
                <motion.div className="relative w-[80%] md:w-[40%] transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={600} // Ensuring a fixed width
                    height={400} // Ensuring a fixed height
                    className="rounded-xl shadow-2xl object-contain w-[500px] h-[350px]"
                  />
                </motion.div>
              </Link>

              <motion.div
                className="mt-6 max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  {item.title}
                </h2>
                <p className="text-gray-400 mt-2 text-lg">{item.description}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Button */}
      <Button
        onClick={handleNext}
        className="absolute right-6 z-10 bg-gray-900/80 hover:bg-gray-700 rounded-full p-3"
      >
        <ChevronRight size={32} />
      </Button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 flex gap-2">
        {items.map((_, index) => (
          <motion.div
            key={index}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
              index === currentIndex
                ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-125"
                : "bg-gray-500 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
