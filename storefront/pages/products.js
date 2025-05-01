import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Products({ products, currentPage, totalPages, limit }) {
  const router = useRouter();
  const [itemsPerPage, setItemsPerPage] = useState(limit);

  // Handle page change
  const handlePageChange = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      router.push(`/products?page=${page}&limit=${itemsPerPage}`);
    },
    [itemsPerPage, totalPages, router]
  );

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setItemsPerPage(newLimit);
    router.push(`/products?page=1&limit=${newLimit}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">All Products</h2>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-neutral-800 text-gray-300 shadow-md hover:shadow-lg transition">
            Show: {itemsPerPage} <ArrowDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 shadow-lg rounded-lg p-2">
            {[10, 20, 50, 100].map((limitOption) => (
              <DropdownMenuItem
                key={limitOption}
                className="cursor-pointer px-4 py-2 text-gray-300 hover:bg-neutral-700 rounded-md"
                onClick={() => handleLimitChange(limitOption)}
              >
                {limitOption} per page
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-6 bg-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 lg:px-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-neutral-800 shadow-md rounded-lg p-4 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.title}
              className="w-full h-48 object-contain rounded-md"
            />
            <Link href={`/products/${product._id}`}>
              <h3 className="text-lg font-semibold mt-2 text-gray-200">
                {product.title}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm truncate">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-bold text-green-400">
                ₹{product.price}
              </span>
              <Button className="text-blue-400 bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-300">
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="text-white bg-black">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  active={page + 1 === currentPage}
                  className="text-white hover:text-white"
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const db = await mongooseConnect();
  console.log(context);
  const page = parseInt(context.query.page) || 1;
  const limit = parseInt(context.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalProducts = await Product.countDocuments();
  console.log({ totalProducts });
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find({}, null, {
    sort: { _id: -1 },
    limit,
    skip,
  });

  console.log(products);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      currentPage: page,
      totalPages,
      limit,
    },
  };
}
