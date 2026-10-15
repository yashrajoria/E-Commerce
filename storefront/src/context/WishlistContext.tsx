import * as React from "react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

import type { Product } from "@/lib/types";

/**
 * A saved wishlist entry — currently identical to a storefront {@link Product}.
 * `WishlistContext` exports this alias so consumers can type wishlist entries
 * without reaching into `@/lib/types`.
 */
export type WishlistItem = Product;

/**
 * Shape of the wishlist context value exposed by {@link WishlistProvider}.
 */
interface WishlistContextType {
  /** Saved wishlist items. */
  wishlist: WishlistItem[];
  /** Adds a product, ignoring duplicates by id. */
  addToWishlist: (item: WishlistItem) => void;
  /** Removes the entry with the given product id. */
  removeFromWishlist: (id: string | number) => void;
  /** Empties the wishlist locally and in `localStorage`. */
  clearWishlist: () => void;
  /** Reports whether the given product id is already wishlisted. */
  hasWishlistItem: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

/**
 * Props accepted by {@link WishlistProvider}.
 */
interface WishlistProviderProps {
  /** Storefront subtree that should have access to the wishlist context. */
  children: ReactNode;
}

/**
 * Provides the client-side wishlist and persists it to `localStorage`.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Mounted once in the Pages Router app shell (src/pages/_app.tsx).
 * <WishlistProvider>
 *   <Component {...pageProps} />
 * </WishlistProvider>
 * ```
 */
export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const isHydratedRef = React.useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<
          WishlistItem & { _id?: string | number; image?: string }
        >;
        const normalized = parsed.map((item) => ({
          ...item,
          id: String(item.id ?? item._id),
          images: item.images?.length
            ? item.images
            : item.image
              ? [item.image]
              : [],
        }));
        setWishlist(normalized);
      } catch {
        /* ignore invalid local storage data */
      }
    }
    isHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isHydratedRef.current) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = (itemToAdd: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((item) => String(item.id) === String(itemToAdd.id))) {
        return prev;
      }
      return [...prev, { ...itemToAdd, id: String(itemToAdd.id) }];
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) =>
      prev.filter((item) => String(item.id) !== String(id)),
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const hasWishlistItem = useMemo(() => {
    const ids = new Set<string>(wishlist.map((item) => String(item.id)));
    return (id: string | number) => ids.has(String(id));
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        hasWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Reads the wishlist context provided by {@link WishlistProvider}.
 *
 * @returns The wishlist state and actions: `wishlist`, `addToWishlist`, `removeFromWishlist`, `clearWishlist`, and `hasWishlistItem`.
 * @throws {@link Error} When called outside a `WishlistProvider` subtree.
 */
export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
