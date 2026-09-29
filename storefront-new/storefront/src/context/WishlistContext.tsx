import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const parsed = JSON.parse(stored) as Array<
          WishlistItem & { _id?: string | number; image?: string }
        >;
        const normalized = parsed
          .map((item) => ({
            ...item,
            id: (item.id ?? item._id ?? "") as string | number,
            images: item.images?.length
              ? item.images
              : item.image
                ? [item.image]
                : [],
          }))
          .filter((item) => Boolean(item.id));
        setWishlist(normalized as WishlistItem[]);
      }
    } catch {
      // Ignore corrupt wishlist data; start fresh.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  const addToWishlist = (itemToAdd: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === itemToAdd.id)) {
        return prev;
      }
      return [...prev, itemToAdd];
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const hasWishlistItem = useMemo(() => {
    const ids = new Set<string | number>(wishlist.map((item) => item.id));
    return (id: string | number) => ids.has(id);
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
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
