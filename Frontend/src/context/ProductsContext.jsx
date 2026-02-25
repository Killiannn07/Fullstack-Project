import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const productsContext = createContext();

export function ProductProvider({ children }) {
  const [product, setProduct] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProduct(res.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = async (id) => {
    await api.get(`/products/${id}`);
    fetchProducts();
  };

  const updateProduct = async (id) => {
    await api.put(`/products/${id}`);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const createProduct = async () => {
    await api.post("/products");
    fetchProducts();
  };

  return (
    <productsContext.Provider
      value={{
        product,
        fetchProducts,
        getProductById,
        updateProduct,
        deleteProduct,
        createProduct,
      }}
    >
      {children}
    </productsContext.Provider>
  );
}
