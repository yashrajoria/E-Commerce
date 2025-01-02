import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";
import { useState } from "react";

export default function Products({ products, currentPage, totalPages, limit }) {
  const router = useRouter();
  console.log({ totalPages });
  console.log({ currentPage });
  const [itemsPerPage, setItemsPerPage] = useState(limit);

  const handlePageChange = (page) => {
    router.push(`/products?page=${page}&limit=${itemsPerPage}`);
  };

  const handleLimitChange = (newLimit) => {
    setItemsPerPage(newLimit);
    router.push(`/products?page=1&limit=${newLimit}`); // Reset to page 1 when changing limit
  };

  return (
    <>
      <Header />
      <div className="flex justify-between items-center mb-4 flex-row-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-black flex gap-2 items-center border mt-4 px-4 py-2 rounded-md ">
            {itemsPerPage} <ArrowDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[10, 20, 50, 100].map((limitOption) => (
              <DropdownMenuItem
                className="w-full"
                key={limitOption}
                onClick={() => handleLimitChange(limitOption)}
              >
                {limitOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductsGrid products={products} />

      <Pagination className="text-black mt-4">
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 && (
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            )}
          </PaginationItem>
          {[...Array(totalPages).keys()].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(page + 1)}
                active={page + 1 === currentPage}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            {currentPage < totalPages && (
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();

  // Get current page and limit from query, default to 1 and 10 if not provided
  const page = parseInt(context.query.page) || 1;
  const limit = parseInt(context.query.limit) || 10; // Items per page
  const skip = (page - 1) * limit;

  // Get total product count for pagination
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch products for the current page
  const products = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: limit,
    skip: skip,
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
    },
  };
}
