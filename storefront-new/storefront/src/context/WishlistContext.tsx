import * as React from "react";
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";

import type { Product } from "@/lib/types";

export type WishlistItem = Product;

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  clearWishlist: () => void;
  hasWishlistItem: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
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
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
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

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
