/**
 * Premium Customers Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import EmptyState from "@/components/ui/empty-state";
import CustomersFilters from "@/components/customers/CustomersFilters";
import CustomersTable from "@/components/customers/CustomersTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  DollarSign,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import type {
  Customer,
  CustomerFilter,
  CustomerStatus,
} from "@/types/customers";

const ITEMS_PER_PAGE = 10;

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<CustomerFilter>({
    search: "",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/customers", {
          withCredentials: true,
        });
        setCustomers(res.data || []);
      } catch {
        // Use mock data if API fails
        setCustomers([
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            status: "active" as CustomerStatus,
            addresses: [],
            stats: {
              totalOrders: 12,
              totalSpent: 1459.99,
              lastOrderDate: "2024-03-15",
              averageOrderValue: 121.66,
              joinedDate: "2023-01-10",
            },
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+0987654321",
            status: "active" as CustomerStatus,
            addresses: [],
            stats: {
              totalOrders: 8,
              totalSpent: 892.5,
              lastOrderDate: "2024-03-20",
              averageOrderValue: 111.56,
              joinedDate: "2023-03-15",
            },
          },
          {
            _id: "3",
            name: "Bob Wilson",
            email: "bob@example.com",
            status: "inactive" as CustomerStatus,
            addresses: [],
            stats: {
              totalOrders: 3,
              totalSpent: 245.0,
              lastOrderDate: "2024-01-05",
              averageOrderValue: 81.67,
              joinedDate: "2023-06-20",
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
      );
    }
    if (filter.status !== "all")
      result = result.filter((c) => c.status === filter.status);
    result.sort((a, b) => {
      const order = filter.sortOrder === "asc" ? 1 : -1;
      if (filter.sortBy === "name") return a.name.localeCompare(b.name) * order;
      if (filter.sortBy === "totalOrders")
        return (a.stats.totalOrders - b.stats.totalOrders) * order;
      if (filter.sortBy === "totalSpent")
        return (a.stats.totalSpent - b.stats.totalSpent) * order;
      return 0;
    });
    return result;
  }, [customers, filter]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const activeCount = customers.filter((c) => c.status === "active").length;
  const inactiveCount = customers.filter((c) => c.status === "inactive").length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + c.stats.totalSpent,
    0,
  );

  return (
    <PageLayout
      title="Customers"
      breadcrumbs={[{ label: "Customers" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
          >
            <Download size={13} />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
          >
            <UserPlus size={13} />
            Add Customer
          </Button>
        </div>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Customers"
          value={customers.length}
          icon={Users}
          trend={{ value: 12.5, label: "vs last month" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Active Customers"
          value={activeCount}
          icon={UserCheck}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Inactive"
          value={inactiveCount}
          icon={UserX}
          gradient="gradient-amber"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="gradient-blue"
        />
      </motion.section>

      {/* Filters */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <CustomersFilters filter={filter} setFilter={setFilter} />
        </div>
      </motion.section>

      {/* Table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.section
            key="loading"
            variants={pageItem}
            className="flex items-center justify-center py-16"
          >
            <LoadingSpinner />
          </motion.section>
        ) : paginatedCustomers.length === 0 ? (
          <motion.section key="empty" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <EmptyState
                icon={Users}
                title="No customers found"
                description={
                  filter.search
                    ? "Try adjusting your search or filter criteria"
                    : "Your customer list will appear here"
                }
              />
            </div>
          </motion.section>
        ) : (
          <motion.section key="table" variants={pageItem}>
            <div className="glass-effect rounded-xl overflow-hidden border border-white/[0.06]">
              <CustomersTable customers={paginatedCustomers} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.section variants={pageItem} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-xl ${currentPage === i + 1 ? "gradient-purple text-white border-0" : ""}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
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
    </PageLayout>
  );
};

export default Customers;
