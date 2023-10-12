import { Inter } from "next/font/google";
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
  const featuredProductId = "64cb9fab679d6748d40a04cc";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const recentProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });

  return {
    //Converting this to string as mongoDB does not serialize
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      recentProducts: JSON.parse(JSON.stringify(recentProducts)),
    },
  };
}
