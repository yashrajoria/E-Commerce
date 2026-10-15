import React from "react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StoreCreditPage from "@/pages/store-credit";
import {
  useStoreCreditBalance,
  useStoreCreditLedger,
  useStoreCreditReconcile,
  grantStoreCredit,
  adjustStoreCredit,
} from "@/hooks/useStoreCredit";
import { useStore } from "@/lib/useStore";
import { useAdminSession } from "@/lib/useAdminSession";
import { useAdminCustomers } from "@/lib/hooks/useAdminData";

vi.mock("@/components/layout/PageLayout", () => ({
  default: ({
    title,
    breadcrumbs,
    children,
  }: {
    title: string;
    breadcrumbs?: { label: string }[];
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock("@/lib/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("@/lib/useAdminSession", () => ({
  useAdminSession: vi.fn(),
}));

vi.mock("@/lib/hooks/useAdminData", () => ({
  useAdminCustomers: vi.fn(),
}));

vi.mock("@/hooks/useStoreCredit", () => ({
  useStoreCreditBalance: vi.fn(),
  useStoreCreditLedger: vi.fn(),
  useStoreCreditReconcile: vi.fn(),
  grantStoreCredit: vi.fn(),
  adjustStoreCredit: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Store Credit Admin Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useStore as Mock).mockReturnValue({
      activeStore: { id: "store-123", name: "Flagship London", currency: "GBP" },
    });

    (useAdminSession as Mock).mockReturnValue({
      user: { id: "admin-1", email: "admin@shopswift.com", role: "admin" },
      isAdmin: true,
    });

    (useAdminCustomers as Mock).mockReturnValue({
      customers: [
        { id: "cust-1", name: "Alice Johnson", email: "alice@example.com" },
        { id: "cust-2", name: "Bob Smith", email: "bob@example.com" },
      ],
    });

    (useStoreCreditBalance as Mock).mockReturnValue({
      data: {
        available_amount: 5000,
        held_amount: 1500,
        total_amount: 6500,
        currency: "GBP",
      },
      isLoading: false,
      mutate: vi.fn(),
    });

    (useStoreCreditLedger as Mock).mockReturnValue({
      data: {
        entries: [
          {
            id: "entry-1",
            account_id: "acc-1",
            entry_type: "grant",
            amount: 5000,
            available_delta: 5000,
            held_delta: 0,
            currency: "GBP",
            reason: "VIP Loyalty Welcome Bonus",
            idempotency_key: "idem-welcome-1",
            created_at: new Date().toISOString(),
          },
          {
            id: "entry-2",
            account_id: "acc-1",
            entry_type: "hold",
            amount: 1500,
            available_delta: -1500,
            held_delta: 1500,
            currency: "GBP",
            reason: "Checkout reservation for Order #999",
            idempotency_key: "idem-hold-999",
            created_at: new Date().toISOString(),
          },
        ],
      },
      isLoading: false,
      mutate: vi.fn(),
    });

    (useStoreCreditReconcile as Mock).mockReturnValue({
      data: {
        account_id: "acc-1",
        user_id: "cust-1",
        store_id: "store-123",
        currency: "GBP",
        cached_available: 3500,
        ledger_available: 3500,
        available_matched: true,
        cached_held: 1500,
        ledger_held: 1500,
        held_matched: true,
        total_ledger_entries: 2,
      },
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it("renders the store credit header and store context", () => {
    render(<StoreCreditPage />);
    expect(screen.getByText("Store Credit Management")).toBeDefined();
    expect(screen.getByText(/Store: Flagship London/)).toBeDefined();
    expect(screen.getByText(/Mutator Authorized/)).toBeDefined();
  });

  it("restricts store managers to read-only mode", () => {
    (useAdminSession as Mock).mockReturnValue({
      user: { id: "mgr-1", email: "manager@shopswift.com", role: "manager" },
      isAdmin: false,
    });

    render(<StoreCreditPage />);
    expect(screen.getByText(/Manager: Read-Only Audit Access/)).toBeDefined();
  });

  it("displays customer balances and immutable ledger entries", async () => {
    render(<StoreCreditPage />);

    // Select customer
    const input = screen.getByPlaceholderText(/Enter user UUID or search/);
    fireEvent.change(input, { target: { value: "cust-1" } });

    await waitFor(() => {
      expect(screen.getByText("Available Balance")).toBeDefined();
      expect(screen.getByText("Held Amount")).toBeDefined();
      expect(screen.getByText("Total Account Value")).toBeDefined();
      expect(screen.getByText("VIP Loyalty Welcome Bonus")).toBeDefined();
      expect(screen.getByText("Checkout reservation for Order #999")).toBeDefined();
    });
  });

  it("opens the grant modal and executes store credit grant", async () => {
    (grantStoreCredit as Mock).mockResolvedValue({ success: true });

    render(<StoreCreditPage />);
    const input = screen.getByPlaceholderText(/Enter user UUID or search/);
    fireEvent.change(input, { target: { value: "cust-1" } });

    const grantBtn = screen.getByRole("button", { name: /Issue Grant/ });
    fireEvent.click(grantBtn);

    expect(screen.getByText("Issue Store Credit Grant")).toBeDefined();

    const amountInput = screen.getByLabelText(/Amount/);
    const reasonInput = screen.getByLabelText(/Reason for Grant/);

    fireEvent.change(amountInput, { target: { value: "25.00" } });
    fireEvent.change(reasonInput, { target: { value: "Goodwill refund" } });

    const submitBtn = screen.getByRole("button", { name: /Confirm Grant/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(grantStoreCredit).toHaveBeenCalledWith(
        "cust-1",
        2500,
        "GBP",
        "Goodwill refund",
        "store-123"
      );
    });
  });

  it("opens audit reconciliation dialog and checks ledger integrity", async () => {
    render(<StoreCreditPage />);
    const input = screen.getByPlaceholderText(/Enter user UUID or search/);
    fireEvent.change(input, { target: { value: "cust-1" } });

    const reconcileBtn = screen.getByRole("button", { name: /Audit Reconcile/ });
    fireEvent.click(reconcileBtn);

    await waitFor(() => {
      expect(screen.getByText("Ledger Reconciliation Audit")).toBeDefined();
      expect(screen.getByText(/Ledger integrity verified/)).toBeDefined();
    });
  });
});
