import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

function Featured({ product }) {
  const items = Array.isArray(product) ? product : product.items || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation
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

  const renderedItems = useMemo(
    () =>
      items.map((item) => (
        <div
          key={item._id || item.title}
          className="flex flex-row items-center flex-shrink-0 w-full text-center p-4 rounded-lg shadow-lg bg-white"
        >
          <a href={`/products/${item._id}`} className="w-full">
            <Image
              src={item.images[0]}
              alt={`Image of ${item.title}`}
              width="600"
              height="350"
              className="mx-auto rounded-lg object-contain h-[350px] transition-all duration-300 transform hover:scale-105"
              loading="lazy"
            />
          </a>
          <div className="flex flex-col mt-4 p-4">
            <h2 className="text-4xl font-semibold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              {item.title}
            </h2>
            <p className="mt-2 text-lg text-gray-600">{item.description}</p>
          </div>
        </div>
      )),
    [items]
  );

  // Handle automatic slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative bg-gradient-to-r from-pink-100 to-lavender-100 py-12">
      <ChevronLeft
        onClick={handlePrevious}
        className="bg-white text-gray-700 rounded-full p-3 absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-100 transition-colors"
        size={32}
      />
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {renderedItems}
        </div>
      </div>

      <ChevronRight
        onClick={handleNext}
        className="bg-white text-gray-700 rounded-full p-3 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-100 transition-colors"
        size={32}
      />

      <div className="flex justify-center mt-6 space-x-3 pb-4 gap-4">
        {items.map((_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full ${
              index === currentIndex
                ? "bg-gradient-to-r from-pink-500 to-purple-600"
                : "bg-gray-300 hover:bg-gray-400"
            } transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  );
}

export default Featured;
