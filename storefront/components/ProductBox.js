import Link from "next/link";
import { useContext } from "react";

import { CartContext } from "./CartContext";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

function ProductBox({ _id, title, description, price, images }) {
  const { addProduct } = useContext(CartContext);
  const url = "/products/" + _id;

  return (
    <div
      key={_id}
      className="relative bg-yellow-100 shadow-lg rounded-lg overflow-hidden group transition-transform transform hover:scale-105"
    >
      {/* Image Container */}
      <Link
        href={url}
        className="relative block overflow-hidden rounded-lg bg-green-100"
      >
        <div className="aspect-w-4 aspect-h-3">
          <img
            src={images?.[0]}
            alt={title}
            className="object-contain w-full h-[300px] p-4"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300">
          <div className="text-xl font-semibold mb-2">₹{price}</div>
          <p className="text-sm mb-4">{description}</p>
        </div>
      </Link>

      {/* Title */}
      <div className="mt-4 flex justify-between items-center p-3">
        <Link
          href={url}
          className="p-2 text-gray-800 font-semibold text-xl hover:text-blue-600 transition-colors duration-300"
          aria-label={`Go to ${title}`}
        >
          {title}
        </Link>
        <Button
          className="text-green-500 flex items-center bg-transparent hover:bg-green-700 hover:text-white transition-colors duration-300"
          onClick={() => addProduct(_id)}
          aria-label={`Add ${title} to cart`}
        >
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
}

export default ProductBox;
