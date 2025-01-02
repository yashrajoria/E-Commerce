import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";

export default function Home({ featuredProduct, recentProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={recentProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();

    const featuredProduct = await Product.find({}, null, {
      sort: { _id: -1 },
      limit: 5,
    }).lean(); // Convert Mongoose documents to plain JavaScript objects

    const recentProducts = await Product.find({}, null, {
      sort: { _id: -1 },
      limit: 10,
    }).lean();

    // Return serialized data
    return {
      props: {
        featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
        recentProducts: JSON.parse(JSON.stringify(recentProducts)),
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error and return an empty array or some default data
    return {
      props: {
        featuredProduct: [],
        recentProducts: [],
      },
    };
  }
}
