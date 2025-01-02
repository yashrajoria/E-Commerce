import { useState } from "react";

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <div>
      {/* Main Image Display */}
      <div className="text-center mb-4">
        <img
          src={activeImage}
          alt="Product"
          className="w-full max-h-[400px] object-contain mx-auto"
        />
      </div>

      {/* Thumbnail Image Buttons */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {images.map((image) => (
          <div
            key={image}
            onClick={() => setActiveImage(image)}
            className={`border-2 rounded-md cursor-pointer overflow-hidden ${
              image === activeImage ? "border-gray-300" : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt=""
              className="w-20 h-20 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
