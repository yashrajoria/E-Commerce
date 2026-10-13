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

interface StoreContextType {
  stores: Store[];
  activeStore: Store | null;
  loading: boolean;
  switchStore: (storeId: string) => void;
  createStore: (name: string, slug?: string, currency?: string) => Promise<Store | null>;
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

export const StoreProvider = ({ children }: { children: ReactNode }) => {
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
      const res = await axios.get("/api/bff/admin/stores", { withCredentials: true });
      const rawStores: Store[] = res.data?.stores || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setStores(rawStores);

      if (rawStores.length > 0) {
        const savedStoreId = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_STORE_STORAGE_KEY) : null;
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

  const switchStore = useCallback((storeId: string) => {
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
      window.dispatchEvent(new CustomEvent("store_changed", { detail: target }));
    }
  }, [stores]);

  const createStore = useCallback(
    async (name: string, slug?: string, currency?: string): Promise<Store | null> => {
      try {
        const res = await axios.post(
          "/api/bff/admin/stores",
          { name, slug, currency: currency || "USD" },
          { withCredentials: true }
        );
        const newStore: Store = res.data?.store || res.data;
        toast.success(`Store "${newStore.name}" created!`);
        await refreshStores();
        if (newStore?.id) {
          switchStore(newStore.id);
        }
        return newStore;
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string; error?: string } } };
        const msg = errorObj.response?.data?.message || errorObj.response?.data?.error || "Failed to create store";
        toast.error(msg);
        return null;
      }
    },
    [refreshStores, switchStore]
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

export const useStore = () => useContext(StoreContext);
