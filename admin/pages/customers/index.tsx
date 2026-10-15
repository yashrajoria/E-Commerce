import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/admin/shared/DataStates";
import {
  CustomersFilters,
  CustomersTable,
  CustomerDetailModal,
  AddCustomerModal,
  ROLE_LABEL,
} from "@/components/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table } from "@/components/ui/table";
import { useAdminCustomers } from "@/lib/hooks/useAdminData";
import type {
  AdminUserRecord,
  Customer,
  CustomerFilter,
  CustomerSortKey,
} from "@/types/customers";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Phone,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const CUSTOMERS_PER_PAGE = 10;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const toCustomer = (raw: AdminUserRecord): Customer => ({
  id: raw.id || raw.email,
  name: raw.name?.trim() || raw.email || "Unnamed account",
  email: raw.email || "",
  role: raw.role === "admin" ? "admin" : "user",
  phone: raw.phone_number?.trim() || undefined,
  createdAt: raw.created_at || "",
});

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<CustomerFilter>({
    search: "",
    role: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [selected, setSelected] = useState<Customer | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    customers: records,
    meta,
    error,
    isLoading,
    mutate,
  } = useAdminCustomers({
    page: currentPage,
    pageSize: CUSTOMERS_PER_PAGE,
    search: filter.search,
    role: filter.role,
    sort: filter.sortBy === "createdAt" ? "created_at" : filter.sortBy,
    order: filter.sortOrder,
  });

  const customers = useMemo(
    () =>
      (Array.isArray(records) ? records : []).map((raw) =>
        toCustomer(raw as AdminUserRecord),
      ),
    [records],
  );

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (filter.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone ?? "").toLowerCase().includes(query),
      );
    }

    if (filter.role !== "all") {
      result = result.filter((c) => c.role === filter.role);
    }

    const direction = filter.sortOrder === "asc" ? 1 : -1;
    result.sort((a, b) => {
      switch (filter.sortBy) {
        case "email":
          return a.email.localeCompare(b.email) * direction;
        case "role":
          return a.role.localeCompare(b.role) * direction;
        case "createdAt":
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            direction
          );
        default:
          return a.name.localeCompare(b.name) * direction;
      }
    });

    return result;
  }, [customers, filter]);

  const totalPages = Math.max(
    Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE),
    Number(meta?.total_pages) || 1,
    1,
  );
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE,
  );

  const totalCustomers = Number(meta?.total) || customers.length;
  const now = Date.now();
  const newThisMonth = customers.filter(
    (c) => now - new Date(c.createdAt).getTime() <= THIRTY_DAYS,
  ).length;
  const newPreviousMonth = customers.filter((c) => {
    const age = now - new Date(c.createdAt).getTime();
    return age > THIRTY_DAYS && age <= THIRTY_DAYS * 2;
  }).length;
  const withPhone = customers.filter((c) => Boolean(c.phone)).length;
  const staffAccounts = customers.filter((c) => c.role === "admin").length;

  const monthOverMonth =
    newPreviousMonth > 0
      ? {
          value: Math.round(
            ((newThisMonth - newPreviousMonth) / newPreviousMonth) * 100,
          ),
          label: "vs previous 30 days",
        }
      : undefined;

  const handleFilterChange = (updated: Partial<CustomerFilter>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handleSort = (key: CustomerSortKey) => {
    setFilter((prev) =>
      prev.sortBy === key
        ? { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }
        : { ...prev, sortBy: key, sortOrder: "asc" },
    );
    setCurrentPage(1);
  };

  const handleExport = () => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ["Name", "Email", "Role", "Phone", "Joined"],
      ...filteredCustomers.map((c) => [
        c.name,
        c.email,
        ROLE_LABEL[c.role],
        c.phone ?? "",
        c.createdAt,
      ]),
    ];
    const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredCustomers.length} customers`);
  };

  return (
    <PageLayout
      title="Customers"
      breadcrumbs={[{ label: "Customers" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={filteredCustomers.length === 0}
            className="gap-2 text-xs border-border hover:bg-accent rounded-xl h-8 hidden sm:flex"
          >
            <Download size={13} />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
          >
            <UserPlus size={13} />
            Add Customer
          </Button>
        </div>
      }
    >
      {/* ── KPI Stats ── */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          gradient="gradient-purple"
          glowClass="glow-purple"
          subtitle="All ShopSwift accounts"
        />
        <StatsCard
          title="New This Month"
          value={newThisMonth}
          icon={UserPlus}
          trend={monthOverMonth}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
          subtitle="Signed up in the last 30 days"
        />
        <StatsCard
          title="With Phone"
          value={withPhone}
          icon={Phone}
          gradient="gradient-blue"
          subtitle="Reachable by call or SMS"
        />
        <StatsCard
          title="Staff Accounts"
          value={staffAccounts}
          icon={ShieldCheck}
          gradient="gradient-amber"
          subtitle="Accounts with admin access"
        />
      </motion.section>

      {/* ── Filters ── */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <CustomersFilters
            filter={filter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </motion.section>

      {/* ── Customers Table ── */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.section key="loading" variants={pageItem}>
            <Card className="glass-effect overflow-hidden border-border">
              <CardContent className="p-0">
                <Table>
                  <TableSkeleton rows={5} cols={6} />
                </Table>
              </CardContent>
            </Card>
          </motion.section>
        ) : error ? (
          <motion.section key="error" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <ErrorState
                message={(error as Error).message}
                onRetry={() => mutate()}
              />
            </div>
          </motion.section>
        ) : filteredCustomers.length === 0 ? (
          <motion.section key="empty" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <EmptyState
                title={
                  filter.search || filter.role !== "all"
                    ? "No customers match your filters"
                    : "No customers yet"
                }
                description={
                  filter.search || filter.role !== "all"
                    ? "Try adjusting your search or role filter"
                    : "Customers will appear here as soon as they sign up for ShopSwift."
                }
                icon={Users}
              />
            </div>
          </motion.section>
        ) : (
          <motion.section key="table" variants={pageItem}>
            <Card className="glass-effect overflow-hidden border-border">
              <CardContent className="p-0 overflow-x-auto">
                <CustomersTable
                  customers={paginatedCustomers}
                  filter={filter}
                  onSort={handleSort}
                  onCustomerClick={setSelected}
                />
              </CardContent>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <motion.section variants={pageItem} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1)
                    pageNum = currentPage - 2 + i;
                  else if (currentPage >= totalPages - 1)
                    pageNum = totalPages - 4 + i;
                }
                return pageNum <= totalPages ? (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`rounded-xl ${currentPage === pageNum ? "gradient-purple text-white border-0" : ""}`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ) : null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={`rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.section>
      )}

      {/* ── Customer detail ── */}
      <CustomerDetailModal
        customer={selected}
        onClose={() => setSelected(null)}
      />

      {/* ── Add customer ── */}
      <AddCustomerModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={mutate}
      />
    </PageLayout>
  );
};

export default Customers;

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
