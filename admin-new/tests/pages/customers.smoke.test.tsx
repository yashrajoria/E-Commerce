import React from "react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import CustomersPage from "@/pages/customers";
import { useAdminCustomers } from "@/lib/hooks/useAdminData";
import type { AdminUserRecord } from "@/types/customers";

vi.mock("@/components/layout/PageLayout", () => ({
  pageItem: undefined,
  pageContainer: undefined,
  default: ({
    title,
    headerActions,
    children,
  }: {
    title: string;
    headerActions?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      {headerActions}
      {children}
    </div>
  ),
}));

vi.mock("@/lib/hooks/useAdminData", () => ({
  useAdminCustomers: vi.fn(),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ isReady: true, query: {}, push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

/** Age in whole days → ISO timestamp. */
const ago = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

/**
 * Mirrors the real `GET /bff/admin/users` payload: 14 accounts,
 * 2 staff, 8 with a phone, 9 joined in the last 30 days.
 */
const RECORDS: AdminUserRecord[] = [
  { id: "u00", name: "Administrator", email: "admin@example.com", role: "admin", phone_number: null, created_at: new Date().toISOString() },
  { id: "u01", name: "Alice Johnson", email: "alice.johnson@shopswift-demo.test", role: "user", phone_number: "+44 7700 900101", created_at: ago(90) },
  { id: "u02", name: "Ben Carter", email: "ben.carter@shopswift-demo.test", role: "user", phone_number: null, created_at: ago(75) },
  { id: "u03", name: "Chloe Nguyen", email: "chloe.nguyen@shopswift-demo.test", role: "user", phone_number: "+44 7700 900103", created_at: ago(58) },
  { id: "u04", name: "Daniel Smith", email: "daniel.smith@shopswift-demo.test", role: "user", phone_number: null, created_at: ago(45) },
  { id: "u05", name: "Elena Ruiz", email: "elena.ruiz@shopswift-demo.test", role: "user", phone_number: "+44 7700 900105", created_at: ago(29) },
  { id: "u06", name: "Farah Khan", email: "farah.khan@shopswift-demo.test", role: "user", phone_number: "+44 7700 900106", created_at: ago(21) },
  { id: "u07", name: "George Mensah", email: "george.mensah@shopswift-demo.test", role: "user", phone_number: null, created_at: ago(14) },
  { id: "u08", name: "Hana Suzuki", email: "hana.suzuki@shopswift-demo.test", role: "user", phone_number: "+44 7700 900108", created_at: ago(9) },
  { id: "u09", name: "Igor Petrov", email: "igor.petrov@shopswift-demo.test", role: "user", phone_number: null, created_at: ago(5) },
  { id: "u10", name: "Julia Rossi", email: "julia.rossi@shopswift-demo.test", role: "user", phone_number: "+44 7700 900110", created_at: ago(2) },
  { id: "u11", name: "Kenji Tanaka", email: "kenji.tanaka@shopswift-demo.test", role: "user", phone_number: "+44 7700 900111", created_at: ago(0.5) },
  { id: "u12", name: "Ops Manager", email: "ops.manager@shopswift-demo.test", role: "admin", phone_number: "+44 7700 900198", created_at: ago(59) },
  { id: "u13", name: "Sofia Mendez", email: "sofia.mendez@shopswift-demo.test", role: "user", phone_number: null, created_at: ago(0.1) },
];

const renderPage = () => render(<CustomersPage />);

/** Value sits in the <p> directly after the card title. */
const kpi = (title: string) =>
  screen.getByText(title).nextElementSibling?.textContent;

const dataRows = () => screen.getAllByRole("row").slice(1);

beforeEach(() => {
  (useAdminCustomers as Mock).mockReturnValue({
    customers: RECORDS,
    meta: { page: 1, page_size: 100, total: 14, total_pages: 1 },
    error: null,
    isLoading: false,
    mutate: vi.fn(),
  });
});

describe("Customers page", () => {
  it("derives the KPI strip from the customer list", () => {
    renderPage();

    expect(kpi("Total Customers")).toBe("14");
    expect(kpi("New This Month")).toBe("9");
    expect(kpi("With Phone")).toBe("8");
    expect(kpi("Staff Accounts")).toBe("2");
    expect(screen.getByText("+200%")).toBeInTheDocument();
    expect(screen.getByText("vs previous 30 days")).toBeInTheDocument();
  });

  it("lists the directory sorted by name and paginates at 10 rows", () => {
    renderPage();

    expect(dataRows()).toHaveLength(10);
    expect(dataRows()[0]).toHaveTextContent("Administrator");
    expect(dataRows()[9]).toHaveTextContent("Igor Petrov");

    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(dataRows()).toHaveLength(4);
    expect(dataRows()[0]).toHaveTextContent("Julia Rossi");
    expect(dataRows()[3]).toHaveTextContent("Sofia Mendez");
  });

  it("re-sorts when a column header is clicked", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /joined/i }));
    await waitFor(() =>
      expect(dataRows()[0]).toHaveTextContent("Alice Johnson"),
    );

    fireEvent.click(screen.getByRole("button", { name: /joined/i }));
    await waitFor(() =>
      expect(dataRows()[0]).toHaveTextContent("Administrator"),
    );
  });

  it("searches across name, email and phone", async () => {
    renderPage();

    fireEvent.change(
      screen.getByPlaceholderText("Search by name, email or phone..."),
      { target: { value: "hana" } },
    );

    await waitFor(() => expect(dataRows()).toHaveLength(1));
    expect(dataRows()[0]).toHaveTextContent("Hana Suzuki");
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("shows a filtered empty state when nothing matches", async () => {
    renderPage();

    fireEvent.change(
      screen.getByPlaceholderText("Search by name, email or phone..."),
      { target: { value: "nobody-here" } },
    );

    expect(
      await screen.findByText("No customers match your filters"),
    ).toBeInTheDocument();
  });

  it("opens the read-only detail view for a customer", async () => {
    renderPage();

    fireEvent.click(screen.getByText("alice.johnson@shopswift-demo.test"));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Customer details")).toBeInTheDocument();
    expect(within(dialog).getByText("Alice Johnson")).toBeInTheDocument();
    expect(within(dialog).getByText("+44 7700 900101")).toBeInTheDocument();
    expect(
      within(dialog).queryByText("No phone on file"),
    ).not.toBeInTheDocument();

    fireEvent.click(within(dialog).getAllByRole("button", { name: /^close$/i })[0]);
    await waitFor(() =>
      expect(screen.queryByText("Customer details")).not.toBeInTheDocument(),
    );
  });

  it("opens the add-customer form", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /add customer/i }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Add customer" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/full name/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /^add customer$/i }),
    ).toBeDisabled();
  });

  it("shows a skeleton while loading and an error state on failure", () => {
    (useAdminCustomers as Mock).mockReturnValue({
      customers: [],
      meta: null,
      error: new Error("Service unavailable"),
      isLoading: false,
      mutate: vi.fn(),
    });
    const { unmount } = renderPage();

    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    unmount();

    (useAdminCustomers as Mock).mockReturnValue({
      customers: [],
      meta: null,
      error: null,
      isLoading: true,
      mutate: vi.fn(),
    });
    renderPage();
    expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
  });

  it("shows the untouched empty state when there are no customers at all", () => {
    (useAdminCustomers as Mock).mockReturnValue({
      customers: [],
      meta: { page: 1, page_size: 100, total: 0, total_pages: 0 },
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
    renderPage();

    expect(screen.getByText("No customers yet")).toBeInTheDocument();
    expect(
      screen.getByText(/as soon as they sign up for ShopSwift/i),
    ).toBeInTheDocument();
  });

  it("keeps the export action available for the current result set", () => {
    renderPage();
    expect(
      within(screen.getByRole("button", { name: /export/i })).getByText(
        "Export",
      ),
    ).toBeInTheDocument();
  });
});
