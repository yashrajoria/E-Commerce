import useSWR from "swr";
import { fetcher } from "../fetcher";

const extractArray = <T>(value: unknown): T[] => {
  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const nestedCandidates = [
    record.products,
    record.data,
    record.items,
    record.results,
  ];
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

const pickArray = <T>(...candidates: unknown[]): T[] => {
  for (const candidate of candidates) {
    const extracted = extractArray<T>(candidate);
    if (extracted.length > 0) {
      return extracted;
    }
  }
  return [];
};

/**
 * Subscribes to a page of orders through the BFF.
 *
 * @param page - 1-based page number; defaults to `1`.
 * @param limit - Page size; defaults to `20`.
 * @param status - Optional order status filter appended as `?status=`.
 * @returns `{ orders, meta, error, isLoading, mutate }` with the SWR revalidation handle.
 */
export function useAdminOrders(page = 1, limit = 20, status?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set("status", status);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/orders?${params}`,
    fetcher,
  );
  return {
    orders: data?.orders || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to a page of products through the BFF.
 *
 * @remarks
 * The product array is picked from the first non-empty candidate among
 * `products`, `data` and the whole payload, so both BFF and service envelopes work.
 *
 * @param page - 1-based page number; defaults to `1`.
 * @param limit - Page size; defaults to `20`.
 * @param search - Optional free-text search appended as `?search=`.
 * @returns `{ products, meta, error, isLoading, mutate }` with the SWR revalidation handle.
 */
export function useAdminProducts(page = 1, limit = 20, search?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("search", search);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/products?${params}`,
    fetcher,
  );
  return {
    products: pickArray(data?.products, data?.data, data),
    meta: extractMeta(data),
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to a page of customers through the BFF.
 *
 * @param query - Filter object: `page` (default 1), `pageSize` (default 10),
 * `search`, `role` (ignored when `"all"`), `sort` and `order`.
 * @returns `{ customers, meta, error, isLoading, mutate }`; `customers` is empty
 * unless the payload exposes a `users` array.
 */
export function useAdminCustomers(
  query: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    sort?: string;
    order?: string;
  } = {},
) {
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

/**
 * Subscribes to a page of inventory rows through the BFF.
 *
 * @param page - 1-based page number; defaults to `1`.
 * @param limit - Page size; defaults to `20`.
 * @returns `{ inventory, meta, error, isLoading, mutate }` with the SWR revalidation handle.
 */
export function useAdminInventory(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/inventory?page=${page}&limit=${limit}`,
    fetcher,
  );
  return {
    inventory: data?.inventory || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to a page of coupons through the BFF.
 *
 * @param page - 1-based page number; defaults to `1`.
 * @param limit - Page size; defaults to `20`.
 * @returns `{ coupons, meta, error, isLoading, mutate }` with the SWR revalidation handle.
 */
export function useAdminCoupons(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/coupons?page=${page}&limit=${limit}`,
    fetcher,
  );
  return {
    coupons: data?.coupons || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the notification delivery log (fixed page size of 20).
 *
 * @param page - 1-based page number; defaults to `1`.
 * @param status - Optional delivery status filter appended as `?status=`.
 * @returns `{ logs, meta, error, isLoading, mutate }` with the SWR revalidation handle.
 */
export function useNotificationLogs(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/notifications/log?${params}`,
    fetcher,
  );
  return {
    logs: data?.logs || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to one of the prebuilt admin reports.
 *
 * @param type - Report to load: `"sales"`, `"users"` or `"inventory"`.
 * @returns `{ report, error, isLoading }`; unlike the other hooks this one has no
 * `mutate`, because reports are treated as immutable snapshots.
 */
export function useAdminReports(type: "sales" | "users" | "inventory") {
  const { data, error, isLoading } = useSWR(
    `/bff/admin/reports/${type}`,
    fetcher,
  );
  return {
    report: data?.data || data,
    error,
    isLoading,
  };
}

/**
 * Subscribes to the shipping operations overview.
 *
 * @returns `{ shipments, stats, error, isLoading, mutate }` from `/api/admin/shipping`.
 */
export function useAdminShipping() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/shipping",
    fetcher,
  );
  return {
    shipments: data?.shipments || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the support ticket overview.
 *
 * @returns `{ tickets, stats, error, isLoading, mutate }` from `/api/admin/support`.
 */
export function useAdminSupport() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/support",
    fetcher,
  );
  return {
    tickets: data?.tickets || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the returns and refunds overview.
 *
 * @returns `{ returns, stats, error, isLoading, mutate }` from `/api/admin/returns`.
 */
export function useAdminReturns() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/returns",
    fetcher,
  );
  return {
    returns: data?.returns || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the product reviews overview.
 *
 * @returns `{ reviews, stats, error, isLoading, mutate }` from `/api/admin/reviews`.
 */
export function useAdminReviews() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/reviews",
    fetcher,
  );
  return {
    reviews: data?.reviews || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the audit activity log.
 *
 * @returns `{ logs, stats, error, isLoading, mutate }` from `/api/admin/activity-logs`.
 */
export function useAdminActivityLogs() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/activity-logs",
    fetcher,
  );
  return {
    logs: data?.logs || [],
    stats: data?.stats,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Subscribes to the dashboard analytics payload.
 *
 * @returns `{ data, revenueData, categoryData, topProducts, trafficSources, stats, error, isLoading, mutate }`
 * from `/api/admin/analytics`, each collection defaulting to an empty array.
 */
export function useAdminAnalytics() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/analytics",
    fetcher,
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

/**
 * Subscribes to the marketing campaigns list.
 *
 * @returns `{ campaigns, error, isLoading, mutate }` from `/api/admin/campaigns`.
 */
export function useAdminCampaigns() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/campaigns",
    fetcher,
  );
  return {
    campaigns: data?.campaigns || [],
    error,
    isLoading,
    mutate,
  };
}
