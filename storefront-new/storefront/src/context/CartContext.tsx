import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  _id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  // color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (_id: number | string, quantity: number) => void;
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
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const findItemIndex = (currentCart: CartItem[], _id: number | string) => {
    console.log(currentCart, _id);
    return currentCart.findIndex((item) => item._id === _id);
  };

  const addToCart = (itemToAdd: CartItem) => {
    console.log({ itemToAdd });
    setCart((prevCart) => {
      const newCart = [...prevCart];
      console.log(itemToAdd._id);

      // FIX: Use the robust helper to find an existing item
      const existingItemIndex = findItemIndex(newCart, itemToAdd._id);
      console.log(existingItemIndex);
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        newCart[existingItemIndex].quantity += itemToAdd.quantity;
      } else {
        // If item does not exist, add it to the cart
        newCart.push(itemToAdd);
      }
      return newCart;
    });
  };

  const removeFromCart = (_id: number | string) => {
    setCart((prevCart) => {
      const itemIndex = findItemIndex(prevCart, _id);
      // FIX: Use the robust helper to find the item
      if (itemIndex === -1) return prevCart; // Item not found, do nothing

      const newCart = [...prevCart];
      newCart.splice(itemIndex, 1); // Remove the item at the found index
      return newCart;
    });
  };

  const updateQuantity = (_id: number | string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setCart((prevCart) => {
      const newCart = [...prevCart];
      // FIX: Use the robust helper to find the item to update
      const itemIndex = findItemIndex(newCart, _id);
      if (itemIndex !== -1) {
        newCart[itemIndex].quantity = quantity;
      }
      return newCart;
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
