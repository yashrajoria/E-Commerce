import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { useContext } from "react";

export default function CategoryPage({ category, products }) {
  const { addProduct } = useContext(CartContext);

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12">
          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <Title className="text-3xl font-bold">{category.name}</Title>
              <p className="text-white text-lg mt-4">{category.description}</p>
            </div>

            <div className="flex items-center gap-6 mt-6">
              {/* <Button
                onClick={() => addProduct(category._id)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                <CartIcon />
                <span>Add to cart</span>
              </Button> */}
            </div>
          </div>
        </div>

        {/* Render Products */}
        <div className="mt-12">
          <ProductsGrid products={products} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();

  const { id } = context.query;

  const category = await Category.findById(id);
  const products = await Product.find({ category: id });

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
