import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  // Load cart from localStorage when component mounts
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartProducts(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [cartProducts]);

  function addProduct(product) {
    setCartProducts((prev) => [...prev, product]);
  }

  function removeProduct(productId) {
    console.log({ productId });
    setCartProducts((prev) => {
      const index = prev.findIndex((product) => product.id === productId);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev;
    });
  }

  function deleteProduct(productId) {
    console.log({ productId });
    setCartProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    ); // Removes all instances
  }

  function clearCart() {
    setCartProducts([]);
    localStorage.removeItem("cart");
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        deleteProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
