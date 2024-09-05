import Layout from "@/components/Layout";
import Pagination from "@/components/PaginationComponent";
import ProductTable from "@/components/ProductTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setTotalPages } from "@/redux/paginationSlice";
import axios from "axios";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Products() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const page = useSelector((state) => state.pagination.page);
  const dispatch = useDispatch();
  const totalPages = useSelector((state) => state.pagination.totalPages);

  const handleSelection = (value) => {
    setItemsPerPage(value);
    setLimit(value);
  };

  useEffect(() => {
    axios
      .get(`/api/products?page=${page}&limit=${limit}`)
      .then((response) => {
        dispatch(setTotalPages(response.data.totalPages));

        const products = response.data.products;

        const mappedProducts = products.map((product) => ({
          name: product.title,
          images: product.images,
          price: product.price,
        }));
        setProducts(mappedProducts);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message or log it
        console.error("Error fetching products:", error);
      });
  }, [limit, page, dispatch]);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4">
        {/* <!-- Button Group --> */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/products/new"
            className="bg-blue-800 text-white py-2 px-4 sm:py-1 sm:px-2 rounded-md text-center hover:bg-blue-700 transition-colors duration-300"
          >
            Add New Product
          </Link>
          <Link
            href="/products/csv"
            className="bg-blue-800 text-white py-2 px-4 sm:py-1 sm:px-2 rounded-md text-center hover:bg-blue-700 transition-colors duration-300"
          >
            Add Products Using CSV
          </Link>
        </div>

        {/* <!-- Pagination and Dropdown Menu --> */}
        <div className="flex flex-row sm:flex-row items-center justify-between gap-4 bg-gray-100 p-4 rounded-md shadow-md">
          <div className="text-gray-700 text-sm sm:text-base">
            Page {page} of {totalPages}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center border-2 border-teal-500 bg-white py-2 px-4 rounded-md text-teal-600 hover:bg-teal-50 transition-colors duration-300">
              <div className="flex items-center gap-2">
                {itemsPerPage}
                <ArrowDown size={18} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-teal-500 rounded-md shadow-lg">
              <DropdownMenuLabel className="text-teal-600 font-semibold">
                Items Per Page
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleSelection(10)}
                className="hover:bg-teal-50 transition-colors duration-200"
              >
                10
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelection(20)}
                className="hover:bg-teal-50 transition-colors duration-200"
              >
                20
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelection(50)}
                className="hover:bg-teal-50 transition-colors duration-200"
              >
                50
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelection(100)}
                className="hover:bg-teal-50 transition-colors duration-200"
              >
                100
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProductTable
        productData={products}
        className="w-full mt-5 border-collapse"
      />

      <Pagination />
    </Layout>
  );
}

export default Products;
