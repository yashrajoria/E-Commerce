import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ProductEditModal from "@/pages/products/edit-product-modal";
import { useState } from "react";
// import Image from "next/image";

type Product = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  images: string[];
  price: number;
  description: string;
};
type Category = {
  _id: string;
  name: string;
};
interface ProductCardProps {
  product: Product;
  category: Category;
}

const ProductCard = ({ product, category }: ProductCardProps) => {
  const [isOpenEditModel, setIsOpenEditModel] = useState(false);
  const openEditModal = (product: Product) => {
    // Function to open the edit modal
    setIsOpenEditModel(true);
  };
  const closeEditModal = () => {
    setIsOpenEditModel(false);
  };

  console.log({ category });
  console.log({ product });
  return (
    <>
      <Card className="glass-effect overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product?.images[0] ? product?.images[0] : "/no-image.png"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            width={500}
            height={500}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={() => {
                openEditModal(product);
              }}
            >
              <Edit size={18} />
            </Button>
          </div>
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                product?.quantity > 0
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-amber-500/20 text-amber-500"
              }`}
            >
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <span className="text-sm font-semibold">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{product.category}</span>
            <span>{product.quantity} in stock</span>
          </div>
        </CardContent>
      </Card>
      {/* Edit Product Modal */}
      {isOpenEditModel && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeEditModal}
          ></div>

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
              <ProductEditModal
                isOpen={isOpenEditModel}
                onClose={closeEditModal}
                product={product}
                categories={category}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductCard;
