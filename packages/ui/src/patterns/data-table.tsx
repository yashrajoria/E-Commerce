import * as React from "react";
import { cn } from "../lib/utils";
import { EmptyState } from "./empty-state";
import { LoadingSpinner } from "./loading-spinner";

/** Describes a single column of {@link DataTable}. */
export interface Column<T> {
  /** Unique identifier for the column, used as the React key of its header and body cells. */
  key: string;
  /** Content rendered inside the column's `th` header cell. */
  header: React.ReactNode;
  /**
   * Renders the body cell for one row.
   *
   * @param row - The row record currently being rendered.
   * @param index - Zero-based position of the row within `data`.
   * @returns The cell content for the given row.
   */
  cell: (row: T, index: number) => React.ReactNode;
  /** Text alignment applied to the column's header and body cells; defaults to left alignment. */
  align?: "left" | "center" | "right";
  /** CSS width for the column's header cell, e.g. `"160px"` or `"20%"`. */
  width?: string;
  /** Extra classes merged onto the column's header and body cells. */
  className?: string;
}

/** Props accepted by {@link DataTable}. */
export interface DataTableProps<T> {
  /** Column definitions, in render order from left to right. */
  columns: Column<T>[];
  /** Rows to render; an empty array shows the empty state. */
  data: T[];
  /**
   * Derives the React key for each row.
   *
   * @param row - The row record.
   * @param index - Zero-based position of the row within `data`.
   * @returns A string that is unique across the rendered rows.
   */
  keyExtractor: (row: T, index: number) => string;
  /**
   * When `true`, replaces the table with a centred spinner and loading caption.
   *
   * @defaultValue false
   */
  isLoading?: boolean;
  /**
   * Title shown by the empty state when `data` is empty.
   *
   * @defaultValue "No records found"
   */
  emptyTitle?: string;
  /**
   * Description shown by the empty state when `data` is empty.
   *
   * @defaultValue "There are no entries to display matching the current criteria."
   */
  emptyDescription?: string;
  /**
   * Makes rows interactive; called with the clicked row and also adds a pointer cursor.
   *
   * @param row - The row record that was clicked.
   */
  onRowClick?: (row: T) => void;
  /** Extra classes merged onto the table's outer container. */
  className?: string;
  /**
   * Tightens vertical cell padding for denser tables.
   *
   * @defaultValue false
   */
  dense?: boolean;
}

/**
 * Renders a generic data table with column definitions, loading and empty states.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={orders}
 *   keyExtractor={(order) => order.id}
 *   columns={[
 *     { key: "ref", header: "Order", cell: (order) => order.reference },
 *     { key: "total", header: "Total", align: "right", cell: (order) => formatCurrency(order.total) },
 *   ]}
 *   onRowClick={(order) => router.push(`/orders/${order.id}`)}
 * />
 * ```
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries to display matching the current criteria.",
  onRowClick,
  className,
  dense = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-card p-8">
        <LoadingSpinner size="lg" />
        <span className="mt-3 text-xs text-muted-foreground font-medium">
          Loading records...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className="rounded-xl border border-border bg-card"
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-2xs",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-border bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-3",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.map((row, index) => {
              const key = keyExtractor(row, index);
              const isClickable = Boolean(onRowClick);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    isClickable && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 text-foreground",
                        dense ? "py-2.5" : "py-3.5",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.className,
                      )}
                    >
                      {col.cell(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
