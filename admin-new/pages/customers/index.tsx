import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/admin/shared/DataStates";
import {
  CustomersFilters,
} from "@/components/customers/CustomersFilters";
import {
  CustomersTable,
  ROLE_LABEL,
  ROLE_STYLE,
} from "@/components/customers/CustomersTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@/components/ui/table";
import { useAdminCustomers } from "@/lib/hooks/useAdminData";
import type {
  AdminUserRecord,
  Customer,
  CustomerFilter,
  CustomerSortKey,
} from "@/types/customers";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
  AtSign,
  CalendarDays,
  Copy,
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

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

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
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as Customer["role"],
  });

  const {
    customers: records,
    meta,
    error,
    isLoading,
    mutate,
  } = useAdminCustomers();

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

  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);
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

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/customers", form);
      if (response.status >= 200 && response.status < 300) {
        toast.success(`${form.name.trim()} added`);
        setIsAddOpen(false);
        setForm({ name: "", email: "", password: "", role: "user" });
        await mutate();
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to create customer";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
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
            <Card className="glass-effect overflow-hidden border-white/[0.06]">
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
            <Card className="glass-effect overflow-hidden border-white/[0.06]">
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
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg glass-effect-strong border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Customer details</DialogTitle>
            <DialogDescription>
              Profile information for this ShopSwift account.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="gradient-purple text-white text-base font-semibold">
                    {initialsOf(selected.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-foreground truncate">
                    {selected.name}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 gap-1.5 w-fit capitalize ${ROLE_STYLE[selected.role]}`}
                  >
                    <span className="status-dot" />
                    {ROLE_LABEL[selected.role]}
                  </Badge>
                </div>
              </div>

              <dl className="grid gap-3 text-sm">
                <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                  <AtSign className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="sr-only">Email</dt>
                  <dd className="flex-1 min-w-0 truncate">{selected.email}</dd>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(selected.email);
                      toast.success("Email copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="sr-only">Phone</dt>
                  <dd className="flex-1 min-w-0 tabular-nums">
                    {selected.phone || (
                      <span className="text-muted-foreground/50">
                        No phone on file
                      </span>
                    )}
                  </dd>
                </div>

                <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="sr-only">Joined</dt>
                  <dd className="flex-1 min-w-0">
                    {formatDate(selected.createdAt)}
                    <span className="text-muted-foreground">
                      {" "}
                      · {formatRelativeDate(selected.createdAt)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
              className="rounded-xl border-white/[0.08]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add customer ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md glass-effect-strong border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
            <DialogDescription>
              Creates a ShopSwift account that can sign in straight away.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Full name</Label>
              <Input
                id="customer-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer-password">Temporary password</Label>
              <Input
                id="customer-password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Minimum 8 characters"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value as Customer["role"] })
                }
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/[0.08]">
                  <SelectItem value="user">Customer</SelectItem>
                  <SelectItem value="admin">Staff (admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl border-white/[0.08]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                isSaving ||
                !form.name.trim() ||
                !form.email.trim() ||
                form.password.length < 8
              }
              className="rounded-xl gradient-purple text-white hover:opacity-90 border-0"
            >
              {isSaving ? "Adding..." : "Add customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Customers;


import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
