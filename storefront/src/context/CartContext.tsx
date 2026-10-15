import React, {
  createContext,
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

/**
 * Subscription purchase configuration attached to a cart line item.
 */
export interface SubscriptionPlanOption {
  /** Whether the customer opted into a recurring subscription. */
  isSubscription: boolean;
  /** Delivery cadence for the subscription. */
  frequency: "2_weeks" | "4_weeks" | "8_weeks";
  /** Percentage discount applied to each recurring order. */
  discountPercent: number;
}

/**
 * Cart line item combining a product with its quantity and optional
 * subscription plan.
 */
export interface CartItem extends Product {
  /** Number of units of the product in the cart. */
  quantity: number;
  /** Subscription plan for the line item, when the customer subscribed. */
  subscription?: SubscriptionPlanOption;
}

/**
 * Shape of the cart context value exposed by {@link CartProvider}.
 */
interface CartContextType {
  /** Current cart line items. */
  cart: CartItem[];
  /** Whether the initial local-cart hydration is still running. */
  loading: boolean;
  /** Whether a server cart sync is in flight. */
  syncing: boolean;
  /** Adds a line item, merging quantities for the same product and subscription plan. */
  addToCart: (item: CartItem) => void;
  /** Removes the line item with the given product id. */
  removeFromCart: (id: string | number) => void;
  /** Sets an absolute quantity for the line item; quantities below 1 are ignored. */
  updateQuantity: (id: number | string, quantity: number) => void;
  /** Empties the cart locally and on the server (when signed in). */
  clearCart: () => void;
  /** Whether the cart has been hydrated from `localStorage` on the client. */
  isHydrated: boolean;
  /** Re-runs the merge of the local cart with the server cart. */
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props accepted by {@link CartProvider}.
 */
interface CartProviderProps {
  /** Storefront subtree that should have access to the cart context. */
  children: ReactNode;
}

/**
 * Provides cart state and actions to the storefront, hydrating from
 * `localStorage` and syncing with the server cart when the user is signed in.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Mounted once in the Pages Router app shell (src/pages/_app.tsx).
 * <CartProvider>
 *   <Component {...pageProps} />
 * </CartProvider>
 * ```
 */
export function CartProvider({ children }: CartProviderProps) {
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
          ? data.images.map((img) => String(img)).filter(Boolean)
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
        subscription:
          data.subscription && typeof data.subscription === "object"
            ? (data.subscription as SubscriptionPlanOption)
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
      const localItems = loadLocalCart();
      const localMap = new Map(
        localItems.map((item) => [String(item.id), item] as const),
      );

      // Empty server cart: keep guest/local cart and push it up.
      if (serverItems.length === 0) {
        if (localItems.length === 0) {
          setCart([]);
        } else {
          setCart(localItems);
          try {
            await axiosInstance.post(API_ROUTES.CART.ADD, {
              items: localItems.map((item) => ({
                product_id: String(item.id),
                quantity: Math.max(1, Number(item.quantity || 1)),
              })),
            });
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              setServerCartEnabled(false);
            }
          }
        }
        setServerCartEnabled(true);
        return;
      }

      const serverIds = new Set<string>();
      const hydrated = await Promise.all(
        serverItems.map(async (item) => {
          const productId = String(item.product_id ?? "");
          const serverQty = Math.max(1, Number(item.quantity ?? 1));

          if (!productId) return null;
          serverIds.add(productId);

          const local = localMap.get(productId);
          const quantity = local
            ? Math.max(serverQty, Math.max(1, Number(local.quantity || 1)))
            : serverQty;

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

      const merged = hydrated.filter((item): item is CartItem => item !== null);

      // Guest-only lines not on the server yet.
      for (const local of localItems) {
        const id = String(local.id);
        if (!serverIds.has(id)) {
          merged.push(local);
        }
      }

      setCart(merged);
      setServerCartEnabled(true);

      // Persist merged cart when guest lines were added or quantities increased.
      const needsPush =
        localItems.some((local) => !serverIds.has(String(local.id))) ||
        localItems.some((local) => {
          const server = serverItems.find(
            (s) => String(s.product_id) === String(local.id),
          );
          if (!server) return false;
          return (
            Math.max(1, Number(local.quantity || 1)) >
            Math.max(1, Number(server.quantity ?? 1))
          );
        });

      if (needsPush && merged.length > 0) {
        try {
          await axiosInstance.delete(API_ROUTES.CART.CLEAR);
          await axiosInstance.post(API_ROUTES.CART.ADD, {
            items: merged.map((item) => ({
              product_id: String(item.id),
              quantity: Math.max(1, Number(item.quantity || 1)),
            })),
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setServerCartEnabled(false);
          }
        }
      }
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

  const addToCart = useCallback(
    (itemToAdd: CartItem) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            String(item.id) === String(itemToAdd.id) &&
            Boolean(item.subscription?.isSubscription) ===
              Boolean(itemToAdd.subscription?.isSubscription) &&
            item.subscription?.frequency === itemToAdd.subscription?.frequency,
        );
        const nextCart =
          existingItemIndex !== -1
            ? prevCart.map((item, index) =>
                index === existingItemIndex
                  ? { ...item, quantity: item.quantity + itemToAdd.quantity }
                  : item,
              )
            : [...prevCart, itemToAdd];

        enqueueServerSync(async () => {
          await persistExactCart(nextCart);
        });

        return nextCart;
      });
    },
    [enqueueServerSync, persistExactCart],
  );

  const removeFromCart = useCallback(
    (id: number | string) => {
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex(
          (item) => String(item.id) === String(id),
        );
        if (itemIndex === -1) return prevCart;
        const nextCart = prevCart.filter(
          (item) => String(item.id) !== String(id),
        );

        enqueueServerSync(async () => {
          await persistExactCart(nextCart);
        });

        return nextCart;
      });
    },
    [enqueueServerSync, persistExactCart],
  );

  const updateQuantity = useCallback(
    (id: number | string, quantity: number) => {
      if (quantity <= 0) return;
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex(
          (item) => String(item.id) === String(id),
        );
        if (itemIndex === -1) return prevCart;
        const nextCart = prevCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item,
        );

        enqueueServerSync(async () => {
          await persistExactCart(nextCart);
        });

        return nextCart;
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

/**
 * Reads the cart context provided by {@link CartProvider}.
 *
 * @returns The cart state and actions: `cart`, `loading`, `syncing`, `isHydrated`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, and `syncCart`.
 * @throws {@link Error} When called outside a `CartProvider` subtree.
 */
export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
