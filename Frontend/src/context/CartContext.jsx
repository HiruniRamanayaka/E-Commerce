import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } catch (_) {
      // ignore parse errors
    }
  }, []);

  const persistCart = (items) => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (_) {
      // quota / private mode issues
    }
  };

  const addToCart = (product) => {
    setCartLoading(true);
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      let updatedCart;
      if (existing) {
        updatedCart = prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }
      persistCart(updatedCart); // Save immediately
      return updatedCart;
    });
    setCartLoading(false);
  };

  const removeFromCart = (productId) => {
    setCartLoading(true);
    setCartItems((prev) => {
      const updatedCart = prev
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      persistCart(updatedCart); // Save immediately
      return updatedCart;
    });
    setCartLoading(false);
  };

  const deleteFromCart = (productId) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item._id !== productId);
      persistCart(updatedCart); // Save immediately
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    persistCart([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        cartCount,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};