import { EditIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductTable = ({ productData }) => {
  const router = useRouter();
  const { pathname } = router;

  // Initial path state
  const [isProductPage, setIsProductPage] = useState(false);

  useEffect(() => {
    // Update path state based on pathname
    setIsProductPage(pathname === "/products");
  }, [pathname]);

  if (!productData || productData.length === 0) {
    return <p>No data found</p>;
  }

  // Define column headers based on the page
  const productKeys = Object.keys(productData[0]);
  const keyDisplayNames = isProductPage
    ? {
        title: "Product Name",
        images: "Product Image",
        price: "Product Price (₹)",
      }
    : {
        product_name: "Product Name",
        product_image: "Product Image",
        product_description: "Product Description",
        product_price: "Product Price ($)",
      };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full mt-5">
        <thead className="text-xs sm:text-sm text-gray-800 uppercase bg-gray-100 border-b border-gray-300">
          <tr>
            {productKeys.map((productKey) => (
              <th
                key={productKey}
                className="py-2 px-3 sm:py-3 sm:px-4 text-left"
              >
                {keyDisplayNames[productKey] || productKey}{" "}
              </th>
            ))}
            {isProductPage && (
              <th className="py-2 px-3 sm:py-3 sm:px-4 text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {productData.map((product, index) => (
            <tr
              key={index}
              className="border-b border-gray-200" // Added bottom border for differentiation
            >
              {productKeys.map((key) => (
                <td key={key} className="py-2 px-3 sm:py-3 sm:px-4">
                  {key === "images" || key === "product_image" ? (
                    <img
                      src={
                        Array.isArray(product[key])
                          ? product[key][0]
                          : product[key]
                      } // Check if it's an array, otherwise use the value directly
                      alt={product.product_name}
                      style={{ width: "80px", height: "auto" }} // Consistent image width, maintain aspect ratio
                      className="sm:w-24" // Larger width on larger screens
                    />
                  ) : (
                    product[key]
                  )}
                </td>
              ))}

              {isProductPage && (
                <td className="py-2 px-3 sm:py-3 sm:px-4 flex h-full items-center gap-2">
                  <Link
                    href={`/products/edit/${product._id}`}
                    className="bg-blue-900 text-white px-2 sm:px-3 py-1 rounded-md inline-flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <EditIcon />
                    Edit
                  </Link>
                  <Link
                    href={`/products/delete/${product._id}`}
                    className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md inline-flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Trash2 size={20} />
                    Delete
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
