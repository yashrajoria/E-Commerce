import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string, size?: string, color?: string) => void;
  updateQuantity: (
    id: number | string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount (optional)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }
  }, []);

  // Save cart to localStorage on cart changes (optional)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Helper to find item index based on id + optional size/color
  const findItemIndex = (item: CartItem) =>
    cart.findIndex(
      (i) =>
        i.id === item.id &&
        (i.size || "") === (item.size || "") &&
        (i.color || "") === (item.color || "")
    );

  const addToCart = async (item: CartItem) => {
    // console.log(item);
    // count += 1;
    setCart((prevCart) => {
      const idx = prevCart.findIndex(
        (i) =>
          i.id === item.id &&
          (i.size || "") === (item.size || "") &&
          (i.color || "") === (item.color || "")
      );
      if (idx !== -1) {
        const newCart = [...prevCart];
        newCart[idx].quantity += item.quantity;
        return newCart;
      }
      return [...prevCart, item];
    });
    // Sync with backend
    /* try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.error("Failed to sync addToCart", err);
    }*/
  };

  const removeFromCart = async (
    id: number | string,
    size?: string,
    color?: string
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
    );
    /*
    // Sync with backend
    try {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, size, color }),
      });
    } catch (err) {
      console.error("Failed to sync removeFromCart", err);
    }
      */
  };

  const updateQuantity = async (
    id: number | string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      // If quantity zero or less, remove item
      removeFromCart(id, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
    /*
    // Sync with backend
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, quantity, size, color }),
      });
    } catch (err) {
      console.error("Failed to sync updateQuantity", err);
    }
      */
  };

  const clearCart = async () => {
    setCart([]);
    /*
    try {
      await fetch("/api/cart/clear", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to sync clearCart", err);
    }
      */
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
