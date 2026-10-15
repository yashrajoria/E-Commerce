import useSWR from "swr";
import { fetcher } from "../fetcher";

const extractArray = <T,>(value: unknown): T[] => {
  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const nestedCandidates = [record.products, record.data, record.items, record.results];
  for (const candidate of nestedCandidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      if (Array.isArray(nested.products)) return nested.products as T[];
      if (Array.isArray(nested.data)) return nested.data as T[];
      if (Array.isArray(nested.items)) return nested.items as T[];
      if (Array.isArray(nested.results)) return nested.results as T[];
    }
  }

  return [];
};

const extractMeta = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  if (record.meta && typeof record.meta === "object") {
    return record.meta;
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if (nested.meta && typeof nested.meta === "object") {
      return nested.meta;
    }
  }

  return undefined;
};

const pickArray = <T,>(...candidates: unknown[]): T[] => {
  for (const candidate of candidates) {
    const extracted = extractArray<T>(candidate);
    if (extracted.length > 0) {
      return extracted;
    }
  }
  return [];
};

export function useAdminOrders(page = 1, limit = 20, status?: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/orders?${params}`,
    fetcher
  );
  return {
    orders: data?.orders || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminProducts(page = 1, limit = 20, search?: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/products?${params}`,
    fetcher
  );
  return {
    products: pickArray(data?.products, data?.data, data),
    meta: extractMeta(data),
    error,
    isLoading,
    mutate,
  };
}

export function useAdminCustomers(query: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  sort?: string;
  order?: string;
} = {}) {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    page_size: String(query.pageSize ?? 10),
  });
  if (query.search) params.set("search", query.search);
  if (query.role && query.role !== "all") params.set("role", query.role);
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/users?${params.toString()}`,
    fetcher,
  );
  return {
    customers: data?.users ?? [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminInventory(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/inventory?page=${page}&limit=${limit}`,
    fetcher
  );
  return {
    inventory: data?.inventory || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminCoupons(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/coupons?page=${page}&limit=${limit}`,
    fetcher
  );
  return {
    coupons: data?.coupons || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useNotificationLogs(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/notifications/log?${params}`,
    fetcher
  );
  return {
    logs: data?.logs || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminReports(type: "sales" | "users" | "inventory") {
  const { data, error, isLoading } = useSWR(
    `/bff/admin/reports/${type}`,
    fetcher
  );
  return {
    report: data?.data || data,
    error,
    isLoading,
  };
}

export function useAdminShipping() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/shipping",
    fetcher
  );
  return {
    shipments: data?.shipments || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminSupport() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/support",
    fetcher
  );
  return {
    tickets: data?.tickets || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminReturns() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/returns",
    fetcher
  );
  return {
    returns: data?.returns || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminReviews() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/reviews",
    fetcher
  );
  return {
    reviews: data?.reviews || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminActivityLogs() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/activity-logs",
    fetcher
  );
  return {
    logs: data?.logs || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminAnalytics() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/analytics",
    fetcher
  );
  return {
    data: data || {},
    revenueData: data?.revenueData || [],
    categoryData: data?.categoryData || [],
    topProducts: data?.topProducts || [],
    trafficSources: data?.trafficSources || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminCampaigns() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/campaigns",
    fetcher
  );
  return {
    campaigns: data?.campaigns || [],
    error,
    isLoading,
    mutate,
  };
}
