import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    await api.post("/cart", { productId, quantity });
    fetchCart();
  };

  const updateCart = async (cartId, quantity) => {
    if (quantity < 1) {
      removeCart(cartId);
      return;
    }
    await api.put(`/cart/${cartId}`, { quantity });
    fetchCart();
  };

  const removeCart = async (productId) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateCart, removeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
