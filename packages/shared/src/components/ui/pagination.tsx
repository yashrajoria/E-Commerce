"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "../../utils";
import { Button, buttonVariants } from "./button";

/**
 * Renders the pagination landmark that wraps the page controls.
 *
 * @remarks
 * Client Component — declares `"use client"`. Compose it with
 * {@link PaginationContent}, {@link PaginationItem} and the link components.
 *
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="/products?page=1" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/products?page=2" isActive>
 *         2
 *       </PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="/products?page=3" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * Renders the horizontal list holding {@link PaginationItem} entries.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationContent>
 *   <PaginationItem>
 *     <PaginationLink href="/products?page=1">1</PaginationLink>
 *   </PaginationItem>
 * </PaginationContent>
 * ```
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * Renders a list item wrapper for a single pagination control.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationItem>
 *   <PaginationLink href="/products?page=2">2</PaginationLink>
 * </PaginationItem>
 * ```
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

/**
 * Props accepted by {@link PaginationLink}.
 *
 * @remarks
 * The `size` prop reuses the button sizes from {@link Button} and defaults to
 * `"icon"` when unset.
 */
type PaginationLinkProps = {
  /** Marks this link as the current page — sets `aria-current="page"` and the active button style. */
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

/**
 * Renders a styled anchor for a page number.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationLink href="/products?page=2" isActive>
 *   2
 * </PaginationLink>
 * ```
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the previous-page link with a chevron and label.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationPrevious href="/products?page=1" />
 * ```
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

/**
 * Renders the next-page link with a chevron and label.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationNext href="/products?page=3" />
 * ```
 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

/**
 * Renders a non-interactive ellipsis standing in for skipped page ranges.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PaginationEllipsis />
 * ```
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
