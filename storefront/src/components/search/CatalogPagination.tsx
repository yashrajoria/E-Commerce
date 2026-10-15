import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

/** Props accepted by {@link CatalogPagination}. */
interface CatalogPaginationProps {
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages; the component renders nothing when this is 1 or fewer. */
  totalPages: number;
  /** Called with the requested page when the user picks a page, previous or next. */
  onPageChange: (page: number) => void;
  /**
   * Extra class names applied to the pagination root.
   *
   * @defaultValue "mt-8"
   */
  className?: string;
}

/**
 * Renders a windowed page list with first, previous, next and last controls for catalog listings.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * Shows a moving window of page numbers around `page` with ellipses, and dims the previous/next controls at the bounds; it does not clamp values, so the caller owns page bounds.
 *
 * @example
 * ```tsx
 * <CatalogPagination
 *   page={page}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
  className = "mt-8",
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {page > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
          </PaginationItem>
        )}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from(
          {
            length: Math.min(totalPages, page + 1) - Math.max(1, page - 1) + 1,
          },
          (_, index) => Math.max(1, page - 1) + index,
        ).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === page}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
