import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    // Hanya fetch cart jika user sudah login (ada token)
    if (token) {
      fetchCart();
    }
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart", { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add to cart");
      throw error;
    }
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
