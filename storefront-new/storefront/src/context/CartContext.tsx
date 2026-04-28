import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from "react";
import type { Product } from "@/lib/types";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";
import { useUser } from "./UserContext";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  syncing: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [serverCartEnabled, setServerCartEnabled] = useState(true);
  const { isAuthenticated } = useUser();
  const serverQueueRef = useRef(Promise.resolve());

  const canSyncServerCart = isAuthenticated && serverCartEnabled;

  const normalizeProduct = useCallback(
    (raw: unknown, fallbackId: string, quantity: number): CartItem => {
      const data = (raw ?? {}) as Record<string, unknown>;
      const category = data.category;

      return {
        id: String(data.id ?? data._id ?? fallbackId),
        name: String(data.name ?? data.title ?? "Product"),
        price: Number(data.price ?? 0),
        originalPrice:
          data.originalPrice != null
            ? Number(data.originalPrice)
            : data.original_price != null
              ? Number(data.original_price)
              : undefined,
        images: Array.isArray(data.images)
          ? data.images
              .map((img) => String(img))
              .filter(Boolean)
          : data.image
            ? [String(data.image)]
            : [],
        description:
          data.description != null ? String(data.description) : undefined,
        rating: Number(data.rating ?? 0),
        reviews: Number(data.reviews ?? 0),
        category:
          typeof category === "string"
            ? category
            : category && typeof category === "object"
              ? {
                  id:
                    (category as Record<string, unknown>).id != null
                      ? String((category as Record<string, unknown>).id)
                      : undefined,
                  name: String(
                    (category as Record<string, unknown>).name ??
                      "Uncategorized",
                  ),
                }
              : "Uncategorized",
        badge: data.badge != null ? String(data.badge) : undefined,
        inStock:
          data.inStock != null
            ? Boolean(data.inStock)
            : data.in_stock != null
              ? Boolean(data.in_stock)
              : undefined,
        quantity,
      };
    },
    [],
  );

  const loadLocalCart = useCallback(() => {
    if (typeof window === "undefined") return [] as CartItem[];

    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return [] as CartItem[];

    try {
      const parsed = JSON.parse(storedCart) as Array<
        CartItem & { _id?: string | number; image?: string }
      >;

      return parsed.map((item) => ({
        ...item,
        id: item.id ?? item._id,
        images: item.images?.length
          ? item.images
          : item.image
            ? [item.image]
            : [],
      }));
    } catch {
      return [] as CartItem[];
    }
  }, []);

  const enqueueServerSync = useCallback((task: () => Promise<void>) => {
    serverQueueRef.current = serverQueueRef.current
      .then(task)
      .catch(() => undefined);
  }, []);

  const syncFromServer = useCallback(async () => {
    if (!isAuthenticated) return;

    setSyncing(true);
    try {
      const response = await axiosInstance.get(API_ROUTES.CART.ALL);
      const payload = (response.data ?? {}) as {
        items?: Array<{ product_id?: string; quantity?: number }>;
      };

      const serverItems = Array.isArray(payload.items) ? payload.items : [];
      if (serverItems.length === 0) {
        setCart([]);
        setServerCartEnabled(true);
        return;
      }

      const localMap = new Map(
        loadLocalCart().map((item) => [String(item.id), item] as const),
      );

      const hydrated = await Promise.all(
        serverItems.map(async (item) => {
          const productId = String(item.product_id ?? "");
          const quantity = Math.max(1, Number(item.quantity ?? 1));

          if (!productId) return null;

          const local = localMap.get(productId);
          if (local) {
            return { ...local, quantity };
          }

          try {
            const productRes = await axiosInstance.get(
              API_ROUTES.PRODUCTS.BY_ID(productId),
            );
            return normalizeProduct(productRes.data, productId, quantity);
          } catch {
            return normalizeProduct({}, productId, quantity);
          }
        }),
      );

      setCart(hydrated.filter((item): item is CartItem => item !== null));
      setServerCartEnabled(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setServerCartEnabled(false);
      }
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, loadLocalCart, normalizeProduct]);

  const persistExactCart = useCallback(
    async (nextCart: CartItem[]) => {
      if (!canSyncServerCart) return;

      try {
        await axiosInstance.delete(API_ROUTES.CART.CLEAR);

        if (nextCart.length > 0) {
          await axiosInstance.post(API_ROUTES.CART.ADD, {
            items: nextCart.map((item) => ({
              product_id: String(item.id),
              quantity: Math.max(1, Number(item.quantity || 1)),
            })),
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setServerCartEnabled(false);
        }
      }
    },
    [canSyncServerCart],
  );

  // Load local cart quickly for immediate UX, then hydrate from server if authenticated.
  useEffect(() => {
    setCart(loadLocalCart());
    setLoading(false);
    setIsHydrated(true);
  }, [loadLocalCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    void syncFromServer();
  }, [isAuthenticated, syncFromServer]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback((itemToAdd: CartItem) => {
    let nextCart: CartItem[] = [];
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === itemToAdd.id,
      );
      if (existingItemIndex !== -1) {
        nextCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item,
        );
        return nextCart;
      }
      nextCart = [...prevCart, itemToAdd];
      return nextCart;
    });

    enqueueServerSync(async () => {
      await persistExactCart(nextCart);
    });
  }, [enqueueServerSync, persistExactCart]);

  const removeFromCart = useCallback((id: number | string) => {
    let nextCart: CartItem[] = [];
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.id === id);
      if (itemIndex === -1) return prevCart;
      const newCart = [...prevCart];
      newCart.splice(itemIndex, 1);
      nextCart = newCart;
      return nextCart;
    });

    enqueueServerSync(async () => {
      await persistExactCart(nextCart);
    });
  }, [enqueueServerSync, persistExactCart]);

  const updateQuantity = useCallback(
    (id: number | string, quantity: number) => {
      if (quantity <= 0) return;
      let nextCart: CartItem[] = [];
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.id === id);
        if (itemIndex === -1) return prevCart;
        nextCart = prevCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item,
        );
        return nextCart;
      });

      enqueueServerSync(async () => {
        await persistExactCart(nextCart);
      });
    },
    [enqueueServerSync, persistExactCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    enqueueServerSync(async () => {
      await persistExactCart([]);
    });
  }, [enqueueServerSync, persistExactCart]);

  const syncCart = useCallback(async () => {
    await syncFromServer();
  }, [syncFromServer]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      syncing,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCart,
    }),
    [
      cart,
      loading,
      syncing,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
