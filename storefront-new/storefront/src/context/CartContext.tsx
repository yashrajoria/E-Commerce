import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
          images: item.images?.length ? item.images : item.image ? [item.image] : [],
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

  const addToCart = (itemToAdd: CartItem) => {
    setCart((prevCart) => {
      // FIX: Use the robust helper to find an existing item
      const existingItemIndex = findItemIndex(prevCart, itemToAdd.id);
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      }
      // If item does not exist, add it to the cart
      return [...prevCart, itemToAdd];
    });
  };

  const removeFromCart = (id: number | string) => {
    setCart((prevCart) => {
      const itemIndex = findItemIndex(prevCart, id);
      // FIX: Use the robust helper to find the item
      if (itemIndex === -1) return prevCart; // Item not found, do nothing

      const newCart = [...prevCart];
      newCart.splice(itemIndex, 1); // Remove the item at the found index
      return newCart;
    });
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setCart((prevCart) => {
      // FIX: Use the robust helper to find the item to update
      const itemIndex = findItemIndex(prevCart, id);
      if (itemIndex === -1) {
        return prevCart;
      }
      return prevCart.map((item, index) =>
        index === itemIndex ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
