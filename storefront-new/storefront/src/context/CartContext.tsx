import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as Array<
          CartItem & { _id?: string | number; image?: string }
        >;
        const normalized = parsed.map((item) => ({
          ...item,
          id: item.id ?? item._id,
          images: item.images?.length
            ? item.images
            : item.image
              ? [item.image]
              : [],
        }));
        setCart(normalized);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const findItemIndex = (currentCart: CartItem[], id: number | string) => {
    return currentCart.findIndex((item) => item.id === id);
  };

  const addToCart = useCallback((itemToAdd: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = findItemIndex(prevCart, itemToAdd.id);
      if (existingItemIndex !== -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item,
        );
      }
      return [...prevCart, itemToAdd];
    });
  }, []);

  const removeFromCart = useCallback((id: number | string) => {
    setCart((prevCart) => {
      const itemIndex = findItemIndex(prevCart, id);
      if (itemIndex === -1) return prevCart;
      const newCart = [...prevCart];
      newCart.splice(itemIndex, 1);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback(
    (id: number | string, quantity: number) => {
      if (quantity <= 0) return;
      setCart((prevCart) => {
        const itemIndex = findItemIndex(prevCart, id);
        if (itemIndex === -1) return prevCart;
        return prevCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item,
        );
      });
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
