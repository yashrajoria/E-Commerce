import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products/?id=" + id).then(
      (response) => {
        setProductDetails(response.data);
      },
      (error) => {
        console.error("Error fetching product details:", error);
      }
    );
  }, [id]);

  function goBack() {
    router.push("/products");
  }
  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-blue-900 text-xl font-bold justify-center flex">
        {" "}
        Do you really want to delete {productDetails?.title}?
      </h1>
      <div className="flex gap-2 mt-3 items-center justify-center">
        <button
          className="bg-red-700 py-2 px-4 rounded-md text-white"
          onClick={deleteProduct}
        >
          Yes
        </button>
        <button
          className="bg-gray-500 py-2 px-4 rounded-md text-white"
          onClick={() => {
            goBack();
          }}
        >
          No
        </button>
      </div>
    </Layout>
  );
}
