import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  // Handle potential parse errors when retrieving from localStorage
  const defaultProducts = ls ? JSON.parse(ls?.getItem("cart")) || [] : [];

  const [cartProducts, setCartProducts] = useState(defaultProducts);

  useEffect(() => {
    try {
      if (cartProducts?.length > 0) {
        ls?.setItem("cart", JSON.stringify(cartProducts));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [cartProducts]);

  useEffect(() => {
    try {
      if (ls && ls.getItem("cart")) {
        setCartProducts(JSON.parse(ls.getItem("cart")));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  function addProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  function removeProduct(productId) {
    setCartProducts((prev) => {
      try {
        const pos = prev.indexOf(productId);
        if (pos !== -1) {
          return prev.filter((value, index) => index !== pos);
        }
        return prev;
      } catch (error) {
        console.error("Error removing product:", error);
        return prev;
      }
    });
  }

  function clearCart() {
    setCartProducts([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
