import useSWR from "swr";
import { fetcher } from "../fetcher";

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
    products: data?.products || data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

export function useAdminUsers(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/bff/admin/users?page=${page}&limit=${limit}`,
    fetcher
  );
  return {
    users: data?.users || data?.data || [],
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
