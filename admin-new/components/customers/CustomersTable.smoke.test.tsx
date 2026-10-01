import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { formatRelativeDate } from "@/lib/utils";
import type { Customer, CustomerFilter } from "@/types/customers";

const customers: Customer[] = [
  {
    id: "c1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    phone: "+44 7700 900123",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "c2",
    name: "Morgan Lee",
    email: "morgan@example.com",
    role: "admin",
    createdAt: "2025-11-02T08:30:00Z",
  },
];

const baseFilter: CustomerFilter = {
  search: "",
  role: "all",
  sortBy: "name",
  sortOrder: "asc",
};

const renderTable = (
  onSort = vi.fn(),
  onCustomerClick = vi.fn(),
  filter = baseFilter,
) => {
  render(
    <CustomersTable
      customers={customers}
      filter={filter}
      onSort={onSort}
      onCustomerClick={onCustomerClick}
    />,
  );
  return { onSort, onCustomerClick };
};

describe("CustomersTable", () => {
  it("renders identity columns for every customer", () => {
    renderTable();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Morgan Lee")).toBeInTheDocument();
    expect(screen.getByText("morgan@example.com")).toBeInTheDocument();

    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("+44 7700 900123")).toBeInTheDocument();
  });

  it("shows a placeholder when a customer has no phone", () => {
    renderTable();
    expect(screen.getAllByText("—")).toHaveLength(1);
  });

  it("renders a gradient initials avatar", () => {
    renderTable();
    expect(screen.getByText("AJ")).toBeInTheDocument();
    expect(screen.getByText("ML")).toBeInTheDocument();
  });

  it("tells the page which column to sort", () => {
    const { onSort } = renderTable();

    fireEvent.click(screen.getByRole("button", { name: /email/i }));
    expect(onSort).toHaveBeenCalledWith("email");

    fireEvent.click(screen.getByRole("button", { name: /joined/i }));
    expect(onSort).toHaveBeenCalledWith("createdAt");
  });

  it("opens the detail view when a row is clicked", () => {
    const { onCustomerClick } = renderTable();

    fireEvent.click(screen.getByText("alice@example.com"));
    expect(onCustomerClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "c1", role: "user" }),
    );
  });

  it("shows the active sort direction on the sorted column only", () => {
    render(
      <CustomersTable
        customers={customers}
        filter={{ ...baseFilter, sortBy: "email", sortOrder: "desc" }}
        onSort={vi.fn()}
        onCustomerClick={vi.fn()}
      />,
    );

    expect(
      screen
        .getByRole("button", { name: /email/i })
        .querySelector(".lucide-arrow-down"),
    ).not.toBeNull();
    expect(
      screen
        .getByRole("button", { name: /^name/i })
        .querySelector(".lucide-arrow-up-down"),
    ).not.toBeNull();
  });
});

describe("formatRelativeDate", () => {
  it("falls back for missing or invalid input", () => {
    expect(formatRelativeDate(undefined)).toBe("N/A");
    expect(formatRelativeDate("not-a-date")).toBe("N/A");
  });

  it("returns a human readable age", () => {
    const age = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(age)).toMatch(/month/);
  });
});
