"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CustomersFilters } from "@/components/customers/CustomersFilters";
import { Customer, CustomerFilter } from "@/types/customers";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Customers = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<CustomerFilter>({
    search: "",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, fetch from your API
        // const response = await fetch("/api/customers");
        // const data = await response.json();

        setCustomers([
          {
            _id: "cust-001",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            avatar: "/placeholder.svg",
            status: "active",
            addresses: [
              {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "United States",
                type: "billing",
                isDefault: true,
              },
            ],
            stats: {
              totalOrders: 15,
              totalSpent: 2499.99,
              lastOrderDate: "2024-02-15T10:30:00",
              averageOrderValue: 166.67,
              joinedDate: "2023-01-01T00:00:00",
            },
            tags: ["vip", "regular"],
          },
          // Add more mock customers here
        ]);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter and sort customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(filter.search.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(filter.search.toLowerCase());

    const matchesStatus =
      filter.status === "all" || customer.status === filter.status;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const direction = filter.sortOrder === "asc" ? 1 : -1;

    switch (filter.sortBy) {
      case "name":
        return a.name.localeCompare(b.name) * direction;
      case "totalOrders":
        return (a.stats.totalOrders - b.stats.totalOrders) * direction;
      case "totalSpent":
        return (a.stats.totalSpent - b.stats.totalSpent) * direction;
      case "lastOrder":
        return (
          (new Date(a.stats.lastOrderDate).getTime() -
            new Date(b.stats.lastOrderDate).getTime()) *
          direction
        );
      case "joinedDate":
        return (
          (new Date(a.stats.joinedDate).getTime() -
            new Date(b.stats.joinedDate).getTime()) *
          direction
        );
      default:
        return 0;
    }
  });

  // Handle filter changes
  const handleFilterChange = (newFilter: Partial<CustomerFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Customers</h1>
              <Badge className="bg-blue-400 hover:bg-blue-500 transition-all">
                {filteredCustomers.length} Total
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/customers/new")}
                className="bg-blue-400 hover:bg-blue-500 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                      Active Customers
                    </span>
                    <span className="text-2xl font-semibold">
                      {customers.filter((c) => c.status === "active").length}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                      Total Revenue
                    </span>
                    <span className="text-2xl font-semibold">
                      $
                      {customers
                        .reduce((acc, curr) => acc + curr.stats.totalSpent, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                      Average Order Value
                    </span>
                    <span className="text-2xl font-semibold">
                      $
                      {(
                        customers.reduce(
                          (acc, curr) => acc + curr.stats.averageOrderValue,
                          0
                        ) / customers.length || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                      Total Orders
                    </span>
                    <span className="text-2xl font-semibold">
                      {customers.reduce(
                        (acc, curr) => acc + curr.stats.totalOrders,
                        0
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <CustomersFilters
              filter={filter}
              onFilterChange={handleFilterChange}
            />

            {/* Customers Table */}
            <Card className="glass-effect overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <CustomersTable
                  customers={sortedCustomers}
                  isLoading={isLoading}
                  filter={filter}
                  onSort={(key) =>
                    handleFilterChange({
                      sortBy: key as CustomerFilter["sortBy"],
                      sortOrder:
                        filter.sortBy === key && filter.sortOrder === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                  onCustomerClick={(id) => router.push(`/customers/${id}`)}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;
