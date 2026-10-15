import axios from "axios";
import { useEffect, useState } from "react";
import type { BadgeCounts } from "./types";

type BadgeCacheEntry = {
  expiresAt: number;
  value: BadgeCounts;
};

const SIDEBAR_BADGE_CACHE_KEY = "admin-sidebar-badge-counts";
const SIDEBAR_BADGE_CACHE_TTL_MS = 5 * 60 * 1000;

let badgeCountsMemoryCache: BadgeCacheEntry | null = null;

const getCountValue = (...candidates: unknown[]) => {
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value >= 0) {
      return value;
    }
  }

  return undefined;
};

const hasAllBadgeCounts = (counts: BadgeCounts) =>
  [counts.products, counts.orders, counts.customers, counts.inventory].every(
    (value) => typeof value === "number",
  );

const readCachedBadgeCounts = (): BadgeCounts | null => {
  const now = Date.now();

  if (badgeCountsMemoryCache && badgeCountsMemoryCache.expiresAt > now) {
    return badgeCountsMemoryCache.value;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SIDEBAR_BADGE_CACHE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as BadgeCacheEntry;
    if (parsed.expiresAt <= now) {
      window.sessionStorage.removeItem(SIDEBAR_BADGE_CACHE_KEY);
      return null;
    }

    badgeCountsMemoryCache = parsed;
    return parsed.value;
  } catch {
    window.sessionStorage.removeItem(SIDEBAR_BADGE_CACHE_KEY);
    return null;
  }
};

const writeCachedBadgeCounts = (value: BadgeCounts) => {
  const hasAnyCount = Object.values(value).some(
    (candidate) => typeof candidate === "number",
  );
  if (!hasAnyCount) {
    return;
  }

  const entry: BadgeCacheEntry = {
    value,
    expiresAt: Date.now() + SIDEBAR_BADGE_CACHE_TTL_MS,
  };

  badgeCountsMemoryCache = entry;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      SIDEBAR_BADGE_CACHE_KEY,
      JSON.stringify(entry),
    );
  }
};

const extractDashboardBadgeCounts = (payload: unknown): BadgeCounts => {
  const obj =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const dashboard =
    typeof obj.data === "object" && obj.data !== null
      ? (obj.data as Record<string, unknown>)
      : obj;
  const kpis =
    typeof dashboard.kpis === "object" && dashboard.kpis !== null
      ? (dashboard.kpis as Record<string, unknown>)
      : typeof dashboard.overview === "object" &&
          dashboard.overview !== null &&
          typeof (dashboard.overview as Record<string, unknown>).kpis ===
            "object"
        ? ((dashboard.overview as Record<string, unknown>).kpis as Record<
            string,
            unknown
          >)
        : typeof dashboard.metrics === "object" && dashboard.metrics !== null
          ? (dashboard.metrics as Record<string, unknown>)
          : undefined;
  const totals =
    typeof dashboard.totals === "object" && dashboard.totals !== null
      ? (dashboard.totals as Record<string, unknown>)
      : typeof dashboard.counts === "object" && dashboard.counts !== null
        ? (dashboard.counts as Record<string, unknown>)
        : typeof dashboard.summary === "object" && dashboard.summary !== null
          ? (dashboard.summary as Record<string, unknown>)
          : undefined;
  const inventorySummary =
    typeof dashboard.inventorySummary === "object" &&
    dashboard.inventorySummary !== null
      ? (dashboard.inventorySummary as Record<string, unknown>)
      : typeof dashboard.inventory === "object" && dashboard.inventory !== null
        ? (dashboard.inventory as Record<string, unknown>)
        : undefined;

  return {
    products: getCountValue(
      kpis &&
        typeof kpis.totalProducts === "object" &&
        kpis.totalProducts !== null
        ? (kpis.totalProducts as Record<string, unknown>).value
        : undefined,
      totals && typeof totals.products !== "undefined"
        ? totals.products
        : undefined,
      dashboard.totalProducts,
      dashboard.productsCount,
      dashboard.productCount,
    ),
    orders: getCountValue(
      kpis && typeof kpis.totalOrders === "object" && kpis.totalOrders !== null
        ? (kpis.totalOrders as Record<string, unknown>).value
        : undefined,
      totals && typeof totals.orders !== "undefined"
        ? totals.orders
        : undefined,
      dashboard.totalOrders,
      dashboard.ordersCount,
      dashboard.orderCount,
    ),
    customers: getCountValue(
      kpis &&
        typeof kpis.totalCustomers === "object" &&
        kpis.totalCustomers !== null
        ? (kpis.totalCustomers as Record<string, unknown>).value
        : undefined,
      kpis && typeof kpis.customers === "object" && kpis.customers !== null
        ? (kpis.customers as Record<string, unknown>).value
        : undefined,
      totals && typeof totals.customers !== "undefined"
        ? totals.customers
        : undefined,
      dashboard.totalCustomers,
      dashboard.customersCount,
      dashboard.customerCount,
    ),
    inventory: getCountValue(
      kpis &&
        typeof kpis.totalInventory === "object" &&
        kpis.totalInventory !== null
        ? (kpis.totalInventory as Record<string, unknown>).value
        : undefined,
      inventorySummary && typeof inventorySummary.totalSkus !== "undefined"
        ? inventorySummary.totalSkus
        : undefined,
      inventorySummary && typeof inventorySummary.totalItems !== "undefined"
        ? inventorySummary.totalItems
        : undefined,
      totals && typeof totals.inventory !== "undefined"
        ? totals.inventory
        : undefined,
      dashboard.inventoryCount,
      dashboard.totalInventory,
    ),
  };
};

const fetchBadgeCountsFromFallbackEndpoints = async (
  currentCounts: BadgeCounts,
): Promise<BadgeCounts> => {
  const nextCounts = { ...currentCounts };
  const pendingFetches: Promise<void>[] = [];

  if (typeof nextCounts.products !== "number") {
    pendingFetches.push(
      axios
        .get("/api/admin/products?page=1&perPage=1", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          nextCounts.products = getCountValue(
            response.data?.meta?.total,
            response.data?.products?.length,
          );
        })
        .catch(() => undefined),
    );
  }

  if (typeof nextCounts.orders !== "number") {
    pendingFetches.push(
      axios
        .get("/api/admin/orders?page=1&limit=1", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          nextCounts.orders = getCountValue(
            response.data?.meta?.total,
            response.data?.orders?.length,
          );
        })
        .catch(() => undefined),
    );
  }

  if (typeof nextCounts.customers !== "number") {
    pendingFetches.push(
      axios
        .get("/api/admin/customers?page=1&page_size=1", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          nextCounts.customers = getCountValue(
            response.data?.meta?.total,
            response.data?.users?.length,
          );
        })
        .catch(() => undefined),
    );
  }

  if (typeof nextCounts.inventory !== "number") {
    pendingFetches.push(
      axios
        .get("/api/admin/inventory?page=1&page_size=1", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          nextCounts.inventory = getCountValue(
            response.data?.meta?.total,
            response.data?.inventory?.length,
          );
        })
        .catch(() => undefined),
    );
  }

  await Promise.all(pendingFetches);

  return nextCounts;
};

const fetchSidebarBadgeCounts = async (): Promise<BadgeCounts> => {
  const cachedCounts = readCachedBadgeCounts();
  if (cachedCounts) {
    return cachedCounts;
  }

  let nextCounts: BadgeCounts = {};

  try {
    const dashboardResponse = await axios.get("/api/admin/dashboard", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    nextCounts = extractDashboardBadgeCounts(dashboardResponse.data);
  } catch {
    nextCounts = {};
  }

  if (!hasAllBadgeCounts(nextCounts)) {
    nextCounts = await fetchBadgeCountsFromFallbackEndpoints(nextCounts);
  }

  writeCachedBadgeCounts(nextCounts);
  return nextCounts;
};

/**
 * Fetches dashboard record counts for the sidebar navigation badges, backed by
 * a five-minute in-memory and `sessionStorage` cache.
 *
 * @remarks
 * The `/api/admin/dashboard` payload is parsed first; any count it does not
 * provide is fetched from the matching admin list endpoint. Cached counts are
 * returned synchronously on first render and refreshed after mount.
 *
 * @returns The latest {@link BadgeCounts} — an empty object until the first
 * fetch resolves, or whenever every request fails.
 */
export function useSidebarBadges(): BadgeCounts {
  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>(
    () => readCachedBadgeCounts() ?? {},
  );

  useEffect(() => {
    let isMounted = true;

    const fetchBadgeCounts = async () => {
      try {
        const counts = await fetchSidebarBadgeCounts();
        if (!isMounted) {
          return;
        }

        setBadgeCounts(counts);
      } catch {
        if (!isMounted) {
          return;
        }
        setBadgeCounts({});
      }
    };

    void fetchBadgeCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return badgeCounts;
}
