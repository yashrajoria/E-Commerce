import * as React from "react";
import { cn } from "../lib/utils";
import { EmptyState } from "./empty-state";
import { LoadingSpinner } from "./loading-spinner";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  dense?: boolean;
}

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
        <span className="mt-3 text-xs text-muted-foreground font-medium">Loading records...</span>
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
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-2xs", className)}>
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
                    col.className
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
                    isClickable && "cursor-pointer"
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
                        col.className
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
