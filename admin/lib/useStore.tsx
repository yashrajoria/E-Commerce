import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { setActiveStoreId, type Store } from "@ecommerce/shared";
import { useAdminSession } from "./useAdminSession";

/** Tenant store state and actions exposed through {@link useStore}. */
interface StoreContextType {
  /** Stores the admin has access to. */
  stores: Store[];
  /** Currently selected store, or `null` when the admin has no stores. */
  activeStore: Store | null;
  /** `true` while the store list is loading. */
  loading: boolean;
  /** Selects a store by id and broadcasts a `store_changed` window event. */
  switchStore: (storeId: string) => void;
  /** Creates a store through the BFF and makes it active; returns `null` on failure. */
  createStore: (
    name: string,
    slug?: string,
    currency?: string,
  ) => Promise<Store | null>;
  /** Re-fetches the store list for the authenticated admin. */
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  stores: [],
  activeStore: null,
  loading: true,
  switchStore: () => {},
  createStore: async () => null,
  refreshStores: async () => {},
});

const ACTIVE_STORE_STORAGE_KEY = "shopswift_active_store_id";

/** Props accepted by {@link StoreProvider}. */
interface StoreProviderProps {
  /** The subtree that may call {@link useStore}. */
  children: ReactNode;
}

/**
 * Provides the tenant store list and the active store to the admin app.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router);
 * relies on client-side state/effects, so it runs in the browser after
 * hydration. Loads `/api/bff/admin/stores` once the admin session is
 * authenticated, persists the selection in `localStorage` and syncs it to the
 * shared axios instance via `setActiveStoreId`.
 *
 * @example
 * ```tsx
 * // pages/_app.tsx
 * <AdminSessionProvider>
 *   <StoreProvider>
 *     <AppContent Component={Component} pageProps={pageProps} router={router} />
 *   </StoreProvider>
 * </AdminSessionProvider>
 * ```
 */
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const { authenticated, loading: authLoading } = useAdminSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStores = useCallback(async () => {
    if (!authenticated) {
      setStores([]);
      setActiveStore(null);
      setActiveStoreId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("/api/bff/admin/stores", {
        withCredentials: true,
      });
      const rawStores: Store[] =
        res.data?.stores ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      setStores(rawStores);

      if (rawStores.length > 0) {
        const savedStoreId =
          typeof window !== "undefined"
            ? localStorage.getItem(ACTIVE_STORE_STORAGE_KEY)
            : null;
        const matched = rawStores.find((s) => s.id === savedStoreId);
        const selected = matched || rawStores[0];

        setActiveStore(selected);
        setActiveStoreId(selected.id);
        if (typeof window !== "undefined") {
          localStorage.setItem(ACTIVE_STORE_STORAGE_KEY, selected.id);
        }
      } else {
        setActiveStore(null);
        setActiveStoreId(null);
      }
    } catch (err) {
      console.error("Failed to load tenant stores:", err);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authLoading) {
      refreshStores();
    }
  }, [authLoading, refreshStores]);

  const switchStore = useCallback(
    (storeId: string) => {
      const target = stores.find((s) => s.id === storeId);
      if (!target) return;

      setActiveStore(target);
      setActiveStoreId(target.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(ACTIVE_STORE_STORAGE_KEY, target.id);
      }
      toast.success(`Switched store to ${target.name}`);
      // Reload or emit event so active pages refresh their data with new store scope
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("store_changed", { detail: target }),
        );
      }
    },
    [stores],
  );

  const createStore = useCallback(
    async (
      name: string,
      slug?: string,
      currency?: string,
    ): Promise<Store | null> => {
      try {
        const res = await axios.post(
          "/api/bff/admin/stores",
          { name, slug, currency: currency || "USD" },
          { withCredentials: true },
        );
        const newStore: Store = res.data?.store || res.data;
        toast.success(`Store "${newStore.name}" created!`);
        await refreshStores();
        if (newStore?.id) {
          switchStore(newStore.id);
        }
        return newStore;
      } catch (err: unknown) {
        const errorObj = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        const msg =
          errorObj.response?.data?.message ||
          errorObj.response?.data?.error ||
          "Failed to create store";
        toast.error(msg);
        return null;
      }
    },
    [refreshStores, switchStore],
  );

  return (
    <StoreContext.Provider
      value={{
        stores,
        activeStore,
        loading,
        switchStore,
        createStore,
        refreshStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

/**
 * Reads the tenant store context.
 *
 * @remarks
 * Outside {@link StoreProvider} the context default is returned (empty store
 * list, `loading: true`, no-op actions) rather than throwing.
 *
 * @returns The {@link StoreContextType} value: `stores`, `activeStore`,
 * `loading`, `switchStore`, `createStore` and `refreshStores`.
 */
export const useStore = () => useContext(StoreContext);
