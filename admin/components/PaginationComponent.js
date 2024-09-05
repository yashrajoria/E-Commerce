import { nextPage, previousPage, setPage } from "@/redux/paginationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const Pagination = () => {
  const page = useSelector((state) => state.pagination.page);
  const totalPages = useSelector((state) => state.pagination.totalPages);
  const dispatch = useDispatch();

  const handlePrevious = () => {
    if (page > 1) dispatch(previousPage());
  };

  const handleNext = () => {
    if (page < totalPages) dispatch(nextPage());
  };

  return (
    <div className="mt-7">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className="cursor-pointer"
          />
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2">
          {/* Previous Page Link */}
          {page > 1 && (
            <PaginationLink
              className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors duration-200"
              onClick={() => dispatch(setPage(page - 1))}
            >
              {page - 1}
            </PaginationLink>
          )}

          {/* Current Page Link */}
          <PaginationLink
            className="px-3 py-1 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600 transition-colors duration-200"
            onClick={() => dispatch(setPage(page))}
          >
            {page}
          </PaginationLink>

          {/* Next Page Link */}
          {page < totalPages && (
            <PaginationLink
              className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors duration-200"
              onClick={() => dispatch(setPage(page + 1))}
            >
              {page + 1}
            </PaginationLink>
          )}

          {/* Ellipsis */}
          {totalPages > 1 && page < totalPages - 1 && (
            <PaginationEllipsis className="text-gray-500" />
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={handleNext} className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </div>
  );
};

export default Pagination;
